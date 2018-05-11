
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);



<<<<<<< HEAD
router1.get('/', function(req, res, next) {
  // replace an HTTP posted body property with the sanitized string
  req.body.sanitized = req.sanitize('Justine Espin');
  // send the response
  res.send('Your value was sanitized to: ' + req.body.sanitized);
});
=======
>>>>>>> 3810c22c871abd4e8e19f36fb07eee52dd1af7c9

router.get('/',  (req,res)=>{

  db.query(`SELECT * FROM vaccine`,(err, results, field) => {
      res.render('CVO-M-Vaccine/views/view',{re:results});
});
});

router.post('/', (req, res) => {
  //SANITATION OF DATA
	var vaccineName = req.sanitize(`${req.body.name}`.trim());
	var vaccineClass = `${req.body.vaccineClassification}`;
	var vaccineManu = req.sanitize(`${req.body.manu_name}`.trim());

  //VALIDATION OF DATA
  if(vaccineName==""){
    res.send("there's error");
  }
  else{
	db.query(`INSERT INTO vaccine(str_VaccineName,int_VaccineClassification,str_Manufacturer) VALUES ("${vaccineName}","${vaccineClass}","${vaccineManu}")`,(err, fields, results) => {
		if (err){
			console.log(err);
<<<<<<< HEAD
			res.redirect('/CVO_Vaccine');
		}
		else {
			res.redirect('/CVO_Vaccine');
=======
>>>>>>> 3810c22c871abd4e8e19f36fb07eee52dd1af7c9
		}
			res.redirect('/CVO_Vaccine');
	})
}
});




exports.CVO_Vaccine= router;
exports.CVO_TryLangValidation= router1;
