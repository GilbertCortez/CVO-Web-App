
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	db.query(`SELECT * FROM requirements`, (err, requirements, fields) => {
		db.query(`SELECT * FROM requirements r JOIN requirementspertransaction rt ON r.int_RequirementsId=rt.int_RequirementsId WHERE int_Transaction='0'`, (err, por, fields) => {
			db.query(`SELECT * FROM requirements r JOIN requirementspertransaction rt ON r.int_RequirementsId=rt.int_RequirementsId WHERE int_Transaction='1'`, (err, pr, fields) => {
				db.query(`SELECT * FROM requirements r JOIN requirementspertransaction rt ON r.int_RequirementsId=rt.int_RequirementsId WHERE int_Transaction='2'`, (err, vac, fields) => {
					db.query(`SELECT * FROM requirements r JOIN requirementspertransaction rt ON r.int_RequirementsId=rt.int_RequirementsId WHERE int_Transaction='3'`, (err, ado, fields) => {
						db.query(`SELECT * FROM requirements r JOIN requirementspertransaction rt ON r.int_RequirementsId=rt.int_RequirementsId WHERE int_Transaction='4'`, (err, red, fields) => {
							res.render('CVO-M-TransactionRequirements/views/view',{por:por, pr:pr,vac:vac,ado:ado,red:red,req:requirements});
						});
					});
				});
			});
		});
	});
          
});

router.post('/add',  (req,res)=>{
	var requirements=JSON.parse(req.body.id);
	var transaction=req.body.trans;
	var QUERY="";
	console.log(requirements.length)
	requirements.forEach(function(i){
		QUERY+='INSERT INTO requirementspertransaction(int_Transaction, int_RequirementsId) VALUES ("'+transaction+'",'+i+');';
	});
	db.query(QUERY,(err)=>{
		console.log(err)
		if(err){

			res.send(false)
		}
		else{
			res.send(true)
		}
	});


 });


router.post('/remove',  (req,res)=>{

	console.log(req.body)
	db.query(`DELETE FROM requirementspertransaction WHERE int_Transaction="${req.body.trans}" AND int_RequirementsId=${req.body.id}`,(err)=>{
		if(err){
			res.send(false)
		}
		else{
			res.send(true)
		}
	});
 });

exports.CVO_TransactionRequirements= router;