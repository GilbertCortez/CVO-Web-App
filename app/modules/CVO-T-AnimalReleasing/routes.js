
var express = require('express');
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
//sess.use(authMiddleware.noAuthed);

var munkres = require('munkres-js');

router1.get('/',  (req,res)=>{
 
	res.render('CVO-T-AnimalReleasing/views/view.ejs');
		
});



exports.CVO_AnimalReleasing=router1;


