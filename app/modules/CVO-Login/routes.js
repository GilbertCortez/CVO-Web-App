
var express = require('express');
var router = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
//router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{

  console.log(req.session)

	res.render('CVO-Login/views/view.ejs');
          
});

router.post('/login',  (req,res)=>{
 		console.log('login')
	db.query(`SELECT * FROM employee WHERE str_Email='${req.body.email}' AND str_Password='${req.body.password}'`,(err,results)=>{
			req.session.user=results;
			req.session.save();
			res.redirect('/CVO_Dashboard');
    });      
});

router.get('/logout',  (req,res)=>{
 		req.session.destroy();  
 		res.redirect('/CVO_Login')

});


router.get('/getUser',(req,res)=>{
		res.send(req.session.user)
});



exports.CVO_Login= router;


