var port = process.env.PORT || 5000; 
var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('billDB',['login']);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
//var port = 'localhost';
var path = require('path');


app.use("/", express.static(path.join(__dirname, 'public')));
app.use('app-content', express.static(__dirname, + '/app-content'));
app.use('app-services', express.static(__dirname, + '/app-services'));
app.use('views', express.static(__dirname, + '/views'));
app.use('', express.static(__dirname, + '/home'));

//var mysql = require('mysql');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); 

app.get('/',function(req,res){
	 res.sendFile('index.html',{root: __dirname });
});


/******************************************* Login *********************************************/

app.post('/login', function(req , res) {
  var uname = req.body.username;
  var upass = req.body.password;
  var status = false;
  db.login.findOne({username : uname}, function(err, doc){
    if (doc) 
    {
      if (doc.password == upass) 
      {
        status = true;
        console.log(status);
        res.json(status);
      }else
      { 
        console.log(status);
        res.json(status);
      }
    }
    else
    {
      console.log("No user Found");
      res.json(status);
    }
  })
});

/****************************************** All Product details ***************************************/

app.post('/verifyAdmin', function(req , res) {
 
  var adminpass = req.body.delUser;
  var username = req.body.username.username;
  console.log(req.body);
  db.login.findOne({username : 'admin'}, function(err, doc){
    if (doc) 
    {
      console.log("hello");
      console.log(doc.password);
      if (doc.password == adminpass) 
      {
        db.login.remove({username: username}, function(err, doc)
        {
          console.log("delted");
          console.log(doc);
          res.json(doc);
        })  
      }else
      { 
        //console.log(doc);
        res.json(doc);
      }
    }
    else
    {
      console.log("No user Found");
      res.json(doc);
    }
  })
});

/****************************************** All Product details ***************************************/

app.get('/allproducts', function(req , res) 
{
  db.products.find(function(err, doc)
  {
    //console.log(doc);
    res.json(doc);
  })  
});

/*************************************** Add to product table ************************************/

app.post('/addProducts', function(req , res) 
{
  //console.log(req.body);
  db.products.insert(req.body, function(err, doc){
    res.json(doc);
  })
});

/*************************************** Update product table ***********************************/

app.put('/update', function(req , res) 
{
  console.log(req.body.pName.pName);
  db.products.findAndModify({query:{pName: req.body.pName.pName},update:{$set: {pCompany:req.body.pCompany,pCost:req.body.pCost,pQuantity:req.body.pQuantity,pDesc:req.body.pDesc}},
  new:true}, function(err, doc)
  {
    res.json(doc);
  })
});

/************************************* Remove product from table ********************************/
app.delete('/remove/:name', function(req , res) {
  var namep = req.params.name;
  //console.log(namep);
  db.products.remove({pName: namep}, function(err, doc){
    res.json(doc);
  })
  
});

/******************************************* Get Invoice **************************************/
app.get('/allinvoices', function(req , res) 
{

  db.invoices.find(function(err, doc)
  {
    //console.log(doc);
    res.json(doc);
  })  
});

/***************************************** To insert to invoice table *************************************/

app.post('/insertTOinvoice', function(req , res) {
  //console.log(req.body);
  db.invoices.insert(req.body, function(err, doc){
    res.json(doc);
  })
});

/**************************************** To get all Invoices **********************************/
app.delete('/removeInvoice/:invoice', function(req , res) {
  var invo = parseInt(req.params.invoice);
  console.log(invo);
  db.invoices.remove({invoiceNo: invo}, function(err, doc){
    res.json(doc);
  })
  
});



/**************************************** To get fee Installment *********************************/

app.put('/updateStock', function(req , res) 
{
  console.log(req.body);
  db.products.findAndModify({query:{pName: req.body.pName},update:{$set: {pStock:req.body.pStock}},
  new:true}, function(err, doc)
  {
    res.json(doc);
  })
});
/**************************************** To get fee Installment *********************************/

app.post('/addNewUser/:adminpass', function(req , res) {
  var uname = req.body.name;
  var upass = req.body.pass;
  var adminPass = req.params.adminpass;
  console.log(adminPass);
  console.log(req.body);
  var status = false;
  db.login.findOne({username : 'admin'}, function(err, doc){
    if (doc) 
    {
      if (doc.password == adminPass)
      {
        db.login.insert(req.body, function(err, doc)
        {
          status = true;
          console.log(status);
          res.json(status);
        })
      }else
      { 
        console.log(status);
        res.json(status);
      }
    }
    else
    {
      console.log("No user Found");
      res.json(status);
    }
  })
});
/**************************************** To get fee Installment *********************************/

app.get('/allUsers', function(req , res) 
{
  //console.log("here");
  db.login.find(function(err, doc)
  {
    //console.log(doc);
    res.json(doc);
  })  
});



app.listen(port, function () {
  console.log('Example app listening on port !' + port);
});


console.log("App listening on port " + port);