
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/PetOwnerRegistration',  (req,res)=>{
	console.log(req.query);
	if (req.query.QueryType == 2){ 
 	var QUERY=`SELECT * FROM petowner po JOIN barangay b ON po.int_BarangayId=b.int_BarangayId`;
 	db.query(QUERY,(err,results)=>{
 	db.query('SELECT * FROM barangay', (err, barangay) => {
			res.render('CVO-Query/views/petownerregistration.ejs',{ba:barangay,re:results});
 		});
	 });
	}
	else if (req.query.QueryType == 1){

		console.log(req.query)
		if (req.query.Barangay == 'all'){
			db.query(`SELECT * FROM petowner po JOIN barangay b ON po.int_BarangayId=b.int_BarangayId
			WHERE po.dat_DateRegistered BETWEEN 
			"${req.query.StartDate}" AND "${req.query.EndDate}"`,(err, results)=>{
				db.query(`SELECT * FROM barangay`,(err, barangay)=>{
					res.render('CVO-Query/views/petownerregistration.ejs',{ba:barangay,re:results});
				});
			})	
		}

		else {
			db.query(`SELECT * FROM petowner po JOIN barangay b ON po.int_BarangayId=b.int_BarangayId
			WHERE po.int_BarangayId IN (${req.query.Barangay}) AND po.dat_DateRegistered BETWEEN 
			"${req.query.StartDate}" AND "${req.query.EndDate}"`, (err, results)=>{
				db.query(`SELECT * FROM barangay`,(err, barangay)=>{
					res.render('CVO-Query/views/petownerregistration.ejs',{ba:barangay,re:results});
				});
			})	
		}
	} 
});

router.get('/PetRegistration', (req,res)=>{
	console.log(req.query);


	if (req.query.QueryType == 2){
	var query=`SELECT * FROM animal a JOIN pet p ON a.int_AnimalId = p.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId = c.int_ColorPatternId;`
	db.query(query, (err,pets)=>{
		if (err) {
			console.log(err)
		}
		else {
			db.query('SELECT * FROM barangay', (err, barangay) => {
				res.render('CVO-Query/views/petregistration.ejs',{pets:pets,ba:barangay});
			})
			}
		})
	}
	
});

router.get('/Vaccination', (req,res)=>{
	var query = `SELECT * FROM vaccination vc JOIN vaccine vac ON vc.int_VaccineId = vac.int_VaccineId JOIN manufacturer manu 
	ON vac.int_ManufacturerId = manu.int_ManufacturerId JOIN pet ON vc.int_PetId = pet.int_PetId JOIN animal ON pet.int_AnimalId = animal.int_AnimalId
	JOIN employee em ON vc.int_EmployeeId = em.int_EmployeeId JOIN breed b ON animal.int_BreedId = b.int_BreedId 
	JOIN colorpattern c ON animal.int_ColorPatternId = c.int_ColorPatternId;`
	console.log(req.query);
	db.query(query, (err,results)=>{
		if (err){
			console.log(err)
		}
		else {
		res.render('CVO-Query/views/vaccination.ejs',{vac:results});
		}
	})
});

router.get('/PetsAdoption', (req,res)=>{
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/petsforadoption.ejs',{site:results});
	});
});

router.get('/PetsRedemption', (req,res)=>{
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/petsforredemption.ejs',{site:results});
	});
});

router.get('/PetsEuthanasia', (req,res)=>{
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/petsforeuthanasia.ejs',{site:results});
	});
});

