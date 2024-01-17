const Home = require('../src/controllers/Home.js');
const Register = require('../src/controllers/Register.js');
const Auth = require('../src/controllers/Auth.js');

module.exports = (app) => {
    // Déclarer notre première route
    app.get('/', Home.getHome)

    app.get('/inscription', Register.getRegister)
    app.post('/inscription', Register.postRegister)

    app.get('/connexion', Auth.getAuth)
    app.post('/connexion', Auth.postAuth)
    app.get('/deconnexion', Auth.getDeconnect)
    
};