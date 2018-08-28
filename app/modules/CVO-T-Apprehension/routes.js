
var express = require('express');
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
//sess.use(authMiddleware.noAuthed);

var munkres = require('munkres-js');

router1.get('/',  (req,res)=>{
  	db.query(`SELECT *,aa.int_AnimalId AS Animal FROM apprehendedanimal aa JOIN animal a ON aa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId JOIN vancage vc ON aa.int_VanCageId =vc.int_VanCageId JOIN van v ON vc.int_VanId=v.int_VanId WHERE  a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,apprehended)=>{
  		db.query(`SELECT *, SUM(AvailableSlots ) AS AvailableCagePerImpounding FROM(SELECT c.int_ImpoundingSite, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId   GROUP BY c.int_CageId, c.int_ImpoundingSite ) AS derived JOIN impoundingsite i ON derived.int_ImpoundingSite=i.int_ImpoundingSiteId JOIN barangay b ON i.int_BarangayId=b.int_BarangayId GROUP BY i.int_ImpoundingSiteId`,(err,impoundingSites)=>{

	res.render('CVO-T-Apprehension/views/Apprehension.ejs',{ap:apprehended, is:impoundingSites});
		});
        });
});



//APPREHENDED ANIMAL
//FOR IMAGE UPLOAD USING MULTER (PET OWNER REGISTRATION)
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/Animals' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg")
  }
})
var upload = multer({ storage: storage }) 

router2.get('/',  (req,res)=>{
  	db.query('SELECT * FROM breed',(err,breed) =>{
    	db.query('SELECT * FROM colorpattern',(err,colorpattern)=>{
    		db.query('SELECT * FROM barangay',(err,barangay)=>{
    			db.query('SELECT * FROM van v JOIN vancage vc ON v.int_VanId=vc.int_VanId WHERE v.int_Status=1 AND vc.int_Status=1',(err,vancages)=>{
    				db.query('SELECT * FROM employee WHERE int_EmployeeType IN (1)',(err,employee)=>{
					res.render('CVO-T-Apprehension/views/ApprehendedAnimal.ejs',{br:breed,cp:colorpattern,ba:barangay,em:employee,vc:vancages});
					});
					});
    			});
    		});
    	});
          
});
router2.post('/',upload.any(),  (req,res)=>{

					

		var BreedId=req.body.breed;
		var Sex=req.body.sex;
		var ColorPatternId=req.body.ColorPattern;
		var AnimalPicturePath="/"+req.files[0].filename;
		var HealthStatus=req.body.healthStatus;

		var BarangayId=req.body.barangay;
		var PetTag=req.body.pettag;
		var Alias=req.body.alias;
		var VanCageId=req.body.vanCageId;
		var DateTimeApprehension="2018-06-07 "+req.body.timeApprehended+":00";
		var EmployeeId=req.body.employee;
		var Remarks=req.body.remarks;

		console.log(req.body);
    	db.query(`INSERT INTO animal(int_BreedId, int_Sex, int_ColorPatternId, str_AnimalPicturePath, int_AnimalStatus,int_HealthStatus) VALUES (${BreedId},${Sex},${ColorPatternId},'${AnimalPicturePath}',1,${HealthStatus})`,(err,animalId)=>{console.log(err);
          db.query(`INSERT INTO apprehendedanimal(int_AnimalId, int_BarangayId, str_PetTagNo, str_Alias, int_VanCageId, dtm_DateTimeApprehension, int_EmployeeId, str_Remarks) VALUES (${animalId.insertId},${BarangayId},"${PetTag}","${Alias}",${VanCageId},"${DateTimeApprehension}",${EmployeeId},"${Remarks}")`,(err,result)=>{console.log(err);
           res.send(`<html><body><script src="sweetalert/dist/sweetalert.min.js"></script> <style>body{font-family: "Trebuchet MS";}tr{font-size: 15px;}.swal-overlay{background-color: rgba(66, 134, 244, 0.90);}</style> <script>swal({title: "Added Apprehended Animal!",text: "Apprehended Animal Details is successfully recorded.",icon: "success",button: true,closeOnClickOutside: false,}).then((willDelete) => {if (willDelete) {swal({title: "Add Another Apprehended Animal?",text: "Do you wish to add another Apprehended Animal Details?",icon: "/images/alert_question.png",buttons: {YES: "YES",NO: "NO",},closeOnClickOutside: false,width: '800px',}).then((decision) => {if (decision==="YES") {window.location.href="/CVO_ApprehendedAnimal" }else if(decision==="NO"){window.location.href="/CVO_Apprehension"}})}});</script></body></html>`); 

           });                                                  
    	 });
});



//CAGE ASSIGNMENTS
//TO DO, CONSIDER THE CAGE ASSIGNED NA. KELANGAN RESERVE NA SA KANILA YUNG SLOT
router3.post('/',  (req,res)=>{
	var preferredImpoundingSite=req.body.impoundingSiteId;
  	
	  
	db.query(`SELECT *,aa.int_AnimalId AS Animal FROM apprehendedanimal aa JOIN animal a ON aa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId JOIN vancage vc ON aa.int_VanCageId =vc.int_VanCageId JOIN van v ON vc.int_VanId=v.int_VanId WHERE int_AnimalSpecies=0 AND int_HealthStatus=0 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forImpoundingDogs)=>{ 
	db.query(`SELECT *,aa.int_AnimalId AS Animal FROM apprehendedanimal aa JOIN animal a ON aa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_AnimalSpecies=1 AND int_HealthStatus=0 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forImpoundingCats)=>{ 
	db.query(`SELECT *,aa.int_AnimalId AS Animal FROM apprehendedanimal aa JOIN animal a ON aa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_AnimalSpecies=0 AND int_HealthStatus=1 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forDogObservations)=>{ 
	db.query(`SELECT *,aa.int_AnimalId AS Animal FROM apprehendedanimal aa JOIN animal a ON aa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_AnimalSpecies=1 AND int_HealthStatus=1 AND a.int_AnimalId NOT IN (SELECT int_AnimalId FROM lodginghistory)`,(err,aa_forCatObservations)=>{ 

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
		
	
		res.render('CVO-T-Apprehension/views/CageAssignments.ejs',{
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
	//	console.log(cageAssignments);
		return cageAssignments;
	}
	


});

router3.post('/place',  (req,res)=>{

	var QUERY="";
	JSON.parse(req.body.finalCageAssignment).forEach(function(i){
		if(i.cage!="unassign"){
			QUERY += 'INSERT INTO lodginghistory( int_AnimalId, int_CageId, dtm_DateTimeOfOccurence, int_LodgingStatus, str_Remarks) VALUES ('+i.animal+','+i.cage+',now(),0,"Impounded to cage number '+i.cageNum+'");'
		}
	});
	console.log(QUERY)
	db.query(QUERY,(err)=>{ console.log(err)
		res.render("CVO-T-Apprehension/views/CageAssignmentSummary.ejs",{cageAssign:req.body.finalCageAssignment})
	}) 
});


exports.CVO_Apprehension=router1;
exports.CVO_ApprehendedAnimal=router2;
exports.CVO_CageAssignments=router3;

