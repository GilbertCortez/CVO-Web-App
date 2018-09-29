
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
//router.use(authMiddleware.noAuthedPetOwner);


router.get('/',  (req,res)=>{
	      
	res.render('CVO-PetOwner-Login/views/view.ejs');
        
});

router.get('/logout',  (req,res)=>{
	       req.session.destroy(err => {
	res.redirect('/PetOwner_Login')
          });
});

router.post('/',  (req,res)=>{

  	var email=req.body.email;
  	var pass=req.body.password;
	db.query(`SELECT * FROM petowner WHERE str_Email= "${email}" AND str_Password= "${pass}"`,(err,result)=>{
		if (result.length == 0 || result == 'undefined' || result == 'NULL'){
			res.redirect("/PetOwner_Login");
		}
		else{

			req.session.userType=1;
			req.session.user=result;
			res.redirect('/PetOwner/Dashboard')
	}
		
	});
          
});

	



exports.PetOwner_Login= router;
