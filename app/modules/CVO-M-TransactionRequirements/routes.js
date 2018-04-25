
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/',  (req,res)=>{
	db.query(`SELECT * FROM requirements JOIN requirementspertransaction 
	WHERE requirements.int_RequirementsId = requirementspertransaction.int_RequirementsId`, (err, results, fields) => {
		if(err){
			console.log(err)
			res.redirect('/CVO_TransactionRequirements')
		}
		else {
			render(results)
		}

	});

	function render(req){
		res.render('CVO-M-TransactionRequirements/views/view',{req:req});
	}
          
});

router.post('/',  (req,res)=>{
	var reqDescription = `${req.body.req_desc}`.trim();
	var reqPurpose = `${req.body.req_purpose}`.trim();
	var reqTransaction = `${req.body.transaction}`;
	db.query(`INSERT INTO requirements(str_Description,str_Purpose,int_EmployeeNo) VALUES ("${reqDescription}","${reqPurpose}",1)`, (err, results, fields) => {
		if (err){
			console.log(err);
			res.redirect('/CVO_TransactionRequirements')
		}
		else {
			db.query(`SELECT int_RequirementsId FROM requirements order by 1 desc limit 1`,(err,currentReqId, fields)=>{
				if (err){
					console.log(err);
				}
				else {
					db.query(`INSERT INTO requirementspertransaction(int_RequirementsId,int_Transaction,int_EmployeeNo) VALUES("${currentReqId[0].int_RequirementsId}","${reqTransaction}",1)`,(err,results,fields)=>{
						res.redirect('/CVO_TransactionRequirements')
					});
				}
			})
		}
	});
			
  });


exports.CVO_TransactionRequirements= router;
