var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(express.static('public'));
var fs = require('fs');
var _ = require('underscore');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var sha1 = require('sha1');

MongoClient.connect('mongodb://localhost:27017/store', function(err, db) {
	app.get('/', function (req, res) {
		console.log("Connected correctly to server");
		db.collection('products')
		.find()
		.toArray(function(err, docs) {
			if(err){
				return console.log(err)
			}
			res.render('home.ejs', {
				products: docs
			});
		});
	});

	app.get('/product/:id', function (req, res) {
		console.log("Connected correctly to server");
		db.collection('products')
		.find({_id: mongo.ObjectId(req.params.id)})
		.toArray(function(err, docs) {
			if(err){
				return console.log(err)
			}
			res.render('product.ejs', {
				product: docs
			});		
		});
	});

	app.get('/bag', function (req, res) {
		console.log("Connected correctly to server");
		res.render('bag.ejs');		
	});

	app.post('/bag', function (req, res) {
		console.log("Connected correctly to server");
		// res.json(req.body.cookie);	
		var idArr = JSON.parse(req.body.cookie);
		var objIdArr = new Array;
		for (var i = 0; i < idArr.length; i++) {
			objIdArr.push(mongo.ObjectId(idArr[i]));
			console.log(mongo.ObjectId(idArr[i]));
		}
		db.collection('products')
		.find({_id: {$in: objIdArr}})
		.toArray(function(err, docs) {
			if(err){
				return console.log(err)
			}
			var newObj = new Array;
			for (var i = 0; i < objIdArr.length; i++) {
				for (var k = 0; k < docs.length; k++) {
					if (docs[k]._id.equals(objIdArr[i])) {
						newObj.push(docs[k]);
					}
				}
			}
			console.log(newObj)
			res.json(newObj);		
		});	
		
	});

	app.post('/bag/order', function (req, res) {
		console.log("Connected correctly to server");
		var idArr = JSON.parse(req.body.cookie);
		var objIdArr = new Array;
		for (var i = 0; i < idArr.length; i++) {
			objIdArr.push(mongo.ObjectId(idArr[i]));
			console.log(mongo.ObjectId(idArr[i]));
		}
		db.collection('orders')
		.insertOne({ name: req.body.name, id: objIdArr}, function (err) {
			if (err) {
				console.log(err);
			}else{
				console.log('success');
				res.json(req.body.name);
			}
  		});
		
	});
});

app.listen(3000);