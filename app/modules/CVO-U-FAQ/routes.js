
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

router.post('/add', (req, res)=>{
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

router.post('/update', (req, res) => {

	var id = req.body.modal_id;
	var update_question = req.sanitize(req.body.modal_question.trim());
	var update_answer = req.sanitize(req.body.modal_answer.trim());

	db.query(`UPDATE faq SET str_Question = "${update_question}", str_Answer = "${update_answer}"
	   WHERE int_FAQId = ${id}`, (err) => {
		   if (err){
			   console.log(err);
		   }
		   else {
			   res.redirect('/CVO_FAQs');
		   }
	   });
});

exports.CVO_FAQs= router;

