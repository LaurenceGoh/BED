/*
Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin no : 2220327
*/


var db = require("./databaseConfig.js");

var customerDB = {
  getCustomer: (id, start_date, end_date, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err, null);
      } else {
        var sql = `SELECT film.title, payment.amount,payment.payment_date FROM payment 
                INNER JOIN customer ON customer.customer_id = payment.customer_id
                INNER JOIN rental ON payment.rental_id = rental.rental_id
                INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id
                INNER JOIN film ON inventory.film_id = film.film_id
                WHERE customer.customer_id = ?
                AND payment_date BETWEEN ? 
                AND ?`;
        conn.query(sql, [id, start_date, end_date], (err, res) => {
          if (err) {
            console.log(err);
            return callback(err, null);
          } else {
            var amount = 0;
            for (var a = 0; a < res.length; a++) {
              amount += res[a].amount;
              res[a].amount = res[a].amount.toString();
              // Formatting ISO date to YYYY/MM/DD HH:MM:SS
              res[a].payment_date = res[a].payment_date.toISOString().replace("T"," ").substring(0, 19);
            }

            var result = {
              rental: res,
              total: amount.toFixed(2),
            };

            return callback(null, result);
          }
        });
      }
    });
  },

  addCustomer: (object, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err, null);
      } else {
        var address = `INSERT INTO address (address,address2,district,city_id,postal_code,phone) VALUES (?,?,?,?,?,?) `;
        conn.query(
          address,
          [
            object.address.address_line1,
            object.address.address_line2,
            object.address.district,
            object.address.city_id,
            object.address.postal_code,
            object.address.phone,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
              return callback(err, null);
            } else {
              var sql = `INSERT INTO customer (store_id,first_name,last_name,email,address_id) VALUES (?,?,?,?,?)`;
              conn.query(
                sql,
                [
                  object.store_id,
                  object.first_name,
                  object.last_name,
                  object.email,
                  result.insertId,
                ],
                (err, res) => {
                  conn.end();
                  if (err) {
                    console.log(err);
                    return callback(err, null);
                  }
                  return callback(null, res);
                }
              );
            }
          }
        );
      }
    });
  },
};

module.exports = customerDB;
