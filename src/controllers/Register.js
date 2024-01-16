const User = require('../repositories/User.js');

exports.getRegister = (request, response) => {
    response.render('user_register');
}

exports.postRegister = (request, response) => {
    const newUser = new User();
    newUser.lastname = request.body.lastname;
    newUser.firstname = request.body.firstname;
    newUser.email = request.body.email;
    newUser.password = request.body.password;
    newUser.save();
    response.send("ok");
}
