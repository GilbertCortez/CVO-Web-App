
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	db.query(`SELECT * FROM faq`,(err, results, fields) => {
		if (err){
			console.log(err)
			res.redirect('/CVO_FAQs')		
		}
		else {
			res.render('CVO-U-FAQ/views/view',{faqs:results});
		}
	})	
});

router.post('/', (req, res)=>{
	var question = req.sanitize(`${req.body.question}`);
	var answer = req.sanitize(`${req.body.answer}`);

		if (question == "" || answer == "" ){
			console.log("error");
			res.redirect('/CVO_FAQs');
		}
		else {
			db.query(`INSERT INTO faq(str_Question, str_Answer) VALUES ("${question}","${answer}")`,(err,results,fields)=>{
				if (err) {
					console.log(err)
					res.redirect('/CVO_FAQs')
				}
				else {
					res.redirect('/CVO_FAQs')
				}
			});
		}
	
});


exports.CVO_FAQs= router;
