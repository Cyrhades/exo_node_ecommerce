const Home = require('../src/controllers/Home.js');
const Register = require('../src/controllers/Register.js');
const Auth = require('../src/controllers/Auth.js');
const Dashboard = require('../src/controllers/Dashboard.js');
const AdminUser = require('../src/controllers/AdminUser.js');

module.exports = (app) => {
    // Déclarer notre première route
    app.get('/', Home.getHome)

    app.get('/inscription', Register.getRegister)
    app.post('/inscription', Register.postRegister)

    app.get('/connexion', Auth.getAuth)
    app.post('/connexion', Auth.postAuth)
    app.get('/deconnexion', Auth.getDeconnect)
    

    app.get('/admin', Dashboard.getDashboard)
    app.get('/admin/user', AdminUser.getList)

    app.get('/admin/user/delete/:id', AdminUser.getDelete)

    app.get('/admin/user/edit/:id', AdminUser.getEdit)
    app.post('/admin/user/edit/:id', AdminUser.postEdit)
};