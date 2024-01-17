const User = require('../repositories/User.js');
const bcrypt = require('bcryptjs');

exports.getRegister = (request, response) => {
    if(request.session.user) {
        request.flash('info', 'Vous êtes déjà connecté !')
        response.redirect('/')
        return;
    }
    response.render('user_register', {user:{}});
}

exports.postRegister = (request, response) => {
    if(request.session.user) {
        request.flash('info', 'Vous êtes déjà connecté !')
        response.redirect('/')
        return;
    }
    const newUser = new User();
    newUser.lastname = request.body.lastname;
    newUser.firstname = request.body.firstname;
    newUser.email = request.body.email;
    if(process.env.ENABLE_INJECTION_MONGO == 1) {
        newUser.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
    } else {
        newUser.password = request.body.password;
    }
    
    newUser.save().then(() => {
        request.flash('notify', 'Votre compte a bien été enregistré!')
        response.redirect('/')
    }).catch((error) => {
        if(error.code == 11000 && error.keyPattern.email) {
            response.render('user_register', {
                user: newUser,
                error: `L'adresse email "${error.keyValue.email}" existe déjà`
            });
        } else {
            response.render('user_register', { 
                user: newUser,
                error: `Une erreur inconnue est survenue, réessayez plus tard`
            });
        }
    });
    
}
