
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{

	db.query(`SELECT * FROM adoptionperhousehold WHERE int_APHId = 1`, (err,results,fields)=>{
		if(err){
			console.log(err)
			res.redirect('/CVO_AdoptionPerHousehold')
		}
		else {
			res.render('CVO-U-AdoptionperHousehold/views/view',{adoption:results});
		}
	});        
});

router.post('/', (req, res) =>{

	var adoptionPerHousehold = req.sanitize(`${req.body.adoptionperhousehold}`.trim());

	db.query(`UPDATE adoptionperhousehold SET int_NumberOfAdoption = "${adoptionPerHousehold}" WHERE int_APHId = 1`,(err, results, fields) => {
		if(err){
			console.log(err)
			res.redirect('/CVO_AdoptionPerHousehold')
		}
		else{
			res.redirect('/CVO_AdoptionPerHousehold')
		}
	});

});
exports.CVO_AdoptionperHousehold= router;
