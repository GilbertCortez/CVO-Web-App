
require('dotenv').config();

var express = require('express');

var app = express();


require('./app')(app);

app.listen(app.get('port'), () => {
    console.log(`ExpressJS server listening to port ${app.get('port')}`);
});