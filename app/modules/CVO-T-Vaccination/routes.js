var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);


router.get('/', (req, res) => {
    db.query(`SELECT *, TIME(v.dtm_DateTimeOfVaccination) as Time, DATE(v.dtm_DateTimeOfVaccination) as Date FROM vaccination v JOIN pet p ON v.int_PetId=p.int_PetId JOIN petowner po ON p.int_PetOwnerId=po.int_PetOwnerId WHERE v.int_Status=0 ORDER BY Date, Time;`, (err, scheduledVaccination) => {
        db.query(`SELECT * FROM pet p JOIN petowner po ON p.int_PetOwnerId = po.int_PetOwnerId JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId `, (err, pets) => {
            db.query(`SELECT *,p.dat_DateRegistered as PetDateReg, po.dat_DateRegistered as PetOwnerDateReg FROM vaccinationcertificateupload vcu JOIN vaccination v ON vcu.int_VaccinationId=v.int_VaccinationId JOIN pet p ON v.int_PetId=p.int_PetId JOIN petowner po ON p.int_PetOwnerId=po.int_PetOwnerId JOIN barangay ba ON po.int_BarangayId=ba.int_BarangayId JOIN animal a ON p.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId JOIN colorpattern c ON a.int_colorPatternId=c.int_colorPatternId WHERE v.int_Status=0 ORDER BY vcu.int_VaccinationCertificateUploadId DESC `, (err, requests) => {
                db.query(`SELECT * FROM vaccine`, (err, vaccines) => {
                    res.render('CVO-T-Vaccination/views/view.ejs', {
                        va: vaccines,
                        pe: pets,
                        sv: scheduledVaccination,
                        re: requests
                    });
                });
            });
        });
    });
});
router.post('/approve', (req, res) => {
    db.query(`UPDATE vaccinationcertificateupload SET int_Status=1 WHERE int_VaccinationCertificateUploadID=${req.body.currentVaccinationCertificateUploadID}`, (err, results) => {
        console.log(err);
        db.query(`UPDATE vaccination SET dtm_DateTimeOfVaccination='${req.body.vaccinationDate} 00:00:00',int_VaccineId=${req.body.vaccine},str_LotNo='${req.body.lotNumber}',int_Status=4 ,int_EmployeeId= ${1} WHERE int_VaccinationId=${req.body.currentVaccinationId}`, (err, results) => {
            console.log(err);
            res.send(`<html><body><script src="/sweetalert/dist/sweetalert.min.js"></script> <style>body{font-family: "Trebuchet MS";}tr{font-size: 15px;}.swal-overlay{background-color: rgba(66, 134, 244, 0.90);}</style> <script>swal("Approval Successful!" , "The Pet Owner will be notified that the Uploaded Vaccination Certificate is Approved" , "success" ).then(()=>{window.location.href="/CVO_Vaccination";});</script></body></html>`);
        });
    });
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
        res.redirect('/CVO_Vaccination');
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
            res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:petdetails[0][0]});
        });   
        });
        });
    }
});


exports.CVO_Vaccination = router;
exports.CVO_VaccinationRecording = router1;
exports.CVO_VaccinationScheduling = router2;
exports.CVO_VaccinationConducting = router3;