
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-T-Adoption/views/view.ejs');
          
});



router1.get('/',  (req,res)=>{
  
	res.render('CVO-T-Adoption/views/AdoptionApplicationForm.ejs');
          
});


router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Adoption/views/ApprovedAdoptionApplication.ejs');
          
});



exports.CVO_Adoption= router;
exports.CVO_AdoptionApplicationForm= router1;
exports.CVO_ApprovedAdoptionApplication= router2;
