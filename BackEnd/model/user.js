/* Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin num : 2220327 */

var db = require('./databaseConfig.js');
var config = require('../config.js');
var jwt = require('jsonwebtoken');

var userDB = {
	getUser: function (staff_id, callback) {

		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("***Connected!");

				var sql = `SELECT staffid,email,username FROM staff WHERE staff_id = ?`;


				conn.query(sql, [staff_id], function (err, result) {
					conn.end();
					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				});
			}
		});
	},

	loginAdmin: function (email, password, callback) {

        var conn = db.getConnection();

        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log("Connected!");

                var sql = 'select * from staff where email=? and password=?';

                conn.query(sql, [email, password], function (err, result) {
                    conn.end();

                    if (err) {
                        console.log("Err: " + err);
                        return callback(err, null, null);
                    } else {
                        var token = "";
                        var i;
                        if (result.length == 1) {

                            token = jwt.sign({ id: result[0].staff_id }, config.key, {
                                expiresIn: 86400 //expires in 24 hrs
                            });
                            console.log("@@token " + token);
                            return callback(null, token, result);


                        } else {
                            var err2 = new Error("Email/Password does not match.");
                            err2.statusCode = 500;
                            return callback(err2, null, null);
                        }
                    }  //else
                });
            }
		});
	},

	updateUser: function (username, email, role, callback) {

		var conn = db.getConnection();

		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			} else {
				console.log("Connected!");

				var sql = "UPDATE user SET username=?, role=? WHERE email=?";

				conn.query(sql, [username, role, email], function (err, result) {
					conn.end();

					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						console.log("No. of records updated successfully: " + result.affectedRows);
						return callback(null, result.affectedRows);
					}
				})
			}
		})
	},

	addUser: function (username, email, role, password, pic, callback) {

		var conn = db.getConnection();

		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			} else {

				console.log("Connected!");
				sqlStr = "Insert into user(username,email,role,password,pic) values(?,?,?,?,?)";
				conn.query(sqlStr, [username, email, role, password, pic], function (err, result) {
					conn.end();

					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				});

			}
		});
	},

	getUsers: function (callback) {

		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("***Connected!");

				var sql = 'SELECT userid,username,email FROM user ';
				conn.query(sql, [], function (err, result) {
					conn.end();
					if (err) {
						console.log(err);
						return callback(err, null);
					} else {
						return callback(null, result);
					}
				});
			}
		});
	}

};

module.exports = userDB;