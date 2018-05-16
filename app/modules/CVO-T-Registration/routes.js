
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

//FOR SENDING EMAIL USING NODEMAILER
var nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth:{
    user: 'gilbert230709@gmail.com',
    pass: 'Aeccestane23'
  },
  tls: {
    rejectUnauthorized: false
  }
});

//FOR IMAGE UPLOAD USING MULTER (PET OWNER REGISTRATION)
var multer  = require('multer');
var storageOwner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/PetOwners' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg")
  }
})
var uploadOwner = multer({ storage: storageOwner })

//FOR IMAGE UPLOAD USING MULTER (PET REGISTRATION)
var storagePet = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/Pets' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg")
  }
})
var uploadPet = multer({ storage: storagePet })

router.get('/',  (req,res)=>{
	res.render('CVO-T-Registration/views/view.ejs');
});

//OWNER REGISTRATION
router1.get('/',  (req,res)=>{
  db.query('SELECT * FROM barangay',(err,barangay)=>{
			res.render('CVO-T-Registration/views/ownerregistration.ejs',{ba:barangay, pageStatus:0});
	});
});

router1.post('/',uploadOwner.any(),  (req,res)=>{
	var FirstName=req.body.FName;
	var MiddleName=req.body.MName;
	var LastName=req.body.LName;
	var BarangayId=req.body.barangay;
	var CompleteAddress=req.body.completeAddress;
	var StartedYear=req.body.startYear;
	var PhoneNumber=req.body.CellphoneNumber;
	var PetOwnerPicturePath="/"+req.files[0].filename;
	var Email=req.body.emailAddress;
	var Password=generatePassword();
	function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
	}
	db.query(`INSERT INTO petowner(str_PetOwnerFirstName, str_PetOwnerMiddleName, str_PetOwnerLastName, dat_DateRegistered, int_BarangayId, str_CompleteAddress, dat_StartedYearOfStay, str_PhoneNo, str_PetOwnerPicturePath, str_Email, str_Password, int_Status)
	VALUES ('${FirstName}','${MiddleName}','${LastName}',now(),${BarangayId},'${CompleteAddress}','${StartedYear}','${PhoneNumber}','${PetOwnerPicturePath}','${Email}','${Password}',1)`,(err,result)=>{
			db.query('SELECT * FROM petowner ORDER BY 1 desc LIMIT 1',(err,currentPetOwnerId)=>{
				db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_NatureOfCollectionId, int_Status) VALUES (${currentPetOwnerId[0].int_PetOwnerId},0,1,0)`,(err,results)=>{
					db.query('SELECT * FROM barangay',(err,barangay)=>{
							res.render('CVO-T-Registration/views/ownerregistration.ejs',{ba:barangay,currentPetOwner: currentPetOwnerId[0].int_PetOwnerId, pageStatus:1});
					});
				});
			});
	});
	let HelperOptions = {
		from: '"City Veterenary Office-Marikina" <gilbert230709@gmail.com',
		to: 'gilbert230709@gmail.com',
		subject: 'Pet Owner Password for Pet Owner Portal',
		text:`Good day Sir/Ma'am `+LastName+`, `+FirstName+` `+MiddleName+`! Your password is: `+Password
	};
	transporter.sendMail(HelperOptions, (err,info)=>{
		if(err){
			return console.log(err);
		}
	});
});

//PET REGISTRATION


router2.post('/',uploadPet.any(),  (req,res)=>{
  db.query('SELECT * FROM breed',(err,breed) =>{
    db.query('SELECT * FROM colorpattern',(err,colorpattern)=>{
			if(req.body.cameFrom=="Pet Owner Registration"){
        res.render('CVO-T-Registration/views/petregistration.ejs', { br: breed, co: colorpattern,currentPetOwner: req.body.currentPetOwner, pageStatus:0});
			}
			else if(req.body.cameFrom=="Pet Registration"){
				var BreedId=req.body.breed;
				var Sex=req.body.sex;
				var ColorPatternId=req.body.ColorPattern;
				//var AnimalPicturePath="/"+req.files[0].filename;
				var AnimalPicturePath="/";
				var PetName=req.body.petName;
				var Birthday=req.body.birthday;
				var PetTagNo=req.body.pettag;

				db.query(`INSERT INTO animal(int_BreedId, int_Sex, int_ColorPatternId, str_AnimalPicturePath, int_AnimalStatus)
									VALUES (${BreedId},${Sex},${ColorPatternId},'${AnimalPicturePath}',6)`,(err,result)=>{
						db.query(`SELECT * FROM animal ORDER BY 1 desc LIMIT 1`,(err,currentAnimalRecord)=>{
						db.query(`INSERT INTO pet( int_AnimalId, int_PetOwnerId, str_PetName, dat_DateRegistered, dat_Birthday, str_PetTagNo)
						 			VALUES (${currentAnimalRecord[0].int_AnimalId},${req.body.currentPetOwner},'${PetName}',now(),'${Birthday}','${PetTagNo}')`,(err,result)=>{
										db.query(`SELECT * FROM pet ORDER BY 1 desc LIMIT 1`,(err,currentPetRecord)=>{
        												res.render('CVO-T-Registration/views/petregistration.ejs', { br: breed, co: colorpattern,currentPetOwner: req.body.currentPetOwner,currentPet: currentPetRecord, pageStatus:1});
								});
						});
					});
				});
			}
    });
  });
});



exports.CVO_Registration= router;
exports.CVO_OwnerRegistration= router1;
exports.CVO_PetRegistration= router2;
