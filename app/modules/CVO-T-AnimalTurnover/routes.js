
var express = require('express');
var router1 = express.Router();


var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();


router1.get('/New',(req,res)=>{
	db.query(`SELECT * FROM organization WHERE int_Status=1`,(err,org)=>{
		db.query(`CALL SelectAnimalForAdoptionWithDetails()`,(err,forAdoption)=>{
		console.log(forAdoption[0])
	res.render("CVO-T-AnimalTurnover/views/new.ejs",{org:org,forAdoption:forAdoption[0]})
});});
	
});
router1.post('/New',(req,res)=>{
	db.query(`INSERT INTO batchofanimalturnover(int_OrganizationId, dat_DateOfPickUp) VALUES (${req.body.orgId},"${req.body.dateOfPickup}")`,(err,batchId)=>{ 
	var QUERY="";
	(req.body.animalsList.split(",")).forEach(function(i){
	
		QUERY+='INSERT INTO animalsforturnover(int_BatchOfAnimalTurnOver, int_AnimalId) VALUES('+batchId.insertId+','+i+');';
	});
	db.query(QUERY,(err,result)=>{ 
			res.redirect("/CVO_AnimalTurnover/Pending");
	}); 
});
	
});

router1.get('/Pending',(req,res)=>{
	db.query(`SELECT * FROM batchofanimalturnover  bat JOIN organization o ON bat.int_OrganizationId = o.int_OrganizationId`,(err,batch)=>{
		db.query(`CALL SelectAnimalForAdoptionWithDetails()`,(err,forAdoption)=>{
		res.render("CVO-T-AnimalTurnover/views/pending.ejs",{batch:batch,forAdoption:forAdoption[0]})
	});
		});
});

router1.get('/Pickup',(req,res)=>{

	db.query(`SELECT * FROM batchofanimalturnover  bat JOIN organization o ON bat.int_OrganizationId = o.int_OrganizationId`,(err,batch)=>{
		res.render("CVO-T-AnimalTurnover/views/pickup.ejs",{batch:batch})
	});

	
});



exports.CVO_AnimalTurnover=router1;
