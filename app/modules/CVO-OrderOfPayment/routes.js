
var express = require('express');
var router = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-OrderOfPayment/views/view.ejs');
          
});





exports.CVO_OrderOfPayment= router;

