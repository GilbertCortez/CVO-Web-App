
var express = require('express');
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
// router.use(authMiddleware.noAuthed);

router1.get('/',  (req,res)=>{
  	db.query(`SELECT * FROM apprehendedanimal aa JOIN animal a ON aa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId`,(err,apprehended)=>{


	res.render('CVO-T-Apprehension/views/Apprehension.ejs',{ap:apprehended});
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
    			db.query('SELECT * FROM employee WHERE int_EmployeeType=1',(err,employee)=>{console.log(err);
					res.render('CVO-T-Apprehension/views/ApprehendedAnimal.ejs',{br:breed,cp:colorpattern,ba:barangay,em:employee});
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
		var VanCageNumber=req.body.vanCageNumber;
		var DateTimeApprehension="2018-06-07 "+req.body.timeApprehended+":00";
		var EmployeeId=req.body.employee;
		var Remarks=req.body.remarks;

		console.log(req.body);
    	db.query(`INSERT INTO animal(int_BreedId, int_Sex, int_ColorPatternId, str_AnimalPicturePath, int_AnimalStatus,int_HealthStatus) VALUES (${BreedId},${Sex},${ColorPatternId},'${AnimalPicturePath}',1,${HealthStatus})`,(err,animalId)=>{console.log(err);
          db.query(`INSERT INTO apprehendedanimal(int_AnimalId, int_BarangayId, str_PetTagNo, str_Alias, int_VanCageNumber, dtm_DateTimeApprehension, int_EmployeeId, str_Remarks) VALUES (${animalId.insertId},${BarangayId},"${PetTag}","${Alias}",${VanCageNumber},"${DateTimeApprehension}",${EmployeeId},"${Remarks}")`,(err,result)=>{console.log(err);
           res.send(`<html><body><script src="sweetalert/dist/sweetalert.min.js"></script> <style>body{font-family: "Trebuchet MS";}tr{font-size: 15px;}.swal-overlay{background-color: rgba(66, 134, 244, 0.90);}</style> <script>swal("Added!" , "Do you want to add another apprehended animal?" , "success" ).then(()=>{window.location.href="/CVO_ApprehendedAnimal";});</script></body></html>`); 

           });                                                  
    	 });
});



//CAGE ASSIGNMENTS
//TO DO, CONSIDER THE CAGE ASSIGNED NA. KELANGAN RESERVE NA SA KANILA YUNG SLOT
router3.get('/',  (req,res)=>{
	var preferredImpoundingSite=2;
  	var cageAssignment=[];
	  
	db.query(`SELECT * FROM apprehendedanimal aa JOIN barangay ba ON ba.int_BarangayId=aa.int_BarangayId JOIN animal a ON aa.int_AnimalId=a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId`,(err,apprehended)=>{console.log(err);
	  	db.query(`SELECT *,c.int_CageId AS CageId, c.int_MaxNumber-COUNT(l.int_AnimalId) as AvailableSlots FROM cage c  LEFT JOIN  lodginghistory l on c.int_CageId=l.int_CageId  WHERE c.int_ImpoundingSite=${preferredImpoundingSite} GROUP BY c.int_CageId`,(err,impoundingsite)=>{console.log(err);
		  	db.query(`SELECT * FROM lodginghistory l JOIN animal a ON l.int_AnimalId=a.int_AnimalId WHERE l.int_LodgingStatus <> 2 AND l.int_CageId in (SELECT int_CageId FROM cage WHERE int_ImpoundingSite=${preferredImpoundingSite})`,(err,impounded)=>{ console.log(err);
				apprehended.forEach(function(a){ 
					var listOfPoints=[];
					impoundingsite.forEach(function(i){
					  				var animalsOnCurrentCage;
					  				var animalAssignedOnCurrentCage;
					  				if(i.AvailableSlots != 0){
					  						[{a:0,b:0,c:0},{a:1,b:1,c:0},{a:2,b:0,c:1},{a:3,b:1,c:1}].forEach(function(x){
						  						if (i.int_CageType == x.a && a.int_AnimalSpecies==x.b && a.int_HealthStatus==x.c){
						  							animalsOnCurrentCage=search(impounded,i.CageId,true)
						  							
						  							animalAssignedOnCurrentCage=search(cageAssignment,i.CageId,false)
						  							var point=0
						  							animalsOnCurrentCage.forEach(function(i){
						  								point+=scoring(i,a)
						  							}); 
						  							animalAssignedOnCurrentCage.forEach(function(i){
						  								point+=scoring(i,a)
						  							}); 
						  							point==0 && animalsOnCurrentCage.length==0 && animalAssignedOnCurrentCage.length==0 ? 
							  							listOfPoints.push({point: 0, cage: i.CageId, cageType: i.int_CageType})
							  							:
							  							listOfPoints.push({point: (point/(animalsOnCurrentCage.length+animalAssignedOnCurrentCage.length))+.01, cage: i.CageId})
						  							;
						  							console.log(CageAssignments)
						  						}
					  					});
					  				} 
					});  
					console.log(listOfPoints)
					cageAssignment.push([((sortJsonArray(listOfPoints,'point','des')).pop()),a]);
				});  
				console.log(cageAssignment)	
				res.render('CVO-T-Apprehension/views/CageAssignments.ejs',{ca:cageAssignment});  
		  	});
		});
	
	}); 

	function search(objTS, queryTS, x){//TS-To Search
		var passed=[];
		console.log(x)
		if(x){
			objTS.forEach(function(i){
				i.int_CageId==queryTS ? passed.push(i)  : "";	
			});
		}
		else{

			objTS.forEach(function(i,ctr){
				console.log(i);
				i[0]["cage"]==queryTS ? passed.push(i[1])  : "";	
			});
		}	
		return passed;
	}

	function scoring(onCage,toCaged){
		var point=0;
		['int_ColorPatternId','int_Sex','int_BreedId'].forEach(function(i){
			onCage[i]==toCaged[i] ? point++ : "";
		})
		return point/3;
	}


});



exports.CVO_Apprehension=router1;
exports.CVO_ApprehendedAnimal=router2;
exports.CVO_CageAssignments=router3;

