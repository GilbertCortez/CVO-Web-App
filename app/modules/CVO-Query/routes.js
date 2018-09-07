
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/PetOwnerRegistration',  (req,res)=>{
 	var QUERY=`SELECT * FROM petowner po JOIN barangay b ON po.int_BarangayId=b.int_BarangayId`;
 	console.log(req.query)
 	db.query(QUERY,(err,results)=>{
 	db.query('SELECT * FROM barangay', (err, barangay) => {
			res.render('CVO-Query/views/petownerregistration.ejs',{ba:barangay,re:results});
 	});
 });
});





exports.CVO_Query= router;
