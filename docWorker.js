const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// MongoDB connection URL
const url = 'mongodb://localhost:27017';
const dbName = 'passwordManager';

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection('storedCredentials');

    // Add a document to a collection
    app.post('/addDocument', (req, res) => {
        const documentData = req.body;
        collection.insertOne(documentData, (err, result) => {
            if (err) throw err;
            res.send('Document added successfully');
        });
    });

    // Update a document in a collection
    app.post('/updateDocument', (req, res) => {
        const filter = { _id: req.body._id };
        const update = { $set: req.body.updatedData };
        collection.updateOne(filter, update, (err, result) => {
            if (err) throw err;
            res.send('Document updated successfully');
        });
    });

    // Read a document in a collection
    app.get('/getDocument/:id', (req, res) => {
        const documentId = req.params.id;
        collection.findOne({ _id: documentId }, (err, document) => {
            if (err) throw err;
            res.send(document);
        });
    });

    // Delete a document in a collection
    app.delete('/deleteDocument/:id', (req, res) => {
        const documentId = req.params.id;
        collection.deleteOne({ _id: documentId }, (err, result) => {
            if (err) throw err;
            res.send('Document deleted successfully');
        });
    });

    // Verify a username does not already exist
    app.post('/verifyUsername', (req, res) => {
        const username = req.body.username;
        collection.findOne({ username: username }, (err, user) => {
            if (err) throw err;
            if (user) {
                res.send('Username already exists');
            } else {
                res.send('Username is available');
            }
        });
    });

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});
