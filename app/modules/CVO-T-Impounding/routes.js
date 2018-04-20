
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var router4 = express.Router();
var router5 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/view.ejs');
          
});

router1.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/Apprehension.ejs');
          
});

router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/SurrenderAnimal.ejs');
          
});

router3.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/ApprehendedAnimal.ejs');
          
});
router4.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/Cages.ejs');
          
});
router5.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/CageAssignments.ejs');
          
});


exports.CVO_Impounding=router;
exports.CVO_Apprehension=router1;
exports.CVO_SurrenderAnimal=router2;
exports.CVO_ApprehendedAnimal=router3;
exports.CVO_Cages=router4;
exports.CVO_CageAssignments=router5;

