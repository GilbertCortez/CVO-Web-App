var express = require('express');
var router = express.Router();
var cb = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

router.get('/',  (req,res)=>{


 db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE petowner.int_status = 1`, (err, petowners) => {
     
            db.query(`SELECT * FROM noncitizen`, (err, noncitizen) => {
                res.render('CVO-TransferOfPetOwnership/views/view.ejs', {
                    po: petowners,
                   
                    nc: noncitizen
                  		
                });
            });
          });
        });

router.get('/transferForm', (req,res)=>{
		 res.render('CVO-TransferOfPetOwnership/views/transferForm.ejs',{trans:req.query});
});

router.post('/transferForm', (req,res)=>{
		 console.log(req.body)
		 db.query(`INSERT INTO transferofpetownership( int_PetId, int_TransferFrom, int_TranferTo, int_TranferToType, str_Reason, dtm_DateTimeOfTransfer, int_TransferStatus, int_EmployeeId) VALUES 
		 	(${req.body.pet},${req.body.transferFrom},${req.body.transferTo},${req.body.transferToType},'${req.body.reason}','${req.body.datetimeoftransfer}',0,1)`,(err)=>{
		 		 
                 db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${req.body.transferTo},${(req.body.transferToType==0?'5':'6')},0)`, (err, lastPayment) => { console.log(lastPayment.insertId)
                    db.query(`INSERT INTO breakdown( int_PaymentId,int_AnimalInvolved, int_NatureOfCollectionId) VALUES( ${lastPayment.insertId},${req.body.pet},8)`, (err, results) => {
                        if(req.body.transferToType==0){
                            db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${lastPayment.insertId}`,(err,breakdown)=>{console.log(breakdown)
                                db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                                    res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:breakdown[0].str_PayorName});
                                });
                            });
                        }
                        else if(req.body.transferToType==1){
                            db.query(`SELECT *, concat(nc.str_LastName,", ",nc.str_FirstName," ",nc.str_MiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN noncitizen nc ON p.int_PayorId = nc.int_NonCitizenId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${lastPayment.insertId}`,(err,breakdown)=>{ console.log(breakdown)
                                db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                                    res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:breakdown[0].str_PayorName});
                                });
                            });
                        }
                
            });
        });
            });
           
		 });


  

exports.CVO_TransferOfPetOwnership= router;
