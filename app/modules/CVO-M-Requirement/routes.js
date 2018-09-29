var express = require('express');
var router = express.Router();
var cr = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/', (req, res) => {
    db.query(`SELECT * FROM requirements`, (err, results, fields) => {
        db.query(`SELECT DISTINCT int_RequirementsId FROM requirementspertransaction`,(err,usedRequirements)=>{ 
        res.render('CVO-M-Requirement/views/view', {req: results,usedRequirements:usedRequirements});
    }); 
});
});

router.post('/add', (req, res) => {

      var reqDes = req.body.req_desc;
    var purpose = req.body.req_purpose;
    db.query(`INSERT INTO requirements(str_Description, str_Purpose) VALUES ("${reqDes}","${purpose}")`, (err) => {
        res.redirect("/CVO_Requirement");
    });

});

router.post('/update', (req, res) => {


    var reqDes = req.body.Req_Desc;
    var purpose = req.body.Req_Purpose;
    db.query(`UPDATE requirements SET str_Description="${reqDes}",str_Purpose="${purpose}" WHERE int_RequirementsId=${req.body.Req_Id} `, (err) => {
        res.redirect("/CVO_Requirement");
    });

});

router.post('/delete', (req, res)=>{
    console.log(req.body.id)
    db.query(`DELETE FROM requirements WHERE int_RequirementsId = ${req.body.id}`,(err)=>{
        console.log(err)
    })
});



cr.post('/', (req, res) => {
    var id = req.sanitize(req.body.id.trim());
    console.log(id);
    db.query(`SELECT str_Description FROM requirements WHERE str_Description="${id}"`, (err, result) => {
        console.log(result);
        if (result.length == 0) {
            res.json(0);
        } else {
            res.json(1);
        }
    });
});

cr.post('/update', (req, res) => {
    var id = req.sanitize(req.body.id.trim());

    db.query(`SELECT str_Description FROM requirements WHERE str_Description="${id}" AND int_RequirementsId <> ${req.body.id2}`, (err, result) => {
    
        if (result.length == 0) {
            res.json(0);
        } else {
            res.json(1);
        }
    });
});

router.post('/updateStatus', (req, res)=>{
    db.query('UPDATE requirements SET int_Status='+req.body.status+' WHERE int_RequirementsId='+req.body.id,(err)=>{
        if(err){
            res.send("ERROR")
        }
        else{
            res.send("SUCCESS")
        }
    })
});

exports.CVO_Requirement = router;
exports.checkRequirements = cr; 

