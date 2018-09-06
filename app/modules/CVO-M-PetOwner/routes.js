var express = require('express');
var router = express.Router();
var cb = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

router.get('/',  (req,res)=>{
 db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE petowner.int_status = 1`, (err, petowners) => { console.log(err)
                res.render('CVO-M-PetOwner/views/view.ejs', {
                    po: petowners
                
                });
           });
        });
  
router.post('/profile',  (req,res)=>{
   db.query(`SELECT *  FROM pet p JOIN animal a on p.int_AnimalId=a.int_AnimalId JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_PetOwnerId=${JSON.parse(req.body.currentpetowner).int_PetOwnerId}`, (err, pets) => {
        res.render('CVO-M-PetOwner/views/profile.ejs', {
            currentPetOwner: JSON.parse(req.body.currentpetowner),
            pe: pets
        });
    });
});
router.post('/getVaccinationHistory', (req, res) => {
    console.log("HI")
    db.query(`SELECT * FROM vaccination v JOIN vaccine va ON v.int_VaccineId=va.int_VaccineId JOIN manufacturer m ON va.int_ManufacturerId=m.int_ManufacturerId WHERE v.int_PetId=${req.body.id}`, (err, vaccinationHistory) => {
        console.log(err)
        res.json(vaccinationHistory);
    });
});

exports.CVO_PetOwner= router;
