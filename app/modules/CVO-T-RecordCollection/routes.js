var express = require('express');
var router = express.Router();
var router1 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array'); //FOR SORTING JSON
// router.use(authMiddleware.noAuthed);



router.get('/', (req, res) => {
    db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId WHERE p.int_PayorType=0 AND p.int_Status=0`, (err, registration) => {
  
        db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE b.int_NatureOfCollectionId=6 AND p.int_PayorType=1 AND p.int_Status=0`,(err,adoption_PO)=>{
             db.query(`SELECT *, concat(nc.str_LastName,", ",nc.str_FirstName," ",nc.str_MiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN noncitizen nc ON p.int_PayorId = nc.int_NonCitizenId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE b.int_NatureOfCollectionId=6 AND p.int_PayorType=2 AND p.int_Status=0`,(err,adoption_NC)=>{
        //query for adoption payments
        //query for redemption payments
        //FOR MERGING AND SORTING SAMPLE TAPOS IPASA SA FRONT END

        console.log(adoption_NC)
        var adoption = {};
        var redemption = {};
        var unpaid = sortJsonArray(adoption_PO.concat(registration.concat(adoption_NC)), 'int_PaymentId', 'des');
        res.render('CVO-T-RecordCollection/views/view.ejs', {
            un: unpaid
        });
    });
    });
    });
});


router.post('/Certpo/download', (req, res) => {
    db.query(`CALL SelectPetOwnerDetails(${req.body.petOwnerId})`, (err, petOwnerDetails) => {
        db.query(`SELECT * FROM office`, (err, officeDetails) => {
            res.render('CVO-T-RecordCollection/views/CertificateOfPetOwnership_DOWNLOAD.ejs', {
                po: petOwnerDetails,
                od: officeDetails,
                empName: "Gilbert Critica Cortez"
            });
        });
    });
});
router.post('/Certpo/print', (req, res) => {
    db.query(`CALL SelectPetOwnerDetails(${req.body.petOwnerId})`, (err, petOwnerDetails) => {
        db.query(`SELECT * FROM office`, (err, officeDetails) => {
            res.render('CVO-T-RecordCollection/views/CertificateOfPetOwnership_PRINT.ejs', {
                po: petOwnerDetails,
                od: officeDetails,
                empName: "Gilbert Critica Cortez"
            });
        });
    });
});

router.post('/Certp/print', (req, res) => {
    db.query(`CALL SelectPetDetails(${req.body.petId})`, (err, petDetails) => {
        db.query(`CALL SelectPetOwnerDetails(${petDetails[0][0].int_PetOwnerId})`, (err, petOwnerDetails) => {

            db.query(`SELECT * FROM office`, (err, officeDetails) => {
                res.render('CVO-T-RecordCollection/views/CertificateOfPetRegistration_PRINT.ejs', {
                    po: petOwnerDetails,
                    pd: petDetails[0],
                    od: officeDetails,
                    empName: "Gilbert Critica Cortez"
                });
            });
        });
    });
});
router.post('/Certp/download', (req, res) => {
    db.query(`CALL SelectPetDetails(${req.body.petId})`, (err, petDetails) => {
        db.query(`CALL SelectPetOwnerDetails(${petDetails[0][0].int_PetOwnerId})`, (err, petOwnerDetails) => {

            db.query(`SELECT * FROM office`, (err, officeDetails) => {
                res.render('CVO-T-RecordCollection/views/CertificateOfPetRegistration_DOWNLOAD.ejs', {
                    po: petOwnerDetails,
                    pd: petDetails[0],
                    od: officeDetails,
                    empName: "Gilbert Critica Cortez"
                });
            });
        });
    });
});
router.post('/Certv/print', (req, res) => {
    db.query(`CALL SelectVaccinationDetails(${req.body.vaccinationId})`, (err, vaccinationDetails) => {
        db.query(`SELECT * FROM office`, (err, officeDetails) => {
            db.query(`CALL SelectPetDetails(${vaccinationDetails[0][0].int_PetId})`, (err, petDetails) => {
                res.render('CVO-T-RecordCollection/views/CertificateOfVaccination_PRINT.ejs', {
                    vd: vaccinationDetails[0],
                    od: officeDetails,
                    pd: petDetails[0],
                    empName: "Gilbert Critica Cortez"
                });
            });
        });
    });
});

router.post('/Certv/download', (req, res) => {
    db.query(`CALL SelectVaccinationDetails(${req.body.vaccinationId})`, (err, vaccinationDetails) => {
        db.query(`SELECT * FROM office`, (err, officeDetails) => {
            db.query(`CALL SelectPetDetails(${vaccinationDetails[0][0].int_PetId})`, (err, petDetails) => {
                res.render('CVO-T-RecordCollection/views/CertificateOfVaccination_DOWNLOAD.ejs', {
                    vd: vaccinationDetails[0],
                    od: officeDetails,
                    pd: petDetails[0],
                    empName: "Gilbert Critica Cortez"
                });
            });
        });
    });
});

