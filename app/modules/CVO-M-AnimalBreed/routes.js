var express = require('express');
var router = express.Router();
var cb = express.Router();
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

router.post('/add', (req, res)=>{
	var breed = req.sanitize(`${req.body.name}`.trim());
	var animalspecies = `${req.body.animal}`;

	if (breed == ""){
		res.send("There's error")
	}

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

router.post('/update', (req, res)=>{
	var breed = req.sanitize(`${req.body.update_breedName}`.trim());
	var animalspecies = req.body.update_animalSpecies;
	var id= req.body.update_id;
	db.query(`UPDATE breed SET int_AnimalSpecies=${animalspecies},str_BreedName="${breed}" WHERE int_BreedId=${id}`,(err)=>{
		res.redirect('/CVO_AnimalBreed');
	});
});



cb.post('/',  (req,res)=>{
	 var id=req.sanitize(req.body.id.trim());
	console.log(id);
	db.query(`SELECT str_BreedName FROM breed WHERE str_BreedName="${id}"`,(err,result)=>{
		console.log(result);
		if(result.length==0){
		res.json(0);
		}
		else{
		res.json(1);	
		}
	});
});

cb.post('/update',  (req,res)=>{
	 var id=req.sanitize(req.body.id.trim());

	db.query(`SELECT str_BreedName FROM breed WHERE str_BreedName="${id}" AND int_BreedId <> ${req.body.id2}`,(err,result)=>{
		if(result.length==0){
		res.json(0);
		}
		else{
		res.json(1);	
		}
	});
});


exports.CVO_AnimalBreed= router;
exports.checkBreedName= cb;