/**
 * Created by prism on 3/7/16.
 */
var express = require('express'),
    jwt = require('jsonwebtoken');

try {
    var config = require('./config.local.json');
} catch(e) {
    config = require('./config.json');
}

var knex = require('knex')({
    client: 'pg',
    connection: 'postgres://' + config.db_user + ':' + config.db_password + '@localhost:5432/' + config.db_name,
    searchPath: 'knex,public'
});

var bookshelf = require('bookshelf')(knex);
var Account = require('./models/Account')(bookshelf);
var Tags = require('./models/tag')(bookshelf);
var Urls = require('./models/Url')(bookshelf);
var auth = require('./routes/auth')(Account, config);
var dashboard = require('./routes/auth')(Tags, Urls);
var port = process.env.PORT || 3000;

//ensure authentication in every request
function ensureAuthenticated(req, res, next) {
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if(token) {
        jwt.verify(token, config.secret, function(err, decoded) {          
            if (err) {
                return res.status(403).send({ error: "token not valid"});     
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;  
                next();
            }
        });
    }
    return res.status(403).send({ error: "token required"});     

}

express()
    .enable('trust proxy')
    .set('view engine', 'ejs')
    .use(require('morgan')('dev'))
    .use(require('helmet')())
    .use(express.static('./public'))
    .use(require('body-parser').urlencoded({extended: false}))
    .use(require('body-parser').json())
    .use(require('cookie-parser')())
    .use(require('serve-favicon')(__dirname + '/public/favicon.ico'))
    .use(require('express-session')({
        resave: false,
        saveUninitialized: true,
        secret: config.secret
    }))
    .use('/auth', auth)
    .use('/dashboard', dashboard)
    .get('*', function (req, res) {
        res.render('index');
    })
    .listen(port, function(){
        console.log('Bunny is running on port: ' + port);
    });