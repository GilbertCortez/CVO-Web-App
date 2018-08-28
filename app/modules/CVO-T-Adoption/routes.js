
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
 db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE petowner.int_status = 1`, (err, petowners) => { console.log(err)

                
                res.render('CVO-T-Adoption/views/view.ejs', {
                    po: petowners
            });
        });
    });

          




router.get('/AdoptionApplicationForm',  (req,res)=>{
  
	res.render('CVO-T-Adoption/views/AdoptionApplicationForm.ejs');
          
});


router.get('/PetFinder',  (req,res)=>{
  db.query(`SELECT * FROM colorpattern WHERE int_Status=1 ORDER BY str_Description`,(err,colorpattern)=>{
	res.render('CVO-T-Adoption/views/PetFinder.ejs',{cp:colorpattern});
          });
});


router.post('/Filtering', (req, res) => {
		db.query(`CALL SelectAnimalForAdoptionWithDetails()`,(err,forAdoption)=>{

    var preferences = JSON.parse(req.body.filter),
        animals = forAdoption[0],
        identifiers = Object.keys(preferences.filters),
        semifinalist = [],
        finalist = [];
        console.log(preferences)
    animals.forEach(function(animal) {
    	
        var points = identifiers.reduce((p, k) => p + (preferences.filters[k] == animal[k]), 0);
        if (points > identifiers.length/2) {
            semifinalist.push(Object.assign({
                points
            }, animal));
        }
    });

    semifinalist.sort((a, b) => b.points - a.points);

    finalist = semifinalist.slice(0, preferences.numberOfFinalists);
    console.log(finalist)
    console.log(semifinalist)
    if(finalist.length!=0){
    	console.log("FINALIST")
    	res.send(finalist);
    }
    else if(semifinalist.length!=0){
    	console.log("SEMIFINALIST")
    	res.send(semifinalist);
    }
    else{
    	console.log("FORADOPTIOn")
    	res.send(forAdoption[0])
    }
});
});


router.get('/Pending',  (req,res)=>{

	res.render('CVO-T-Adoption/views/PendingAdoptionApplication.ejs');

});

router.get('/Interview',  (req,res)=>{

	res.render('CVO-T-Adoption/views/Interview.ejs');

});
router.get('/HomeVisit',  (req,res)=>{

	res.render('CVO-T-Adoption/views/HomeVisit.ejs');

});
router.get('/FinalEvaluation',  (req,res)=>{

	res.render('CVO-T-Adoption/views/FinalEvaluation.ejs');

});
exports.CVO_Adoption= router;