router.get('/ApprehendedAnimals', (req,res)=>{
	db.query(`SELECT * FROM apprehendedanimal app JOIN barangay ba ON ba.int_BarangayId = apprehendedanimal.int_BarangayId JOIN animal a ON a.int_AnimalId = apprehendedanimal.int_AnimalId JOIN breed b ON b.int_BreedId = a.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN lodginghistory lh ON lh.int_AnimalId = a.int_AnimalId JOIN cage cg ON lh.int_CageId = cg.int_CageId JOIN impoundingsite site ON site.int_ImpoundingSiteId = cg.int_ImpoundingSite`)
	db.query(`SELECT * FROM impoundingsite i JOIN barangay b on i.int_ImpoundingSiteId = b.int_BarangayId`,(err,results)=>{
			res.render('CVO-Query/views/apprehendedanimals.ejs',{site:results});
	});
});

router.get('/SurrenderedAnimals', (req,res)=>{
	db.query(`SELECT * FROM surrenderedanimal sa JOIN animal a ON sa.int_AnimalId = a.int_AnimalId JOIN concerncitizen cc ON cc.int_ConcernedCitizenId = sa.int_ConcernedCitizenId JOIN barangay ba ON ba.int_BarangayId = sa.int_Barangay JOIN breed b ON b.int_BreedId = a.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN lodginghistory lh ON lh.int_AnimalId = a.int_AnimalId JOIN cage cg ON cg.int_CageId = lh.int_CageId JOIN impoundingsite site ON site.int_ImpoundingSiteId = cg.int_ImpoundingSite WHERE a.int_AnimalStatus = 5`)
	db.query('SELECT * FROM barangay', (err, barangay) => {
		res.render('CVO-Query/views/surrenderedanimals.ejs',{ba:barangay});
	})
});

router.get('/ReleasedAnimals', (req,res)=>{
	db.query(`SELECT * FROM lodginghistory lh JOIN animal a ON lh.int_AnimalId = a.int_AnimalId JOIN breed b ON b.int_BreedId = a.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId = c.int_ColorPatternId JOIN apprehendedanimal app on app.int_AnimalId = lh.int_AnimalId WHERE lh.int_LodgingStatus = 2`, (err,results)=>{
		res.render('CVO-Query/views/releasedanimals.ejs',{released:results});
	})
});

router.get('/EuthanizedAnimals', (req,res)=>{
	db.query(`SELECT * FROM animal a JOIN euthanasiahistory eh ON a.int_AnimalId = eh.int_AnimalId JOIN pet p ON a.int_AnimalId = p.int_AnimalId JOIN breed b on b.int_BreedId = a.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN apprehendedanimal app ON app.int_AnimalId = a.int_AnimalId WHERE a.int_AnimalStatus = 4;`, (err,results)=>{
		res.render('CVO-Query/views/euthanizedanimals.ejs',{euthanized:results});
	});
});

router.get('/DeceasedAnimals', (req,res)=>{
	db.query(`SELECT * FROM animal a JOIN pet p on a.int_AnimalId = p.int_AnimalId JOIN breed b on b.int_BreedId = a.int_BreedId JOIN colorpattern c on c.int_ColorPatternId JOIN apprehendedanimal app ON app.int_AnimalId = a.int_AnimalId WHERE a.int_HealthStatus = 2`,(err, results)=>{
			res.render('CVO-Query/views/deceasedanimals.ejs',{deceased:results});	
	});
});

