const express = require('express');
const session = require('express-session'); // Importa express-session
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Configuración de express-session
app.use(session({
    secret: 'tu_secreto_seguro', // Cambia esto por una clave segura
    resave: false, // No guarda la sesión si no se modifica
    saveUninitialized: true, // Guarda sesiones no inicializadas
    cookie: { secure: false } // Cambia a true si usas HTTPS
}));

// Configuración de Passport con SAML Strategy
passport.use(new SamlStrategy(
    {
        entryPoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/saml2`, // URL de inicio de sesión de Azure AD
        issuer: `${process.env.PUBLIC_URL}/`, // Identificador de la aplicación (Entity ID)
        callbackUrl: `${process.env.PUBLIC_URL}/login/callback`, // URL de respuesta (ACS URL)
        cert: `${process.env.CERTIFICATE}` // Certificado público de Azure AD
    },
    (profile, done) => {
        console.log('Perfil SAML:', profile); // Muestra el perfil SAML en la consola
        return done(null, profile); // Devuelve el perfil del usuario autenticado
    }
));

// Serializar y deserializar usuario para sesiones
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session()); // Añade soporte para sesiones

// Rutas
app.get('/', (req, res) => {
    res.send('<h1>Bienvenido</h1><a href="/login">Iniciar Sesión</a>');
});

// Ruta para iniciar sesión
app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

// Ruta de callback para manejar la respuesta SAML
app.post('/login/callback', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    (req, res) => {
        // Si la autenticación es exitosa, muestra la información del usuario
        res.send(`<h1>Autenticación exitosa</h1><p>Usuario: ${req.user.nameID}</p>`);
    }
);

// Inicia el servidor
app.listen(3007, () => console.log('Servidor corriendo en http://45.56.118.38:3007/'));
