
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{

	db.query(`SELECT * FROM office WHERE int_OfficeId = 1`, (err, results, fields)=>{
		if (err){
			console.log('err')
			res.redirect('/CVO_Office')
		}
		else {
			res.render('CVO-U-Office/views/view',{office:results});
		}
	}); 
});

router.post('/', (req, res) => {
	var officeName = req.sanitize(`${req.body.office_name}`.trim());
	var officeEmail = req.sanitize(`${req.body.office_email}`.trim());
	var officeAddress = req.sanitize(`${req.body.office_address}`.trim());
	var officeNumber = req.sanitize(`${req.body.office_number}`.trim());
	var officeOpen = req.sanitize(`${req.body.office_OpenHour}`);
	var officeClose = req.sanitize(`${req.body.office_CloseHour}`);
	db.query(`UPDATE office SET str_OfficeName = "${officeName}", str_Email = "${officeEmail}",
	 str_ContactNo = "${officeNumber}", str_Address = "${officeAddress}", dtm_OpenHour = "${officeOpen}", 
	 dtm_CloseHour = "${officeClose}" WHERE int_OfficeId=1`, (err, results, fields)=>{
		if (err){
			console.log('err')
			res.redirect('/CVO_Office')
		}
		else {
			res.redirect('/CVO_Office');
		}
	})
});

exports.CVO_Office= router;
