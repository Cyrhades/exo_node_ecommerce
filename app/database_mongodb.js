const mongoose = require('mongoose');
(async () => {
    await mongoose.connect(process.env.MONGODB);
})();

module.exports = mongoose.connection;