require('../../app/database_mongodb.js');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname:  { type: String, required: true },
    lastname:  { type: String, required: true },
    email:  { type: String, unique : [true, "Cet email existe déjà en BDD"], required: true },
    password:  { type: String, required: true },
    roles: { type: Array, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);