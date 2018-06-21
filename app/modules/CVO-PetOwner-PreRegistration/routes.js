
var express = require('express');
var router = express.Router();
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

router.get('/',  (req,res)=>{
	db.query('SELECT * FROM barangay',(err,barangay)=>{
			res.render('CVO-PetOwner-PreRegistration/views/view',{ba:barangay});
		});
});

router.post('/',  (req,res)=>{
	var FirstName=req.body.FName;
	var MiddleName=req.body.MName;
	var LastName=req.body.LName;
	var BarangayId=req.body.barangay;
	var Appointment=req.body.Appointment;
	var CompleteAddress=req.body.completeAddress;
	var StartedYear=req.body.startYear;
	var PhoneNumber=req.body.CellphoneNumber;
	var Email=req.body.emailAddress;
	var Password=generatePassword();
	console.log(Appointment);
	function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
	}
	db.query(`INSERT INTO petowner(str_PetOwnerFirstName, str_PetOwnerMiddleName, str_PetOwnerLastName, int_BarangayId, dat_DateRegistered, str_CompleteAddress, dat_StartedYearOfStay, str_PhoneNo, str_Email, str_Password, int_Status) VALUES ('${FirstName}','${MiddleName}','${LastName}',${BarangayId},'${Appointment}','${CompleteAddress}','${StartedYear}','${PhoneNumber}','${Email}','${Password}',0)`,(err,currentPetOwnerId)=>{ console.log(err);
		res.send(`<html><body><script src="sweetalert/dist/sweetalert.min.js"></script> <style>body{font-family: "Trebuchet MS";}tr{font-size: 15px;}.swal-overlay{background-color: rgba(66, 134, 244, 0.90);}</style> <script>swal("Pre-registered!" , "Kindly check your Email for your Password" , "success" ).then(()=>{window.location.href="/PetOwner_Login";});</script></body></html>`); 
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



exports.PetOwner_PreRegistration= router;
