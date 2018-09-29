
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
//router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  console.log(req.session)
	res.render('CVO-Dashboard/views/view.ejs');
          
});


router.get('/apprehensionBar',  (req,res)=>{

	res.render('CVO-Dashboard/views/apprehensionbar.ejs');
          
});


router.get('/petandownerregistration',  (req,res)=>{
 	db.query(`SELECT petowner.MON as MON, petowner.COU as poCOU, pet.COU as pCOU FROM (SELECT COUNT(*) AS COU,MONTHNAME(dat_DateRegistered) AS MON,YEAR(CURDATE()) AS YEA FROM petowner WHERE YEAR(dat_DateRegistered)=YEAR(CURDATE()) GROUP BY MONTHNAME(dat_DateRegistered) ORDER BY MONTH(dat_DateRegistered) ) as petowner JOIN (SELECT COUNT(*) AS COU,MONTHNAME(dat_DateRegistered) AS MON,YEAR(CURDATE()) AS YEA FROM pet WHERE YEAR(dat_DateRegistered)=YEAR(CURDATE()) GROUP BY MONTHNAME(dat_DateRegistered)  ORDER BY MONTH(dat_DateRegistered)) as pet ON petowner.MON=pet.MON  ORDER BY petowner.MON`,(err,data)=>{
	console.log(data)
	res.render('CVO-Dashboard/views/petandownerregistration.ejs',{data:data});
      });
});





exports.CVO_Dashboard= router;


