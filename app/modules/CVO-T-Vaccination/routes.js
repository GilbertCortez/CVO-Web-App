
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-T-Vaccination/views/view.ejs');
          
});

router1.get('/',  (req,res)=>{
  
	res.render('CVO-T-Vaccination/views/recordvaccination.ejs');
          
});


router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Vaccination/views/schedulevaccination.ejs');
          
});






exports.CVO_Vaccination= router;
exports.CVO_VaccinationRecording= router1;
exports.CVO_VaccinationScheduling= router2;
