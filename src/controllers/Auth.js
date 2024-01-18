const User = require('../repositories/User.js');
const bcrypt = require('bcryptjs');

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
        request.session.user = {
            lastname:  currentUser.lastname,
            firstname: currentUser.firstname,
            email: currentUser.email,
            roles: currentUser.roles
        };
        request.flash('notify', 'Vous êtes maintenant connecté !')
        response.redirect('/');
    } else {
        response.render('user_auth', {error: "Erreur d'identification", user:{email: request.body.email}});
    }
}