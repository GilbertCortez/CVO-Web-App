
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	       req.session.destroy(err => {
	res.render('CVO-PetOwner-Login/views/view.ejs');
          });
});

router.post('/',  (req,res)=>{

  	var email=req.body.email;
  	var pass=req.body.password;
	db.query(`SELECT * FROM petowner WHERE str_Email= "${email}" AND str_Password= MD5("${pass}")`,(err,result)=>{
		if (result.length == 0 || result == 'undefined' || result == 'NULL'){
			res.redirect("/PetOwner_Login");
		}
		else{

		req.session.save(function(){
					req.session.user={int_PetOwnerId : result[0]};
					res.redirect('/PetOwner_MyPets');
					console.log(req.session.user);
		})
				
				
	
	}
		
	});
          
});




exports.PetOwner_Login= router;
