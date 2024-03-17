const db=require('../models/db_conf.js');


module.exports.getUserAnswer=(id_user)=> db.prepare("SELECT * FROM answers WHERE id_user = ?").all (id_user)

module.exports.reportedAnswer=() => db.prepare("Select * FROM answers WHERE is_reported=1").all()

module.exports.getAnswer=(id_answer)=>db.prepare('SELECT * FROM answers WHERE id_answer=?').get(id_answer);

//data contains id_question and id_right_answer
module.exports.getQuestionAnswer=(data)=>{
  const stm = db.prepare('SELECT * FROM answers WHERE id_question=? AND id_answer!=? ORDER BY date_answer');
  return stm.all(data.id_question, data.id_r_answer);
}

//data contains id_question and id_subject and id_user
module.exports.addAnswer=(data)=>{
  const stm = db.prepare('INSERT INTO answers (subject, id_question, id_user) VALUES (?, ?, ?)');
  return stm.run(data.subject, data.id_question, data.id_user);
}

module.exports.reportAnswer = (id_answer) => db.prepare("UPDATE answers SET is_reported=1 WHERE id_answer=?").run(id_answer);

module.exports.deleteAnswer=(id_answer) => db.prepare("DELETE FROM answers WHERE id_answer=?").run(id_answer);

module.exports.allowAnswer=(id_answer) => db.prepare("UPDATE answers SET is_reported=0 WHERE id_answer=?").run(id_answer);

module.exports.deleteAllQuestionAnswers=(id_question) => db.prepare("DELETE FROM answers WHERE id_question=?").run(id_question);