const mongoose = require('mongoose');

mongoose.connect('mongodb://root:example@localhost:27017/boutik')
  .then(() => console.log('Connected!'));