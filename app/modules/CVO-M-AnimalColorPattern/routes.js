var express = require('express');
var router = express.Router();
var ccp = express.Router();
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

router.post('/add',  (req,res)=>{
	var colorDesc = req.sanitize(`${req.body.name}`.trim());

	if (colorDesc == " "){
		res.send("Error")
		res.redirect('/CVO_AnimalColorPattern');
	}
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

router.post('/update',  (req,res)=>{

	var colorDesc = req.sanitize(`${req.body.desc}`.trim());
	db.query(`UPDATE colorpattern SET str_Description="${colorDesc}" WHERE int_ColorPatternId= ${req.body.id}`, (err) =>{
		
	
			res.redirect('/CVO_AnimalColorPattern');
	
	}); 
});

ccp.post('/',  (req,res)=>{
var id=req.sanitize(req.body.id.trim());
	db.query(`SELECT str_Description FROM colorpattern WHERE str_Description="${id}"`,(err,result)=>{
		console.log(result);
		if(result.length==0){
		res.json(0);
		}
		else{
		res.json(1);	
		}
	});
});

ccp.post('/update',  (req,res)=>{
var id=req.sanitize(req.body.id.trim());
	db.query(`SELECT str_Description FROM colorpattern WHERE str_Description="${id}" AND int_ColorPatternId <> ${req.body.id2}`,(err,result)=>{
		console.log(result);
		if(result.length==0){
		res.json(0);
		}
		else{
		res.json(1);	
		}
	});
});

exports.CVO_AnimalColorPattern= router;

exports.checkColorPattern= ccp;
