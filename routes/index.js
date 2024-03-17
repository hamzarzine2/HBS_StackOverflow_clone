const express = require('express');
const router = express.Router();
const category = require('../models/Categories'); 
const questions=require ('../models/Questions')

let categoryDisplay=category.list();
let searchDisplay=undefined
let countDisplay=undefined;


router.get('/', function(req, res, next) {
  let question=questions.list();
  if(countDisplay!=undefined && countDisplay.number==0){ //in case there is'nt any question
    let nulMessage='No question found'        
    res.render('index',{category:categoryDisplay,message:nulMessage})
  }
  if(searchDisplay!=undefined){
    question=searchDisplay;     //in order to display all the question 
    searchDisplay=undefined;    //right after a research if the user load back the home page
  }

  res.render('index',{category:categoryDisplay,question:question});
  });


router.get('/search', function(req,res,next){
  if(req.query.search ==""){
    //in order to display the same home page that when we open the page   
    res.redirect('/');
  }
  searchDisplay=questions.search(req.query.search)
  countDisplay=questions.countSearchResult(req.query.search);
  res.redirect('/')
});

router.get('/searchCategories', function(req, res, next) {
  console.log(req.query.id_cat)
  if(req.query.id_cat==undefined){
    searchDisplay=questions.list();
    return res.redirect('/');
  }
  searchDisplay=category.selectCategories(req.query.id_cat);
  res.redirect('/');
});

  module.exports = router;