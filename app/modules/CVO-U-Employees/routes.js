
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);
var nodemailer = require('nodemailer');


let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth:{
    user: 'gilbert230709@gmail.com',
    pass: 'Aeccestane23'
  },
  tls: {
    rejectUnauthorized: false
  }
});


var multer  = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../images' )
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg")
  }
})

var upload = multer({ storage: storage })



router.get('/',  (req,res)=>{
  db.query(`SELECT * FROM employee`,(err,result,fields)=> {
     res.render('CVO-U-Employees/views/view.ejs',{re: result});
  });
});

router.post('/', upload.any(),  (req,res)=>{
  var FirstName= req.body.FName;
  var MiddleName= req.body.MName;
  var LastName= req.body.LName;
  var EmployeeType= req.body.EmployeeType;
  var Email= req.body.Email;
  var Password= "EMP"+EmployeeType+FirstName[0]+LastName[1]+FirstName[1]+LastName[0];
  var IdPicturePath= "../images/"+req.files[0].filename;

  db.query(`INSERT INTO employee
  (str_FirstName, str_MiddleName, str_LastName, int_EmployeeType, str_Email, str_Password, str_IdPicturePath, int_Status, dat_DateAdded)
   VALUES ( '${FirstName}','${MiddleName}','${LastName}','${EmployeeType}','${Email}', '${Password}','${IdPicturePath}',1,now() )`,(err,result,fields) =>{
     if(err){
       console.log(err);
     }

     let HelperOptions = {
       from: '"City Veterenary Office-Marikina" <gilbert230709@gmail.com',
       to: 'gilbert230709@gmail.com',
       subject: 'Employee Password',
       text:`Good day Sir/Ma'am `+LastName+`, `+FirstName+` `+MiddleName+`! Your password is: `+Password
     };
     transporter.sendMail(HelperOptions, (err,info)=>{
       if(err){
         return console.log(err);
       }
       res.redirect("/CVO_Employees");
     });

});
});





exports.CVO_Employees= router;
