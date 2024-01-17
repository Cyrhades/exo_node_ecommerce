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
    let currentUser = await User.findOne({email: request.body.email}).exec()    
    if(bcrypt.compareSync(request.body.password, currentUser.password)) {
        request.session.user = {
            lastname:  currentUser.lastname,
            firstname: currentUser.firstname,
            email: currentUser.email,
        };
        request.flash('notify', 'Vous êtes maintenant connecté !')
        response.redirect('/')
    } else {
        response.render('user_auth', {error: "Erreur d'identification", user:{email: request.body.email}});
    }
}