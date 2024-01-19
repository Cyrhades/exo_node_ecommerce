const User = require('../repositories/User.js');

exports.getList = (request, response) => {
    User.find({}).then(users => {
        response.render('admin/user', {users});
    })
}

exports.getDelete =  (request, response) => {
    if(request.params.id) {
        User.deleteOne({_id: request.params.id}).then((result) => {
            if(result.deletedCount == 1) {
                request.flash('notify', `L'utilisateur a bien été supprimé`);
                response.redirect('/admin/user');
            } else {
                request.flash('error', `L'utilisateur n'a pas été trouvé !`);
                response.redirect('/admin/user');
            }
        }).catch(() => {
            request.flash('error', `Une erreur inconnue est survenue, veuillez réessayer plus tard`);
            response.redirect('/admin/user');
        })
    }
}

exports.getEdit = (request, response) => {
    if(request.params.id) {
        User.findById(request.params.id).then((user) => {
            response.render('admin/user/edit', {user});
        })
    } else {
        response.redirect('/admin/user');
    }
}

exports.postEdit = (request, response) => {
    if(request.params.id) {
        const data = {
            lastname : request.body.lastname,
            firstname : request.body.firstname,
            email : request.body.email,
            roles : request.body.roles
        };   
        User.findByIdAndUpdate(request.params.id, data).then(() => {
            request.flash('notify', `L'utilisateur a bien été modifié`);
            response.redirect('/admin/user');
        }).catch(() => {
            request.flash('error', `L'utilisateur n'a pas été trouvé !`);
            response.redirect('/admin/user');
        })
    } else {
        response.redirect('/admin/user');
    }
}