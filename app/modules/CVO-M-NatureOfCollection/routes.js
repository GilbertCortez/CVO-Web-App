
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

/*
router.get('/',  (req,res)=>{
	db.query("SELECT * FROM NatureOfCollection",(err,results,fields)=>{
		res.render('CVO-M-NatureOfCollection/views/view.ejs', {i:results});
	});
});

router.post('/',  (req,res)=>{
	console.log(`${req.body.description}`);
	db.query(`INSERT INTO natureofcollection(str_Description, dec_InitialPrice, int_Status) VALUES ("${req.body.description}","${req.body.price}","${req.body.status}")`,(err,results,fields)=>{
		if(err){
			console.log(err);
		}
		res.redirect('/CVO_NatureOfCollection');
	});
});

*/

router.get('/',  (req,res)=>{
	
		res.render('CVO-M-NatureOfCollection/views/view.ejs');
	
});




exports.CVO_NatureOfCollection= router;
