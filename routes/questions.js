const express = require('express');
const router = express.Router();
const questions = require('../models/Questions'); 
const categories = require('../models/Categories');
const answers = require('../models/Answers');
const { redirect } = require('express/lib/response');


let categoryDisplay=categories.list();

//Open the questionPage for the requested question
router.get('/', function(req, res, next) {
    let id_question=undefined;
    if(req.session.id_question!=undefined){
         id_question=req.session.id_question;
    }else{
         id_question = req.query.id;
    }
    //get the id of the question to show
    //search the question  in the database
    const question = questions.get(id_question);
    console.log(question)
    //const category = categories.getCategorie(question.id_category);
    const is_owner= req.session.user!==undefined && (req.session.user.id_user===question.id_user);
    //If there's an answer marked as right for this question
    if (question.id_right_answer) {
        //search the right answer and all the others answers from the DB
        const rightAnswer = answers.getAnswer(question.id_right_answer);
        const answersList = answers.getQuestionAnswer({id_question: id_question, id_r_answer: question.id_right_answer});
        return res.render('questions/question', {question, rightAnswer, answers: answersList, is_owner});
    }
    //if there's no answer marked as right for this question
    else {
        //search all the answers from the DB
        const answersList = answers.getQuestionAnswer({id_question: id_question, id_r_answer: 0});
        return res.render('questions/question', {question: question, answers: answersList, is_owner});
    }
});


router.get('/createQuestion', function(req, res, next) {
    if(req.session.user==undefined){
        return res.redirect('/users/login')
    }
    if(req.session.error==undefined){ //get the page without a error message
        return res.render('questions/createQuestion',{category:categoryDisplay});
    }else{
        //if the user don't fill all the mandatory fields
        res.render('questions/createQuestion',{category:categoryDisplay,error:req.session.error});
        delete req.session.error; //delete the variable error to make sure that the page load without a error message the next time
    }

});

router.post('/addQuestion', function(req, res, next) {
    if(req.session.user==undefined){ //verification in case the user write the routes in the url even though he is not supposed to be able to get there
        let error= 'you must login first';
        req.session.error = error;
        return res.redirect('/questions/createQuestion');
    }
    //put all the data in a variable
    let tmp={id_user:req.session.user.id_user , title:req.body.title ,subject:req.body.subject,id_category:req.body.id_cat}

    if(tmp.title=='' || tmp.id_category==null|| tmp.subject==''){ //if the user don't fill all the field
        let error= 'you cannot create a new question without filling in all the fields';
        req.session.error = error;
        return res.redirect('/questions/createQuestion');
    }
    if(tmp.title.length<5 || tmp.subject.length<5){
        let error= 'you must have at least 5 caracteres in the subjet and the title';
        req.session.error = error;
        return res.redirect('/questions/createQuestion');
    }
    //add the question
    questions.add(tmp)
    //get the id of the new question in order to mae the redirection
    id_ques=questions.getId(tmp.title)
    req.session.id_question=id_ques.id_question;
    res.redirect('/questions/');
});

//add a new answer to the current question opened by the current user
router.post('/addAnswer', function(req, res, next) {
    const id=req.body.id_question;
    console.log(id);
    if (req.session.user===undefined) {
        req.session.noAccess = "You must be logged in to answer questions!";
        res.redirect('/users/login');
    }
    const data = {subject: req.body.subject, id_question: id, id_user: req.session.user.id_user};
    answers.addAnswer(data);
    res.redirect("/questions?id="+id);
});

router.get('/reportQuestion', function (req, res, next) {
    questions.reportQuestion(req.query.id);
    res.redirect("/questions?id="+req.query.id);
});

router.get('/removeQuestion', function(req, res, next) {
    questions.deleteRightAnswer(req.query.question);
    //delete the answers with the question
    answers.deleteAllQuestionAnswers(req.query.question);
    questions.deleteQuestion(req.query.question);
    res.redirect('/users/adminPage');
});

router.get('/allowQuestion', function(req, res, next) {
    questions.allowQuestion(req.query.question);
    res.redirect('/users/adminPage');

});

router.get('/reportAnswer', function (req, res, next) {
    answers.reportAnswer(req.query.id_answer);
    res.redirect("/questions?id="+req.query.id_question);
});

router.get('/removeAnswer', function(req, res, next) {
    const answer = answers.getAnswer(req.query.answer);
    const question = questions.get(answer.id_question);
    if (answer.id_answer===question.id_right_answer) {
        questions.deleteRightAnswer(question.id_question);
    }
    answers.deleteAnswer(answer.id_answer);
    res.redirect('/users/adminPage');

});

router.get('/allowAnswer', function(req, res, next) {
    answers.allowAnswer(req.query.answer);
    res.redirect('/users/adminPage');
});

router.get('/setRightAnswer', function (req, res, next) {
    const id_answer = req.query.id;
    const id_question = req.query.id_question;
    questions.setRightAnswer({id_answer, id_question});
    res.redirect("/questions?id="+id_question);
});

module.exports = router;