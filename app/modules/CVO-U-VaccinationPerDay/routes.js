
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	db.query(`SELECT int_NumberOfVaccination FROM vaccinationperday`, (err, results, fields)=>{
		if (err){
			console.log(err)
			res.redirect('/CVO_VaccinationPerDay')
		}
		else {
			res.render('CVO-U-VaccinationPerDay/views/view.ejs', {results:results});
		}

	});
          
});

router.post('/', (req, res) => {
	var vaccinationPerDay = req.sanitize(`${req.body.vaccination_number}`.trim());

	if (vaccinationPerDay==""){
		res.send("There's error");
	}

	else {
		db.query(`UPDATE vaccinationperday SET int_NumberOfVaccination = ${vaccinationPerDay} WHERE int_VPDId = 1`, (err, results, fields)=>{
			if (err){
				console.log(err)
				res.redirect('/CVO_VaccinationPerDay')
			}
			else {
				res.redirect('/CVO_VaccinationPerDay')
			}
		});
	}
});
exports.CVO_VaccinationPerDay= router;
