
var express = require('express');
var router = express.Router();
var cv = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{

  db.query(`SELECT * FROM vaccine v JOIN manufacturer m ON v.int_ManufacturerId=m.int_ManufacturerId`,(err, vaccines, field) => {
    db.query(`SELECT * FROM manufacturer`,(err, manufacturer, field) => {
      res.render('CVO-M-Vaccine/views/view',{va:vaccines, ma:manufacturer});
      });
  });
});

router.post('/add', (req, res) => {
  //SANITATION OF DATA
	var vaccineName = req.sanitize(`${req.body.name}`.trim());
	var vaccineClass = `${req.body.vaccineClassification}`;
	var vaccineManu = req.body.manu_name;
  var species=req.body.species;
  var yearsOfImmunity=req.sanitize(`${req.body.yearsOfImmunity}`.trim());

	db.query(`INSERT INTO vaccine(str_VaccineName,int_VaccineClassification,int_ManufacturerId, int_Species,flt_YearsOfImmunity) VALUES ("${vaccineName}","${vaccineClass}","${vaccineManu}",${species},${yearsOfImmunity})`,(err, fields, results) => {
			res.redirect('/CVO_Vaccine');
	});

});

router1.post('/',  (req,res)=>{
var id=req.sanitize(req.body.id.trim());
  db.query(`SELECT * FROM vaccine WHERE str_VaccineName = "${id}" AND int_ManufacturerId="${req.body.id2}"`,(err,result)=>{
    console.log(result);
    if(result.length==0){
    res.json(0);
    }
    else{
    res.json(1);  
    }
  });
});




exports.CVO_Vaccine= router;
exports.checkVaccine= cv;
exports.cv = router1;

