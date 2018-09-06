
var morgan = require('morgan');


var path = require('path');


var bodyParser = require('body-parser');
var sessions = require('express-session');

//For Sanitation of Data
var expressSanitizer = require('express-sanitizer');

var serveStatic = require('serve-static');


module.exports = app => {
    //For Sanitation of data
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
     app.use(sessions({
        secret: 'WQcptX3p4W'
    }));

    app.use(expressSanitizer()); // this line follows bodyParser() instantiations
    app.set('port', process.argv[2] || process.env.PORT || 3000);

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'ejs');

    //app.set('view engine', 'pug');

    app.set('views', path.join(path.dirname(__dirname), 'modules'));

    //app.use(morgan('dev'));

    app.use(serveStatic(path.join(path.dirname(path.dirname(__dirname)), 'public')));
   app.use(serveStatic(path.join(path.dirname(path.dirname(__dirname)), '../images')));
    
   
    

 
}
