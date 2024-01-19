const User = require('../repositories/User.js');
const QRCode = require('qrcode');
const { authenticator } = require('otplib');


exports.getProfil = async (request, response) => {
    if(! request.session.user) {
        request.flash('info', 'Vous devez vous connecter !')
        response.redirect('/connexion')
        return;
    }

    let currentUser = await User.findOne({email: request.session.user.email}).exec();
    if(currentUser) {
        // Si le a2f n'est pas actif on le propose
        if(currentUser.enable_a2f != true) {
            // Si il n'y a pas encore de clé secrete pour la a2f on la crée
            if(currentUser.secret_a2f == undefined || currentUser.secret_a2f == '') {
                // On enregistre une clé secret pour le a2f de notre utilisateur
                currentUser.secret_a2f = authenticator.generateSecret();
                // On l'enregistre sur son compte utilisateur
                await User.findOneAndUpdate({email: request.session.user.email}, {secret_a2f: currentUser.secret_a2f}).exec();
            }

            QRCode.toDataURL(authenticator.keyuri(currentUser.email, 'ToutA10', currentUser.secret_a2f), (err, url) => {
                if (err) response.redirect('/');
                response.render('user_profil', { 
                    qr: url, 
                    account: `ToutA10`,
                    key: currentUser.secret_a2f,
                    user : {
                        lastname:  currentUser.lastname,
                        firstname: currentUser.firstname,
                        email: currentUser.email,
                        roles: currentUser.roles
                    }
                });
            }); 
        } else {
            response.render('user_profil', {
                user : {
                    lastname:  currentUser.lastname,
                    firstname: currentUser.firstname,
                    email: currentUser.email,
                    roles: currentUser.roles
                }
            });
        }
    } else {
        response.render('user_auth', {error: "Erreur d'identification", user:{email: request.body.email}});
    }
}

exports.postProfil = async (request, response) => {
    if(! request.session.user) {
        request.flash('info', 'Vous devez vous connecter !')
        response.redirect('/connexion')
        return;
    }

    let currentUser = await User.findOne({email: request.session.user.email}).exec();
    if(currentUser) {
        const data = {
            lastname : request.body.lastname,
            firstname : request.body.firstname
        }; 

        request.flash('notify', `Vos données ont bien été mise à jours !`)
           
        // Si le a2f n'est pas actif on peut potentiellement l'activer
        if(request.body.a2f && currentUser.enable_a2f != true) {
            // On va valider tout de même le code
            if(authenticator.check(request.body.number_2fa, currentUser.secret_a2f)) {
                data.enable_a2f = true;
                request.flash('notify', `La double authentification a bien été activé !`)
            } else {
                request.flash('error', `Le code de double authentification n'étant pas valide nous n'avons pas activé la double authentification sur votre compte !`)
            }
        }
        // Dans tout les cas on met à jours les infos correctes
        await User.findOneAndUpdate(
            {email: request.session.user.email}, 
            data
        ).exec();
        response.redirect('/profil');
    } else {
        response.render('user_auth', {error: "Erreur d'identification", user:{email: request.body.email}});
    }
}