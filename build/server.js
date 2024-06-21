"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var express = require('express');
var app = express();
var PORT = 4200;
var path = './data.json';
var fs = require('fs');
var cors = require('cors');
app.use(express.json()); // Middleware to parse JSON bodies

// CORS configuration
// For development: Allow all origins
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
} else {
  // For production: Only allow specific origin
  app.use(cors({
    origin: 'http://localhost:3000'
  }));
}

// Example of a GET route
app.get('/api/products', function (req, res) {
  fs.readFile('data.json', 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data file');
    }
    var products = JSON.parse(data); // Parse the JSON data
    res.json(products); // Send 'products' as the response
  });
});
app.post('/api/products', function (req, res) {
  // Read the existing data
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data file');
    }

    // Parse the data to an object
    var jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).send('Error parsing data file');
    }

    // Ensure jsonData has a 'products' key and it is an array
    if (!jsonData.products || !Array.isArray(jsonData.products)) {
      jsonData.products = []; // Initialize as an empty array if not
    }

    // Determine the next ID
    var nextId = jsonData.products.reduce(function (acc, cur) {
      return Math.max(acc, cur.id);
    }, 0) + 1;

    // Add the new product with the next ID
    jsonData.products.push(_objectSpread({
      id: nextId
    }, req.body));

    // Write updated data back to the file
    fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving data');
      }
      res.status(201).send({
        message: 'Product added successfully!',
        id: nextId
      });
    });
  });
});
app.put('/api/products/:id', function (req, res) {
  var productId = parseInt(req.params.id); // Convert the id from URL parameter to integer

  // Read the existing data
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data file');
    }

    // Parse the data to an object
    var jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).send('Error parsing data file');
    }

    // Ensure jsonData has a 'products' key and it is an array
    if (!jsonData.products || !Array.isArray(jsonData.products)) {
      return res.status(404).send('No products found');
    }

    // Find the index of the product with the matching ID
    var productIndex = jsonData.products.findIndex(function (product) {
      return product.id === productId;
    });
    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    // Update the product at the found index with the new data
    // Assuming req.body contains the updated product data
    jsonData.products[productIndex] = _objectSpread({
      id: productId
    }, req.body);

    // Write updated data back to the file
    fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving data');
      }
      res.status(200).send({
        message: 'Product updated successfully!',
        id: productId
      });
    });
  });
});
app["delete"]('/api/products/:id', function (req, res) {
  var productId = parseInt(req.params.id); // Convert the id from URL parameter to integer

  // Read the existing data
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading data file');
    }

    // Parse the data to an object
    var jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      console.error(parseError);
      return res.status(500).send('Error parsing data file');
    }

    // Ensure jsonData has a 'products' key and it is an array
    if (!jsonData.products || !Array.isArray(jsonData.products)) {
      return res.status(404).send('No products found');
    }

    // Find the index of the product with the matching ID
    var productIndex = jsonData.products.findIndex(function (product) {
      return product.id === productId;
    });
    if (productIndex === -1) {
      return res.status(404).send('Product not found');
    }

    // Remove the product from the array
    jsonData.products.splice(productIndex, 1);

    // Write updated data back to the file
    fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', function (err) {
      if (err) {
        console.error(err);
        return res.status(500).send('Error saving data');
      }
      res.status(200).send({
        message: 'Product deleted successfully!',
        id: productId
      });
    });
  });
});

// Start the server
var port = process.env.PORT || 4200;
app.listen(port, function () {
  return console.log("Server running on port ".concat(port));
});