
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/New',  (req,res)=>{
   db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE petowner.int_status = 1`, (err, petowners) => { console.log(err)
        
	res.render('CVO-T-Redemption/views/view.ejs',{po: petowners});
});
          
});
router.post('/New/getPetOwnerDetailsAndItsPets',  (req,res)=>{
 console.log(req.body.id)
 db.query(`SELECT * FROM pet p JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern cp ON a.int_ColorPatternId=cp.int_ColorPatternId WHERE p.int_PetOwnerId= ${req.body.id}`,(err,pets)=>{
 db.query(`CALL SelectPetOwnerDetails(${req.body.id})`,(err,petOwner)=>{
 res.send({po:petOwner[0],pets:pets})

         }) })
});
router.post('/New/getPetDetails',  (req,res)=>{
 console.log(req.body.id)

 db.query(`CALL SelectPetDetails(${req.body.id})`,(err,petDetails)=>{
console.log(petDetails)
 	db.query(`SELECT * FROM(
 		(SELECT lh.int_AnimalId, lh.int_CageId, lh.dtm_DateTimeOfOccurence, b.str_BreedName,b.int_AnimalSpecies, a.int_Sex, cp.str_Description, a.str_AnimalPicturePath, a.int_AnimalStatus, a.int_HealthStatus, aa.int_BarangayId, aa.str_PetTagNo, aa.str_Alias FROM lodginghistory lh JOIN animal a ON lh.int_AnimalId=a.int_AnimalId JOIN apprehendedanimal aa ON a.int_AnimalId= aa.int_AnimalId JOIN breed b ON a.int_BreedId= b.int_BreedId JOIN colorpattern cp ON a.int_ColorPatternId=cp.int_ColorPatternId   WHERE lh.int_lodgingStatus=0) 
 		UNION 
 		(SELECT lh.int_AnimalId, lh.int_CageId, lh.dtm_DateTimeOfOccurence, b.str_BreedName,b.int_AnimalSpecies, a.int_Sex, cp.str_Description, a.str_AnimalPicturePath, a.int_AnimalStatus, a.int_HealthStatus, sa.int_Barangay, sa.str_PetTagNo ,sa.str_Alias FROM lodginghistory lh JOIN animal a ON lh.int_AnimalId=a.int_AnimalId JOIN surrenderedanimal sa ON a.int_AnimalId= sa.int_AnimalId JOIN breed b ON a.int_BreedId= b.int_BreedId JOIN colorpattern cp ON a.int_ColorPatternId=cp.int_ColorPatternId    WHERE lh.int_lodgingStatus=0 ) ) as ImpoundedAnimals WHERE str_PetTagNo="${petDetails[0][0].str_PetTagNo}";`,(err,impoundedAnimal)=>{
 		if(impoundedAnimal.length==0){
 			res.send("NONE");
 		}
 		else{
 				res.send({impoundedAnimal:impoundedAnimal,petDetails:petDetails[0]});
 		}
 
 })
         }) 
});

router.post('/type1',(req,res)=>{
		db.query(`INSERT INTO redemptiontransaction(dtm_DateTimeAnimalLost, int_OwnerId, int_OwnerStatus, int_AnimalId,dtm_DateTimeOfRedemption, str_Reason, str_InterviewRemarks, int_RedemptionResult) VALUES ('${req.body.datetimelost}',${req.body.petOwnerId},0,${req.body.animalId},now(),'${req.body.reason}','${req.body.interviewremarks}',${req.body.interviewresult})`,(err,result)=>{
			if(req.body.interviewresult==1){
				console.log("APPROVED")
			db.query(`SELECT COUNT(*) FROM redemptiontransaction WHERE int_OwnerId=${req.body.petOwnerId}`,(err,countTimes)=>{ console.log(err)
					console.log(countTimes);
					  db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${req.body.petOwnerId},2,0)`, (err, lastPayment) => { console.log(err)
                    db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId,int_AnimalInvolved) VALUES( ${lastPayment.insertId},4,${req.body.animalId} )`, (err, results) => { console.log(err)
                        orderOfPayment(lastPayment.insertId,req.body.petOwnerId);
                    });
                });
		
});
		}
		else if(req.body.interviewresult==0){
			console.log("DISAPPROVED")
		}
		});
		 function orderOfPayment(x,y){
        db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${x}`,(err,breakdown)=>{

        db.query(`SELECT * FROM office`,(err,officeDetails)=>{
            res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:breakdown[0].str_PayorName});
      

        });
    });

	}
	});


router1.get('/',  (req,res)=>{
  
	res.render('CVO-T-Redemption/views/automatedLostPetSearch.ejs');
          
});

router2.get('/',  (req,res)=>{
  
	res.render('CVO-T-Redemption/views/unregisteredsuggestion.ejs');
          
});





exports.CVO_Redemption= router;
exports.CVO_Suggestion= router1;
exports.CVO_UnregisteredSuggestion= router2;
