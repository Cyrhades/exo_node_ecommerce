const Home = require('../src/controllers/Home.js');
const Register = require('../src/controllers/Register.js');

module.exports = (app) => {
    // Déclarer notre première route
    app.get('/', Home.getHome)

    app.get('/inscription', Register.getRegister)
    app.post('/inscription', Register.postRegister)
};