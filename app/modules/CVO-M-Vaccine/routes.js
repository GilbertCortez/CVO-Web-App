
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-M-Vaccine/views/view.ejs');
          
});

router.post('/', (req, res) => {
	var vaccineName = `${req.body.name}`.trim();
	var vaccineClass = `${req.body.vaccineClassification}`;
	var vaccineManu = `${req.body.manu_name}`.trim();
	db.query(`INSERT INTO vaccine(str_VaccineName,int_VaccineClassification,str_Manufacturer) VALUES ("${vaccineName}","${vaccineClass}","${vaccineManu}")`,(err, fields, results) => {
		if (err){
			console.log(err);
			res.redirect('/CVO_Vaccine');
		}
		else {
			res.render('CVO-M-Vaccine/views/view');
		}
	})
});




exports.CVO_Vaccine= router;
