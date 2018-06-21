
var express = require('express');

var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);

router1.get('/',  (req,res)=>{
  	
	res.render('CVO-T-Impounding/views/view.ejs');
          
});
    


router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/SurrenderAnimal.ejs');
          
});



router3.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/Cages.ejs');
          
});




exports.CVO_Impounding=router1;

exports.CVO_SurrenderAnimal=router2;

exports.CVO_Cages=router3;


