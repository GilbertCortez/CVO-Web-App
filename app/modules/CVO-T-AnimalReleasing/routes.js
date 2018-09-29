
var express = require('express');
var router1 = express.Router();


var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
//sess.use(authMiddleware.noAuthed);



router1.get('/',  (req,res)=>{
	db.query(`SELECT * FROM batchofanimalturnover  bat JOIN organization o ON bat.int_OrganizationId = o.int_OrganizationId WHERE bat.int_Status=2 AND bat.dat_DatePickedUp IS NULL`,(err,batch)=>{console.log(err)
 	db.query(`SELECT * FROM lodginghistory lh JOIN animal a ON a.int_AnimalId=lh.int_AnimalId  JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId  JOIN cage ca ON lh.int_CageId=ca.int_CageId JOIN impoundingsite imp ON ca.int_ImpoundingSite = imp.int_ImpoundingSiteId JOIN barangay ba ON imp.int_BarangayId=ba.int_BarangayId WHERE  lh.int_LodgingStatus =0 AND a.int_HealthStatus <> 2  AND a.int_AnimalStatus IN (1,5) AND a.int_HealthStatus !=4 AND a.int_AnimalId IN (SELECT int_AnimalId FROM redemptiontransaction WHERE int_RedemptionResult=2);`,(err,forRedemption)=>{
	 db.query(`SELECT * FROM lodginghistory lh JOIN animal a ON a.int_AnimalId=lh.int_AnimalId  JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId  JOIN cage ca ON lh.int_CageId=ca.int_CageId JOIN impoundingsite imp ON ca.int_ImpoundingSite = imp.int_ImpoundingSiteId JOIN barangay ba ON imp.int_BarangayId=ba.int_BarangayId WHERE  lh.int_LodgingStatus =0 AND a.int_HealthStatus <> 2  AND a.int_AnimalStatus IN (1,5) AND a.int_HealthStatus !=4 AND a.int_AnimalId IN (SELECT int_AnimalId FROM adoptiontransaction WHERE int_Stage=6);`,(err,forAdoption)=>{ 
	
	res.render('CVO-T-AnimalReleasing/views/view.ejs',{fa:forAdoption,fr:forRedemption,batch:batch});
		});
});});
});

router1.post('/release/redemption',(req,res)=>{
	db.query(`UPDATE animal SET int_AnimalStatus=2 WHERE int_AnimalId=${req.body.id};`,(err)=>{
		if(err){
			res.send("ERROR");
		}
		else{
			res.send("SUCCESS");
		}
	})
});


router1.get('/release/animalturnover?:batchId=?',  (req,res)=>{
	db.query(`UPDATE batchofanimalturnover SET dat_DatePickedUp=now() WHERE int_BatchOfAnimalTurnOver=${req.query.batchId}`,(err)=>{
		db.query(`UPDATE animal SET int_AnimalStatus=2 WHERE int_AnimalId IN (SELECT int_AnimalId FROM animalsforturnover WHERE int_BatchOfAnimalTurnOver=${req.query.batchId})`,(err)=>{ console.log(err)
			db.query(`UPDATE lodginghistory SET int_LodgingStatus=2 WHERE int_LodgingStatus=0 AND int_AnimalId IN (SELECT int_AnimalId FROM animalsforturnover WHERE int_BatchOfAnimalTurnOver=${req.query.batchId})`,(err)=>{
		res.redirect('/CVO_AnimalReleasing');
	});
		});
	});
});

exports.CVO_AnimalReleasing=router1;


