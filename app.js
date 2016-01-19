var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

var User = require('./models/user.js');
var app = express();
var bodyParser = require('body-parser');

// declare authentication for MongoLab MongoDB in config file
mongoose.connect(config.mongoUrl);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \Authorization');
    next();
});

app.get('/', function(req, res){
    res.send('Welcome to Austin\'s homepage <3');
});

var port = process.env.PORT || 8080;

var router = express.Router();

app.use('/api', router);

router.use(function(req, res, next){
    console.log('someone just came to our app!');
    next();
});

router.get('/', function(req, res){
    res.json({ message: 'Hey Austin! Yaaas'});
});

router.route('/users')
    .post(function(req, res){
        console.log(req.body);
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code === 11000) {
                    return res.send({ success: false, message: 'A user with that username already exists.'});
                } else {
                    return res.send(err);
                }
            }
            res.send({ message: 'User created!' });
        });
    });

router.route('/users')
    .get(function(req, res){
        User.find(function(err, users){
            if (err) {
                res.send(err);
            }
            res.send(users);
        });
});

router.route('/users/:user_id')
    .get(function(req, res){
        User.findById(req.params.user_id, function(err, user){
            if (err) {
                res.send(err);
            }
            res.send(user);
        });
});


app.listen(port);
console.log('magic being delivered on', port);
