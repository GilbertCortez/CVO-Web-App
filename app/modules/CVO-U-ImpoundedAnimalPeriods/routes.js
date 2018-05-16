
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{

	db.query(`SELECT * FROM impoundedanimalperiods WHERE int_PeriodId = 1`, (err, results, fields) =>{
		if(err){
			console.log(err)
			res.redirect('/CVO_ImpoundedAnimalPeriods')
		}
		else {
			res.render('CVO-U-ImpoundedAnimalPeriods/views/view',{periods:results});
		}
	})
});


router.post('/', (req, res)=>{
	var claimingPeriod = req.sanitize(`${req.body.claiming_period}`.trim());
	var adoptionPeriod = req.sanitize(`${req.body.adoption_period}`.trim());

	db.query(`UPDATE impoundedanimalperiods SET int_ClaimingPeriod = "${claimingPeriod}", int_AdoptionPeriod = "${adoptionPeriod}"
	WHERE int_PeriodId=1`, (err, results, fields)=>{
		if(err){
			console.log(err)
			res.redirect('/CVO_ImpoundedAnimalPeriods')
		}
		else {
			res.redirect('/CVO_ImpoundedAnimalPeriods')
		}
	});
});

exports.CVO_ImpoundedAnimalPeriods= router;
