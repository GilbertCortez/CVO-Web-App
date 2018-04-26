
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
  db.query(`SELECT * FROM barangay`,(err, results, fields) => {
  
	res.render('CVO-M-Location/views/view.ejs',{re:results});
});
});


router.post('/',  (req,res)=>{
  db.query(`INSERT INTO barangay(str_BarangayName, int_ResettlementArea) VALUES ('${req.body.BarangayName}',${req.body.Resettlement})`,(err, fields, results) => {
	res.redirect('/CVO_Location');
});
});




exports.CVO_Location= router;
