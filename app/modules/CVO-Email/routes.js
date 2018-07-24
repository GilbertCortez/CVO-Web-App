
var express = require('express');
var router = express.Router();
var authMiddleware = require('../../core/auth');
var db = require('../../lib/database')();
// router.use(authMiddleware.noAuthed);

//FOR SENDING EMAIL USING NODEMAILER
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

router.get('/',  (req,res)=>{

     res.render('CVO-Email/views/view.ejs');

});



exports.CVO_Email= router;
