const express = require('express');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();


passport.use(new SamlStrategy(
    {
        entryPoint: `https://login.microsoftonline.com/${process.env.TENANT_ID}/saml2`,
        issuer: 'http://localhost:3000/',
        callbackUrl: 'http://localhost:3000/login/callback',
        cert: `${process.env.CERTIFICATE}`
    },
    (profile, done) => {
        console.log('Perfil SAML:', profile);
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

app.get('/', (req, res) => {
    res.send('<h1>Bienvenido</h1><a href="/login">Iniciar Sesión</a>');
});

app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

app.post('/login/callback', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    (req, res) => {
        res.send(`<h1>Autenticación exitosa</h1><p>Usuario: ${req.user.nameID}</p>`);
    }
);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000/'));
