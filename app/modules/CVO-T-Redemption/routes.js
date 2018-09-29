var express = require('express');
var router = express.Router();
var router1 = express.Router();
var router2 = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);


router.get('/', (req, res) => {

    db.query(`SELECT int_RedemptionTransactionId,int_PetOwnerId AS ownerId, int_OwnerStatus, concat(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName) AS ownerName,dtm_DateTimeOfRedemption, int_RedemptionResult FROM redemptiontransaction  rt JOIN petowner po ON rt.int_OwnerId=po.int_PetOwnerId WHERE   int_RedemptionResult in (2,3) AND int_OwnerStatus=0  UNION  SELECT int_RedemptionTransactionId,int_NonCitizenId AS ownerId, int_OwnerStatus, concat(str_LastName,", ",str_FirstName," ",str_MiddleName) AS ownerName,dtm_DateTimeOfRedemption,int_RedemptionResult FROM redemptiontransaction rt JOIN noncitizen nc ON rt.int_OwnerId=nc.int_NonCitizenId WHERE   int_RedemptionResult in (2,3) AND int_OwnerStatus=1`, (err, redemptionTransaction) => {
           db.query(`SELECT int_RedemptionTransactionId, int_PetOwnerId AS ownerId,int_OwnerStatus, concat(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName) AS ownerName,dtm_DateTimeOfRedemption, int_RedemptionResult FROM redemptiontransaction  rt JOIN petowner po ON rt.int_OwnerId=po.int_PetOwnerId WHERE   int_RedemptionResult=2 AND int_OwnerStatus=0  UNION  SELECT int_RedemptionTransactionId, int_NonCitizenId AS ownerId, int_OwnerStatus, concat(str_LastName,", ",str_FirstName," ",str_MiddleName) AS ownerName,dtm_DateTimeOfRedemption,int_RedemptionResult FROM redemptiontransaction rt JOIN noncitizen nc ON rt.int_OwnerId=nc.int_NonCitizenId WHERE   int_RedemptionResult =2 AND int_OwnerStatus=1`, (err, fv) => {
                db.query(`SELECT int_RedemptionTransactionId, int_PetOwnerId AS ownerId,int_OwnerStatus, concat(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName) AS ownerName,dtm_DateTimeOfRedemption, int_RedemptionResult FROM redemptiontransaction  rt JOIN petowner po ON rt.int_OwnerId=po.int_PetOwnerId WHERE   int_RedemptionResult=3 AND int_OwnerStatus=0  UNION  SELECT int_RedemptionTransactionId, int_NonCitizenId AS ownerId, int_OwnerStatus, concat(str_LastName,", ",str_FirstName," ",str_MiddleName) AS ownerName,dtm_DateTimeOfRedemption,int_RedemptionResult FROM redemptiontransaction rt JOIN noncitizen nc ON rt.int_OwnerId=nc.int_NonCitizenId WHERE   int_RedemptionResult=3 AND int_OwnerStatus=1`, (err, fi) => {
        db.query(`SELECT * FROM petowner JOIN barangay ON petowner.int_BarangayId=barangay.int_BarangayId WHERE petowner.int_status = 1`, (err, petowners) => {
     
            db.query(`SELECT * FROM noncitizen`, (err, noncitizen) => {
                res.render('CVO-T-Redemption/views/view.ejs', {
                    po: petowners,
                    rt: redemptionTransaction,
                    nc: noncitizen,
                    fv:fv,
                    fi:fi
                });
            });
                        });
                    });
        });
    });

});
router.post('/getPetOwnerDetailsAndItsPets', (req, res) => {
    console.log(req.body.id)
    db.query(`SELECT * FROM pet p JOIN animal a ON p.int_AnimalId = a.int_AnimalId JOIN breed b ON a.int_BreedId=b.int_BreedId JOIN colorpattern cp ON a.int_ColorPatternId=cp.int_ColorPatternId WHERE p.int_PetOwnerId= ${req.body.id}`, (err, pets) => {
        db.query(`CALL SelectPetOwnerDetails(${req.body.id})`, (err, petOwner) => {
            res.send({
                po: petOwner[0],
                pets: pets
            })

        })
    })
});
router.post('/New/getPetDetails', (req, res) => {
    console.log(req.body.id)

    db.query(`CALL SelectPetDetails(${req.body.id})`, (err, petDetails) => {
        console.log(petDetails)
        db.query(`SELECT * FROM(
 		(SELECT lh.int_AnimalId, lh.int_CageId, lh.dtm_DateTimeOfOccurence, b.str_BreedName,b.int_AnimalSpecies, a.int_Sex, cp.str_Description, a.str_AnimalPicturePath, a.int_AnimalStatus, a.int_HealthStatus, aa.int_BarangayId, aa.str_PetTagNo, aa.str_Alias FROM lodginghistory lh JOIN animal a ON lh.int_AnimalId=a.int_AnimalId JOIN apprehendedanimal aa ON a.int_AnimalId= aa.int_AnimalId JOIN breed b ON a.int_BreedId= b.int_BreedId JOIN colorpattern cp ON a.int_ColorPatternId=cp.int_ColorPatternId   WHERE lh.int_lodgingStatus=0) 
 		UNION 
 		(SELECT lh.int_AnimalId, lh.int_CageId, lh.dtm_DateTimeOfOccurence, b.str_BreedName,b.int_AnimalSpecies, a.int_Sex, cp.str_Description, a.str_AnimalPicturePath, a.int_AnimalStatus, a.int_HealthStatus, sa.int_Barangay, sa.str_PetTagNo ,sa.str_Alias FROM lodginghistory lh JOIN animal a ON lh.int_AnimalId=a.int_AnimalId JOIN surrenderedanimal sa ON a.int_AnimalId= sa.int_AnimalId JOIN breed b ON a.int_BreedId= b.int_BreedId JOIN colorpattern cp ON a.int_ColorPatternId=cp.int_ColorPatternId    WHERE lh.int_lodgingStatus=0 ) ) as ImpoundedAnimals WHERE str_PetTagNo="${petDetails[0][0].str_PetTagNo}";`, (err, impoundedAnimal) => {
            if (impoundedAnimal.length == 0) {
                res.send("NONE");
            } else {
                res.send({
                    impoundedAnimal: impoundedAnimal,
                    petDetails: petDetails[0]
                });
            }

        })
    })
});

