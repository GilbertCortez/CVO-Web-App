
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);



router.get('/',  (req,res)=>{
    db.query(`SELECT * FROM barangay`, (err,barangay)=>{
        db.query(`SELECT * FROM complaint JOIN barangay on complaint.int_BarangayId = barangay.int_BarangayId`,(err,complaint)=>{
            if(err){
                console.log(err)
            }
            else{
                res.render('CVO-StrayAnimalComplaints/views/view.ejs',
                {   baragay:barangay,
                    complaint:complaint
                });
            }
        });
    });
});

router.post('/add', (req, res)=>{
    var statement = req.sanitize(req.body.statement.trim());
    var location = req.sanitize(req.body.location.trim());
    var barangay = req.body.barangay;
    var datetime = req.body.datetime;
    var complainant = req.sanitize(req.body.complainant.trim());
    var contactnum = req.sanitize(req.body.contactnum.trim());
    
    db.query(`INSERT INTO complaint(str_Statement,int_BarangayId,str_LocationDetails,dtm_DateTimeOfComplaint,str_ComplainantName,str_ContactNumber) VALUES
    ("${statement}",${barangay},"${location}","${datetime}","${complainant}","${contactnum}")`,(err) =>{
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/CVO_StrayAnimalComplaints");
        }
    });
});

router.post('/record',(req,res)=>{
    db.query(`UPDATE complaint SET str_ActionTaken='${req.body.id2}', int_Status=1 WHERE int_ComplaintId=${req.body.id1}`,(err)=>{
        if(err){
            console.log(err)
            res.send('ERROR');
        }
        else{
            res.send('SUCCESS');
        }
    })
})
exports.CVO_StrayAnimalComplaints= router;
