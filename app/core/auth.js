var db = require('../lib/database')();
exports.hasAuth = (req, res, next) => {
    if (req.session && req.session.user && Object.keys(req.session.user).length > 0) return next();
    
}

exports.noAuthed = (req, res, next) => {
    if (req.session && req.session.user && Object.keys(req.session.user).length > 0) {
        
    }
    else{
        res.redirect('/CVO_Login');
    }
     return next();
}
