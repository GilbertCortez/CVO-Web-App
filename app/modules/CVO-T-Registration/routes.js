
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var router4 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-T-Registration/views/view.ejs');
          
});

router1.get('/',  (req,res)=>{
  
	res.render('CVO-T-Registration/views/ownerregistration.ejs');
          
});

router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Registration/views/petregistration.ejs');
          
});

router3.get('/',  (req,res)=>{
  
	res.render('CVO-T-Registration/views/schedulevaccination.ejs');
          
});

router4.get('/',  (req,res)=>{
  
	res.render('CVO-T-Registration/views/recordvaccination.ejs');
          
});


exports.CVO_Registration= router;
exports.CVO_OwnerRegistration= router1;
exports.CVO_PetRegistration= router2;
exports.CVO_ScheduleVaccination= router3;
exports.CVO_RecordVaccination= router4;
