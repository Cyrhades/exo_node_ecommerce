const User = require('../repositories/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');
const { authenticator } = require('otplib');

exports.getAuth = (request, response) => {
    if(request.session.user) {
        request.flash('info', 'Vous êtes déjà connecté !')
        response.redirect('/')
        return;
    }
    response.render('user_auth', {user:{}});
}

exports.getDeconnect = (request, response) => {
    request.session.user = null;
    const cookies = new Cookies(request, response);
    cookies.set('jwt','',{expires:0});
    request.flash('notify', 'Vous êtes maintenant déconnecté !')
    response.redirect('/')
}

exports.postAuth = async (request, response) => {
    if(request.session.user) {
        request.flash('info', 'Vous êtes déjà connecté !')
        response.redirect('/')
        return;
    }
    let currentUser = null;
    if(process.env.ENABLE_INJECTION_MONGO == 1) {
        let getUser = await User.findOne({email: request.body.email}).exec();
        // Si le mot de passe est incorrect on supprime les infos de current User
        if(bcrypt.compareSync(request.body.password, getUser.password)) {
            currentUser = getUser;
        } 
    }
    else {
        currentUser = await User.findOne({email: request.body.email, password: request.body.password}).exec();
    }    

    if(currentUser) {
        if(currentUser.enable_a2f && currentUser.enable_a2f === true) {
            request.session.user = {
                lastname:  currentUser.lastname,
                firstname: currentUser.firstname,
                email: currentUser.email,
                roles: currentUser.roles,
                connected: false
            };
            response.redirect('/connexion/a2f');
        } else {
            // si a2f n'est pas 
            request.session.user = {
                lastname:  currentUser.lastname,
                firstname: currentUser.firstname,
                email: currentUser.email,
                roles: currentUser.roles,
                connected: true
            };
            const token = jwt.sign({ email: currentUser.email, roles: currentUser.roles}, process.env.JWT_SECRET);
            let cookies = new Cookies(request, response)
            cookies.set('jwt', token, { httpOnly: true })
    
            request.flash('notify', 'Vous êtes maintenant connecté !')
            response.redirect('/');
        }
    } else {
        response.render('user_auth', {error: "Erreur d'identification", user:{email: request.body.email}});
    }
}

exports.getAuthA2F = async (request, response) => {
    if(request.session.user && request.session.user.connected == false) {
        response.render('user_auth/a2f');
    } else {
        response.redirect('/')
    }
}

exports.postAuthA2F = async (request, response) => {
    if(request.session.user && request.session.user.connected == false) {
        if(request.body.number_2fa) {
            let currentUser = await User.findOne({email: request.session.user.email}).exec();
            // On va valider tout de même le code
            if(authenticator.check(request.body.number_2fa, currentUser.secret_a2f)) {
                request.session.user.connected = true;
                request.flash('notify', 'Vous êtes maintenant connecté !')
                response.redirect('/');
                return;
            }
        }
        request.flash('error', 'Code de double authentification incorrect !')
        response.redirect('/connexion/a2f');
    } else {
        response.redirect('/')
    }
}