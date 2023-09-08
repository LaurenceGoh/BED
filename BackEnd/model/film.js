/*
Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin num : 2220327
*/

const e = require("express");
const db = require("./databaseConfig.js");

var filmDB = {
  getFilmByCategoryID: (id, callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err, null);
      } else {
        var sql = `SELECT film.film_id, film.title, category.name ,film.rating,  film.release_year, film.length as duration FROM film 
                INNER JOIN film_category ON film.film_id = film_category.film_id 
                INNER JOIN category ON film_category.category_id = category.category_id
                WHERE film_category.category_id = ?`;
        conn.query(sql, [id], (err, res) => {
          if (err) {
            return callback(err, null);
          } else {
            if (res.length != 0) {
              for (var a = 0; a < id; a++) {
                // Converting numbers into strings
                res[a].film_id = res[a].film_id.toString();
                res[a].release_year = res[a].release_year.toString();
                res[a].duration = res[a].duration.toString();
              }
            }
            return callback(null, res);
          }
        });
      }
    });
  },
  getAllFilmCategory:(callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err){
        return callback(err,null)
      }
      else {
        var sql = `SELECT category.name FROM category`;
        conn.query(sql,(err,res) => {
          if (err){
            return callback(err,null)
          }
          else {
            return callback(null,res)
          }
        })
      }
    })
  }
  ,

  getFilmByCategory: (category,callback)=>{
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err,null);
      }
      else {
        var sql = `SELECT film.film_id, film.title, category.name , film.release_year, film.description, film.rating , film.rental_rate FROM film 
        INNER JOIN film_category ON film.film_id = film_category.film_id 
        INNER JOIN category ON film_category.category_id = category.category_id
        WHERE category.name = ?`
        conn.query(sql,[category],(err,res) => {
          if (err){
            return callback(err,null);
          }
          else {
            return callback(null,res)
          }
        })
      }
    })
  },
  getFilmByInput: (title,callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err, null);
      } else {
        var sql = `SELECT film.film_id,film.title, category.name , film.release_year, film.description ,film.rental_rate FROM film 
                INNER JOIN film_category ON film.film_id = film_category.film_id 
                INNER JOIN category ON film_category.category_id = category.category_id
                WHERE film.title LIKE ?
                `;
        conn.query(sql, (title + "%"),(err, res) => {
          if (err) {
            return callback(err, null);
          } else {
            return callback(null, res);
          }
        });
      }
    });
  },
  getFilmByInputAndCategory: (title,category,callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err) {
        return callback(err, null);
      } else {
        var sql = `SELECT film.film_id,film.title, category.name , film.release_year, film.description ,film.rental_rate FROM film 
                INNER JOIN film_category ON film.film_id = film_category.film_id 
                INNER JOIN category ON film_category.category_id = category.category_id
                WHERE category.name = ? AND film.title LIKE ?
                `;
        conn.query(sql, [category,(title + "%")],(err, res) => {
          if (err) {
            return callback(err, null);
          } else {
            return callback(null, res);
          }
        });
      }
    });
  },
  getFilmByInputAndPrice:(title,maxPrice,callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err){
        return callback(err,null);
      }
      else {
        var sql = `SELECT film.film_id, film.title, category.name , film.release_year, film.description, film.rating, film.rental_rate  FROM film 
        INNER JOIN film_category ON film.film_id = film_category.film_id 
        INNER JOIN category ON film_category.category_id = category.category_id
        WHERE film.title LIKE ? and rental_rate < ?`;
        conn.query(sql,[(title+"%"),maxPrice],(err,res) => {
          conn.end();
          if (err){
            return callback(err,null)
          }
          else {
            return callback(null,res)
          }
        })
      }
    })
  },
  getFilmByCategoryAndPrice:(category,maxPrice,callback)=>{
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err){
        return callback(err,null)
      }
      else {
        var sql = `SELECT film.film_id, film.title, category.name , film.release_year, film.description, film.rating, film.rental_rate  FROM film 
        INNER JOIN film_category ON film.film_id = film_category.film_id 
        INNER JOIN category ON film_category.category_id = category.category_id
        where category.name = ? and rental_rate < ?`;
        conn.query(sql,[category,maxPrice],(err,res) => {
          conn.end();
          if (err){
            return callback(err,null);
          }
          else {
            return callback(null,res);
          }
        })
      }
    })
  },
  getFilmByInputAndCategoryAndPrice: (title,category,maxPrice,callback) => {
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err){
        return callback(err,null)
      }
      else {
        var sql = `SELECT film.film_id, film.title, category.name , film.release_year, film.description, film.rating, film.rental_rate  FROM film 
        INNER JOIN film_category ON film.film_id = film_category.film_id 
        INNER JOIN category ON film_category.category_id = category.category_id
        where film.title like ? and category.name = ? and rental_rate < ?`;
        console.log(title)
        console.log(category)
        console.log(maxPrice)
        conn.query(sql,[(title+"%"),category,maxPrice],(err,res) => {
          if (err){
            return callback(err,null)
          }
          else {
            return callback(null,res)
          }
        })
      }
    })
  },
  getActorByFilm: (filmID,callback)=>{
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err){
        return callback(err,null);
      }
      else {
        var sql = `SELECT actor.first_name,actor.last_name FROM film 
        INNER JOIN film_category ON film.film_id = film_category.film_id 
        INNER JOIN category ON film_category.category_id = category.category_id
        INNER JOIN film_actor ON film.film_id = film_actor.film_id
        INNER JOIN actor ON film_actor.actor_id = actor.actor_id
        WHERE film.film_id = ?`
        conn.query(sql,[filmID],(err,res)=>{
          if (err){
            return callback(err,null)
          }
          else {
            console.log(res)
            return callback(null,res)
          }
        })
      }
    })
  },
  getFilm: (id,callback)=>{
    var conn = db.getConnection();
    conn.connect((err) => {
      if (err){
        return callback(err,null)
      }
      else {
        var sql = `SELECT film.film_id, film.title, category.name ,film.rating,  film.release_year , film.description FROM film 
        INNER JOIN film_category ON film.film_id = film_category.film_id 
        INNER JOIN category ON film_category.category_id = category.category_id
        WHERE film.film_id = ?`
      }
      conn.query(sql,[id],(err,res) => {
        if (err){
          return callback(err,null)
        }
        else {
          return callback(null,res)
        }
      })
    })
  }
};

module.exports = filmDB;
