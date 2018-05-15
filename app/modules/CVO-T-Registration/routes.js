
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{

	res.render('CVO-T-Registration/views/view.ejs');

});

router1.get('/',  (req,res)=>{
  db.query('SELECT * FROM barangay',(err,barangay)=>{
	res.render('CVO-T-Registration/views/ownerregistration.ejs',{ba:barangay});
});
});

router2.get('/',  (req,res)=>{
  db.query('SELECT * FROM breed',(err,breed) =>{
    db.query('SELECT * FROM colorpattern',(err,colorpattern)=>{
        res.render('CVO-T-Registration/views/petregistration.ejs', { br: breed, co: colorpattern});
    });
  });


});



exports.CVO_Registration= router;
exports.CVO_OwnerRegistration= router1;
exports.CVO_PetRegistration= router2;