router.get('/Redemption', (req,res)=>{
	console.log(req.query)
	db.query(`SELECT rt.int_RedemptionTransactionId, rt.dtm_DateTimeOfRedemption, rt.int_OwnerStatus, CONCAT(po.str_PetOWnerFirstName,' ',po.str_PetOwnerMiddleName,' ',po.str_PetOWnerLastName) AS 'Owner', p.str_PetTagNo, p.str_PetName, b.int_AnimalSpecies, b.str_BreedName, c.str_Description, a.int_Sex, a.int_AnimalStatus
	FROM redemptiontransaction rt JOIN animal a ON rt.int_AnimalId = a.int_AnimalId JOIN breed b on b.int_BreedId = a.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN petowner po ON po.int_PetOwnerId = rt.int_OwnerId JOIN pet p ON p.int_AnimalId = a.int_AnimalId WHERE a.int_AnimalStatus = 2 AND rt.int_OwnerStatus = 0
	UNION
	SELECT rt.int_RedemptionTransactionId, rt.dtm_DateTimeOfRedemption, rt.int_OwnerStatus, CONCAT(nc.str_FirstName,' ',nc.str_MiddleName,' ',nc.str_LastName) AS 'Owner', p.str_PetTagNo, p.str_PetName, b.int_AnimalSpecies, b.str_BreedName, c.str_Description, a.int_Sex, a.int_AnimalStatus
	FROM redemptiontransaction rt JOIN animal a ON rt.int_AnimalId = a.int_AnimalId JOIN breed b on b.int_BreedId = a.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN noncitizen nc ON nc.int_NonCitizenId = rt.int_OwnerId JOIN pet p ON p.int_AnimalId = a.int_AnimalId WHERE a.int_AnimalStatus = 2 AND rt.int_OwnerStatus = 1`, (err, results)=>{
		res.render('CVO-Query/views/redemption.ejs',{redemption:results});
	});
});

router.get('/Adoption', (req,res)=>{
	db.query(`SELECT at.int_AdoptionTransactionId, at.dtm_DateTimeAnimalReleased, app.int_AdopterType, CONCAT(p.str_PetOWnerFirstName,' ',p.str_PetOwnerMiddleName,' ',p.str_PetOwnerLastName) AS 'Adopter',app.int_AdopterType,a.int_AnimalId ,appa.str_PetTagNo, appa.str_Alias, b.int_AnimalSpecies, b.str_BreedName, c.str_Description, a.int_Sex, a.int_AnimalStatus FROM adoptiontransaction at JOIN adoptionapplication app ON at.int_AdopterId = app.int_AdopterId AND at.int_AdopterType = app.int_AdopterType JOIN animal a ON a.int_AnimalId = at.int_AnimalId JOIN breed b ON b.int_BreedId = a.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId = c.int_ColorPatternId JOIN petowner p ON at.int_AdopterId = p.int_PetOwnerId JOIN apprehendedanimal appa ON appa.int_AnimalId = a.int_AnimalId WHERE a.int_AnimalStatus = 3 AND app.int_AdopterType = 1
	UNION
	SELECT at.int_AdoptionTransactionId, at.dtm_DateTimeAnimalReleased, app.int_AdopterType, CONCAT(nc.str_FirstName,' ',nc.str_MiddleName,' ',nc.str_LastName) AS 'Adopter',app.int_AdopterType,a.int_AnimalId ,appa.str_PetTagNo, appa.str_Alias, b.int_AnimalSpecies, b.str_BreedName, c.str_Description, a.int_Sex, a.int_AnimalStatus FROM adoptiontransaction at JOIN adoptionapplication app ON at.int_AdopterId = app.int_AdopterId AND at.int_AdopterType = app.int_AdopterType JOIN animal a ON a.int_AnimalId = at.int_AnimalId JOIN breed b ON b.int_BreedId = a.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId = c.int_ColorPatternId JOIN noncitizen nc ON at.int_AdopterId = nc.int_NonCitizenId JOIN apprehendedanimal appa ON appa.int_AnimalId = a.int_AnimalId WHERE a.int_AnimalStatus = 3 AND app.int_AdopterType = 0`,(err,results)=>{
		res.render('CVO-Query/views/adoption.ejs',{adoption:results});
	});
});

router.get('/Collection', (req,res)=>{
	db.query(`SELECT * FROM payment pm JOIN petowner po ON pm.int_PayorId = po.int_PetOwnerId JOIN breakdown bd ON bd.int_PaymentId = pm.int_PaymentId join natureofcollection nc ON nc.int_NatureOfCollectionId = bd.int_NatureOfCollectionId`,(err,results)=>{
		res.render('CVO-Query/views/collection.ejs',{collection:results});
	})
});

