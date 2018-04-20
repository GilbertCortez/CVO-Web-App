
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-Homepage/views/view.ejs');
          
});


router1.get('/',  (req,res)=>{
  
	res.render('CVO-Homepage/views/faq.ejs');
          
});

router2.get('/',  (req,res)=>{
  
	res.render('CVO-Homepage/views/announcement.ejs');
          
});

router3.get('/',  (req,res)=>{
  
	res.render('CVO-Homepage/views/learn.ejs');
          
});






exports.CVO_Homepage= router;
exports.CVO_FAQ= router1;
exports.CVO_Announcement= router2;
exports.CVO_Learn= router3;