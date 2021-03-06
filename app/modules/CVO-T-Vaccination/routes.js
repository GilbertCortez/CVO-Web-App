var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);


router.get('/WalkIn', (req, res) => {
   db.query(`SELECT * FROM pet p JOIN petowner po ON p.int_PetOwnerId = po.int_PetOwnerId JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId `, (err, pets) => {
           db.query(`SELECT * FROM requirementspertransaction rpt JOIN requirements r ON rpt.int_RequirementsId=r.int_RequirementsId WHERE rpt.int_Transaction='3'`, (err, vrequirements) => {
     
                    res.render('CVO-T-Vaccination/views/view_walkin.ejs', {
                    
                        pe: pets,
                        vrequ: vrequirements
                       
                    });
                });
       });
            });
 

router.get('/Scheduled', (req, res) => {
    
     db.query(`SELECT * FROM pet p JOIN petowner po ON p.int_PetOwnerId = po.int_PetOwnerId JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId `, (err, pets) => {
             db.query(`SELECT * FROM requirementspertransaction rpt JOIN requirements r ON rpt.int_RequirementsId=r.int_RequirementsId WHERE rpt.int_Transaction='3'`, (err, vrequirements) => {
     
    db.query(`SELECT *, TIME(v.dtm_DateTimeOfVaccination) as Time, DATE(v.dtm_DateTimeOfVaccination) as Date FROM vaccination v JOIN pet p ON v.int_PetId=p.int_PetId JOIN petowner po ON p.int_PetOwnerId=po.int_PetOwnerId WHERE v.int_Status=0 ORDER BY Date, Time;`, (err, scheduledVaccination) => {
   
                    res.render('CVO-T-Vaccination/views/view_sched.ejs', {
                       
                        sv: scheduledVaccination,
                        pe: pets,
                        vrequ: vrequirements
                      
        });
                    });
    });
         });
});
  
router.post('/Scheduled/reschedule/recording',(req,res)=>{
    db.query(`UPDATE vaccination SET dtm_DateTimeOfVaccination='${req.body.selectedDate}' WHERE int_VaccinationId=${req.body.vaccinationId}`,(err)=>{ console.log(err)
        db.query(`SELECT *, TIME(dtm_DateTimeOfVaccination) as time FROM vaccination WHERE int_VaccinationId= ${req.body.vaccinationId}`,(err,appointDetails)=>{
        db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                    db.query(`CALL SelectPetDetails(${req.body.petId})`,(err,petDetails)=>{
                        res.render('CVO-T-Vaccination/views/SummaryOfVaccinationAppointmentSchedule.ejs',{ad:appointDetails,od:officeDetails,pd:petDetails[0],empName: "Gilbert Critica Cortez"});
                    });    
                });    
    });
    })
});
router.post('/Scheduled/reschedule',(req,res)=>{
     db.query(`SELECT * FROM office`,(err,offi)=>{
    db.query(`SELECT * FROM vaccinationperday`,(err,numVac)=>{
    db.query(`SELECT * FROM (SELECT COUNT(*)< ${numVac[0].int_NumberOfVaccination}  as result, dtm_DateTimeOfVaccination  FROM vaccination WHERE int_Status=0 GROUP BY dtm_DateTimeOfVaccination) a WHERE result=0 `,(err,totalSchedule)=>{
var availableDay="";

      offi[0].str_DayAvailability.split(",").forEach(function(day,ctr){
        if(ctr!=0){
            availableDay+=",";
        }
        if(day=="Sun"){
            availableDay+="0";
        }
        else if(day=="Mon"){
            availableDay+="1";
        }
        else if(day=="Tue"){
            availableDay+="2";
        }
        else if(day=="Wed"){
            availableDay+="3";
        }
        else if(day=="Thu"){
            availableDay+="4";
        }
        else if(day=="Fri"){
            availableDay+="5";
        }
        else if(day=="Sat"){
            availableDay+="6";
        }
      });
    res.render('CVO-T-Vaccination/views/reschedulevaccination.ejs',{vaccDetails:req.body.vaccination,  daysOfWeek:availableDay})
})
  });
    });
 });
