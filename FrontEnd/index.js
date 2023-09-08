/* Name: Laurence Goh Ming Shen
Class : DIT/FT/1B/03
Admin num : 2220327 */
const express=require('express');
const serveStatic=require('serve-static');

var hostname="localhost";
var port=3001;

var app=express();

/* */
app.use(function(req,res,next){
    // console.log(req.url);
    // console.log(req.method);
    // console.log(req.path);
    // console.log(req.query.id);

    if(req.method!="GET"){
        res.type('.html');
        var msg="<html><body>This server only serves web pages with GET!</body></html>";
        res.end(msg);
    }else{
        next();
    }
});


app.use(serveStatic(__dirname+"/public"));

app.get("/", (req, res) => {
    res.sendFile("/public/login.html", { root: __dirname });
  });
  

app.get('/dvddetails',(req,res) => {
    res.sendFile('/public/details.html', { root: __dirname })
})

app.get('/index',(req,res) => {
    res.sendFile('/public/index.html',{ root: __dirname })
})

app.get('/admin',(req,res) => {
    res.sendFile('/public/admin.html',{ root: __dirname })
})

app.get('/addactor',(req,res) => {
    res.sendFile('/public/addActor.html',{ root: __dirname })
})

app.get('/addcustomer',(req,res) => {
    res.sendFile('/public/addCustomer.html',{ root: __dirname })
})
app.listen(port,hostname,function(){

    console.log(`Server hosted at http://${hostname}:${port}`);
});