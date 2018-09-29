        
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
//router.use(authMiddleware.noAuthed);



router.get('/',  (req,res)=>{
 db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE petowner.int_status = 1`, (err, petowners) => { console.log(err)
    db.query(`SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=0 AND int_Stage=0) a JOIN (SELECT int_PetOwnerId, CONCAT(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName ) AS AdopterName FROM petowner) po ON a.int_AdopterId=po.int_PetOwnerId  UNION SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=1 AND int_Stage=0) a JOIN (SELECT int_NonCitizenId, CONCAT(str_LastName,", ",str_FirstName," ",str_MiddleName ) AS AdopterName FROM noncitizen) nc ON a.int_AdopterId=nc.int_NonCitizenId`,(err,impoundingsitevisitation)=>{
              db.query(`SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=0 AND int_Stage=1) a JOIN (SELECT int_PetOwnerId, CONCAT(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName ) AS AdopterName FROM petowner) po ON a.int_AdopterId=po.int_PetOwnerId  UNION SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=1 AND int_Stage=1) a JOIN (SELECT int_NonCitizenId, CONCAT(str_LastName,", ",str_FirstName," ",str_MiddleName ) AS AdopterName FROM noncitizen) nc ON a.int_AdopterId=nc.int_NonCitizenId`,(err,foradoptionapplication)=>{
              db.query(`SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=0 AND int_Stage=2) a JOIN (SELECT int_PetOwnerId, CONCAT(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName ) AS AdopterName FROM petowner) po ON a.int_AdopterId=po.int_PetOwnerId  UNION SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=1 AND int_Stage=2) a JOIN (SELECT int_NonCitizenId, CONCAT(str_LastName,", ",str_FirstName," ",str_MiddleName ) AS AdopterName FROM noncitizen) nc ON a.int_AdopterId=nc.int_NonCitizenId`,(err,forInterview)=>{
                db.query(`SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=0 AND int_Stage=3) a JOIN (SELECT int_PetOwnerId, CONCAT(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName ) AS AdopterName FROM petowner) po ON a.int_AdopterId=po.int_PetOwnerId  UNION SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=1 AND int_Stage=3) a JOIN (SELECT int_NonCitizenId, CONCAT(str_LastName,", ",str_FirstName," ",str_MiddleName ) AS AdopterName FROM noncitizen) nc ON a.int_AdopterId=nc.int_NonCitizenId`,(err,forHomeVisit)=>{
              db.query(`SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=0 AND int_Stage=4) a JOIN (SELECT int_PetOwnerId, CONCAT(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName ) AS AdopterName FROM petowner) po ON a.int_AdopterId=po.int_PetOwnerId  UNION SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=1 AND int_Stage=4) a JOIN (SELECT int_NonCitizenId, CONCAT(str_LastName,", ",str_FirstName," ",str_MiddleName ) AS AdopterName FROM noncitizen) nc ON a.int_AdopterId=nc.int_NonCitizenId`,(err,forFinalEvaluation)=>{
                 db.query(`SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=0 AND int_Stage IN (0,1,2,3,4)) a JOIN (SELECT int_PetOwnerId, CONCAT(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName ) AS AdopterName FROM petowner) po ON a.int_AdopterId=po.int_PetOwnerId  UNION SELECT * FROM (SELECT * FROM adoptiontransaction WHERE int_AdopterType=1 AND int_Stage IN (0,1,2,3,4)) a JOIN (SELECT int_NonCitizenId, CONCAT(str_LastName,", ",str_FirstName," ",str_MiddleName ) AS AdopterName FROM noncitizen) nc ON a.int_AdopterId=nc.int_NonCitizenId`,(err,forAll)=>{
              db.query(`SELECT * FROM noncitizen`,(err,noncitizen)=>{
                res.render('CVO-T-Adoption/views/view.ejs', {
                    fa:forAll,
                    po: petowners,
                    nc:noncitizen,
                    isv:impoundingsitevisitation,
                    faa:foradoptionapplication,
                    fi:forInterview,
                    fhv:forHomeVisit,
                    ffe:forFinalEvaluation
            });});});
            });});
          });
          });
    })
 });
});

router.post('/regNonCitizen',(req,res)=>{
    console.log("hi")
    db.query(`INSERT INTO noncitizen(str_FirstName, str_MiddleName, str_LastName, str_CompleteAddress, str_Email, str_PhoneNo) VALUES ('${req.body.id1}','${req.body.id2}','${req.body.id3}','${req.body.id4}','${req.body.id5}','${req.body.id6}')`,(err,noncitizenId)=>{
        console.log(err)
        res.json(noncitizenId.insertId);
    });
});

router.get('/OrderOfVisitation',  (req,res)=>{
         if(req.query.type==1){
            db.query(`CALL SelectPetOwnerDetails(${req.query.adopter});`,(err,petOwnerDetails)=>{ console.log(petOwnerDetails)
                db.query(`SELECT * FROM office`, (err, officeDetails) => {
                    res.render('CVO-T-Adoption/views/OrderOfVisitation_1.ejs', {
                        po: petOwnerDetails,
                        od: officeDetails,
                        empName: "Gilbert Critica Cortez"
                    });
                });            
            });
        }
        else if(req.query.type==2){
             db.query(`SELECT * FROM noncitizen`,(err,noncitizen)=>{ 
            db.query(`SELECT * FROM office`, (err, officeDetails) => {
                    res.render('CVO-T-Adoption/views/OrderOfVisitation_2.ejs', {
                        nc: noncitizen,
                        od: officeDetails,
                        empName: "Gilbert Critica Cortez"
                    });
                });  
        });
        }
});
          
router.get('/NewPetAdoption',  (req,res)=>{

  
        if(req.query.adoptertype==1){
            db.query(`INSERT INTO adoptiontransaction(int_AdopterId,int_AdopterType,dtm_DateTimeOfAdoptionTransaction,str_AdoptionTransactionRemarks,int_Stage) VALUES(${req.query.adopterId},0,now(),'${JSON.stringify(req.query)}',0)`,(err)=>{ console.log(err)
                res.redirect(`/CVO_Adoption/OrderOfVisitation?adopter=${req.query.adopterId}&type=1`);
            })
        }
        if(req.query.adoptertype==3){
            db.query(`INSERT INTO adoptiontransaction(int_AdopterId,int_AdopterType,dtm_DateTimeOfAdoptionTransaction,str_AdoptionTransactionRemarks,int_Stage) VALUES(${req.query.adopterId},1,now(),'${JSON.stringify(req.query)}',0)`,(err)=>{ console.log(err)
                res.redirect(`/CVO_Adoption/OrderOfVisitation?adopter=${req.query.adopterId}&type=2`);
            })
        }
    
});



router.get('/AdoptionApplicationForm',  (req,res)=>{
        res.render('CVO-T-Adoption/views/AdoptionApplicationForm.ejs',{adopterDetails:req.query});      
});

router.post('/AdoptionApplicationForm',  (req,res)=>{
       db.query(`INSERT INTO adoptionapplication(
            dtm_DateTimeOfApplication, 
            int_AdopterId, 
            int_AdopterType, 
            int_Occupation, 
            str_OtherOccupation, 
            int_SourceOfIncome, 
            str_OtherSourceOfIncome, 
            int_MonthlyIncome, 
            int_NoOfChildren, 
            int_NoOfTeenagers, 
            int_NoOfYouth, 
            int_NoOfAdult, 
            int_NoOfDogs, 
            int_NoOfCats, 
            int_PetEuthanize, 
            int_SurrenderPet, 
            int_LostPet, 
            str_ReasonForAdoption, 
            str_HomeDescription, 
            int_EnsurePetIndoor) 
    VALUES (now(),
            ${req.body.adopterId},
            ${req.body.adopterType},
            ${req.body.occupation},
            '${req.body.otherOccupation}',
            ${req.body.sourceOfIncome},
            '${req.body.otherSourceOfIncome}',
            ${req.body.monthlyIncome},
            ${req.body.noOfChildren},
            ${req.body.noOfTeenagers},
            ${req.body.noOfYouth},
            ${req.body.noOfAdult},
            ${req.body.noOfDogs},
            ${req.body.noOfCats},
            ${req.body.petEuthanize},
            ${req.body.petSurrendered},
            ${req.body.lostPet},
            '${req.body.reasonForAdoption}',
            '${req.body.homeDescription}',
            ${req.body.ensurePetIndoor})`,(err,adoptionApplicationId)=>{console.log(err)
             db.query(`UPDATE adoptiontransaction SET  int_Stage=2 WHERE int_AdoptionTransactionId=${req.body.transactionId}`,(err)=>{
            res.redirect('/CVO_Adoption');
     });
        })    
    
});

router.get('/PetFinder',  (req,res)=>{
  db.query(`SELECT * FROM colorpattern WHERE int_Status=1 ORDER BY str_Description`,(err,colorpattern)=>{
	res.render('CVO-T-Adoption/views/PetFinder.ejs',{cp:colorpattern});
          });
});

router.post('/AnimalOnCage',(req,res)=>{
    console.log('hi')
        db.query(`SET @EuthanasiaPeriod = (   SELECT int_ClaimingPeriod+1 FROM  impoundedanimalperiods WHERE int_PeriodId=1);SELECT *,DATEDIFF(now(),lh.dtm_DateTimeOfOccurence)  as LodgingDays FROM lodginghistory lh JOIN cage c ON lh.int_CageId=c.int_CageId JOIN animal a ON lh.int_AnimalId=a.int_AnimalId JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern cp ON a.int_ColorPatternId=cp.int_ColorPatternId  WHERE c.int_ImpoundingSite=1 AND lh.int_LodgingStatus=0 AND DATEDIFF(now(),lh.dtm_DateTimeOfOccurence) > @EuthanasiaPeriod AND lh.str_Remarks LIKE '%Impounded%' AND lh.int_AnimalId NOT IN (SELECT int_AnimalId FROM animalsforturnover) GROUP BY lh.int_AnimalId ;`,(err,result)=>{
            console.log(result)
            res.json(result[1]);
        })
});

router.post('/Filtering', (req, res) => {
		db.query(`CALL SelectAnimalForAdoptionWithDetails()`,(err,forAdoption)=>{

    var preferences = JSON.parse(req.body.filter),
        animals = forAdoption[0],
        identifiers = Object.keys(preferences.filters),
        semifinalist = [],
        finalist = [];
        console.log(preferences)
    animals.forEach(function(animal) {
    	
        var points = identifiers.reduce((p, k) => p + (preferences.filters[k] == animal[k]), 0);
        if (points > identifiers.length/2) {
            semifinalist.push(Object.assign({
                points
            }, animal));
        }
    });

    semifinalist.sort((a, b) => b.points - a.points);

    finalist = semifinalist.slice(0, preferences.numberOfFinalists);
    console.log(finalist)
    console.log(semifinalist)
    if(finalist.length!=0){
    	console.log("FINALIST")
    	res.send(finalist);
    }
    else if(semifinalist.length!=0){
    	console.log("SEMIFINALIST")
    	res.send(semifinalist);
    }
    else{
    	console.log("FORADOPTIOn")
    	res.send(forAdoption[0])
    }
});
});



router.post('/CancelAdoption',  (req,res)=>{
 db.query(`DELETE FROM adoptiontransaction WHERE int_AdoptionTransactionId=${req.body.id} `, (err) => { console.log(err)
     if(err){
        res.send("ERROR")
     }
     else{
        res.send("SUCCESS")
     }
    });
});

router.get('/ChooseAnimal',(req,res)=>{
    console.log(req.query)

    db.query(`SELECT * FROM adoptiontransaction WHERE int_AdoptionTransactionId=${req.query.TransactionId}`,(err,adoptionTransaction)=>{

        if(JSON.parse(adoptionTransaction[0].str_AdoptionTransactionRemarks).adoptertype==1){
            db.query(`SELECT int_PetOwnerId  IN (SELECT int_AdopterId FROM adoptionapplication WHERE int_AdopterType=0) AS status FROM petowner WHERE int_PetOwnerId=${JSON.parse(adoptionTransaction[0].str_AdoptionTransactionRemarks).adopterId}`,(err,petownerstatus)=>{
                db.query(`UPDATE adoptiontransaction SET int_AnimalId=${req.query.Animal}, int_Stage=`+(petownerstatus[0].status==0? '1':'2')+` WHERE int_AdoptionTransactionId=${req.query.TransactionId}`,(err)=>{
                        res.redirect('/CVO_Impounding/Visitation')
                });
            });
        }
        else if(JSON.parse(adoptionTransaction[0].str_AdoptionTransactionRemarks).adoptertype==3){
            db.query(`SELECT int_NonCitizenId  IN (SELECT int_AdopterId FROM adoptionapplication WHERE int_AdopterType=1) AS status FROM noncitizen WHERE int_NonCitizenId=${JSON.parse(adoptionTransaction[0].str_AdoptionTransactionRemarks).adopterId}`,(err,noncitizenstatus)=>{
                db.query(`UPDATE adoptiontransaction SET int_AnimalId=${req.query.Animal}, int_Stage=`+(noncitizenstatus[0].status==0? '1':'2')+` WHERE int_AdoptionTransactionId=${req.query.TransactionId}`,(err)=>{
                        res.redirect('/CVO_Impounding/Visitation')
                });
            });
        }
    });
});

router.get('/Interview',  (req,res)=>{

	res.render('CVO-T-Adoption/views/Interview.ejs',{adopterDetails:req.query});

});
router.post('/Interview',  (req,res)=>{
        console.log(req.body)
         db.query(`UPDATE adoptiontransaction SET dtm_DateTimeOfInterview='${req.body.dtmInterview}',str_InterviewRemarks='${req.body.interviewRemarks}', int_Stage=`+(req.body.homevisit==0? '3': '4')+` WHERE int_AdoptionTransactionId=${req.body.transactionId}`,(err)=>{
 
            res.redirect('/CVO_Adoption');
        });
});
router.get('/HomeVisit',  (req,res)=>{

	res.render('CVO-T-Adoption/views/HomeVisit.ejs',{adopterDetails:req.query});

});
router.post('/HomeVisit',  (req,res)=>{

    db.query(`UPDATE adoptiontransaction SET int_HomeVisitStatus=${req.body.capable},dtm_DateTimeOfHomeVisit='${req.body.dtmHomeVisit}',str_HomeVisitRemarks='${req.body.remarks}', int_Stage=4 WHERE int_AdoptionTransactionId=${req.body.transactionId}`,(err)=>{
            res.redirect('/CVO_Adoption');
        });

});
router.get('/FinalEvaluation',  (req,res)=>{

	res.render('CVO-T-Adoption/views/FinalEvaluation.ejs',{adopterDetails:req.query});


});

router.post('/FinalEvaluation',  (req,res)=>{

           db.query(`UPDATE adoptiontransaction SET int_Result=${req.body.result},dtm_DateTimeOfResult='${req.body.dtmFinalEvaluation}',str_EvaluationRemarks='${req.body.remarks}', int_Stage=5 WHERE int_AdoptionTransactionId=${req.body.transactionId}`,(err)=>{
            db.query(`SELECT int_AnimalId FROM adoptiontransaction WHERE int_AdoptionTransactionId=${req.body.transactionId}`,(err,animalInvolved)=>{
            if(req.body.result==0){
                 db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${req.body.adopterId},${(req.body.adopterType==0?'1':'2')},0)`, (err, lastPayment) => { console.log(lastPayment.insertId)
                    db.query(`INSERT INTO breakdown( int_PaymentId,int_AnimalInvolved, int_NatureOfCollectionId) VALUES( ${lastPayment.insertId},${animalInvolved[0].int_AnimalId},6)`, (err, results) => {
                        if(req.body.adopterType==0){
                            db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${lastPayment.insertId}`,(err,breakdown)=>{
                                db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                                    res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:breakdown[0].str_PayorName});
                                });
                            });
                        }
                        else if(req.body.adopterType==1){
                            db.query(`SELECT *, concat(nc.str_LastName,", ",nc.str_FirstName," ",nc.str_MiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN noncitizen nc ON p.int_PayorId = nc.int_NonCitizenId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${lastPayment.insertId}`,(err,breakdown)=>{ console.log(err)
                                db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                                    res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:breakdown[0].str_PayorName});
                                });
                            });
                        }
                
            });
        });
            }
            else{
                res.redirect("/CVO_Adoption");
            }
        });
        });
});


router.post('/getAdoptionApplication',  (req,res)=>{

        db.query(`SELECT * FROM adoptionapplication WHERE int_AdopterId=${req.body.id1} AND int_AdopterType=${req.body.id2}`,(err,results)=>{
                //console.log(results)
                res.json(results);
        })
         
});
router.post('/getPersonalInformation',  (req,res)=>{

       if(req.body.id2==0){
        //PETOWNER
                db.query(`SELECT *,CONCAT(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName ) AS AdopterName FROM petowner WHERE int_PetOwnerId=${req.body.id1}`,(err,results)=>{
                    //console.log(results);
                    res.json(results);
                })
       }
       else{
        //NONCITIZEN
                db.query(`SELECT *,CONCAT(str_LastName,", ",str_FirstName," ",str_MiddleName ) AS AdopterName FROM noncitizen WHERE int_NonCitizenId=${req.body.id1}`,(err,results)=>{
                    //console.log(results);
                    res.json(results);
                })
       }
         
});

router.post('/getInterviewDetails',  (req,res)=>{

      db.query(`SELECT * FROM adoptiontransaction WHERE int_AdoptionTransactionId=${req.body.id}`,(err,results)=>{
        //console.log(results)
            res.json(results)
      });
         
});

router.post('/getHomeVisitDetails',  (req,res)=>{

      db.query(`SELECT * FROM adoptiontransaction WHERE int_AdoptionTransactionId=${req.body.id}`,(err,results)=>{
       // console.log(results)
            res.json(results)
      });
         
});
router.post('/systemEvaluation',(req,res)=>{
    db.query(`SELECT * FROM adoptionapplication WHERE int_AdopterId=${req.body.id1} AND int_AdopterType=${req.body.id2}`,(err,adoptionapp)=>{
               
        
  var DecisionTree = require('decision-tree');
  db.query(`SELECT a.int_AdopterType, a.int_Occupation, a.int_SourceOfIncome, a.int_MonthlyIncome,a.int_NoOfChildren,a.int_NoOfTeenagers,a.int_NoOfYouth,a.int_NoOfAdult,a.int_NoOfDogs,a.int_NoOfCats,a.int_PetEuthanize,a.int_SurrenderPet,a.int_LostPet,a.int_EnsurePetIndoor,atran.int_Result FROM adoptiontransaction atran JOIN adoptionapplication a  ON (a.int_AdopterId=atran.int_AdopterId AND a.int_AdopterType=atran.int_AdopterType)`,(err,training_data)=>{ 
   db.query(`SELECT a.int_AdopterType, a.int_Occupation, a.int_SourceOfIncome, a.int_MonthlyIncome,a.int_NoOfChildren,a.int_NoOfTeenagers,a.int_NoOfYouth,a.int_NoOfAdult,a.int_NoOfDogs,a.int_NoOfCats,a.int_PetEuthanize,a.int_SurrenderPet,a.int_LostPet,a.int_EnsurePetIndoor,atran.int_Result FROM adoptionapplication a JOIN adoptiontransaction atran ON (a.int_AdopterId=atran.int_AdopterId AND a.int_AdopterType=atran.int_AdopterType)`,(err,test_data)=>{ 
  //console.log(training_data)
  
   var class_name = "int_Result"; //VARIABLE TO PREDICT
     var features = ["int_AdopterType",
    "int_Occupation",
    "int_SourceOfIncome",
    "int_MonthlyIncome",
    "int_NoOfChildren",
    "int_NoOfTeenagers",
    "int_NoOfYouth",
    "int_NoOfAdult",
    "int_NoOfDogs",
    "int_NoOfCats",
    "int_PetEuthanize",
    "int_SurrenderPet",
    "int_LostPet",
    "int_EnsurePetIndoor"];
      var dt = new DecisionTree(training_data, class_name, features);
       var predicted_class = dt.predict({
        int_AdopterType : adoptionapp[0].int_AdopterType,
        int_Occupation : adoptionapp[0].int_Occupation,
        int_SourceOfIncome :adoptionapp[0].int_SourceOfIncome,
        int_MonthlyIncome :adoptionapp[0].int_MonthlyIncome,
        int_NoOfChildren :adoptionapp[0].int_NoOfChildren,
        int_NoOfTeenagers :adoptionapp[0].int_NoOfTeenagers,
        int_NoOfYouth :adoptionapp[0].int_NoOfYouth,
        int_NoOfAdult :adoptionapp[0].int_NoOfAdult,
        int_NoOfDogs :adoptionapp[0].int_NoOfDogs,
        int_NoOfCats :adoptionapp[0].int_NoOfCats,
        int_PetEuthanize :adoptionapp[0].int_PetEuthanize,
        int_SurrenderPet :adoptionapp[0].int_SurrenderPet,
        int_LostPet :adoptionapp[0].int_LostPet,
        int_EnsurePetIndoor :adoptionapp[0].int_EnsurePetIndoor
  });
       var accuracy = dt.evaluate(test_data);
       var treeModel = dt.toJSON();
       res.json({pc:predicted_class,acc:accuracy}) 
   });    
      });    });
});
exports.CVO_Adoption= router;

