
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);



router.get('/',  (req,res)=>{
		db.query(`SELECT * FROM adoptionperhousehold WHERE int_APHId = 1`, (err,results3,fields)=>{
	db.query(`SELECT * FROM impoundedanimalperiods WHERE int_PeriodId = 1`, (err, results2, fields) =>{
	db.query(`SELECT int_NumberOfVaccination FROM vaccinationperday`, (err, results1, fields)=>{
			res.render('CVO-U-OperationConstraints/views/view.ejs', {results:results1,periods:results2,adoption:results3});
          });
});
});
});

router.post('/VaccinationPerDay', (req, res) => {
	var vaccinationPerDay = req.sanitize(`${req.body.vaccination_number}`.trim());

	if (vaccinationPerDay==""){
		res.send("There's error");
	}

	else {
		db.query(`UPDATE vaccinationperday SET int_NumberOfVaccination = ${vaccinationPerDay} WHERE int_VPDId = 1`, (err, results, fields)=>{
			
				res.redirect('/CVO_OperationConstraints')
		
		});
	}
});

router.post('/ImpoundedAnimalPeriods', (req, res)=>{
	var claimingPeriod = req.sanitize(`${req.body.claiming_period}`.trim());
	var adoptionPeriod = req.sanitize(`${req.body.adoption_period}`.trim());

	db.query(`UPDATE impoundedanimalperiods SET int_ClaimingPeriod = "${claimingPeriod}", int_AdoptionPeriod = "${adoptionPeriod}"
	WHERE int_PeriodId=1`, (err, results, fields)=>{
		console.log(err)
			res.redirect('/CVO_OperationConstraints')
		
	});
});

router.post('/AdoptionPerHousehold', (req, res) =>{

	var adoptionPerHousehold = req.sanitize(`${req.body.adoptionperhousehold}`.trim());

	db.query(`UPDATE adoptionperhousehold SET int_NumberOfAdoption = "${adoptionPerHousehold}" WHERE int_APHId = 1`,(err, results, fields) => {

	
			res.redirect('/CVO_OperationConstraints')
		});

});

exports.CVO_OperationConstraints= router;
