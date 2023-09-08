/*
Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin no : 2220327
*/

var db = require('./databaseConfig.js');

var additionalDB = {
    updateCustomer: (id, object, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                return callback(err, null)
            }
            else {
                var name = "UPDATE customer SET first_name = ?, last_name = ? , email = ? WHERE address_id = ?"
                conn.query(name, [object.first_name, object.last_name, object.email, id], (err) => {
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        var address = "UPDATE address SET address = ?, address2 = ?, district = ?, city_id = ?, postal_code = ?,phone = ? WHERE address_id = ?"
                        conn.query(address, [
                            object.address.address_line1,
                            object.address.address_line2,
                            object.address.district,
                            object.address.city_id,
                            object.address.postal_code,
                            object.address.phone,
                            id
                        ], (err, res) => {
                            if (err) {
                                return callback(err, null)
                            }
                            else {
                                return callback(null, res)
                            }
                        })

                    }
                })
            }
        })
    }
};


module.exports = additionalDB;
