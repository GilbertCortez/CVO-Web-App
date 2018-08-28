
var express = require('express');
var router1 = express.Router();
var router2 = express.Router();
var router3 = express.Router();

var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');
//sess.use(authMiddleware.noAuthed);

var munkres = require('munkres-js');

router1.get('/',  (req,res)=>{
 db.query(`SELECT * FROM lodginghistory lh JOIN animal a ON a.int_AnimalId=lh.int_AnimalId  JOIN breed b on a.int_BreedId=b.int_BreedId JOIN colorpattern c ON a.int_ColorPatternId=c.int_ColorPatternId  JOIN cage ca ON lh.int_CageId=ca.int_CageId JOIN impoundingsite imp ON ca.int_ImpoundingSite = imp.int_ImpoundingSiteId JOIN barangay ba ON imp.int_BarangayId=ba.int_BarangayId WHERE  lh.int_LodgingStatus =0 AND a.int_HealthStatus <> 2  AND a.int_AnimalStatus IN (1,5) AND a.int_HealthStatus !=4 AND a.int_AnimalId IN (SELECT int_AnimalId FROM redemptiontransaction WHERE int_RedemptionResult=2);`,(err,forRedemption)=>{
	res.render('CVO-T-AnimalReleasing/views/view.ejs',{fr:forRedemption});
});
});



exports.CVO_AnimalReleasing=router1;


