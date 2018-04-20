var db = require('../lib/database')();
exports.hasAuth = (req, res, next) => {
    if (req.session && req.session.user && Object.keys(req.session.user).length > 0) return next();
    return res.redirect('/login/tempLog?unauthorized');
}

exports.noAuthed = (req, res, next) => {
    if (req.session && req.session.user && Object.keys(req.session.user).length > 0) {

       Object.keys(req.session.user).forEach(i => {
                if(i == 'strOrganizerEmail'){
                    res.redirect('/organizer');
                }
                else if (i == 'strProviderEmail'){
                    res.redirect('/provider/dashboard');
                }
                else if (i == 'strAdminEmail'){
                    res.redirect('/admin');
                }
            });


    }

    return next();
}
