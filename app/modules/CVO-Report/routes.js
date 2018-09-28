
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

//REGISTRATION AND VACCINATION  ###################################
router.get('/RegistrationAndVaccination',  (req,res)=>{
	db.query(`SELECT petowner.MON as MON, petowner.COU as poCOU, pet.COU as pCOU FROM (SELECT COUNT(*) AS COU,MONTHNAME(dat_DateRegistered) AS MON,YEAR(CURDATE()) AS YEA FROM petowner WHERE YEAR(dat_DateRegistered)=YEAR(CURDATE()) GROUP BY MONTHNAME(dat_DateRegistered) ORDER BY MONTH(dat_DateRegistered) ) as petowner JOIN (SELECT COUNT(*) AS COU,MONTHNAME(dat_DateRegistered) AS MON,YEAR(CURDATE()) AS YEA FROM pet WHERE YEAR(dat_DateRegistered)=YEAR(CURDATE()) GROUP BY MONTHNAME(dat_DateRegistered)  ORDER BY MONTH(dat_DateRegistered)) as pet ON petowner.MON=pet.MON  ORDER BY petowner.MON`,(err,data1)=>{
 			db.query(`SELECT * ,COUNT(*) as COU FROM vaccination v JOIN vaccine va ON v.int_VaccineId=va.int_VaccineId JOIN manufacturer m ON va.int_ManufacturerId=m.int_ManufacturerId GROUP BY v.int_VaccineId ORDER BY COU DESC LIMIT 5`,(err,data2)=>{
 			res.render('CVO-Report/views/registrationandvaccination.ejs',{data1:data1,data2:data2});
 		});
 		});
});


router.get('/RegistrationAndVaccination/registrationforecast',  (req,res)=>{
 	res.render('CVO-Report/views/charts/registrationforcast.ejs');
});

router.get('/RegistrationAndVaccination/animalspecies',  (req,res)=>{
	db.query(` SELECT  b.int_AnimalSpecies AS Species,COUNT(*) AS COU,MONTHNAME(dat_DateRegistered) AS MON,YEAR(CURDATE()) AS YEA FROM pet p JOIN animal a ON p.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId WHERE YEAR(dat_DateRegistered)=YEAR(CURDATE()) GROUP BY Species`,(err,data)=>{
 			res.render('CVO-Report/views/charts/registeredpet_pie.ejs',{data:data});
 	});
});
//################################################################

//ADOPTION #######################################################
router.get('/Adoption',  (req,res)=>{
 	res.render('CVO-Report/views/adoption.ejs');
});

router.get('/Adoption/line',  (req,res)=>{
 	res.render('CVO-Report/views/charts/adoption_line.ejs');
});
//################################################################

//EUTHANASIA ####################################################
router.get('/Euthanasia',  (req,res)=>{
	
 	res.render('CVO-Report/views/euthanasia.ejs');
});
router.get('/Euthanasia/line',  (req,res)=>{
 	res.render('CVO-Report/views/charts/euthanasia_line.ejs');
});
//################################################################

//APPREHENSION ###################################################
router.get('/Apprehension',  (req,res)=>{
 	res.render('CVO-Report/views/apprehension.ejs');
});

router.get('/Apprehension/animalspecies',  (req,res)=>{
 	res.render('CVO-Report/views/charts/apprehendedanimal_pie.ejs');
});


exports.CVO_Report= router;
	