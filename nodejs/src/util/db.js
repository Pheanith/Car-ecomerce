const mysql = require("mysql")
const util = require("util")

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"demodb",
    port:"3306"
})

db.query = util.promisify(db.query).bind(db); //alow use asycn await

module.exports = db;