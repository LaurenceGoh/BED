/*
Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin no : 2220327
*/

// Require databaseconfig file to connect to mysql database
var db = require("./databaseConfig.js");

var actorDB = {
  // Get actor by ID
  getActor: (userid, callback) => {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("getActor");
        // MySQL command to be executed
        var sql =
          "SELECT actor_id , first_name, last_name FROM actor WHERE actor_id = ?";
        conn.query(sql, [userid], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          }

          if (result.length === 0) {
            callback(null, null);
            return;
          }
          console.log(result);
          return callback(null, result[0]);
        });
      }
    });
  },
  // Get actors with offset & limit
  getActors: (offset, limit, callback) => {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("getActor");
        // MySQL command to be executed
        var sql =
          "SELECT actor_id , first_name, last_name FROM actor ORDER BY first_name ASC LIMIT ? OFFSET ?";
        conn.query(sql, [limit, offset], function (err, result) {
          conn.end();
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          
          return callback(null, result);
        });
      }
    });
  },
  // Add an actor with firstname and lastname as inputs
  addActor: (object, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err, null);
      } else {
        // MySQL command to be executed
        var sql = "INSERT INTO actor (first_name,last_name) VALUES (?,?)";
        conn.query(
          sql,
          [object.first_name, object.last_name],
          (err, result) => {
            conn.end();
            if (err) {
              console.log(err);
              return callback(err, null);
            } else {
              return callback(null, result);
            }
          }
        );
      }
    });
  },
  // Update actor's first name, last name or both
  updateActor: (id, object, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log(object.first_name);
        console.log(object.last_name);

        if (object.first_name != undefined && object.last_name != undefined) {
          var sql =
            "UPDATE actor SET first_name = ?, last_name = ? where actor_id = ?";
          conn.query(
            sql,
            [object.first_name, object.last_name, id],
            (err, res) => {
              if (err) {
                console.log(err);
                return callback(err, null);
              } else {
                return callback(null, res);
              }
            }
          );
        }
        else if (object.first_name == undefined) {
          var sql = "UPDATE actor SET last_name = ? WHERE actor_id = ?";
          conn.query(sql, [object.last_name, id], (err, res) => {
            conn.end();
            if (err) {
              console.log(err);
              return callback(err, null);
            } else {
              return callback(null, res);
            }
          });
        } else if (object.last_name == undefined) {
          console.log("first name");
          var sql = "UPDATE actor SET first_name = ? WHERE actor_id = ?";
          conn.query(sql, [object.first_name, id], (err, res) => {
            conn.end();
            if (err) {
              console.log(err);
              return callback(err, null);
            } else {
              return callback(null, res);
            }
          });
        }
      }
    });
  },
  // Delete an actor from the database
  removeActor: (id, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err, null);
      } else {
        var sql = "DELETE FROM actor WHERE actor_id = ?";
        conn.query(sql, [id], (err, result) => {
          if (err) {
            return callback(err, null);
          } else {
            return callback(null, result);
          }
        });
      }
    });
  },
};

module.exports = actorDB;
