
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

router.get('/',  (req,res)=>{
		res.render('CVO-M-AnimalBreed/views/view');
});

router.post('/', (req, res)=>{
	var breed = `${req.body.name}`.trim();
	var animalspecies = `${req.body.animal}`;
	db.query (`INSERT INTO breed(str_BreedName,	int_AnimalSpecies) VALUES ("${breed}","${animalspecies}")`, (err, results, fields)=>{
		if (err){
			console.log(err);
			return res.redirect('/CVO_AnimalBreed');
		}
		else {
			res.render('CVO-M-AnimalBreed/views/view');
		}
	});
});


exports.CVO_AnimalBreed= router;
