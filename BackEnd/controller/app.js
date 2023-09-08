/*
Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin no : 2220327
*/
var express = require('express');
var app = express();
var actor = require('../model/actor.js'); 
var category = require("../model/film.js")
var customer = require('../model/customer.js');
var additonal = require('../model/additional.js');
var user = require('../model/user.js');
var verifyToken = require('../auth/verifyToken.js');

var cors = require('cors');

app.options('*',cors());
app.use(cors());

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());// parse application/json
app.use(urlencodedParser); // parse application/x-www-form-urlencoded


// To get actor by id
app.get('/actors/:actor_id', (req,res) => {
    var id = req.params.actor_id;
    actor.getActor(id, function (err, result) {
        
        if (err) {
           res.status(500).send(`{"error_msg" : "Internal server error"}`);
        }
        else if (result === null){
            res.status(204).send()
            return;
        }
        else {
            res.status(200).send(result);       
        }
    });
});

// Multiple actors with query offset and limit
app.get('/actors', (req,res) => {
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);

    if (isNaN(limit)){
        limit = 20;
    } 
    if (isNaN(offset)){
        offset=0;
    }

    actor.getActors(offset,limit, function (err, result) {

        if (err) {
           res.status(500).send(`{"error_msg" : "Internal server error"}`);
        }
        
        else {
            res.status(200).send(result);       
        }
    });
});

// To post a new actor into the bed_dvd_db schema
app.post('/actors/', verifyToken ,(req,res) => {

    var object = req.body;
    actor.addActor(object,(err,result) =>{
        if (!err){
            res.status(201).send(`{"actor_id" : "${result.insertId}"}`);
        }
        else if (err.code === "ER_BAD_NULL_ERROR"){
            res.status(400).send(`{"error_msg" : "missing data"}`)
        }
        else {
            res.status(500).send(`{"error_msg" : "Internal server error"}`)
        }
    })
})
 
app.put("/actors/:actor_id", verifyToken,(req,res)=>{
    var id = parseInt(req.params.actor_id);
    if (isNaN(id)){
        res.status(400).send(`{"error_msg" : "missing data"}`)
    }

    actor.updateActor(id,req.body,(err,result)=>{
        if (err){
            if (err.code === "ER_BAD_NULL_ERROR"){
                res.status(400).send(`{"error_msg":"missing data"}`);
                
            }
        }
        else if (!err){
            console.log(result)
             if (result.affectedRows === 0){
                res.status(204).send();
            }
            else {
                res.status(200).send(`{"success_msg" : "record updated"}`);
            }
            
        }
        
        else {
            console.log(err)
            res.status(500).send(`{"error_msg" : "Internal server error"}`);   
            return;
        }
        
    })
})

app.delete('/actors/:actor_id',verifyToken,(req,res)=>{
    var id = parseInt(req.params.actor_id);
    if (isNaN(id)){
        res.status(500).send(`{"Result" :  "Internal server error"}`)
    }

    actor.removeActor(id,(err,result)=>{
        
         if (!err){
            console.log(result)
            if (result.affectedRows === 0){
                res.status(204).send()
            }
            
            else {
                res.status(200).send(`{"success_msg" : "actor deleted"}`)
            }
        }
        
        else {
            console.log(err)
            res.status(500).send(`{"error_msg" : "Internal server error"}`)
        }
    })
})
 
app.get("/film_categories/:category_id/films",(req,res)=>{

    var id = parseInt(req.params.category_id);
    category.getFilmByCategoryID(id,(err,result) => {
        if (err){
            console.log(err)
            res.status(500).send(`{"error_msg" : "Internal server error"}`)
        }
        else {
            res.status(200).send(result)
        }
    })
})

app.get('/actors/films/:film_title',(req,res) => {
    var title = parseInt(req.params.film_title);
    category.getActorByFilm(title,(err,result) => {
        if (err){
            res.status(500).send("Internal server error");
        }
        else {
            console.log(result)
            res.status(200).send(result)
        }
    } )
})

app.get('/films/:film_id/film_description',(req,res)=>{
    var film_id = parseInt(req.params.film_id);

    category.getFilm(film_id,(err,result)=>{
        if (err){
            res.status(500).send("Internal server error");
        }
        else {
            res.status(200).send(result);
        }
    })
})

app.get('/category',(req,res) => {
    category.getAllFilmCategory((err,result) => {
        if (err){
            res.status(500).send("Internal server error");
        }
        else {
            console.log(res)
            res.status(200).send(result)
        }
    })
})

