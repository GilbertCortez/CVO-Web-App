
var express = require('express');
var router = express.Router();
var router1 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
var sortJsonArray = require('sort-json-array');//FOR SORTING JSON
// router.use(authMiddleware.noAuthed);



router.get('/',  (req,res)=>{
  db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId WHERE p.int_PayorType=0 AND p.int_Status=0`,(err,registration)=>{
    //query for adoption payments
    //query for redemption payments
    //  console.log(sortJsonArray(o1.concat(o2.concat(o3)),'name','asc')   ); FOR MERGING AND SORTING SAMPLE TAPOS IPASA SA FRONT END
    var adoption={};
    var redemption={};
    var unpaid=sortJsonArray(registration,'int_PaymentId','des');

    res.render('CVO-T-RecordCollection/views/view.ejs',{un:unpaid} );
  });


});




router1.post('/',  (req,res)=>{
  db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${req.body.id}`,(err,result)=>{
    res.json(result);
  });
});



exports.CVO_RecordCollection= router;
exports.CVO_PaymentBreakdown= router1;
