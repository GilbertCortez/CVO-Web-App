var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();

// router.use(authMiddleware.noAuthed);

//FOR SENDING EMAIL USING NODEMAILER
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: 'gilbert230709@gmail.com',
        pass: 'Aeccestane23'
    },
    tls: {
        rejectUnauthorized: false
    }
});

//FOR IMAGE UPLOAD USING MULTER (PET OWNER REGISTRATION)
var multer = require('multer');
var storageOwner = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../images/PetOwners')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }
})
var uploadOwner = multer({
    storage: storageOwner
})

//FOR IMAGE UPLOAD USING MULTER (PET REGISTRATION)
var storagePet = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../images/Pets')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + ".jpg")
    }
})
var uploadPet = multer({
    storage: storagePet
})


router.get('/', (req, res) => {
    db.query(`SELECT * FROM requirementspertransaction rpt JOIN requirements r ON rpt.int_RequirementsId=r.int_RequirementsId WHERE rpt.int_Transaction='0'`, (err, porequirements) => {
        db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE int_status = 1`, (err, petowners) => {
            db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE int_status = 0`, (err, prereg) => {
                console.log(porequirements)
                res.render('CVO-T-Registration/views/view.ejs', {
                    po: petowners,
                    pr: prereg,
                    porequ: porequirements
                });
            });
        });
    });
});

//OWNER REGISTRATION
router1.get('/', (req, res) => {

    db.query('SELECT * FROM barangay', (err, barangay) => {
        res.render('CVO-T-Registration/views/ownerregistration.ejs', {
            ba: barangay,
            pageStatus: 0
        });
    });
});

router1.post('/preregistered', (req, res) => {
    console.log(req.body.currentpetowner);
    db.query('SELECT * FROM barangay', (err, barangay) => {
        res.render('CVO-T-Registration/views/ownerregistration.ejs', {
            ba: barangay,
            cp: JSON.parse(req.body.currentpetowner),
            pageStatus: 2
        });
    });
});

router1.post('/preregistered/recording', uploadOwner.any(), (req, res) => {
    var FirstName = req.body.FName;
    var MiddleName = req.body.MName;
    var LastName = req.body.LName;
    var BarangayId = req.body.barangay;
    var CompleteAddress = req.body.completeAddress;
    var StartedYear = req.body.startYear;
    var PhoneNumber = req.body.CellphoneNumber;
    var PetOwnerPicturePath = "/" + req.files[0].filename;
    var Email = req.body.emailAddress;



    db.query(`UPDATE petowner SET str_PetOwnerFirstName="${FirstName}",str_PetOwnerMiddleName="${MiddleName}",str_PetOwnerLastName="${LastName}",dat_DateRegistered=now(),int_BarangayId=${BarangayId},str_CompleteAddress="${CompleteAddress}",dat_StartedYearOfStay="${StartedYear}",str_PhoneNo="${PhoneNumber}",str_PetOwnerPicturePath="${PetOwnerPicturePath}",str_Email="${Email}",int_Status=1 WHERE int_PetOwnerId=${req.body.currentPetOwnerId}`, (err, result) => {
        console.log(err);
        db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${req.body.currentPetOwnerId},0,0)`, (err, lastPayment) => {
            db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId) VALUES( ${lastPayment.insertId},0 )`, (err, results) => {});
            db.query('SELECT * FROM barangay', (err, barangay) => {
                db.query(`SELECT * FROM petowner WHERE int_PetOwnerId=${req.body.currentPetOwnerId} `, (err, currentPetOwner) => {
                    console.log(currentPetOwner);
                    res.render('CVO-T-Registration/views/ownerregistration.ejs', {
                        ba: barangay,
                        currentPetOwner: currentPetOwner,
                        lastPayment: lastPayment.insertId,
                        pageStatus: 1
                    });
                });
            });
        });
    });
    let HelperOptions = {
        from: '"City Veterenary Office-Marikina" <gilbert230709@gmail.com',
        to: 'gilbert230709@gmail.com',
        subject: 'Pet Owner Password for Pet Owner Portal',
        text: `Good day Sir/Ma'am ` + LastName + `, ` + FirstName + ` ` + MiddleName + `! We will just inform you that you're now a Registered Pet Owner. You may now access all Pet Owner Module Features.`
    };
    transporter.sendMail(HelperOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }
    });
});

