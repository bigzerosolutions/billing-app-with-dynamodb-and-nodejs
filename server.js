var port = process.env.PORT || 5000; 
var express = require('express');
var app = express();
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.loadFromPath('./config.json');
var dd = new AWS.DynamoDB();
//var mongojs = require('mongojs');
//var db = mongojs('billDB',['login']);

//var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
//var nodemailer = require("nodemailer");
//var smtpTransport = require("nodemailer-smtp-transport");
var port = 'localhost';
var path = require('path');


app.use("/", express.static(path.join(__dirname, 'public')));
app.use('app-content', express.static(__dirname, + '/app-content'));
app.use('app-services', express.static(__dirname, + '/app-services'));
app.use('views', express.static(__dirname, + '/views'));
app.use('', express.static(__dirname, + '/home'));

//var mysql = require('mysql');
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); 

app.get('/',function(req,res){
	 res.sendFile('index.html',{root: __dirname });
});

function createDBConnection()
{
  AWS.config.update({accessKeyId: 'AKIAIZ3W7GTR5ASAA75Q', secretAccessKey: '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'});
  // Configure the region
  AWS.config.region = 'us-west-2';  //us-west-2 is Oregon
  //create the ddb object
  var ddb = new AWS.DynamoDB();
  //console.log("connection going");
  return ddb;
}
var status = false;
/******************************************* Login *********************************************/
      
app.post('/login', function(req , res) {

  var uname = req.body.username;
  var upass = req.body.password;
  var ddb = createDBConnection();
  //console.log(req.body);
  var readparams = 
  {  
      Key:
      {
        username: {S: uname}
      },
      AttributesToGet: ['password'],
      TableName: 'login'
  };
  //console.log(readparams);
  
  ddb.getItem(readparams, function(err, data) 
  {
      //console.log(data);
      if (err) 
      {
        console.log("Login failed, Could not connect to DynamoDB"); 
        res.json(status);
      }
      else 
      {
          if( data.Item.password.S == upass)
          {
            status =true;
            res.json(status);
          }
          else
          {
            console.log('Login failed, invalid credentials');
            res.json(status);
          }
      }
  });
});

/****************************************** All Product details ***************************************/
/*

app.post('/verifyAdmin', function(req , res) {
 
  var adminpass = req.body.delUser;
  var username = req.body.username.username;
  console.log(req.body);
  var ddb = createDBConnection();
  //console.log(ddb);
  var readparams = 
  {  
      Key: 
      {
        username: {S: "admin"}
      },
      AttributesToGet: ['password'],
      TableName: 'login'
  };

  ddb.getItem(readparams, function(err, data) 
  {
    console.log(data.Item.password.S);
      if (err) 
      {
        alert("Connection failed, Could not connect to DynamoDB"); 
        return false;
      }
      else 
      {
          if( data.Item.password.S == upass)
          {
            
          }
          else
          {
            alert('Login failed, invalid credentials');
            res.json(status);
          }
      }
  });



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
*/
/****************************************** All Product details ***************************************/

app.get('/allproducts', function(req , res) 
{
  var ddb = createDBConnection();
  var params = 
  {
    TableName: 'products',
    Select: 'ALL_ATTRIBUTES'
    //AttributesToGet:['name','address','email','numOne','numTwo']
  };
  ddb.scan(params, function(err, data) 
  {
    //console.log(data.Items);
    if (err) 
    {
      console.log("Unable to add item. Error JSON:", JSON.stringify(err, null, 2)); 
    }
    else
    {
      res.json(data);
    }
  });
});

/*************************************** Add to product table ************************************/

app.post('/addProducts', function(req , res) 
{
  //console.log(req.body);
  var ddb = createDBConnection();
  var pCost =req.body.pCost.toString();
  var pStock =req.body.pStock.toString();
  var pTax =req.body.pTax.toString();
  var params = 
  {
    Item: 
    {
      "pName": { "S": req.body.pName },
      "pCompany": { "S": req.body.pCompany },
      "pDesc": { "S": req.body.pDesc },
      "pCost": { "S": pCost },
      "pStock": { "S": pStock },
      "pTax": { "S": pTax }
     },
     TableName: 'products'
  };
  //console.log(params);
  ddb.putItem(params, function(err, data) 
  {
    if (err) 
    {
      console.log("error");
    }
    else 
    {
      
      res.json(data);
    }
  });
});


