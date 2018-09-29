
var express = require('express');
var router = express.Router();
var cm = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);




router.get('/',  (req,res)=>{

  db.query(`SELECT * FROM manufacturer`,(err, results, field) => {
    db.query(`SELECT DISTINCT int_ManufacturerId FROM vaccine`,(err,usedManufacturer)=>{ 
      res.render('CVO-M-Manufacturer/views/view',{re:results,usedManufacturer:usedManufacturer});
    });
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

router.post('/delete', (req, res)=>{
  console.log(req.body.id)
  db.query(`DELETE FROM manufacturer WHERE int_ManufacturerId = ${req.body.id}`,(err)=>{
    console.log(err)
  })
});

router.post('/updateStatus', (req, res)=>{
  db.query('UPDATE manufacturer SET int_Status='+req.body.status+' WHERE int_ManufacturerId='+req.body.id,(err)=>{
    console.log(err)
    if(err){
      res.send("ERROR")
    }
    else{
      res.send("SUCCESS")
    }
  })
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

cm.post('/update',  (req,res)=>{
   var id=req.sanitize(req.body.id.trim());
  console.log(id);
  db.query(`SELECT str_Manufacturer FROM manufacturer WHERE str_Manufacturer="${id}" AND int_ManufacturerId <> ${req.body.id2}`,(err,result)=>{
    console.log(`SELECT str_Manufacturer FROM manufacturer WHERE str_Manufacturer="${id}" AND int_ManufacturerId <> ${req.body.id2}`);
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