router.get('/OrderOfVisitation',  (req,res)=>{
        db.query(`INSERT INTO redemptiontransaction( int_OwnerId, int_OwnerStatus,dtm_DateTimeOfRedemption,int_RedemptionResult) 
            VALUES (${req.query.ownerId},${req.query.ownerType},now(),2)`,(err)=>{  console.log(err)
         if(req.query.ownerType==0){
            db.query(`SELECT *, concat(str_PetOwnerLastName,", ",str_PetOwnerFirstName," ",str_PetOwnerMiddleName) AS ownerName FROM petowner WHERE int_PetOwnerId=${req.query.ownerId}`,(err,petOwnerDetails)=>{ console.log(petOwnerDetails)
                db.query(`SELECT * FROM office`, (err, officeDetails) => {
                    res.render('CVO-T-Redemption/views/OrderOfVisitation.ejs', {
                        owner: petOwnerDetails,
                        od: officeDetails,
                        empName: "Gilbert Critica Cortez",
                        ownerType: "PET OWNER"
                    });
                });            
            });
        }
        else if(req.query.ownerType==1){
             db.query(`SELECT *,concat(str_LastName,", ",str_FirstName," ",str_MiddleName) AS ownerName FROM noncitizen WHERE int_NonCitizenId=${req.query.ownerId}`,(err,noncitizen)=>{ 
            db.query(`SELECT * FROM office`, (err, officeDetails) => {
                    res.render('CVO-T-Redemption/views/OrderOfVisitation.ejs', {
                        owner: noncitizen,
                        od: officeDetails,
                        empName: "Gilbert Critica Cortez",
                        ownerType: "NON CITIZEN"
                    });
                });  
        });
        }
          });
});


router.get('/Interview',(req,res)=>{
    //get PET OWNER details
    //get PET details
    console.log(req.query)
    res.render('CVO-T-Redemption/views/Interview.ejs',{transId:req.query.TransactionId,ownerId:req.query.ownerId,ownerType:req.query.ownerType});
});

router.post('/Interview',(req,res)=>{
    db.query(`UPDATE redemptiontransaction SET dtm_DateTimeAnimalLost='${req.body.datetimelost}',str_Reason='${req.body.reason}',str_InterviewRemarks='${req.body.interviewremarks}',int_RedemptionResult=${req.body.interviewresult} WHERE int_RedemptionTransactionId=${req.body.transactionId}`,(err)=>{
         db.query(`SELECT int_AnimalId FROM redemptiontransaction WHERE int_RedemptionTransactionId=${req.body.transactionId}`,(err,animalInvolved)=>{
            if(req.body.interviewresult==1){
                 db.query(`INSERT INTO payment(int_PayorId, int_PayorType, int_Status) VALUES (${req.body.ownerId},${(req.body.ownerType==0?'3':'4')},0)`, (err, lastPayment) => { console.log(lastPayment.insertId)
                    db.query(`INSERT INTO breakdown( int_PaymentId,int_AnimalInvolved, int_NatureOfCollectionId) VALUES( ${lastPayment.insertId},${animalInvolved[0].int_AnimalId},3)`, (err, results) => {
                        if(req.body.ownerType==0){
                            db.query(`SELECT *, concat(po.str_PetOwnerLastName,", ",po.str_PetOwnerFirstName," ",po.str_PetOwnerMiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN petowner po ON p.int_PayorId = po.int_PetOwnerId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${lastPayment.insertId}`,(err,breakdown)=>{
                                db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                                    res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:breakdown[0].str_PayorName});
                                });
                            });
                        }
                        else if(req.body.ownerType==1){
                            db.query(`SELECT *, concat(nc.str_LastName,", ",nc.str_FirstName," ",nc.str_MiddleName) AS str_PayorName FROM payment p JOIN breakdown b ON p.int_PaymentId=b.int_PaymentId JOIN noncitizen nc ON p.int_PayorId = nc.int_NonCitizenId JOIN natureofcollection n ON b.int_NatureOfCollectionId=n.int_NatureOfCollectionId WHERE p.int_PaymentId=${lastPayment.insertId}`,(err,breakdown)=>{ console.log(err)
                                db.query(`SELECT * FROM office`,(err,officeDetails)=>{
                                    res.render('CVO-T-RecordCollection/views/OrderOfPayment_DOWNLOAD.ejs',{br:breakdown,od:officeDetails,empName: "Gilbert Critica Cortez", payor:breakdown[0].str_PayorName});
                                });
                            });
                        }
                
            });
        });
            }
            else{
                res.redirect("/CVO_Redemption");
            }
        });
        });
        
    });






exports.CVO_Redemption = router;
