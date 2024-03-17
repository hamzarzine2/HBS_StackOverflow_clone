const express = require('express');
const router = express.Router();
const questions=require ('../models/Questions')
const answers=require ('../models/Answers')
const User=require ('../models/User');
const bcrypt=require('bcrypt');
const saltRound=10;

let question=null;
let answer=null;

router.get('/userOpenQuestion', function(req, res, next) {
  if(req.session.user==undefined){
    req.session.noAccess='you have no acces to this fonction without login'
    return res.redirect('/users/login')
  }
  question=questions.openQuestion(req.session.user.id_user)
  res.render('users/userPage',{display:question});
});

router.get('/userClosedQuestion', function(req, res, next) {
  question=questions.resolvedQuestion(req.session.user.id_user)
  res.render('users/userPage',{display:question})
});

router.get('/login', function(req, res, next) {
  if(req.session.noAccess) {
    res.render('users/login',{error: req.session.noAccess});
    delete req.session.noAccess
  }
  else {
    res.render('users/login');
  }
});

router.post('/login', function(req, res, next) {
  const email=req.body.email;
  if (email.length==0 || req.body.password.length==0) {
    req.session.noAccess="You must complete all the fields above";
    res.redirect('login');
  }
  const user = User.getUser(email);
  if (!user) {
    req.session.noAccess="No user matching to this email";
  }
  else if ((!bcrypt.compareSync(req.body.password,user.password))) {
    req.session.noAccess="Wrong password or email";
  }
  if (req.session.noAccess) {
    res.redirect('login');
  }
  else {
    req.session.user = user;
    req.session.isConnected  = true;
    res.locals.session=req.session; //for the option display in the header
    req.session.isAdmin=user.is_admin;
    res.redirect('/');
  }
});

router.get('/register', function(req, res, next) {
  if (req.session.errorRegister) {
    res.render('users/register', {error: req.session.errorRegister});
    delete req.session.errorRegister;
  } else {
    res.render('users/register')
  }
});

router.post('/register', function(req, res, next) {
  const regex = `${req.body.firstname}\.${req.body.lastname}@(student\.)?vinci\.be`;
  if (!new RegExp(regex, "g").test(req.body.email)) {
    req.session.errorRegister="Invalid email";
    res.redirect('register');
  }
  else if (User.getUser(req.body.email)) {
    req.session.errorRegister="this email is already used";
    res.redirect('register');
  } else {
    User.save({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRound)
    });
    req.session.user = User.getUser(req.body.email);
    req.session.isConnected  = true;
    res.locals.session=req.session; //for the option display in the header
    req.session.isAdmin=false;
    res.redirect('/');
  }
});

router.get('/adminPage', function(req, res, next) {
  if(req.session.user==undefined){
    req.session.noAccess='you have no acces to this fonction without login'
    return res.redirect('/users/login')
  }
  question=questions.reportedQuestion( );
  answer=answers.reportedAnswer();
  res.render('adminPage',{reportedQuestion:question,reportedAnswer:answer})
});

router.get('/logout', function(req, res, next) {
  req.session.destroy( );
  res.redirect('/')
});

module.exports = router; 