router.post('/Scheduled/delete', (req, res) => {

    db.query(`DELETE FROM vaccination WHERE int_VaccinationId=${req.body.id}`,(err)=>{
        if(err){
            res.send("ERROR")
        }
        else{
            res.send("SUCCESS")
        }
    })
});

//RECORDING
router1.post('/', (req, res) => {
    db.query(`SELECT * FROM vaccine`, (err, vaccines) => { 
           db.query(`CALL SelectPetDetails(${req.body.currentPetId})`,(err,petDetails)=>{
        res.render('CVO-T-Vaccination/views/recordvaccination.ejs', {
            va: vaccines,
            currentPetId: req.body.currentPetId,
            pe: petDetails[0]
        });
        });
    });
});

router1.post('/recording', (req, res) => {

    db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_VaccineId, str_LotNo, int_Status, int_EmployeeId) VALUES (${req.body.currentPetId},'${req.body.vaccinationdate}'+' 00:00:00',${req.body.vaccine},${req.body.lotNumber},3,1)`, (err, vaccines) => {
        console.log(err)
        res.redirect('/CVO_Vaccination/Scheduled');
    });
});

router1.post('/getVaccineDetails', (req, res) => {

    db.query(`SELECT * FROM vaccine v JOIN manufacturer m ON v.int_ManufacturerId=m.int_ManufacturerId WHERE v.int_VaccineId=${req.body.id} `, (err, vaccineDetails) => {
        console.log(vaccineDetails)
        res.json(vaccineDetails);
    });

});


router2.post('/', (req, res) => { 
    db.query(`SELECT * FROM office`,(err,offi)=>{
    db.query(`SELECT * FROM vaccinationperday`,(err,numVac)=>{
    db.query(`SELECT * FROM (SELECT COUNT(*)< ${numVac[0].int_NumberOfVaccination}  as result, dtm_DateTimeOfVaccination  FROM vaccination WHERE int_Status=0 GROUP BY dtm_DateTimeOfVaccination) a WHERE result=0 `,(err,totalSchedule)=>{
    console.log(totalSchedule)
    var availableDay="";

      offi[0].str_DayAvailability.split(",").forEach(function(day,ctr){
        if(ctr!=0){
            availableDay+=",";
        }
        if(day=="Sun"){
            availableDay+="0";
        }
        else if(day=="Mon"){
            availableDay+="1";
        }
        else if(day=="Tue"){
            availableDay+="2";
        }
        else if(day=="Wed"){
            availableDay+="3";
        }
        else if(day=="Thu"){
            availableDay+="4";
        }
        else if(day=="Fri"){
            availableDay+="5";
        }
        else if(day=="Sat"){
            availableDay+="6";
        }
      });

    res.render('CVO-T-Vaccination/views/schedulevaccination.ejs', {
        currentPetId: req.body.currentPetId,
        daysOfWeek:availableDay
    });
    });
     });
});
});

router2.post('/getSlots', (req, res) => {
    db.query(`SELECT * FROM vaccinationperday`,(err,numVac)=>{
    db.query(`SELECT * FROM office`,(err,offi)=>{
 
    var dateClicked = req.body.id;

    var startTime = (offi[0].dtm_OpenHour).split(":");
    var endTime = (offi[0].dtm_CloseHour).split(":");
    var numberOfVaccinationPerDay = numVac[0].int_NumberOfVaccination;
    
    var officeHoursInMinutes = ((parseInt(endTime[0]) * 60) + parseInt(endTime[1])) - ((parseInt(startTime[0]) * 60) + parseInt(startTime[1]));
    var numberOfVaccinationPerHour = Math.round((numberOfVaccinationPerDay / parseInt(officeHoursInMinutes / 60)));

    scheduleDetails = [];
    var currentHour = parseInt(startTime[0]);


    a(null, () => {
        b(null, () => {
            c(() => {

            });
        });
    });

    function a(param, callback1) {

        for (var ctr = 1; ctr <= parseInt(officeHoursInMinutes / 60); ctr++) {

            scheduleDetails = scheduleDetails.concat([{
                'id': ctr,
                'hour': ("0" + currentHour).slice(-2) + ":" + startTime[1],
                'totalSlots': numberOfVaccinationPerHour,
                'takenSlots': 0
            }]);

            if (ctr == parseInt(officeHoursInMinutes / 60)) {
                callback1();
            }
            currentHour++;

        }

    }


    function b(param, callback2) {
        scheduleDetails.forEach(function(i, x) {
            db.query(`SELECT COUNT(*) as num FROM vaccination WHERE (dtm_DateTimeOfVaccination BETWEEN  '` + dateClicked + ` ` + i.hour + `:00' AND  DATE_ADD('` + dateClicked + ` ` + i.hour + `:00', INTERVAL 59 MINUTE) ) AND int_Status=0`, (err, numberOfTaken) => {
                scheduleDetails[x].takenSlots = numberOfTaken[0].num;

                if (parseInt(officeHoursInMinutes / 60) === (parseInt(x) + 1)) {

                    callback2();
                }
            });

        });

    }


    function c() {
        res.json(scheduleDetails);
    }
});
    });
});

router2.post('/recording', (req, res) => {
    db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_Status) VALUES (${req.body.currentPetId},'${req.body.selectedDate}',0)`, (err, insertIdVac) => {
       db.query(`SELECT *, TIME(dtm_DateTimeOfVaccination) as time FROM vaccination WHERE int_VaccinationId= ${insertIdVac.insertId}`,(err,appointDetails)=>{
        db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                    db.query(`CALL SelectPetDetails(${req.body.currentPetId})`,(err,petDetails)=>{
                        res.render('CVO-T-Vaccination/views/SummaryOfVaccinationAppointmentSchedule.ejs',{ad:appointDetails,od:officeDetails,pd:petDetails[0],empName: "Gilbert Critica Cortez"});
                    });    
                });    
    });
    });
});

