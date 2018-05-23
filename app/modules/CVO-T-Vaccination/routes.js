
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
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

router1.get('/',  (req,res)=>{
  db.query(`INSERT INTO vaccination( int_PetId, dtm_DateTimeOfVaccination, int_VaccineId, str_LotNo, int_Status, int_EmployeeId) VALUES (1,${},${},${},3,1)`,(req,vaccines)=>{
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






exports.CVO_Vaccination= router;
exports.CVO_VaccinationRecording= router1;
exports.CVO_VaccinationScheduling= router2;
