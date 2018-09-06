
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  console.log(req.session)
	res.render('CVO-Dashboard/views/view.ejs');
          
});


router.get('/charts/petandownerregistration',  (req,res)=>{
  db.query(`SELECT COUNT(*) AS COU,MONTH(dat_DateRegistered) AS MON,YEAR(CURDATE()) AS YEA FROM petowner WHERE YEAR(dat_DateRegistered)=YEAR(CURDATE()) GROUP BY MONTH(dat_DateRegistered) `,(err,petowner)=>{
  	db.query(`SELECT COUNT(*) AS COU,MONTH(dat_DateRegistered) AS MON,YEAR(CURDATE()) AS YEA FROM pet WHERE YEAR(dat_DateRegistered)=YEAR(CURDATE()) GROUP BY MONTH(dat_DateRegistered) `,(err,pet)=>{
	res.render('CVO-Dashboard/views/petandownerregistration.ejs',{petowner:petowner,pet:pet});
      })    
  	  })  
});





exports.CVO_Dashboard= router;


