
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-T-Redemption/views/view.ejs');
          
});

router1.get('/',  (req,res)=>{
  
	res.render('CVO-T-Redemption/views/suggestion.ejs');
          
});

router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Redemption/views/unregisteredsuggestion.ejs');
          
});





exports.CVO_Redemption= router;
exports.CVO_Suggestion= router1;
exports.CVO_UnregisteredSuggestion= router2;