router.get('/TurnedOverAnimals', (req,res)=>{
	db.query(`SELECT * FROM animalsforturnover at JOIN batchofanimalturnover bat ON at.int_BatchOfAnimalTurnOver = bat.int_BatchOfAnimalTurnOver JOIN animal a ON at.int_AnimalId = a.int_AnimalId JOIN breed b ON b.int_BreedId = a.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN organization org ON org.int_OrganizationId = bat.int_OrganizationId WHERE bat.int_Status = 2`,(err,results)=>{
			res.render('CVO-Query/views/turnedoveranimals.ejs',{turnover:results});
	});
});

router.get('/BatchOfAnimalTurnover', (req,res)=>{
	db.query(`SELECT * FROM batchofanimalturnover bat JOIN organization org ON bat.int_OrganizationId = org.int_OrganizationId`,(err,results)=>{
		res.render('CVO-Query/views/batchofanimalturnover.ejs',{batch:results});	
	})
});

router.get('/StrayAnimalComplaints', (req,res)=>{
	var query = `SELECT * FROM complaint c JOIN employee e ON c.int_EmployeeId = e.int_EmployeeId JOIN barangay b on b.int_BarangayId = c.int_BarangayId;`
	db.query(query, (err,complaint)=>{
		db.query(`SELECT * FROM barangay`,(err,ba)=>{
			res.render('CVO-Query/views/strayanimalcomplaints.ejs',{complaint:complaint,ba:ba});
		});
	})
});

router.get('/TransferOfPetOwnership',(req, res)=>{
	db.query(`SELECT tp.int_TransferOfPetOwnershipId, CONCAT(po.str_PetOwnerFirstName,' ',po.str_PetOwnerLastName,' ',po.str_PetOwnerMiddleName) AS 'Pet Owner', CONCAT(po.str_PetOwnerFirstName , ' ' , po.str_PetOwnerLastName , ' ' , po.str_PetOwnerMiddleName) AS 'Receiver', tp.str_Reason, p.str_PetTagNo, p.str_PetName, b.int_AnimalSpecies, b.str_BreedName, c.str_Description, a.int_Sex, tp.int_TransferStatus, CONCAT(e.str_FirstName,' ',e.str_MiddleName,' ',e.str_LastName) AS 'Employee' FROM transferofpetownership tp JOIN pet p ON tp.int_PetId = p.int_PetId JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN petowner po ON tp.int_PetOwnerId = po.int_PetOwnerId JOIN employee e ON tp.int_EmployeeId = e.int_EmployeeId WHERE int_TransferStatus = 0
	UNION SELECT tp.int_TransferOfPetOwnershipId, CONCAT(po.str_PetOwnerFirstName,' ',po.str_PetOwnerLastName,' ',po.str_PetOwnerMiddleName) AS 'Pet Owner', CONCAT(nc.str_FirstName , ' ' , nc.str_MiddleName , ' ' , nc.str_MiddleName) AS 'Receiver', tp.str_Reason, p.str_PetTagNo, p.str_PetName, b.int_AnimalSpecies, b.str_BreedName, c.str_Description, a.int_Sex, tp.int_TransferStatus, CONCAT(e.str_FirstName,' ',e.str_MiddleName,' ',e.str_LastName) AS 'Employee' FROM transferofpetownership tp JOIN pet p ON tp.int_PetId = p.int_PetId JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId JOIN colorpattern c ON c.int_ColorPatternId = a.int_ColorPatternId JOIN noncitizen nc ON tp.int_PetOwnerId = nc.int_NonCitizenId JOIN employee e ON tp.int_EmployeeId = e.int_EmployeeId JOIN petowner po ON po.int_PetOwnerId = p.int_PetOwnerId WHERE int_TransferStatus = 1`,(err,results)=>{
		res.render('CVO-Query/views/transferofpetownership.ejs',{tr:results});
	});
});

exports.CVO_Query= router;
	