
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
	db.query(`SELECT * FROM batchofanimalturnover  bat JOIN organization o ON bat.int_OrganizationId = o.int_OrganizationId WHERE bat.int_Status=1`,(err,batch)=>{
		db.query(`CALL SelectAnimalForAdoptionWithDetails()`,(err,forAdoption)=>{
		res.render("CVO-T-AnimalTurnover/views/pending.ejs",{batch:batch,forAdoption:forAdoption[0]})
	});
		});
});

router1.get('/Pickup',(req,res)=>{

	db.query(`SELECT * FROM batchofanimalturnover  bat JOIN organization o ON bat.int_OrganizationId = o.int_OrganizationId WHERE bat.int_Status=1`,(err,batch)=>{
		res.render("CVO-T-AnimalTurnover/views/pickup.ejs",{batch:batch})
	});

	
});

router1.get('/Pickup/summary?:batchId=?',(req,res)=>{
	console.log(req.query.batchId)
	db.query(`UPDATE batchofanimalturnover SET int_Status=2 WHERE int_BatchOfAnimalTurnOver=${req.query.batchId}`,(err)=>{ console.log(err)
	db.query(`SELECT * FROM animalsforturnover aft JOIN animal a ON aft.int_AnimalId=a.int_AnimalId  JOIN colorpattern cp ON a.int_ColorPatternId = cp.int_ColorPatternId JOIN breed b ON a.int_BreedId = b.int_BreedId JOIN lodginghistory lh ON a.int_AnimalId=lh.int_AnimalId JOIN cage c ON lh.int_CageId=c.int_CageId JOIN impoundingsite imp ON c.int_ImpoundingSite=imp.int_ImpoundingSiteId JOIN barangay ba ON imp.int_BarangayId=ba.int_BarangayId WHERE int_BatchOfAnimalTurnOver=${req.query.batchId} AND lh.int_lodgingStatus=0 `,(err,animals)=>{
	res.render("CVO-T-AnimalTurnover/views/pickupsummary.ejs",{animals:animals})
	})
});
	
});




exports.CVO_AnimalTurnover=router1;
