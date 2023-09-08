/*
Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin num : 2220327
*/

var mysql = require('mysql');
var dbconnect = {
    getConnection: ()=> {
        var conn = mysql.createConnection({
            host: "localhost",
            user: "bed_dvd_root",
            password: "pa$$woRD123",
            database: "bed_dvd_db",
        });     
        return conn;
    }
};
module.exports = dbconnect;
