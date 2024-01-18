exports.getDashboard = (request, response) => {
    if(!request.session.user) {
        response.redirect('/connexion')
        return;
    }
    response.render('admin/dashboard');
}
