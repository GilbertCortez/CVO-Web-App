
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	db.query(`SELECT *, COUNT(*) as total FROM van v JOIN vancage vc ON v.int_VanId=vc.int_VanId GROUP BY v.int_VanId`,(err, van)=>{
     res.render('CVO-M-Van/views/view.ejs',{van:van});
});
});

router.get('/vancage',  (req,res)=>{
	db.query(`SELECT *, COUNT(*) as total FROM van v JOIN vancage vc ON v.int_VanId=vc.int_VanId GROUP BY v.int_VanId`,(err, van)=>{
     res.render('CVO-M-Van/views/vancage.ejs',{van:van});
});
});

router.post('/add',  (req,res)=>{
	var plateNumber=req.body.plateNumber;
	db.query(`INSERT INTO van(str_PlateNumber) VALUES ('${plateNumber}')`,(err,lastInsertedId)=>{
		var QUERY=""

		for (var i = 0; i < req.body.numberOfCages; i++) {
			QUERY+="INSERT INTO vancage( int_VanId, int_VanCageNumber)  VALUES ("+lastInsertedId.insertId+","+(i+1)+");";
			
			if(i==(req.body.numberOfCages-1)){
				db.query(QUERY,(err,result)=>{console.log(err)
    			res.redirect('/CVO_Van');
   		});
			}
		}
		
		});
});



exports.CVO_Van= router;
