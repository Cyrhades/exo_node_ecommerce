const User = require('../repositories/User.js');

exports.getRegister = (request, response) => {
    response.render('user_register', {user:{}});
}

exports.postRegister = (request, response) => {
    const newUser = new User();
    newUser.lastname = request.body.lastname;
    newUser.firstname = request.body.firstname;
    newUser.email = request.body.email;
    newUser.password = request.body.password;
    
    newUser.save().then(() => {
        response.send("ok");
        // @todo : redirection

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
