var express = require('express');
var router = express.Router();
var cr = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/', (req, res) => {
    db.query(`SELECT * FROM requirements`, (err, results, fields) => {
        res.render('CVO-M-Requirement/views/view', {req: results});
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


exports.CVO_Requirement = router;
exports.checkRequirements = cr; 

