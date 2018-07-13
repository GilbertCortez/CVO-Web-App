
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
router.use(authMiddleware.noAuthed);

//FOR IMAGE UPLOAD USING MULTER
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/VaccinationCertificate' )
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+".jpg")
  }
})
var upload = multer({ storage: storage })


router.get('/',  (req,res)=>{
	db.query(`SELECT * FROM pet p JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId = b.int_BreedId WHERE p.int_PetId=${1} `,(err,petDetails)=>{
			res.render('CVO-PetOwner-Vaccination/views/view.ejs',{pe : petDetails[0]});
	});
});


router.post('/', upload.any(), (req,res)=>{
	db.query(`INSERT INTO vaccination( int_PetId, int_Status) VALUES (${req.body.currentPetId},0)`,(err,vaccinationDetails)=>{if(err){console.log(err);}
		db.query(`INSERT INTO vaccinationcertificateupload( int_VaccinationId,str_VaccinationCertificatePicturePath, int_Status) VALUES (${vaccinationDetails.insertId},'/${req.files[0].filename}',0)`,(err)=>{if(err){console.log(err);}
			res.send(`<html><body><script src="sweetalert/dist/sweetalert.min.js"></script> <style>body{font-family: "Trebuchet MS";}tr{font-size: 15px;}.swal-overlay{background-color: rgba(66, 134, 244, 0.90);}</style> <script>swal("Vaccination Certificate Uploaded!" , "Please wait for the evaluation result of the City Veterinary Office in few business working time" , "success" ).then(()=>{window.location.href="/PetOwner_MyPets";});</script></body></html>`);
		});
	});
});




exports.PetOwner_UploadVaccinationCertificate= router;
