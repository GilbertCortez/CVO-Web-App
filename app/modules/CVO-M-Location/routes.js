var express = require('express');
var router = express.Router();
var cl = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/', (req, res) => {
    db.query(`SELECT * FROM barangay`, (err, results, fields) => {

        res.render('CVO-M-Location/views/view.ejs', {
            re: results
        });
    });
});


router.post('/add', (req, res) => {
    db.query(`INSERT INTO barangay(str_BarangayName, int_ResettlementArea) VALUES ('${req.body.BarangayName}',${req.body.Resettlement})`, (err, fields, results) => {
        res.redirect('/CVO_Location');
    });
});

router.post('/update', (req, res) => {
    var barangayName= req.sanitize(req.body.name.trim());
    var Resettlement= req.body.modal_resettlementarea_submit;
    db.query(`UPDATE barangay SET str_BarangayName="${barangayName}",int_ResettlementArea=${Resettlement} WHERE int_BarangayId=${req.body.modal_BarangayId} `,(err)=>{
      res.redirect('/CVO_Location');
    });
    
});

cl.post('/', (req, res) => {
    var id = req.sanitize(req.body.id.trim());
    console.log(id);
    db.query(`SELECT * FROM barangay WHERE str_BarangayName="${id}"`, (err, result) => {
        console.log(result);
        if (result.length == 0) {
            res.json(0);
        } else {
            res.json(1);
        }
    });
});

cl.post('/update', (req, res) => {
    var id = req.sanitize(req.body.id.trim());
    console.log(id);
    db.query(`SELECT * FROM barangay WHERE str_BarangayName="${id}" AND int_BarangayId <> ${req.body.id2}`, (err, result) => {
        console.log(result);
        if (result.length == 0) {
            res.json(0);
        } else {
            res.json(1);
        }
    });
});

exports.CVO_Location = router;
exports.checkLocation = cl;