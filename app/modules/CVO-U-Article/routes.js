
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images/' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg")
  }
})

var upload = multer({ storage: storage })

router.get('/', (req, res) => {
	db.query(`SELECT * FROM learn`, (err,results,fields) => {
		if (err){
			console.log(err)
		}
		else {
			res.render('CVO-U-Article/views/view', {re:results});
		}
	});
});

router.post('/', upload.any(), (req, res) => {
	var topic = req.sanitize(req.body.topic);
	var content = req.sanitize(req.body.content);
	var imagepath = "/"+req.files[0].filename;

	db.query(`INSERT INTO learn(str_Topic, str_Content, str_ImagePath, dtm_DateTimePosted, int_Status) VALUES ('${topic}', '${content}', '${imagepath}', now(), '1')`, (err, results, fields) => {
			if (err) {
				console.log(err)	
			}
			else {
				res.redirect('/CVO_Article');
			}
		});
});


exports.CVO_Article= router;