
var express = require('express');
var router = express.Router();
var cm = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);




router.get('/',  (req,res)=>{

  db.query(`SELECT * FROM manufacturer`,(err, results, field) => {
      res.render('CVO-M-Manufacturer/views/view',{re:results});
});
});

router.post('/add', (req, res) => {

	var vaccineManu = req.sanitize(`${req.body.manu_name}`.trim());
	db.query(`INSERT INTO manufacturer(str_Manufacturer) VALUES ("${vaccineManu}")`,(err, fields, results) => {
			res.redirect('/CVO_Manufacturer');
	});

});
router.post('/update', (req, res)=>{
  var manufacturer = req.sanitize(`${req.body.update_manufacturer}`.trim());
  var id= req.body.update_id;
  db.query(`UPDATE manufacturer SET str_Manufacturer="${manufacturer}" WHERE int_ManufacturerId=${id}`,(err)=>{
    res.redirect('/CVO_Manufacturer');
  });
});

cm.post('/',  (req,res)=>{
   var id=req.sanitize(req.body.id.trim());
  console.log(id);
  db.query(`SELECT str_Manufacturer FROM manufacturer WHERE str_Manufacturer="${id}"`,(err,result)=>{
    console.log(result);
    if(result.length==0){
    res.json(0);
    }
    else{
    res.json(1);  
    }
  });
});

exports.CVO_Manufacturer= router;
exports.checkManufacturer= cm;