router.post('/OrderOfReleaseR1/print', (req, res) => {
   
  db.query(`SELECT * FROM redemptiontransaction WHERE   int_RedemptionTransactionId=${req.body.redemptionTransactionId}`, (err, redemptionTransaction) => { console.log(redemptionTransaction)
                    if(redemptionTransaction[0].int_OwnerStatus==0){
                        db.query(`CALL SelectPetOwnerDetails(${redemptionTransaction[0].int_OwnerId});`,(err,petOwnerDetails)=>{ console.log(petOwnerDetails)
                            db.query(`CALL SelectImpoundedAnimalDetails(${redemptionTransaction[0].int_AnimalId})`,(err,impoundedAnimal)=>{ console.log(impoundedAnimal)
                               db.query(`SELECT * FROM office`, (err, officeDetails) => {
                res.render('CVO-T-RecordCollection/views/OrderOfRelease.ejs', {
                    po: petOwnerDetails,
                   ia:impoundedAnimal[0][0],
                    od: officeDetails,
                    empName: "Gilbert Critica Cortez"
                });
            });
                            })
                        })
                    }
                    else{
                        console.log('NON CITIZEN')
                    }
                    
                    });
});

router.post('/record', (req, res) => {

    var PaymentId = req.body.payId;
    var ORNumber = req.body.ORNumber;
    var DateOfPayment = req.body.DateOfPayment;



   // db.query(`UPDATE payment SET str_ORNumber=${ORNumber},dat_DateOfPayment="${DateOfPayment}", int_Status=1 WHERE int_PaymentId=${PaymentId}`,(err)=>{
    db.query(`CALL SelectPaymentBreakdown(${PaymentId})`, (err, breakdown) => {


        if (breakdown[0].length == 3) {
            db.query(`CALL SelectPetInvolvedInAPayment(${PaymentId})`, (err, petId) => {
                db.query(`CALL SelectLatestVaccinationOfPet(${petId[0][0].int_AnimalInvolved})`, (err, petLatestVaccine) => {
                    db.query(`CALL SelectPetDetails(${petId[0][0].int_AnimalInvolved})`, (err, petTagNo) => {
                        res.render('CVO-T-RecordCollection/views/TransactionSummary_POR_PR_V.ejs', {
                            petId: petId[0][0].int_AnimalInvolved,
                            petTagNo: petTagNo[0][0].str_PetTagNo,
                            petOwnerId: breakdown[0][0].int_PayorId,
                            vaccinationId: petLatestVaccine[0][0].int_VaccinationId
                        });
                    });
                });
            });
        } else if (breakdown[0].length == 2) {

            if (breakdown[0][0].int_NatureOfCollectionId == 0 && breakdown[0][1].int_NatureOfCollectionId == 1) {
                db.query(`CALL SelectPetInvolvedInAPayment(${PaymentId})`, (err, petId) => {

                    db.query(`CALL SelectPetDetails(${petId[0][0].int_AnimalInvolved})`, (err, petTagNo) => {
                        res.render('CVO-T-RecordCollection/views/TransactionSummary_POR_PR.ejs', {
                            petId: petId[0][0].int_AnimalInvolved,
                            petOwnerId: breakdown[0][0].int_PayorId,
                            petTagNo: petTagNo[0][0].str_PetTagNo
                        });
                    });
                });
            } else if (breakdown[0][0].int_NatureOfCollectionId == 1 && breakdown[0][1].int_NatureOfCollectionId == 2) {
                db.query(`CALL SelectPetInvolvedInAPayment(${PaymentId})`, (err, petId) => {
                    db.query(`CALL SelectLatestVaccinationOfPet(${petId[0][0].int_AnimalInvolved})`, (err, petLatestVaccine) => {
                        db.query(`CALL SelectPetDetails(${petId[0][0].int_AnimalInvolved})`, (err, petTagNo) => {
                            res.render('CVO-T-RecordCollection/views/TransactionSummary_PR_V.ejs', {
                                petId: petId[0][0].int_AnimalInvolved,
                                petTagNo: petTagNo[0][0].str_PetTagNo,
                                vaccinationId: petLatestVaccine[0][0].int_VaccinationId
                            });
                        });
                    });
                });
            }
            /*
              0 1 -POR PR
              1 2 -PR V
            */
        } else if (breakdown[0].length == 1) {

            if (breakdown[0][0].int_NatureOfCollectionId == 0) {
console.log(breakdown[0][0].int_NatureOfCollectionId)
                res.render('CVO-T-RecordCollection/views/TransactionSummary_POR.ejs', {
                    petOwnerId: breakdown[0][0].int_PayorId
                });

            } 
            else if (breakdown[0][0].int_NatureOfCollectionId == 1) {
                console.log(breakdown[0][0].int_NatureOfCollectionId)
                db.query(`CALL SelectPetInvolvedInAPayment(${PaymentId})`, (err, petId) => {
                    db.query(`CALL SelectPetDetails(${petId[0][0].int_AnimalInvolved})`, (err, petTagNo) => {
                        res.render('CVO-T-RecordCollection/views/TransactionSummary_PR.ejs', {
                            petId: petId[0][0].int_AnimalInvolved,
                            petTagNo: petTagNo[0][0].str_PetTagNo
                        });
                    });
                });
            } else if (breakdown[0][0].int_NatureOfCollectionId == 2) {
                 db.query(`CALL SelectPetInvolvedInAPayment(${PaymentId})`, (err, petId) => {console.log(petId);
                    db.query(`CALL SelectLatestVaccinationOfPet(${petId[0][0].int_AnimalInvolved})`, (err, petLatestVaccine) => { console.log(petLatestVaccine);
                       
                            res.render('CVO-T-RecordCollection/views/TransactionSummary_V.ejs', {
                                vaccinationId: petLatestVaccine[0][0].int_VaccinationId
                            });
                    
                    });
                });
            }
            else if (breakdown[0][0].int_NatureOfCollectionId == 3 || breakdown[0][0].int_NatureOfCollectionId == 4 || breakdown[0][0].int_NatureOfCollectionId == 5) {
                 db.query(`SELECT * FROM redemptiontransaction WHERE int_OwnerId=${breakdown[0][0].int_PayorId} AND int_RedemptionResult=1`, (err, redemptionTransaction) => {
                    db.query(`UPDATE redemptiontransaction SET int_RedemptionResult=2 WHERE int_RedemptionTransactionId=${redemptionTransaction[0].int_RedemptionTransactionId }`,(err)=>{ console.log(err)
                        res.render('CVO-T-RecordCollection/views/TransactionSummary_R1.ejs', {
                            redemptionTransactionId:redemptionTransaction[0].int_RedemptionTransactionId 
                        });
                    });
                });
                
            }
            else if (breakdown[0][0].int_NatureOfCollectionId ==6) {
              
                     db.query(`SELECT * FROM adoptiontransaction WHERE int_AdopterId=${breakdown[0][0].int_PayorId} AND int_AdopterType=${breakdown[0][0].int_PayorType==1?'0':'1'} AND int_Stage=5`, (err, adoptiontransaction) => {
                        db.query(`UPDATE adoptiontransaction SET int_Stage=6 WHERE int_AdoptionTransactionId=${adoptiontransaction[0].int_AdoptionTransactionId}`,(err)=>{
                            if(adoptiontransaction[0].int_AdopterType==0){
                                res.render('CVO-T-RecordCollection/views/TransactionSummary_A1.ejs', {
                                    adoptionTransactionId:adoptiontransaction[0].int_AdoptionTransactionId
                                });
                            }
                            else if(adoptiontransaction[0].int_AdopterType==1){
                                res.render('CVO-T-RecordCollection/views/TransactionSummary_A1.ejs', {
                                    adoptionTransactionId:adoptiontransaction[0].int_AdoptionTransactionId
                                });
                            }
                        });
                     });
             
            }
            /*
              0- POR
              1- PR
              2- V
              3- R1
              4- R2
              5- R3
            */
        }

});
   // });

});

router.post('/OrderOfPayment', (req, res) => {

    db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${req.body.paymentId}`, (err, breakdown) => {
        
            db.query(`SELECT * FROM office`, (err, officeDetails) => {
                res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs', {
                    br: breakdown,
                    od: officeDetails,
                    empName: "Gilbert Critica Cortez",
                    payor: breakdown[0].str_PayorName
                });
            
        });
    });

});

router.post('/OrderOfPayment/petOwner', (req, res) => {

    db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${req.body.paymentId}`, (err, breakdown) => {
        
            db.query(`SELECT * FROM office`, (err, officeDetails) => {
                res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs', {
                    br: breakdown,
                    od: officeDetails,
                    empName: "Gilbert Critica Cortez",
                    payor: req.body.payorname
                });
            
        });
    });

});






router1.post('/', (req, res) => {
    db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${req.body.id}`, (err, result) => {
        res.json(result);
    });
});


exports.CVO_RecordCollection = router;
exports.CVO_PaymentBreakdown = router1;