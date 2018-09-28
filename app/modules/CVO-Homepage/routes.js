
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  
	res.render('CVO-Homepage/views/view.ejs');
          
});


router.get('/home', (req, res) => {
    db.query(`SELECT * from office`, (err, office) => {
        db.query(`SELECT * from learn`, (err, learn) => {
            db.query(`SELECT * from faq`, (err, faq) => {
            	db.query(`SELECT * from petowner`,(err,petOwners)=>{
            		db.query(`SELECT * from pet`,(err,pets)=>{

                res.render('CVO-Homepage/views/home.ejs', {
                    faq: faq,
                    learn: learn,
                    office: office,
                    pe:petOwners,
                    pet:pets
                });
            });
            });
            });
        });
    });
});

router.get('/AboutUs',(req,res)=>{
    db.query(`SELECT * from office`, (err, office) => {
        res.render('CVO-Homepage/views/aboutus.ejs',{office:office})
    });
});

router.get('/adoption', (req, res) => {
	db.query(`SELECT *,
 DATEDIFF(now(),lh.dtm_DateTimeOfOccurence) as LodgingDays,
(SELECT int_ClaimingPeriod FROM  impoundedanimalperiods WHERE int_PeriodId=1) as ClaimingPeriod, 
(SELECT int_AdoptionPeriod FROM  impoundedanimalperiods WHERE int_PeriodId=1) as AdoptionPeriod,
IF(lh.int_AnimalId in (SELECT int_AnimalId FROM animalsforturnover),"YES","NO") as InAnimalTurnover,
IF(lh.int_AnimalId in (SELECT int_AnimalId FROM adoptiontransaction),"YES","NO") as InAdoptionTransaction
FROM lodginghistory lh JOIN cage ca ON lh.int_CageId = ca.int_CageId JOIN animal a  ON lh.int_AnimalId=a.int_AnimalId JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId 
WHERE lh.int_LodgingStatus <> 2 AND DATEDIFF(now(),lh.dtm_DateTimeOfOccurence) > ( SELECT int_ClaimingPeriod FROM  impoundedanimalperiods WHERE int_PeriodId=1) AND lh.str_Remarks LIKE '%Impounded%' AND a.int_AnimalStatus=1`,(err,forAdoption)=>{


    db.query(`SELECT * from office`, (err, office) => {
        
            	
                res.render('CVO-Homepage/views/adoption.ejs', {
                    fa:forAdoption,
                    office: office
                  
                });});
            });
            });

router.get('/Adoption/Animal', (req, res) => {
console.log(req.query)
	//QUERY THE ANIMAL FOR DETAILS
//render animalAdoption
db.query(`SELECT * FROM office`,(err,office)=>{
    db.query(`SELECT * FROM animal a JOIN breed b ON a.int_BreedId = b.int_BreedId 
    JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN apprehendedanimal app ON app.int_AnimalId = a.int_AnimalId WHERE a.int_AnimalId = ${req.query.id}`,(err,adoption)=>{
        if (err){
            console.log(err)
        } else {
        res.render('CVO-Homepage/views/animalAdoption.ejs',{office:office,adoption:adoption});}
    });
});
});
     
router.get('/Redemption', (req, res) => {
	db.query(`SELECT *,
 DATEDIFF(now(),lh.dtm_DateTimeOfOccurence) as LodgingDays,
(SELECT int_ClaimingPeriod FROM  impoundedanimalperiods WHERE int_PeriodId=1) as ClaimingPeriod, 
(SELECT int_AdoptionPeriod FROM  impoundedanimalperiods WHERE int_PeriodId=1) as AdoptionPeriod,
IF(lh.int_AnimalId in (SELECT int_AnimalId FROM animalsforturnover),"YES","NO") as InAnimalTurnover,
IF(lh.int_AnimalId in (SELECT int_AnimalId FROM adoptiontransaction),"YES","NO") as InAdoptionTransaction
FROM lodginghistory lh JOIN cage ca ON lh.int_CageId = ca.int_CageId JOIN animal a  ON lh.int_AnimalId=a.int_AnimalId JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId 
WHERE lh.int_LodgingStatus <> 2 AND DATEDIFF(now(),lh.dtm_DateTimeOfOccurence) > ( SELECT int_ClaimingPeriod FROM  impoundedanimalperiods WHERE int_PeriodId=1) AND lh.str_Remarks LIKE '%Impounded%' AND a.int_AnimalStatus=1`,(err,forRedemption)=>{


    db.query(`SELECT * from office`, (err, office) => {
        
            	
                res.render('CVO-Homepage/views/redemption.ejs', {
                    fr:forRedemption,
                    office: office
                  
                });});
            });
            });
     
router.get('/Redemption/Animal', (req, res) => {
console.log(req.query)
	//QUERY THE ANIMAL FOR DETAILS
//render animalRedemption
db.query(`SELECT * FROM office`, (err,office)=>{
    db.query(`SELECT * FROM apprehendedanimal app JOIN animal a ON app.int_AnimalId = a.int_AnimalId JOIN breed b ON b.int_BreedId = a.int_BreedId JOIN colorpattern color ON color.int_ColorPatternId = a.int_ColorPatternId JOIN barangay ba ON ba.int_BarangayId = app.int_BarangayId JOIN lodginghistory lh ON lh.int_AnimalId = a.int_AnimalId JOIN cage c ON c.int_CageId = lh.int_CageId JOIN impoundingsite site ON site.int_ImpoundingSiteId = c.int_ImpoundingSite WHERE a.int_AnimalId = ${req.query.id}`,(err,redemption)=>{
        db.query(`SELECT DATEDIFF(now(),dtm_DateTimeApprehension) AS 'DAYS' from apprehendedanimal app JOIN animal a ON app.int_AnimalId = a.int_AnimalId WHERE a.int_AnimalId = ${req.query.id} AND a.int_AnimalStatus = 1`,(err, days)=>{
            res.render('CVO-Homepage/views/animalRedemption.ejs', {office:office,redemption:redemption,days:days});
        });
    });
});
});
router.get('/learn',  (req,res)=>{
	
	db.query(`SELECT * from office`, (err,office) => {
		db.query(`SELECT * from learn WHERE int_Learn=${req.query.id}`, (err,learn) => {
  db.query(`SELECT * from faq`, (err,faq) => {
	res.render('CVO-Homepage/views/learn.ejs',{faq:faq,learn:learn,office:office});
         });
});
});
});

router1.get('/',  (req,res)=>{
  
	db.query(`SELECT * from faq`, (err,results,fields) => {
		if (err){
			console.log(err)
		}
		else {
			res.render('CVO-Homepage/views/faq.ejs',{faq:results});
		}
	});   
});

router2.get('/',  (req,res)=>{
  
	res.render('CVO-Homepage/views/announcement.ejs');
          
});

router3.get('/',  (req,res)=>{
  
	res.render('CVO-Homepage/views/learn.ejs');
          
});






exports.CVO_Homepage= router;
exports.CVO_FAQ= router1;
exports.CVO_Announcement= router2;
exports.CVO_Learn= router3;