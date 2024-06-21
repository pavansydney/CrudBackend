const express = require('express');
const app = express();
const PORT = 4200;
const path = './data.json';
const fs = require('fs');
const cors = require('cors');

app.use(express.json()); // Middleware to parse JSON bodies

// CORS configuration
// For development: Allow all origins
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
} else {
    // For production: Only allow specific origin
    app.use(cors({ origin: 'http://localhost:3000' }));
}

// Example of a GET route
app.get('/api/products', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data file');
        }
        const products = JSON.parse(data); // Parse the JSON data
        res.json(products); // Send 'products' as the response
    });
});

app.post('/api/products', (req, res) => {
    // Read the existing data
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data file');
        }

        // Parse the data to an object
        let jsonData;
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
        const nextId = jsonData.products.reduce((acc, cur) => Math.max(acc, cur.id), 0) + 1;

        // Add the new product with the next ID
        jsonData.products.push({ id: nextId, ...req.body });

        // Write updated data back to the file
        fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving data');
            }
            res.status(201).send({ message: 'Product added successfully!', id: nextId });
        });
    });
});

app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); // Convert the id from URL parameter to integer

    // Read the existing data
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data file');
        }

        // Parse the data to an object
        let jsonData;
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
        const productIndex = jsonData.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            return res.status(404).send('Product not found');
        }

        // Update the product at the found index with the new data
        // Assuming req.body contains the updated product data
        jsonData.products[productIndex] = { id: productId, ...req.body };

        // Write updated data back to the file
        fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving data');
            }
            res.status(200).send({ message: 'Product updated successfully!', id: productId });
        });
    });
});

app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); // Convert the id from URL parameter to integer

    // Read the existing data
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data file');
        }

        // Parse the data to an object
        let jsonData;
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
        const productIndex = jsonData.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
            return res.status(404).send('Product not found');
        }

        // Remove the product from the array
        jsonData.products.splice(productIndex, 1);

        // Write updated data back to the file
        fs.writeFile(path, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving data');
            }
            res.status(200).send({ message: 'Product deleted successfully!', id: productId });
        });
    });
});

// Start the server
const port = process.env.PORT || 4200;
app.listen(port, () => console.log(`Server running on port ${port}`));