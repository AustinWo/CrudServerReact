var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');

var User = require('./models/user.js');
var app = express();
var bodyParser = require('body-parser');

