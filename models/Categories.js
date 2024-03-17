const db=require('../models/db_conf.js');

module.exports.list = () =>db.prepare("SELECT * FROM categories").all();

module.exports.selectCategories = (id_category) => db.prepare("SELECT * FROM questions WHERE id_category=? ORDER BY date_question DESC LIMIT 20  ").all(id_category);

module.exports.getCategorie = (id_category) => db.prepare("SELECT * FROM categories WHERE id_category=?").get(id_category);
