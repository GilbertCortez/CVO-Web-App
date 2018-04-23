
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	db.query(`SELECT * from colorpattern`, (err, results, fields) => {
		if(err){
			console.log(error);
			res.redirect('/CVO_AnimalColorPattern');
		}
		else {
			render(results);
		}
	});

	function render(color) {
		res.render('CVO-M-AnimalColorPattern/views/view', {color: color});
	}
          
});

router.post('/',  (req,res)=>{
	var colorDesc = `${req.body.name}`.trim();
	db.query(`INSERT INTO colorpattern(str_Description) VALUES("${colorDesc}")`, (err, results, fields) =>{
		if (err){
			console.log(err);
			res.redirect('/CVO_AnimalColorPattern');
		}
		else {
			res.redirect('/CVO_AnimalColorPattern');
		}
	});
});

exports.CVO_AnimalColorPattern= router;
