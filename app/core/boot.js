
var morgan = require('morgan');


var path = require('path');


var bodyParser = require('body-parser');
var session = require('express-session');



var serveStatic = require('serve-static');


module.exports = app => {
   
    app.set('port', process.argv[2] || process.env.PORT || 3000);
    
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');

    //app.set('view engine', 'pug');

    app.set('views', path.join(path.dirname(__dirname), 'modules'));

    //app.use(morgan('dev'));

    app.use(serveStatic(path.join(path.dirname(path.dirname(__dirname)), 'public')));
    
    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'WQcptX3p4W'
    }));

    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));
}