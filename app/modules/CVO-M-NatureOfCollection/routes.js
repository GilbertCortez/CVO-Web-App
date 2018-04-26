
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);



router.post('/',  (req,res)=>{

	db.query(`UPDATE  natureofcollection  SET  dec_OwnerRegistrationFee =${req.body.owner}, dec_PetRegistrationFee =${req.body.pet}, dec_RedemptionFirstPenalty =${req.body.redemption1}, dec_RedemptionSecondPenalty =${req.body.redemption2}, dec_RedemptionThirdPenalty =${req.body.redemption3}, dec_AdoptionFee =${req.body.adoption} WHERE int_NatureOfCollectionID=1`,(err,results,fields)=>{
		if(err){
			console.log(err);
		}
		res.redirect('/CVO_NatureOfCollection');
	});
});



router.get('/',  (req,res)=>{

	db.query("SELECT * FROM NatureOfCollection",(err,results,fields)=>{
		console.log(results[0].dec_OwnerRegistrationFee);
		res.render('CVO-M-NatureOfCollection/views/view.ejs', {re:results});
	});

});




exports.CVO_NatureOfCollection= router;
