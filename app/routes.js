const Home = require('../src/controllers/Home.js');
const Register = require('../src/controllers/Register.js');
const Auth = require('../src/controllers/Auth.js');
const Profil = require('../src/controllers/Profil.js');
const Dashboard = require('../src/controllers/Dashboard.js');
const AdminUser = require('../src/controllers/AdminUser.js');
const csrf = require('../src/middlewares/ho-csrf.js');


module.exports = (app) => {
    // Déclarer notre première route
    app.get('/', Home.getHome)

    app.get('/inscription', csrf.token, Register.getRegister)
    app.post('/inscription', csrf.verify, Register.postRegister)

    app.get('/connexion', csrf.token, Auth.getAuth)
    app.post('/connexion', csrf.verify, Auth.postAuth)

    app.get('/connexion/a2f', csrf.token, Auth.getAuthA2F)
    app.post('/connexion/a2f', csrf.verify, Auth.postAuthA2F)
    

    app.get('/profil', csrf.token, Profil.getProfil)
    app.post('/profil', csrf.verify, Profil.postProfil)

    app.get('/deconnexion', Auth.getDeconnect)
    

    app.get('/admin', Dashboard.getDashboard)
    app.get('/admin/user', AdminUser.getList)

    app.get('/admin/user/delete/:id', AdminUser.getDelete)

    app.get('/admin/user/edit/:id', csrf.token, AdminUser.getEdit)
    app.post('/admin/user/edit/:id', csrf.verify, AdminUser.postEdit)

    app.get('/admin/messages', Home.getMessage)
};