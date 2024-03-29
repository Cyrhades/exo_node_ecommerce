const express = require("express");
const app = express();
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();
const router = require("./app/routes.js");
const session = require('express-session');
const flash = require('express-flash-messages');
const jwt = require('jsonwebtoken');
const Cookies = require('cookies');

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
/*
if(process.env.APP_ENV === 'dev') {
    app.use((request, response, next) => {
        request.session.user = {
            lastname:  'LECOMTE',
            firstname: 'Cyril',
            email: 'cyrhades76@gmail.com',
            roles: ['user', 'admin']
        };
        next();
    })
}
*/

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

//--------------------------------------------------------------------
//  Middleware permettant d'assurer la double authentification
//--------------------------------------------------------------------
app.use('/', (request, response, next) => {
    // si on a une session mais pas connected (il y a donc besoin d'une double authentification)
    if(request.session.user && request.session.user.connected == false && request._parsedUrl.pathname !== '/connexion/a2f') {
        response.redirect('/connexion/a2f');
    } else {
        next();
    }
});

//--------------------------------------------------------------------
//  Middleware permettant de gérer les droits admin
//--------------------------------------------------------------------
app.use('/admin',(request, response, next) => {
    const cookies = new Cookies(request, response);
    const cookieJWT = cookies.get('jwt');
    if(cookieJWT) {
        jwt.verify(cookieJWT, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                cookies.set('jwt','',{expires:0});
                response.status(403).render("admin/error/403");
            } else {
                if(decoded.roles && decoded.roles.includes('admin')) {
                    next();
                } else {
                    response.status(403).render("admin/error/403");
                }
                response.send("accès autorisé");
            }
            console.log(decoded.foo) // bar
        });
    }
    else {
        response.redirect('/connexion')
    }  
})

router(app)

//--------------------------------------------------------------------
//  Middleware permettant de gérer la 404
//--------------------------------------------------------------------
app.use('/admin',(request, response, next) => {
    response.status(404).render("admin/error/404");            
})

app.use((request, response, next) => {
    response.status(404).render("error/404");            
})


// Mise en écoute du serveur
app.listen(process.env.PORT, () => {
    console.log(`Server HTTP en écoute : http://localhost:${process.env.PORT}`);
})