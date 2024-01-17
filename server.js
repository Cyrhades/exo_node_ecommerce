const express = require("express");
const app = express();
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const router = require("./app/routes.js");
const session = require('express-session');
const flash = require('express-flash-messages');


//--------------------------------------------------------------------
//      Ajout du midlleware express session
//--------------------------------------------------------------------
app.use(session({
    secret: process.env.APP_KEY, resave:false, saveUninitialized:false, 
    cookie: {maxAge: 3600000} 
}));


//--------------------------------------------------------------------
//      Ajout du midlleware pour les flashbag
//--------------------------------------------------------------------
app.use(flash())

//--------------------------------------------------------------------
//    Session pour développement
//--------------------------------------------------------------------
if(process.env.APP_ENV === 'dev') {
    app.use((request, response, next) => {
        request.session.user = {
            lastname:  'LECOMTE',
            firstname: 'Cyril',
            email: 'cyrhades76@gmail.com',
        };
        next();
    })
}

//--------------------------------------------------------------------
//    Ajout du midlleware pour transmettre la session à la vue
//--------------------------------------------------------------------
app.use((request, response, next) => {
    response.locals.app = {
        user :  request.session.user,
        route : request._parsedUrl.pathname
    };
    next();
})

//--------------------------------------------------------------------
//      Ajout du midlleware pour gérer les données en post
//--------------------------------------------------------------------
app.use(express.urlencoded({extended: process.env.ENABLE_INJECTION_MONGO == 1 ? true : false}));

// Définir dans notre application le moteur de template utilisé
app.set('view engine', 'pug');

// On déclare dans notre application quel sera notre répertoire static
app.use(express.static(path.join(__dirname, "public")));

router(app)

// Mise en écoute du serveur
app.listen(process.env.PORT, () => {
    console.log(`Server HTTP en écoute : http://localhost:${process.env.PORT}`);
})