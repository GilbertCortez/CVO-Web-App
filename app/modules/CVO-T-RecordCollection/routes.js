var express = require('express');
var router = express.Router();
var router1 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array'); //FOR SORTING JSON
// router.use(authMiddleware.noAuthed);



router.get('/', (req, res) => {
    db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId WHERE p.int_PayorType=0 AND p.int_Status=0`, (err, registration) => {
        //query for adoption payments
        //query for redemption payments
        //  console.log(sortJsonArray(o1.concat(o2.concat(o3)),'name','asc')   ); FOR MERGING AND SORTING SAMPLE TAPOS IPASA SA FRONT END
        var adoption = {};
        var redemption = {};
        var unpaid = sortJsonArray(registration, 'int_PaymentId', 'des');

        res.render('CVO-T-RecordCollection/views/view.ejs', {
            un: unpaid
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


router.post('/record', (req, res) => {

    var PaymentId = req.body.payId;
    var ORNumber = req.body.ORNumber;
    var DateOfPayment = req.body.DateOfPayment;



    //db.query(`UPDATE payment SET str_ORNumber=${ORNumber},dat_DateOfPayment="${DateOfPayment}", int_Status=1 WHERE int_PaymentId=${PaymentId}`,(err)=>{
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
            /*
              0- POR
              1- PR
              2- V
            */
        }


    });

});

router.post('/OrderOfPayment', (req, res) => {

    db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${req.body.paymentId}`, (err, breakdown) => {
        
            db.query(`SELECT * FROM office`, (err, officeDetails) => {
                console.log("HIIII"+breakdown[0].str_PayorName)
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

router.get('/hi', (req, res) => {

    var preferences = {
            numberOfFinalists: 2,
            filters: {
                species: "cat",
                breed: "corgi",
                colorpattern: "tuxido",
                sex: "male",
                status: "healthy"
            }
        },
        animals = [{
                species: "cat",
                breed: "corgi",
                colorpattern: "tuxido",
                sex: "male",
                status: "healthy"
            },
            {
                species: "cat",
                breed: "aspin",
                colorpattern: "black",
                sex: "female",
                status: "healthy"
            },
            {
                species: "dog",
                breed: "persian",
                colorpattern: "green",
                sex: "male",
                status: "sick"
            },
            {
                species: "dog",
                breed: "persian",
                colorpattern: "tuxido",
                sex: "male",
                status: "healthy"
            }
        ],
        identifiers = Object.keys(preferences.filters),
        semifinalist = [],
        finalist = [];

    animals.forEach(function(animal) {
        var points = identifiers.reduce((p, k) => p + (preferences.filters[k] == animal[k]), 0);
        if (points > identifiers.length / 2) {
            semifinalist.push(Object.assign({
                points
            }, animal));
        }
    });

    semifinalist.sort((a, b) => b.points - a.points);

    finalist = semifinalist.slice(0, preferences.numberOfFinalists);

    console.log("SEMIFINALIST:");
    console.log(semifinalist);
    console.log("FINALIST:");
    console.log(finalist);
});

exports.CVO_RecordCollection = router;
exports.CVO_PaymentBreakdown = router1;