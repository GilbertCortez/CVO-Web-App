
var express = require('express');

var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);

router1.get('/',  (req,res)=>{
 	 
 	 db.query(`SELECT *, SUM(AvailableSlots ) AS AvailableCagePerImpounding, SUM(Derived.Max) as Total FROM(SELECT c.int_ImpoundingSite, c.int_MaxNumber as Max, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId   GROUP BY c.int_CageId, c.int_ImpoundingSite ) AS derived JOIN impoundingsite i ON derived.int_ImpoundingSite=i.int_ImpoundingSiteId JOIN barangay b ON i.int_BarangayId=b.int_BarangayId GROUP BY i.int_ImpoundingSiteId`,(err,impoundingSites)=>{
			console.log(err)
		res.render('CVO-T-Impounding/views/view.ejs',{ is:impoundingSites});
	});


          
});

router1.post('/Cages',  (req,res)=>{
 	 
 db.query(`SELECT * FROM impoundingsite i JOIN barangay b ON i.int_BarangayId=b.int_BarangayId `, (err, AllImpoundingSite, fields) => { console.log(err)
 db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite}`, (err, allcages, fields) => {
        db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=0`, (err, forimpoundingdogs, fields) => {
            db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=1`, (err, forimpoundingcats, fields) => {
            	db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=2`, (err, fordogsobservation, fields) => {
            		db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=3`, (err, forcatsobservation, fields) => {
	              	   db.query(`SELECT *, SUM(AvailableSlots ) AS AvailableCagePerImpounding, SUM(Derived.Max) as Total FROM(SELECT c.int_ImpoundingSite, c.int_MaxNumber as Max, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId   GROUP BY c.int_CageId, c.int_ImpoundingSite ) AS derived JOIN impoundingsite i ON derived.int_ImpoundingSite=i.int_ImpoundingSiteId JOIN barangay b ON i.int_BarangayId=b.int_BarangayId WHERE i.int_ImpoundingSiteId = ${req.body.impoundingsite} GROUP BY i.int_ImpoundingSiteId`,(err,impoundingSiteInfo)=>{
                           
                            res.render('CVO-T-Impounding/views/Cages.ejs',{als: AllImpoundingSite, AllCages : allcages,  fid: forimpoundingdogs , fic: forimpoundingcats, fdo: fordogsobservation, fco: forcatsobservation, inf: impoundingSiteInfo });
            	       });
                    });
                 });
            	});
            });
          });
        });
          
});
    
router1.post('/Cages/getAnimals',  (req,res)=>{
     
 
    db.query(`CALL SelectAnimalsOnCageWithAnimalDetails('${req.body.id}');`,(err,results)=>{
       res.json(results[0]);
    });
          
});
router1.post('/Cages/getCageId',  (req,res)=>{
     
 
    db.query(`SELECT int_CageId from cage WHERE int_ImpoundingSite=${req.body.id2} AND int_CageNumber=${req.body.id1};`,(err,results)=>{
       res.json(results[0]);
    });
          
});
router1.post('/Cages/getAnimalDetails',  (req,res)=>{

 db.query(`CALL SelectApprehendedAnimalDetails('${req.body.id}');`,(err,results)=>{
       res.json(results[0]);
    });
});

router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/SurrenderAnimal.ejs');
          
});



router3.get('/',  (req,res)=>{
  
	res.render('CVO-T-Impounding/views/Cages.ejs');
          
});




exports.CVO_Impounding=router1;

exports.CVO_SurrenderAnimal=router2;

exports.CVO_Cages=router3;


