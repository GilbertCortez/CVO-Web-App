
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);



router.get('/',  (req,res)=>{
  db.query(`SELECT *,COUNT(*) AS numberofcages FROM cage JOIN impoundingsite ON cage.int_ImpoundingSite=impoundingsite.int_ImpoundingSiteId JOIN barangay ON impoundingsite.int_BarangayId=barangay.int_BarangayId GROUP BY int_ImpoundingSite`, (err, results, fields) => {
      db.query(`SELECT * FROM barangay`, (err, barangay, fields) => {
    	   res.render('CVO-M-ImpoundingSite/views/view.ejs',{ ba:barangay, re:results });
      });
  });
});



router.post('/',  (req,res)=>{
    db.query(`INSERT INTO ImpoundingSite(int_BarangayId, int_Status) VALUES (${req.body.barangayId},${req.body.status})`, (err, barangay, fields) => {console.log(barangay);
          db.query(`SELECT int_ImpoundingSiteId FROM ImpoundingSite WHERE int_ImpoundingSiteId=${barangay.insertId}`, (err, currentImpoundingSite, fields) => {console.log(err);
                var forImpoundedAnimals= parseInt(req.body.forImpoundedAnimals);
                var forAnimalObservation= parseInt(req.body.forAnimalObservation);
                var numberofcages=forImpoundedAnimals+forAnimalObservation;
                var toQuery="";
                for(var ctr=1;ctr<=numberofcages;ctr++){
                        if(ctr<=forImpoundedAnimals){
                         toQuery+=`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (`+currentImpoundingSite[0].int_ImpoundingSiteId+`,`+ctr+`,0,1);`;
                            //db.query(`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (${currentImpoundingSite[0].int_ImpoundingSiteId},${ctr},0,1)`, (err, results, fields) => {});
                        }
                        else if(ctr>forImpoundedAnimals){
                            toQuery+=`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (`+currentImpoundingSite[0].int_ImpoundingSiteId+`,`+ctr+`,1,1);`;
                           // db.query(`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (${currentImpoundingSite[0].int_ImpoundingSiteId},${ctr},1,1)`, (err, results, fields) => {});
                        }
                        if(ctr==numberofcages){
                          
                          db.query(toQuery,(err,results)=>{
                              res.redirect("/CVO_ImpoundingSite");
                          });
                            
                        }
                  }
            });//for db query
    });//for db query
});

/*
EXPLANATION OF POST ACTION: CVO_ImpoundingSite
1. Iinsert yung Impounding Site Details sa Table na Impounding site
2. Kukunin yung Recent Impounding Site ID na nalagay sa Table na Impounding Site
3. Iinsert sa table na cage  yung mga cages
*/







exports.CVO_ImpoundingSite= router;
