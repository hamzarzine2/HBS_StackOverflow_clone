const db=require('../models/db_conf.js');

module.exports.list = () => db.prepare("SELECT * FROM questions WHERE id_right_answer IS NULL ORDER BY date_question DESC LIMIT 20").all();


module.exports.openQuestion = (id_user) => db.prepare("SELECT * FROM questions WHERE id_right_answer IS NULL AND id_user=? ORDER BY date_question DESC LIMIT 20").all(id_user);

module.exports.resolvedQuestion = (id_user) => db.prepare("SELECT * FROM questions WHERE id_right_answer IS NOT NULL AND id_user=?  ORDER BY date_question DESC LIMIT 20").all(id_user);

module.exports.search =(title) => {
    const  stm = db.prepare(" SELECT * FROM questions WHERE lower(title) LIKE lower(?)  ORDER BY date_question DESC LIMIT 20 ");
    return stm.all('%' + title.toLowerCase() + '%');
}

module.exports.get=(id_question) => db.prepare("SELECT q.*, c.name AS \"category\" FROM questions q, categories c WHERE q.id_question=? AND c.id_category=q.id_category").get(id_question);

module.exports.getId=(title) => db.prepare("SELECT id_question FROM questions WHERE lower(title) LIKE lower(?)").get(title);

module.exports.add=(data)=>{
    // a changer quand fini connection user, mettre le id_user grace a une variable de session 
    const  stm = db.prepare("INSERT INTO questions (id_user,title,subject,id_category) VALUES (?,?,?,?) ");
    return stm.run(data.id_user,data.title,data.subject,data.id_category);
}



module.exports.countSearchResult=(title)=>{
    const  stm = db.prepare("SELECT COUNT(*) AS number FROM questions WHERE lower(title) LIKE ?");
    return stm.get('%' + title.toLowerCase() + '%');
}

module.exports.reportQuestion=(id_question) => db.prepare("UPDATE questions SET is_reported=1 WHERE id_question=?").run(id_question);

module.exports.reportedQuestion=() => db.prepare("Select * FROM questions WHERE is_reported=1").all();

module.exports.deleteQuestion=(id_question) => db.prepare("DELETE FROM questions WHERE id_question =?").run(id_question);

module.exports.allowQuestion=(id_question) => db.prepare("UPDATE questions SET is_reported=0 WHERE id_question=?").run(id_question);

//data contains id_answer, id_question
module.exports.setRightAnswer=(data) => {
    const stm =db.prepare("UPDATE questions SET id_right_answer=? WHERE id_question=?");
    return stm.run(data.id_answer, data.id_question);
}

module.exports.deleteRightAnswer=(id_question) => db.prepare("UPDATE questions SET id_right_answer=null WHERE id_question=?").run(id_question);
