var express = require('express');
var router = express.Router();
var cb = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

router.get('/',  (req,res)=>{
 db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE petowner.int_status = 1`, (err, petowners) => { console.log(err)
                res.render('CVO-TransferOfPetOwnership/views/view.ejs', {
                    po: petowners
                
                });
           });
        });

  

exports.CVO_TransferOfPetOwnership= router;
