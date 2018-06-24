
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);



router.post('/',  (req,res)=>{
	var QUERY='UPDATE natureofcollection SET dec_Amount='+req.body.noc0+' WHERE int_NatureOfCollectionId=0; UPDATE natureofcollection SET dec_Amount='+req.body.noc1+' WHERE int_NatureOfCollectionId=1;UPDATE natureofcollection SET dec_Amount='+req.body.noc2+' WHERE int_NatureOfCollectionId=2; UPDATE natureofcollection SET dec_Amount='+req.body.noc3+' WHERE int_NatureOfCollectionId=3; UPDATE natureofcollection SET dec_Amount='+req.body.noc4+' WHERE int_NatureOfCollectionId=4; UPDATE natureofcollection SET dec_Amount='+req.body.noc5+' WHERE int_NatureOfCollectionId=5; UPDATE natureofcollection SET dec_Amount='+req.body.noc6+' WHERE int_NatureOfCollectionId=6;';
	console.log(QUERY);
	db.query(QUERY, (err)=>{
		console.log(err);
		res.redirect("/CVO_NatureOfCollection");
	});
});



router.get('/',  (req,res)=>{

	db.query("SELECT * FROM NatureOfCollection",(err,results,fields)=>{
		res.render('CVO-M-NatureOfCollection/views/view.ejs', {re:results});
	});

});




exports.CVO_NatureOfCollection= router;
