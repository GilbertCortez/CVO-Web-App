
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

router.get('/',  (req,res)=>{
	db.query(`SELECT * FROM Breed`,(err, results, fields) => {
		if(err){
			console.log(err);
		}
		else {
			render(results);
		}
	});

	function render(breed) {
		res.render('CVO-M-AnimalBreed/views/view', {breed: breed});
	}
});

router.post('/', (req, res)=>{
	var breed = `${req.body.name}`.trim();
	var animalspecies = `${req.body.animal}`;
	db.query (`INSERT INTO breed(str_BreedName,	int_AnimalSpecies) VALUES ("${breed}","${animalspecies}")`, (err, results, fields)=>{
		if (err){
			console.log(err);
			res.redirect('/CVO_AnimalBreed');
		}
		else {
			res.redirect('/CVO_AnimalBreed');
		}
	});
});


exports.CVO_AnimalBreed= router;
