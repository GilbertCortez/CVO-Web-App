
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();

router.use(authMiddleware.noAuthedPetOwner);



router.get('/Dashboard',(req,res)=>{
		res.render('CVO-PetOwner/views/Dashboard.ejs');
});

router.get('/Profile',(req,res)=>{
<<<<<<< HEAD
		res.render('CVO-PetOwner/views/Profile.ejs');
});

router.get('/Pets',(req,res)=>{
		res.render('CVO-PetOwner/views/Pets.ejs');
=======
	db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE int_PetOwnerId=${req.session.user[0].int_PetOwnerId}`, (err, user) => { 
		res.render('CVO-PetOwner/views/Profile.ejs',{user:user[0]});
	});
});

router.get('/Pets',(req,res)=>{
	   db.query(`SELECT *  FROM pet p JOIN animal a on p.int_AnimalId=a.int_AnimalId JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_PetOwnerId=${req.session.user[0].int_PetOwnerId}`, (err, pets) => {
        res.render('CVO-PetOwner/views/Pets.ejs', {
            
            pe: pets
        });
    });
		
>>>>>>> 81cbae7d3cd079fbba609f2595d05ad3e43148da
});

router.get('/Account',(req,res)=>{
		res.render('CVO-PetOwner/views/Account.ejs');
});

router.get('/Appointment',(req,res)=>{
		res.render('CVO-PetOwner/views/Appointment.ejs');
});


exports.PetOwner= router;