router1.post('/', uploadOwner.any(), (req, res) => {

    var FirstName = req.body.FName;
    var MiddleName = req.body.MName;
    var LastName = req.body.LName;
    var BarangayId = req.body.barangay;
    var CompleteAddress = req.body.completeAddress;
    var StartedYear = req.body.startYear;
    var PhoneNumber = req.body.CellphoneNumber;
    var PetOwnerPicturePath = "/" + req.files[0].filename;
    var Email = req.body.emailAddress;
    var Password = generatePassword();

    function generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    db.query(`INSERT INTO petowner(str_PetOwnerFirstName, str_PetOwnerMiddleName, str_PetOwnerLastName, dat_DateRegistered, int_BarangayId, str_CompleteAddress, dat_StartedYearOfStay, str_PhoneNo, str_PetOwnerPicturePath, str_Email, str_Password, int_Status) VALUES ('${FirstName}','${MiddleName}','${LastName}',now(),${BarangayId},'${CompleteAddress}','${StartedYear}','${PhoneNumber}','${PetOwnerPicturePath}','${Email}','${Password}',1)`, (err, currentPetOwnerId) => {
        db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${currentPetOwnerId.insertId},0,0)`, (err, lastPayment) => {
            db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId) VALUES( ${lastPayment.insertId},0 )`, (err, results) => {});
            db.query('SELECT * FROM barangay', (err, barangay) => {
                db.query(`SELECT * FROM petowner WHERE int_PetOwnerId=${currentPetOwnerId.insertId} `, (err, currentPetOwner) => {
                    console.log(currentPetOwner);
                    res.render('CVO-T-Registration/views/ownerregistration.ejs', {
                        ba: barangay,
                        currentPetOwner: currentPetOwner,
                        lastPayment: lastPayment.insertId,
                        pageStatus: 1
                    });
                });
            });
        });
    });
    let HelperOptions = {
        from: '"City Veterenary Office-Marikina" <gilbert230709@gmail.com',
        to: 'gilbert230709@gmail.com',
        subject: 'Pet Owner Password for Pet Owner Portal',
        text: `Good day Sir/Ma'am ` + LastName + `, ` + FirstName + ` ` + MiddleName + `! Your password is: ` + Password
    };
    transporter.sendMail(HelperOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }
    });
});

router1.post('/checkEmail', (req, res) => {
    console.log(req.body)
    db.query(`SELECT * FROM petowner WHERE str_Email="${req.body.id}"`, (err, result) => {
        result.length > 0 ? res.json(1) : res.json(0);
    });
});

router1.post('/checkNumber', (req, res) => {
    console.log(req.body)
    db.query(`SELECT * FROM petowner WHERE str_PhoneNo="${req.body.id}"`, (err, result) => {
        result.length > 0 ? res.json(1) : res.json(0);
    });
});

//PET REGISTRATION


