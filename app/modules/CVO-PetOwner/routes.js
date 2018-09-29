
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();

router.use(authMiddleware.noAuthedPetOwner);



router.get('/Dashboard',(req,res)=>{
		res.render('CVO-PetOwner/views/Dashboard.ejs');
});

router.get('/Profile',(req,res)=>{
		res.render('CVO-PetOwner/views/Profile.ejs');
});

router.get('/Pets',(req,res)=>{
		res.render('CVO-PetOwner/views/Pets.ejs');
});

router.get('/Account',(req,res)=>{
		res.render('CVO-PetOwner/views/Account.ejs');
});

router.get('/Appointment',(req,res)=>{
		res.render('CVO-PetOwner/views/Appointment.ejs');
});


exports.PetOwner= router;
