
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  db.query(`SELECT *, TIME(v.dtm_DateTimeOfVaccination) as Time, DATE(v.dtm_DateTimeOfVaccination) as Date FROM vaccination v JOIN pet p ON v.int_PetId=p.int_PetId JOIN petowner po ON p.int_PetOwnerId=po.int_PetOwnerId WHERE v.int_Status=0 ORDER BY Date, Time;`,(err,scheduledVaccination)=>{
       db.query(`SELECT * FROM pet p JOIN petowner po ON p.int_PetOwnerId = po.int_PetOwnerId JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId `,(err,pets)=>{
            db.query(`SELECT *,p.dat_DateRegistered as PetDateReg, po.dat_DateRegistered as PetOwnerDateReg FROM vaccinationcertificateupload vcu JOIN vaccination v ON vcu.int_VaccinationId=v.int_VaccinationId JOIN pet p ON v.int_PetId=p.int_PetId JOIN petowner po ON p.int_PetOwnerId=po.int_PetOwnerId JOIN barangay ba ON po.int_BarangayId=ba.int_BarangayId JOIN animal a ON p.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId JOIN colorpattern c ON a.int_colorPatternId=c.int_colorPatternId WHERE v.int_Status=0 ORDER BY vcu.int_VaccinationCertificateUploadId DESC `,(err,requests)=>{console.log(requests);
              res.render('CVO-T-Vaccination/views/view.ejs',{pe:pets, sv:scheduledVaccination,re:requests});
            });
       });
   });
});


//RECORDING
router1.post('/',  (req,res)=>{
  db.query(`SELECT * FROM vaccine`,(err,vaccines)=>{
	   res.render('CVO-T-Vaccination/views/recordvaccination.ejs',{va:vaccines,currentPetId:req.body.currentPetId});
  });
});

router1.post('/recording',  (req,res)=>{
  
  db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_VaccineId, str_LotNo, int_Status, int_EmployeeId) VALUES (${req.body.currentPetId},'${req.body.vaccinationDate}',${req.body.vaccine},${req.body.lotNumber},3,1)`,(req,vaccines)=>{
	   res.redirect('/CVO_Vaccination');
  });
});

router1.post('/getVaccineDetails',  (req,res)=>{

  db.query(`SELECT * FROM vaccine WHERE int_VaccineId=${req.body.id}`,(err,vaccineDetails)=>{
	   res.json(vaccineDetails);
  });

});


router2.post('/',  (req,res)=>{

	res.render('CVO-T-Vaccination/views/schedulevaccination.ejs',{currentPetId:req.body.currentPetId});
});

router2.post('/getSlots',  (req,res)=>{
  var dateClicked=req.body.id;

  var startTime=("08:00:00").split(":");
  var endTime=("16:00:00").split(":");
  var numberOfVaccinationPerDay=6;


  var officeHoursInMinutes=((parseInt(endTime[0])*60)+parseInt(endTime[1]))-((parseInt(startTime[0])*60)+parseInt(startTime[1]));
  var numberOfVaccinationPerHour=Math.round((numberOfVaccinationPerDay/parseInt(officeHoursInMinutes/60)));

  scheduleDetails=[];
  var currentHour=parseInt(startTime[0]);

 
 a(null,()=>{
  b(null,()=>{
    c(()=>{

    });
  });
 });
  function a(param, callback1){
 
      for(var ctr=1;ctr<=parseInt(officeHoursInMinutes/60);ctr++){
        
      scheduleDetails= scheduleDetails.concat([{
          'id': ctr,
          'hour': ("0"+currentHour).slice(-2)+":"+startTime[1],
          'totalSlots': numberOfVaccinationPerHour,
          'takenSlots': 0
        }]);
    
       if(ctr==parseInt(officeHoursInMinutes/60)){
          callback1();
        }
      currentHour++;
       
      }
      
  }
  

  function b(param,callback2){
        scheduleDetails.forEach(function(i,x){
            db.query(`SELECT COUNT(*) as num FROM vaccination WHERE (dtm_DateTimeOfVaccination BETWEEN  '`+dateClicked+` `+i.hour+`:00' AND  DATE_ADD('`+dateClicked+` `+i.hour+`:00', INTERVAL 59 MINUTE) ) AND int_Status=0`,(err,numberOfTaken)=>{
                  scheduleDetails[x].takenSlots=numberOfTaken[0].num;
               
                if(parseInt(officeHoursInMinutes/60)===(parseInt(x)+1)){
        
                callback2();
            }
            });
            
        });
        
  }


  function c(){
   res.json(scheduleDetails);
 }
  
});

router2.post('/recording',(req,res)=>{
  db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_Status) VALUES (${req.body.currentPetId},'${req.body.selectedDate}',0)`,(err,result)=>{
      console.log(err);
  });
});
//INSERT INTO `vaccination`( `int_PetId`, `dtm_DateTimeOfVaccination`, `int_Status`) VALUES (1,'2018-05-25 08:00:00',0)

//CONDUCTING
router3.post('/',  (req,res)=>{
  var currentPetId=req.body.currentPetId;
  console.log(currentPetId);
  db.query(`SELECT * FROM vaccine`,(err,vaccines)=>{
     res.render('CVO-T-Vaccination/views/conduct.ejs',{va:vaccines, currentPetId: currentPetId, lastPayment:req.body.lastPaymentId});
  });
});

router3.post('/recording',  (req,res)=>{
  db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_VaccineId, str_LotNo, int_Status, int_EmployeeId) VALUES (${req.body.currentPetId},now(),${req.body.vaccine},${req.body.lotNumber},1,1)`,(err,result)=>{
     db.query(`SELECT * FROM pet p JOIN petowner po ON p.int_PetOwnerId=po.int_PetOwnerId WHERE p.int_PetId=${req.body.currentPetId}`,(err, result)=>{
       res.redirect('/CVO_Vaccination');
                                    if(req.body.lastPayment=='NONE'){
                                        db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${result[0].int_PetOwnerId},0,0)`,(err,lastPayment)=>{
                                            db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId,int_AnimalInvolved) VALUES( ${lastPayment.insertId},3,${req.body.currentPetId} )`,(err,results)=>{});
                                        });
                                      }
                                      else{
                                      db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId,int_AnimalInvolved) VALUES( ${req.body.lastPayment},3,${req.body.currentPetId} )`,(err,results)=>{ console.log(err);});
                                    }
     });
    
  });
 });


exports.CVO_Vaccination= router;
exports.CVO_VaccinationRecording= router1;
exports.CVO_VaccinationScheduling= router2;
exports.CVO_VaccinationConducting= router3;