/*************************************** Update product table ***********************************/

app.put('/update', function(req , res) 
{
    //console.log(req.body)
    var ddb = createDBConnection();
    var pCost =req.body.pCost.toString();
    var Stock =req.body.Stock.toString();
    var pTax =req.body.pTax.toString();
  
    var params = 
  {
    Item: 
    {
      "pName": { "S": req.body.pName.pName },
      "pCompany": { "S": req.body.pCompany },
      "pDesc": { "S": req.body.pDesc },
      "pCost": { "S": pCost },
      "pStock": { "S": Stock },
      "pTax": { "S": pTax }
     },
     TableName: 'products'
  };
  //console.log(params);
  ddb.putItem(params, function(err, data) 
  {
    if (err) 
    {
      console.log("error");
    }
    else 
    {
      
      res.json(data);
    }
  });
});


/************************************* Remove product from table ********************************/

app.delete('/remove/:name', function(req , res) {
  var namep = req.params.name;
  console.log(namep);
  var ddb = createDBConnection();
  var params = {
    TableName:'products',
    Key:
    {
        pName:{S:namep}
    }
  };
  ddb.deleteItem(params, function(err, data) 
  {
    //console.log(data.Items);
    if (err) 
    {
      console.log("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2)); 
    }
    else
    {
      res.json(data);
    }
  });
  
});

/******************************************* Get Invoice **************************************/
app.get('/allinvoices', function(req , res) 
{
  var ddb = createDBConnection();
  var params = 
  {
    TableName: 'invoices',
    Select: 'ALL_ATTRIBUTES'
  };
  ddb.scan(params, function(err, data) 
  {
    //console.log(data.Items);
    if (err) 
    {
      console.log("Unable to add item. Error JSON:", JSON.stringify(err, null, 2)); 
    }
    else
    {
      res.json(data);
    }
  });
});

/***************************************** To insert to invoice table *************************************/

app.post('/insertTOinvoice', function(req , res) {
  //console.log(req.body);
  var ddb = createDBConnection();
  var invoiceNo =req.body.invoiceNo.toString();
  var clientContact =req.body.clientContact.toString();
  var totalAmount =req.body.totalAmount.toString();
  
  var params = 
  {
    Item: 
    {
      "invoiceNo": { "S": invoiceNo },
      "clientContact": { "S": clientContact },
      "clientName": { "S": req.body.clientName },
      "invoiceDate": { "S": req.body.invoiceDate },
      "note": { "S": req.body.note },
      "totalAmount": { "S": totalAmount }
     },
     TableName: 'invoices'
  };
  //console.log(params);
  ddb.putItem(params, function(err, data) 
  {
    if (err) 
    {
      console.log("error");
    }
    else 
    {
      
      res.json(data);
    }
  });
});

/**************************************************************************/

/*
  app.delete('/removeInvoice/:invoice', function(req , res) {
  var invo = parseInt(req.params.invoice);
  console.log(invo);
  db.invoices.remove({invoiceNo: invo}, function(err, doc){
    res.json(doc);
  })
});
*/

/*************************************************************************/

app.put('/updateStock', function(req , res) 
{
  var ddb = createDBConnection();
  //console.log(req.body);
  var pStock =req.body.pStock.toString();
  
  var params = 
  {
    "TableName": "products",
    "Key": 
    {
        "pName": 
        {
            "S": req.body.pName
        }
    },
    "UpdateExpression": "set pStock = :val1",
    "ExpressionAttributeValues": 
    {
        ":val1": {"S": pStock}
    },
    "ReturnValues": "ALL_NEW"
 };
  //console.log(params);
  ddb.updateItem(params, function(err, data) 
  {
    if (err) 
    {
      console.log("error");
    }
    else 
    {
      res.json(data);
    }
  });
});

/**************************************** To get fee Installment *********************************/

/*app.post('/addNewUser/:adminpass', function(req , res) {
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
*//**************************************** To get fee Installment *********************************/
/*
app.get('/allUsers', function(req , res) 
{
  //console.log("here");
  db.login.find(function(err, doc)
  {
    //console.log(doc);
    res.json(doc);
  })  
});


*/
app.listen(5000, function () {
  console.log('Example app listening on port !' + port);
});


console.log("App listening on port " + port);