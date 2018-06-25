
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.post('/',  (req,res)=>{
    db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite}`, (err, allcages, fields) => {
        db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=0`, (err, forimpoundingdogs, fields) => {
            db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=1`, (err, forimpoundingcats, fields) => {
            	db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=2`, (err, fordogsobservation, fields) => {
            		db.query(`SELECT * FROM cage WHERE int_ImpoundingSite = ${req.body.impoundingsite} AND int_CageType=3`, (err, forcatsobservation, fields) => {
	              	 res.render('CVO-M-ImpoundingCage/views/view.ejs',{ AllCages : allcages,  fid: forimpoundingdogs , fic: forimpoundingcats, fdo: fordogsobservation, fco: forcatsobservation});
            	 });
            	});
            });
          });
        });
});





exports.CVO_ImpoundingCage= router;