//CONDUCTING
router3.post('/', (req, res) => {
    var currentPetId = req.body.currentPetId;
    db.query(`CALL SelectPetDetails(${currentPetId})`,(err,petdetails)=>{
    db.query(`SELECT * FROM vaccine v JOIN manufacturer m ON v.int_ManufacturerId=m.int_ManufacturerId WHERE v.int_Species = (SELECT int_AnimalSpecies FROM pet p JOIN animal a ON p.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId WHERE p.int_PetId= ${currentPetId}) OR v.int_Species=2`, (err, vaccines) => {
        res.render('CVO-T-Vaccination/views/conduct.ejs', {
            va: vaccines,
            currentPetId: currentPetId,
            lastPayment: req.body.lastPaymentId,
            pe: petdetails[0]
        });
        });
    });
});



router3.post('/recording', (req, res) => {
    db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_VaccineId, str_LotNo, int_Status, int_EmployeeId) VALUES (${req.body.currentPetId},now(),${req.body.vaccine},${req.body.lotNumber},1,1)`, (err, lastVaccinationId) => {
        db.query(`SELECT * FROM pet p JOIN petowner po ON p.int_PetOwnerId=po.int_PetOwnerId WHERE p.int_PetId=${req.body.currentPetId}`, (err, result) => {
            
        
           
            if (req.body.lastPayment == 'NONE') {
                db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${result[0].int_PetOwnerId},0,0)`, (err, lastPayment) => {
                    db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId,int_AnimalInvolved) VALUES( ${lastPayment.insertId},2,${req.body.currentPetId} )`, (err, results) => {
                        orderOfPayment(lastPayment.insertId,req.body.currentPetId);
                    });
                });
            } else {
                db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId,int_AnimalInvolved) VALUES( ${req.body.lastPayment},2,${req.body.currentPetId} )`, (err, results) => {
                         orderOfPayment(req.body.lastPayment,req.body.currentPetId);
                });
            }
        });

    });

    function orderOfPayment(x,y){
        db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${x}`,(err,breakdown)=>{
        db.query(`CALL SelectPetDetailsWithPetOwnerDetails( ${y} )`,(err,petdetails)=>{
        db.query(`SELECT * FROM office`,(err,officeDetails)=>{
            res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:petdetails[0][0].str_PetOwnerLastName+", "+petdetails[0][0].str_PetOwnerFirstName+" "+petdetails[0][0].str_PetOwnerMiddleName});
        });   
        });
        });
    }
});


exports.CVO_Vaccination = router;
exports.CVO_VaccinationRecording = router1;
exports.CVO_VaccinationScheduling = router2;
exports.CVO_VaccinationConducting = router3;