app.get("/films/:film_title",(req,res)=>{
    var title = req.params.film_title
    
    category.getFilmByInput(title,(err,result) => {
        if (err){
            console.log(err)
            res.status(500).send("Internal server error");
        }else {
            res.status(200).send(result);
        }
    })
})

app.get('/category/:category_name',(req,res) => {
    var categoryName = req.params.category_name;
    console.log('getFilmByCategory')
    category.getFilmByCategory(categoryName,((err,result) => {
        if (err) {
            res.status(500).send("Internal server error");
        }
        else {
            res.status(200).send(result)
        }
    }))
   
})

app.get('/category/:category_name/maxprice/:max_price',(req,res) => {
    var categoryName = req.params.category_name;
    var maxPrice = parseFloat(req.params.max_price);
    console.log('getFilmByCategoryAndPrice');
    category.getFilmByCategoryAndPrice(categoryName,maxPrice,(err,result) => {
        if (err){
            console.log(err)
            res.status(500).send("Internal server error");
        }
        else {
            res.status(200).send(result)
        }
    })
})

app.get('/films/:film_title/category/:category_name',(req,res) => {
    var film = req.params.film_title;
    var categoryName = req.params.category_name;
    console.log('getFilmByInputAndCategory')
    category.getFilmByInputAndCategory(film,categoryName,(err,result)=>{
        if (err){
            res.status(500).send("Internal server error");
        }
        else {
            res.status(200).send(result)
        }
    })
})

app.get('/flims/:film_title/maxprice/:max_price',(req,res) => {
    var film = req.params.film_title;
    var maxPrice = parseFloat(req.params.max_price);
    console.log('getFilmByInputAndPrice')
    category.getFilmByInputAndPrice(film,maxPrice,(err,result) => {
        if (err){
            console.log(err)
            res.status(500).send("Internal server error")
        }
        else {
            res.status(200).send(result)
        }
    })
})

app.get('/films/:film_title/category/:category_name/maxprice/:max_price',(req,res) => {
    var film = req.params.film_title;
    var categoryName = req.params.category_name;
    var maxPrice = parseFloat(req.params.max_price);
    console.log('getFilmByInputAndCategoryAndPrice')
    category.getFilmByInputAndCategoryAndPrice(film,categoryName,maxPrice,(err,result) => {
        if (err){
            console.log(err)
            res.status(500).send("Internal server error")
        }
        else {
            res.status(200).send(result)
        }
    } )
})

app.get('/customer/:customer_id/payment',(req,res)=>{
    var customer_id = parseInt(req.params.customer_id);
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;

    customer.getCustomer(customer_id,start_date,end_date,(err,result)=>{
        if (err){
            res.status(500).send(`{"error_msg" : "Internal server error"}`)
        }
        else {
            console.log(result)
            res.status(200).send(result)
        }
    })
})

app.post('/customers/',verifyToken,(req,res)=>{ 

    customer.addCustomer(req.body,(err,result)=>{
        if (!err){
            res.status(201).send(`{"customer_id" :  "${result.insertId}"}`)
        }
        else if (err.code === "ER_BAD_NULL_ERROR") {
            res.status(400).send(`{"error_msg" : "missing data"}`)
        }
        else if (err.code === "ER_DUP_ENTRY") {
            res.status(409).send(`{"error_msg" : "email already exists"}`)
        }
        else {
            res.status(500).send(`{"error_msg" : "Internal server error"}`)
        }
    })
})
  
app.put('/customer/:customer_id',verifyToken,(req,res)=>{
    var id = parseInt(req.params.customer_id);
    var object = req.body;

    additonal.updateCustomer(id,object,(err,result)=>{
        
        if (err){
            console.log(err);
            if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || err.code === 'ER_BAD_NULL_ERROR'){
                res.status(400).send(`{"error_msg" : "missing data"}`);
            }
            else {
                res.status(500).send(`{"error_msg" : "Internal server error"}`);
            }
        }
        else {
            console.log(result)
            res.status(200).send(`{"success_msg" : "record updated"}`);
        }
    })
})

app.post('/user/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    user.loginAdmin(email, password, function (err, token, result) {
        if (!err) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            delete result[0]['password'];//clear the password in json data, do not send back to client
            console.log(result);
            res.json({ success: true, AdminData: JSON.stringify(result), token: token, status: 'You are successfully logged in!' });
        } else {
            res.status(500);
            res.send(err.statusCode);}});
});

module.exports = app;