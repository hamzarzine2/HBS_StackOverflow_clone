const db = require('../models/db_conf.js');

module.exports.list = () =>  db.prepare("SELECT * FROM users").all();


module.exports.getUser = (email) => db.prepare("SELECT * FROM users WHERE email=?").get(email);


module.exports.save = (data) => {
    const stm = db.prepare('INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)');
    return stm.run(data.firstname, data.lastname, data.email, data.password);
}