router2.post('/', uploadPet.any(), (req, res) => {
    db.query('SELECT * FROM breed', (err, breed) => {
        db.query('SELECT * FROM colorpattern', (err, colorpattern) => {
            if (req.body.cameFrom == "Pet Owner Registration") {
                res.render('CVO-T-Registration/views/petregistration.ejs', {
                    br: breed,
                    co: colorpattern,
                    currentPetOwner: JSON.parse(req.body.currentPetOwner),
                    lastPayment: req.body.lastPayment,
                    pageStatus: 0
                });
            } else if (req.body.cameFrom == "Registration") {
                res.render('CVO-T-Registration/views/petregistration.ejs', {
                    br: breed,
                    co: colorpattern,
                    currentPetOwner: JSON.parse(req.body.currentPetOwner),
                    pageStatus: 3
                });
            } else if (req.body.cameFrom == "Pet Registration") {

                var BreedId = req.body.breed;
                var Sex = req.body.sex;
                var ColorPatternId = req.body.ColorPattern;
                var AnimalPicturePath = "/" + req.files[0].filename;
                var PetName = req.body.petName;
                var Birthday = req.body.birthday;
                var PetTagNo = req.body.pettag;

                db.query(`INSERT INTO animal(int_BreedId, int_Sex, int_ColorPatternId, str_AnimalPicturePath, int_AnimalStatus) VALUES (${BreedId},${Sex},${ColorPatternId},'${AnimalPicturePath}',6)`, (err, result) => {
                    db.query(`SELECT * FROM animal WHERE int_AnimalId=${result.insertId}`, (err, currentAnimalRecord) => {
                        console.log(JSON.parse(req.body.currentPetOwner).int_PetOwnerId);
                        db.query(`INSERT INTO pet( int_AnimalId, int_PetOwnerId, str_PetName, dat_DateRegistered, dat_Birthday, str_PetTagNo) VALUES (${currentAnimalRecord[0].int_AnimalId},${JSON.parse(req.body.currentPetOwner).int_PetOwnerId},'${PetName}',now(),'${Birthday}','${PetTagNo}')`, (err, result) => {

                            if (req.body.lastPayment == 'NONE') {
                                db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${JSON.parse(req.body.currentPetOwner).int_PetOwnerId},0,0)`, (err, lastPayment) => {
                                    db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId,int_AnimalInvolved) VALUES( ${lastPayment.insertId},1,${currentAnimalRecord[0].int_AnimalId} )`, (err, results) => {});
                                    db.query(`SELECT * FROM pet WHERE int_PetId=${result.insertId}`, (err, currentPetRecord) => {
                                        res.render('CVO-T-Registration/views/petregistration.ejs', {
                                            br: breed,
                                            co: colorpattern,
                                            currentPetOwner: req.body.currentPetOwner,
                                            currentPet: currentPetRecord[0].int_PetId,
                                            lastPayment: lastPayment.insertId,
                                            pageStatus: 1
                                        });
                                    });
                                });
                            } else {
                                db.query(`INSERT INTO breakdown( int_PaymentId, int_NatureOfCollectionId,int_AnimalInvolved) VALUES( ${req.body.lastPayment},1,${currentAnimalRecord[0].int_AnimalId} )`, (err, results) => {
                                    db.query(`SELECT * FROM pet WHERE int_PetId=${result.insertId}`, (err, currentPetRecord) => {
                                        res.render('CVO-T-Registration/views/petregistration.ejs', {
                                            br: breed,
                                            co: colorpattern,
                                            currentPetOwner: req.body.currentPetOwner,
                                            currentPet: currentPetRecord[0].int_PetId,
                                            lastPayment: req.body.lastPayment,
                                            pageStatus: 1
                                        });
                                    });
                                });
                            }

                        });
                    });
                });
            } //end of else if
        });
    });
});

router3.post('/', (req, res) => {
    db.query(`SELECT *  FROM pet p JOIN animal a on p.int_AnimalId=a.int_AnimalId JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId WHERE int_PetOwnerId=${JSON.parse(req.body.currentpetowner).int_PetOwnerId}`, (err, pets) => {
        res.render('CVO-T-Registration/views/petownerprofile.ejs', {
            currentPetOwner: JSON.parse(req.body.currentpetowner),
            pe: pets
        });
    });
});
router3.post('/getVaccinationHistory', (req, res) => {
    console.log(req.body.id)
    db.query(`SELECT * FROM vaccination v JOIN vaccine va ON v.int_VaccineId=va.int_VaccineId WHERE v.int_PetId=${req.body.id}`, (err, vaccinationHistory) => {
        console.log(err)
        res.json(vaccinationHistory);
    });
});

exports.CVO_Registration = router;
exports.CVO_OwnerRegistration = router1;
exports.CVO_PetRegistration = router2;
exports.CVO_PetOwnerProfile = router3;