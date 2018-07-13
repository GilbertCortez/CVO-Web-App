
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
router.use(authMiddleware.hasAuth);


router.get('/',  (req,res)=>{
  db.query(`SELECT *  FROM pet p JOIN animal a on p.int_AnimalId=a.int_AnimalId JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_PetOwnerId=${req.session.user[0].int_PetOwnerId}`,(err,pets)=>{
	   	db.query(`SELECT * FROM petowner WHERE int_PetOwnerId=${req.session.user[0].int_PetOwnerId}`,(err,petOwnerDetails)=>{
	   res.render('CVO-PetOwner-MyPet/views/view.ejs',{ currentPetOwner: petOwnerDetails[0], pe:pets});
  });
	 });
});
router.post('/getVaccinationHistory',  (req,res)=>{
  db.query(`SELECT * FROM vaccination v JOIN vaccine va ON v.int_VaccineId=va.int_VaccineId JOIN employee e ON v.int_EmployeeId=e.int_EmployeeId WHERE v.int_PetId=${req.body.id}`,(err,vaccinationHistory)=>{
    res.json(vaccinationHistory);
  });
});


exports.PetOwner_MyPets= router;
