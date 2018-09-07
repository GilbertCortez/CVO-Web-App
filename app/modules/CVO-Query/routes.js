
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/PetOwnerRegistration',  (req,res)=>{
 	var QUERY=`SELECT * FROM petowner po JOIN barangay b ON po.int_BarangayId=b.int_BarangayId`;
 	console.log(req.query)
 	db.query(QUERY,(err,results)=>{
 	db.query('SELECT * FROM barangay', (err, barangay) => {
			res.render('CVO-Query/views/petownerregistration.ejs',{ba:barangay,re:results});
 	});
 });
});

router.get('/PetRegistration', (req,res)=>{
	db.query('SELECT * FROM barangay', (err, barangay) => {
		res.render('CVO-Query/views/petregistration.ejs',{ba:barangay});
	})
});

router.get('/Vaccination', (req,res)=>{
		res.render('CVO-Query/views/vaccination.ejs');
});

router.get('/PetsAdoption', (req,res)=>{
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/petsforadoption.ejs',{site:results});
	});
});

router.get('/PetsRedemption', (req,res)=>{
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/petsforredemption.ejs',{site:results});
	});
});

router.get('/PetsEuthanasia', (req,res)=>{
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/petsforeuthanasia.ejs',{site:results});
	});
});

router.get('/ApprehendedAnimals', (req,res)=>{
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/apprehendedanimals.ejs',{site:results});
	});
});

router.get('/SurrenderedAnimals', (req,res)=>{
	db.query('SELECT * FROM barangay', (err, barangay) => {
		res.render('CVO-Query/views/surrenderedanimals.ejs',{ba:barangay});
	})
});

router.get('/ReleasedAnimals', (req,res)=>{
		res.render('CVO-Query/views/releasedanimals.ejs');
});

router.get('/EuthanizedAnimals', (req,res)=>{
	res.render('CVO-Query/views/euthanizedanimals.ejs');
});

router.get('/DeceasedAnimals', (req,res)=>{
	res.render('CVO-Query/views/deceasedanimals.ejs');
});

router.get('/Redemption', (req,res)=>{
	res.render('CVO-Query/views/redemption.ejs');
});

router.get('/Adoption', (req,res)=>{
	res.render('CVO-Query/views/adoption.ejs');
});

router.get('/Collection', (req,res)=>{
	res.render('CVO-Query/views/collection.ejs');
});

router.get('/TurnedOverAnimals', (req,res)=>{
	res.render('CVO-Query/views/turnedoveranimals.ejs');
});

router.get('/BatchOfAnimalTurnover', (req,res)=>{
	res.render('CVO-Query/views/batchofanimalturnover.ejs');
});

router.get('/StrayAnimalComplaints', (req,res)=>{
	db.query(`SELECT * FROM barangay`,(err,results)=>{
		res.render('CVO-Query/views/strayanimalcomplaints.ejs',{ba:results});
	});
});

router.get('/TransferOfPetOwnership',(req, res)=>{
	res.render('CVO-Query/views/transferofpetownership.ejs');
});

exports.CVO_Query= router;
