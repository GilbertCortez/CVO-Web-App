
var express = require('express');

var router1 = express.Router();
var router2 = express.Router();
var munkres = require('munkres-js');

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);

router1.get('/',  (req,res)=>{
 	       db.query(`SELECT * FROM barangay`, (err, barangay, fields) => {
 	 db.query(`SELECT *, COUNT(AvailableSlots ) AS AvailableCagePerImpounding, SUM(Derived.Max) as Total FROM(SELECT c.int_ImpoundingSite, c.int_MaxNumber as Max, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId GROUP BY c.int_CageId, c.int_ImpoundingSite ) AS derived JOIN impoundingsite i ON derived.int_ImpoundingSite=i.int_ImpoundingSiteId JOIN barangay b ON i.int_BarangayId=b.int_BarangayId GROUP BY i.int_ImpoundingSiteId`,(err,impoundingSites)=>{
			console.log(impoundingSites)
		res.render('CVO-T-Impounding/views/view.ejs',{ ba:barangay,is:impoundingSites});
	});
  });       
});

router1.post('/addImpounding',  (req,res)=>{
    db.query(`INSERT INTO ImpoundingSite(int_BarangayId, int_Status) VALUES (${req.body.barangayId},${req.body.status})`, (err, barangay, fields) => {console.log(err);
          db.query(`SELECT int_ImpoundingSiteId FROM ImpoundingSite WHERE int_ImpoundingSiteId=${barangay.insertId}`, (err, currentImpoundingSite, fields) => {console.log(err);
                var forImpoundedDogs= parseInt(req.body.forImpoundedDogs);
                var forImpoundedCats= parseInt(req.body.forImpoundedCats);
                var forDogsObservation= parseInt(req.body.forDogsObservation);
                 var forCatsObservation= parseInt(req.body.forCatsObservation);

                var maxforImpoundedDogs= parseInt(req.body.maxforImpoundedDogs);
                var maxforImpoundedCats= parseInt(req.body.maxforImpoundedCats);
                var maxforDogsObservation= parseInt(req.body.maxforDogsObservation);
                var maxforCatsObservation= parseInt(req.body.maxforCatsObservation);
                
                var numberofcages=forImpoundedDogs+forImpoundedCats+forDogsObservation+forCatsObservation;
                var toQuery="";
                for(var ctr=1;ctr<=numberofcages;ctr++){
                        if(ctr<=forImpoundedDogs){
                         toQuery+=`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType,int_MaxNumber, int_Status) VALUES (`+currentImpoundingSite[0].int_ImpoundingSiteId+`,`+ctr+`,0,`+ maxforImpoundedDogs+`,1);`;
                            //db.query(`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (${currentImpoundingSite[0].int_ImpoundingSiteId},${ctr},0,1)`, (err, results, fields) => {});
                        }
                        else if(ctr<=forImpoundedCats+forImpoundedDogs){
                         toQuery+=`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType,int_MaxNumber, int_Status) VALUES (`+currentImpoundingSite[0].int_ImpoundingSiteId+`,`+ctr+`,1,`+ maxforImpoundedCats+`,1);`;
                            //db.query(`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (${currentImpoundingSite[0].int_ImpoundingSiteId},${ctr},0,1)`, (err, results, fields) => {});
                        }
                        else if(ctr<=forImpoundedCats+forImpoundedDogs+forDogsObservation){
                            toQuery+=`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType,int_MaxNumber, int_Status) VALUES (`+currentImpoundingSite[0].int_ImpoundingSiteId+`,`+ctr+`,2,`+ maxforDogsObservation+`,1);`;
                           // db.query(`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (${currentImpoundingSite[0].int_ImpoundingSiteId},${ctr},1,1)`, (err, results, fields) => {});
                        }
                        else if(ctr<=forImpoundedCats+forImpoundedDogs+forImpoundedCats+forDogsObservation){
                            toQuery+=`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType,int_MaxNumber, int_Status) VALUES (`+currentImpoundingSite[0].int_ImpoundingSiteId+`,`+ctr+`,3,`+ maxforCatsObservation+`,1);`;
                           // db.query(`INSERT INTO cage(int_ImpoundingSite, int_CageNumber,int_CageType, int_Status) VALUES (${currentImpoundingSite[0].int_ImpoundingSiteId},${ctr},1,1)`, (err, results, fields) => {});
                        }

                        if(ctr==numberofcages){
                          
                          db.query(toQuery,(err,results)=>{ console.log(err);
                              res.redirect("/CVO_Impounding");
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



router1.post('/Cages',  (req,res)=>{
 	 
 db.query(`SELECT * FROM impoundingsite i JOIN barangay b ON i.int_BarangayId=b.int_BarangayId `, (err, AllImpoundingSite, fields) => { console.log(err)
 db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite}`, (err, allcages, fields) => {
        db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=0`, (err, forimpoundingdogs, fields) => {
            db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=1`, (err, forimpoundingcats, fields) => {
            	db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=2`, (err, fordogsobservation, fields) => {
            		db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=3`, (err, forcatsobservation, fields) => {
	              	   db.query(`SELECT *, SUM(AvailableSlots ) AS AvailableCagePerImpounding, SUM(Derived.Max) as Total FROM(SELECT c.int_ImpoundingSite, c.int_MaxNumber as Max, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId  WHERE l.int_LodgingStatus=0 GROUP BY c.int_CageId, c.int_ImpoundingSite ) AS derived JOIN impoundingsite i ON derived.int_ImpoundingSite=i.int_ImpoundingSiteId JOIN barangay b ON i.int_BarangayId=b.int_BarangayId WHERE i.int_ImpoundingSiteId = ${req.body.impoundingsite} GROUP BY i.int_ImpoundingSiteId`,(err,impoundingSiteInfo1)=>{ 
                           db.query(`SELECT *, SUM(AvailableSlots ) AS AvailableCagePerImpounding, SUM(Derived.Max) as Total FROM(SELECT c.int_ImpoundingSite, c.int_MaxNumber as Max, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId  GROUP BY c.int_CageId, c.int_ImpoundingSite ) AS derived JOIN impoundingsite i ON derived.int_ImpoundingSite=i.int_ImpoundingSiteId JOIN barangay b ON i.int_BarangayId=b.int_BarangayId WHERE i.int_ImpoundingSiteId = ${req.body.impoundingsite} GROUP BY i.int_ImpoundingSiteId`,(err,impoundingSiteInfo2)=>{
                           db.query(`CALL SelectAnimalsForEuthanasia(${impoundingSiteInfo2[0].int_ImpoundingSiteId})`,(err,animalForEuthanasia)=>{
                            console.log(animalForEuthanasia[0]);
                            res.render('CVO-T-Impounding/views/Cages.ejs',{afe:animalForEuthanasia[0],als: AllImpoundingSite, AllCages : allcages,  fid: forimpoundingdogs , fic: forimpoundingcats, fdo: fordogsobservation, fco: forcatsobservation, inf1: impoundingSiteInfo1 ,inf2: impoundingSiteInfo2 });
            	       });
                         });
                             });
                    });
                 });
            	});
            });
          });
        });
          
});
    
router1.post('/Cages/getAnimals',  (req,res)=>{
     
 
    db.query(`CALL SelectAnimalsOnCageWithAnimalDetails('${req.body.id}');`,(err,results)=>{
       res.json(results[0]);
    });
          
});
router1.post('/Cages/getCageId',  (req,res)=>{
    db.query(`SELECT int_CageId from cage WHERE int_ImpoundingSite=${req.body.id2} AND int_CageNumber=${req.body.id1};`,(err,results)=>{
       res.json(results[0]);
    });
          
});
router1.post('/Cages/getApprehendedAnimalDetails',  (req,res)=>{

 db.query(`CALL SelectApprehendedAnimalDetails('${req.body.id}');`,(err,results)=>{
       res.json(results[0]);
    });
});

router1.post('/Cages/getSurrenderedAnimalDetails',  (req,res)=>{

 db.query(`CALL  SelectSurrenderedAnimalDetails('${req.body.id}');`,(err,results)=>{
  console.log(results[0])
       res.json(results[0]);
    });
});
router1.post('/Cages/getAnimalMedical',  (req,res)=>{
 db.query(`SELECT * FROM medicalhistory mh JOIN employee e on mh.int_EmployeeId=e.int_EmployeeId WHERE mh.int_AnimalId=${req.body.id}`,(err,results)=>{
       res.json(results);
    });
});

router1.post('/Cages/getCagesInImpoundingSite',  (req,res)=>{
 console.log(req.body)
db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.id}`, (err, allcages) => {
       res.json(allcages);
    });
});
router1.post('/Cages/Medication',(req,res)=>{

    db.query(`INSERT INTO medicalhistory(int_AnimalId, str_Description, dtm_DateTimeOfOccurence,int_EmployeeId) VALUES (${req.body.id2},'${req.body.id1}',now(),1)`,(err)=>{
      if(err){
          res.send("ERROR")
  
      }
      else{
        res.send("SUCCESS")
      }
    });
});

router1.post('/Cages/Transfer',  (req,res)=>{
var remarks="Transferred to cage number "+req.body.id2;
    if(req.body.id3!=5){
      remarks+=" due to ";
      if(req.body.id3==0){
        remarks+="sickness.";
      }
      else{
        remarks+="animal agression.";
      }
    }
    if(req.body.id4!=null && req.body.id4!=''){
      remarks+=" In addition, "+req.body.id4+".";
    }
    console.log(remarks)
  db.query(`SET @lhId:= (SELECT int_LodgingHistoryId FROM lodginghistory WHERE int_AnimalId=${req.body.id5} ORDER BY 1 desc LIMIT 1);UPDATE lodginghistory SET int_LodgingStatus=1 WHERE int_LodgingHistoryId=@lhId;INSERT INTO lodginghistory( int_AnimalId, int_CageId, dtm_DateTimeOfOccurence, int_LodgingStatus, str_Remarks) VALUES (${req.body.id5},${req.body.id1},now(),0,'${remarks}');`,(err)=>{ 
    if(err){
      res.send("FAIL")
    }
    else{
      res.send("SUCCESS")
    }
  }); 
});

router1.post('/Cages/Euthanasia',(req,res)=>{

   db.query(`INSERT INTO euthanasiahistory( int_AnimalId, dtm_DateTimeofEuthanasia, int_Reason, str_Remarks, int_EmployeeId) VALUES (${req.body.id1},'${req.body.id2}',${req.body.id3},'${req.body.id4}',1);`,(err)=>{
     console.log(err)
      db.query(`UPDATE animal SET int_HealthStatus=4 WHERE int_AnimalId=${req.body.id1}`,(err)=>{
          if(err){
           console.log(err)
          }else{
           res.send("SUCCESS")
          }
      });
   });
});

router2.get('/',  (req,res)=>{
    db.query('SELECT * FROM breed  WHERE int_Status=1 ORDER BY str_BreedName',(err,breed) =>{
      db.query('SELECT * FROM colorpattern WHERE int_Status=1 ORDER BY str_Description',(err,colorpattern)=>{
        db.query('SELECT * FROM barangay WHERE int_Status=1 ORDER BY str_BarangayName',(err,barangay)=>{
	res.render('CVO-T-Impounding/views/SurrenderAnimal.ejs',{br:breed,cp:colorpattern,ba:barangay});
          });
        });
      });
});

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/Animals' )
  },
  filename: function (req, file, cb) {
    cb(null, "SA" + '-' + Date.now()+".jpg")
  }
})
var upload = multer({ storage: storage }) 

router2.post('/record',upload.any(),  (req,res)=>{
  var ColorPatternId=req.body.colorpattern;
  var Sex=req.body.sex;
  var BreedId=req.body.breed;
  var HealthStatus=req.body.healthstatus;
  var AnimalPicturePath="/" + req.files[0].filename;

  var FName=req.body.Firstname;
  var MName=req.body.Middlename;
  var LName=req.body.Lastname;
  var PhoneNo=req.body.Contact;
  var Email=req.body.Email;

  var PetTag=req.body.pettag;
  var Alias=req.body.alias;
  var BarangayCaught=req.body.barangay;
  var DtmCaught=req.body.dtmcaught;
  var remarks=req.body.remarks;

  db.query(`INSERT INTO animal(int_BreedId, int_Sex, int_ColorPatternId, str_AnimalPicturePath, int_AnimalStatus, int_HealthStatus) VALUES (${BreedId},${Sex},${ColorPatternId},"${AnimalPicturePath}",5,${HealthStatus})`,(err,result1)=>{ 
    db.query(`INSERT INTO concerncitizen( str_ConcernedCitizenFirstName, str_ConcernedCitizenMiddleName, str_ConcernedCitizenLastName, str_PhoneNo, str_Email, int_ConcernedCitizenType) VALUES ("${FName}","${MName}","${LName}","${PhoneNo}","${Email}",0)`,(err,result2)=>{
      db.query(`INSERT INTO surrenderedanimal(int_AnimalId, str_Alias, int_Barangay, str_PetTagNo, int_ConcernedCitizenId, dtm_DateTimeCaught, str_Remarks) VALUES (${result1.insertId}, "${Alias}",${BarangayCaught},"${PetTag}",${result2.insertId},"${DtmCaught}","${remarks}")`,(err)=>{
         res.send(`<html><body><script src="/sweetalert/dist/sweetalert.min.js"></script> <style>body{font-family: "Trebuchet MS";}tr{font-size: 15px;}.swal-overlay{background-color: rgba(66, 134, 244, 0.90);}</style> <script>swal({title: "Added Surrendered Animal!",text: "Surrendered Animal Details is successfully recorded.",icon: "success",button: true,closeOnClickOutside: false,}).then((willDelete) => {if (willDelete) {swal({title: "Add Another Apprehended Animal?",text: "Do you wish to add another Surrendered Animal Details?",icon: "/images/alert_question.png",buttons: {YES: "YES",NO: "NO",},closeOnClickOutside: false,width: '800px',}).then((decision) => {if (decision==="YES") {window.location.href="/CVO_SurrenderAnimal" }else if(decision==="NO"){window.location.href="/CVO_SurrenderAnimal/SurrenderedAnimals"}})}});</script></body></html>`);

      })
    });
  });
          
});

router2.get('/SurrenderedAnimals',(req,res)=>{

    db.query(`SELECT * FROM surrenderedanimal sa JOIN animal a ON sa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE  a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,surrendered)=>{
      db.query(`SELECT *, SUM(AvailableSlots ) AS AvailableCagePerImpounding FROM(SELECT c.int_ImpoundingSite, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId   GROUP BY c.int_CageId, c.int_ImpoundingSite ) AS derived JOIN impoundingsite i ON derived.int_ImpoundingSite=i.int_ImpoundingSiteId JOIN barangay b ON i.int_BarangayId=b.int_BarangayId GROUP BY i.int_ImpoundingSiteId`,(err,impoundingSites)=>{

  res.render('CVO-T-Impounding/views/SurrenderedAnimals.ejs',{ is:impoundingSites, su:surrendered});
    });
        });
});



router2.post('/cageAssignments',  (req,res)=>{
  
    var preferredImpoundingSite=req.body.impoundingSiteId;
    
    
  db.query(`SELECT *,sa.int_AnimalId AS Animal  FROM surrenderedanimal sa JOIN animal a ON sa.int_AnimalId=a.int_AnimalId  JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_AnimalSpecies=0 AND int_HealthStatus=0 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forImpoundingDogs)=>{ 
  db.query(`SELECT *,sa.int_AnimalId AS Animal  FROM surrenderedanimal sa JOIN animal a ON sa.int_AnimalId=a.int_AnimalId  JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_AnimalSpecies=1 AND int_HealthStatus=0 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forImpoundingCats)=>{ 
  db.query(`SELECT *,sa.int_AnimalId AS Animal  FROM surrenderedanimal sa JOIN animal a ON sa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_AnimalSpecies=0 AND int_HealthStatus=1 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forDogObservations)=>{ 
  db.query(`SELECT *,sa.int_AnimalId AS Animal  FROM surrenderedanimal sa JOIN animal a ON sa.int_AnimalId=a.int_AnimalId  JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_AnimalSpecies=1 AND int_HealthStatus=1 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forCatObservations)=>{ 
    
  db.query(`SELECT * FROM lodginghistory l JOIN animal a ON l.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId WHERE l.int_LodgingStatus <> 2 AND l.int_CageId in (SELECT int_CageId FROM cage WHERE int_ImpoundingSite=${preferredImpoundingSite}) AND b.int_AnimalSpecies=0 AND a.int_HealthStatus=0`,(err,imp_forImpoundingDogs)=>{ 
  db.query(`SELECT * FROM lodginghistory l JOIN animal a ON l.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId WHERE l.int_LodgingStatus <> 2 AND l.int_CageId in (SELECT int_CageId FROM cage WHERE int_ImpoundingSite=${preferredImpoundingSite}) AND b.int_AnimalSpecies=1 AND a.int_HealthStatus=0`,(err,imp_forImpoundingCats)=>{ 
  db.query(`SELECT * FROM lodginghistory l JOIN animal a ON l.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId WHERE l.int_LodgingStatus <> 2 AND l.int_CageId in (SELECT int_CageId FROM cage WHERE int_ImpoundingSite=${preferredImpoundingSite}) AND b.int_AnimalSpecies=0 AND a.int_HealthStatus=1`,(err,imp_forDogObservations)=>{
  db.query(`SELECT * FROM lodginghistory l JOIN animal a ON l.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId WHERE l.int_LodgingStatus <> 2 AND l.int_CageId in (SELECT int_CageId FROM cage WHERE int_ImpoundingSite=${preferredImpoundingSite}) AND b.int_AnimalSpecies=1 AND a.int_HealthStatus=1`,(err,imp_forCatObservations)=>{ 

  db.query(`SELECT *,c.int_CageId AS CageId, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots, COUNT(l.int_AnimalId) as ConsumedSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId  WHERE c.int_ImpoundingSite=${preferredImpoundingSite} AND int_CageType=0 GROUP BY c.int_CageId`,(err,ca_forImpoundingDogs)=>{
  db.query(`SELECT *,c.int_CageId AS CageId, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots, COUNT(l.int_AnimalId) as ConsumedSlots  FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId  WHERE c.int_ImpoundingSite=${preferredImpoundingSite} AND int_CageType=1 GROUP BY c.int_CageId`,(err,ca_forImpoundingCats)=>{ 
  db.query(`SELECT *,c.int_CageId AS CageId, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots, COUNT(l.int_AnimalId) as ConsumedSlots  FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId  WHERE c.int_ImpoundingSite=${preferredImpoundingSite} AND int_CageType=2 GROUP BY c.int_CageId`,(err,ca_forDogObservations)=>{ 
  db.query(`SELECT *,c.int_CageId AS CageId, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots, COUNT(l.int_AnimalId) as ConsumedSlots  FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId  WHERE c.int_ImpoundingSite=${preferredImpoundingSite} AND int_CageType=3 GROUP BY c.int_CageId`,(err,ca_forCatObservations)=>{ 
    
    //POINTS PER CAGES
    var ppc_forImpoundingDogs=[];
    var ppc_forImpoundingCats=[];
    var ppc_forDogObservations=[];
    var ppc_forCatObservations=[];

    //ASSIGNED
    var munk_forImpoundingDogs=[];
    var munk_forImpoundingCats=[];
    var munk_forDogObservations=[];
    var munk_forCatObservations=[];

    //POINTING ALGORITHM
    ppc_forImpoundingDogs= pointing(aa_forImpoundingDogs, imp_forImpoundingDogs, ca_forImpoundingDogs);
    ppc_forImpoundingCats= pointing(aa_forImpoundingCats, imp_forImpoundingCats, ca_forImpoundingCats);
    ppc_forDogObservations= pointing(aa_forDogObservations, imp_forDogObservations, ca_forDogObservations);
    ppc_forCatObservations= pointing(aa_forCatObservations, imp_forCatObservations, ca_forCatObservations);

    var munk_forImpoundingDogs=[];
    var munk_forImpoundingCats=[];
    var munk_forDogObservations=[];
    var munk_forCatObservations=[];

    munk_forImpoundingDogs=hungarian(ppc_forImpoundingDogs);
    munk_forImpoundingCats=hungarian(ppc_forImpoundingCats);
    munk_forDogObservations=hungarian(ppc_forDogObservations);
    munk_forCatObservations=hungarian(ppc_forCatObservations);
    
    var cageAssignment_forImpoundingDogs=[];
    var cageAssignment_forImpoundingCats=[];
    var cageAssignment_forDogObservations=[];
    var cageAssignment_forCatObservations=[];
    
    cageAssignment_forImpoundingDogs=finalize(munk_forImpoundingDogs,aa_forImpoundingDogs,ca_forImpoundingDogs);
    cageAssignment_forImpoundingCats=finalize(munk_forImpoundingCats,aa_forImpoundingCats,ca_forImpoundingCats);
    cageAssignment_forDogObservations=finalize(munk_forDogObservations,aa_forDogObservations,ca_forDogObservations);
    cageAssignment_forCatObservations=finalize(munk_forCatObservations,aa_forCatObservations,ca_forCatObservations);
    
  
    res.render('CVO-T-Impounding/views/CageAssignments.ejs',{
      fid:cageAssignment_forImpoundingDogs,
      fic:cageAssignment_forImpoundingCats,
      fdo:cageAssignment_forDogObservations,
      fco:cageAssignment_forCatObservations,
      ca_fid:ca_forImpoundingDogs,
      ca_fic:ca_forImpoundingCats,
      ca_fdo:ca_forDogObservations,
      ca_fco:ca_forCatObservations
    });
    
  }); }); }); }); 
  }); }); }); }); 
  }); }); }); }); 

  function pointing(a, b, c){
    var allCages=[];
    a.forEach(function(q){//Apprehended Animal
      var currentCage=[];
      c.forEach(function(w){//Cages
        var pointsPerCage=0;
        b.forEach(function(e){//Impounded Animal
          var point=0;
          ['int_ColorPatternId','int_Sex','int_BreedId'].forEach(function(i){
            e[i]==q[i] ? point++ : "";
          })
          if(w.AvailableSlots==0){
            point+=1000;
          }
          point+=w.ConsumedSlots;
          pointsPerCage=point;
        });
        currentCage=currentCage.concat(pointsPerCage);
      });
      allCages.push(currentCage);
    });
    return allCages;
    
  }

  function hungarian(z){
    if(z.length!=0){
      console.log(z)
      return munkres(z);  
    }
    else{
      return [];
    }
    
  }

  function finalize(a,b,c){
    var cageAssignments=[];
    a.forEach(function(i,ctr){
      cageAssignments.push(Object.assign(b[ctr],c[i[1]]));
    })
   console.log(cageAssignments);
    return cageAssignments;
  }
  


          
});

router2.post('/place',  (req,res)=>{

  var QUERY="";
  JSON.parse(req.body.finalCageAssignment).forEach(function(i){
    if(i.cage!="unassign"){
      QUERY += 'INSERT INTO lodginghistory( int_AnimalId, int_CageId, dtm_DateTimeOfOccurence, int_LodgingStatus, str_Remarks) VALUES ('+i.animal+','+i.cage+',now(),0,"Impounded to cage number '+i.cageNum+'");'
    }
  });
 
  db.query(QUERY,(err)=>{ console.log(err)
    res.redirect('/CVO_SurrenderAnimal/SurrenderedAnimals')
    //res.render("CVO-T-Impounding/views/CageAssignmentSummary.ejs",{cageAssign:req.body.finalCageAssignment})
  }) 
});

exports.CVO_Impounding=router1;

exports.CVO_SurrenderAnimal=router2;




