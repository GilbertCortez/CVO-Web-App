var express = require('express');
var router = express.Router();
var ccp = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	db.query(`SELECT * from colorpattern`, (err, results, fields) => {
	db.query(`SELECT DISTINCT int_ColorPatternId FROM animal`,(err,usedColor)=>{
			
		res.render('CVO-M-AnimalColorPattern/views/view', {color: results,usedColor:usedColor});
	});
});
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

router.post('/delete', (req, res)=>{
	console.log(req.body.id)
	db.query(`DELETE FROM colorpattern WHERE int_ColorPatternId = ${req.body.id}`,(err)=>{
		console.log(err)
	})
});


router.post('/updateStatus', (req, res)=>{
	db.query('UPDATE colorpattern SET int_Status='+req.body.status+' WHERE int_ColorPatternId='+req.body.id,(err)=>{
		if(err){
			res.send("ERROR")
		}
		else{
			res.send("SUCCESS")
		}
	})
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
