
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	res.render('CVO-T-Vaccination/views/view.ejs');
});


//RECORDING
router1.get('/',  (req,res)=>{
  db.query(`SELECT * FROM vaccine`,(req,vaccines)=>{
	   res.render('CVO-T-Vaccination/views/recordvaccination.ejs',{va:vaccines});
  });
});

router1.post('/',  (req,res)=>{
  console.log(req.body.vaccinationDate);
  db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_VaccineId, str_LotNo, int_Status, int_EmployeeId) VALUES (1,'${req.body.vaccinationDate}',${req.body.vaccine},${req.body.lotNumber},3,1)`,(req,vaccines)=>{
	   res.redirect('/CVO_Vaccination');
  });
});

router1.post('/getVaccineDetails',  (req,res)=>{

  db.query(`SELECT * FROM vaccine WHERE int_VaccineId=${req.body.id}`,(err,vaccineDetails)=>{
    console.log(err);
	   res.json(vaccineDetails);
  });

});



router2.get('/',  (req,res)=>{
	res.render('CVO-T-Vaccination/views/schedulevaccination.ejs');
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
      console.log(ctr+'=='+parseInt(officeHoursInMinutes/60))
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
                console.log(`SELECT COUNT(*) as num FROM vaccination WHERE (dtm_DateTimeOfVaccination BETWEEN  '`+dateClicked+` `+i.hour+`:00' AND  DATE_ADD('`+dateClicked+` `+i.hour+`:00', INTERVAL 59 MINUTE) ) AND int_Status=0`);
                if(parseInt(officeHoursInMinutes/60)===(parseInt(x)+1)){
                  console.log(parseInt(officeHoursInMinutes/60)+'=='+(parseInt(x)+1))
                callback2();
            }
            });
            
        });
        
  }


  function c(){
   res.json(scheduleDetails);
 }
  
});


//INSERT INTO `vaccination`( `int_PetId`, `dtm_DateTimeOfVaccination`, `int_Status`) VALUES (1,'2018-05-25 08:00;00',0)


exports.CVO_Vaccination= router;
exports.CVO_VaccinationRecording= router1;
exports.CVO_VaccinationScheduling= router2;
