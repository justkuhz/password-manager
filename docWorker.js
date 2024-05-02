const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const dbName = 'passwordManager';
const collectionName = 'storedCredentials';

// MongoDB connection URL
const uri = "mongodb+srv://admin:<compsecpassword>@compsecproject.91yryyz.mongodb.net/?retryWrites=true&w=majority&appName=CompSecProject";

// Middleware
app.use(bodyParser.json());


// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => 
{
    if (err) {
        console.error('Error occurred while connecting to MongoDB:\n', err);
        return;
    }
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Function to add a document to a collection
    app.post('/addDocument', (req, res) => {
        const documentData = req.body;
        collection.insertOne(documentData, (err, result) => {
            if (err) {
                console.error('Error occurred while adding document:\n', err);
                res.status(500).send('Error adding document');
                return;
            }
            res.send('Document added successfully');
        });
    });

    // Function to update a document in a collection
    app.put('/updateDocument/:id', (req, res) => {
        const documentId = req.params.id;
        const updatedData = req.body;
        collection.updateOne({ _id: ObjectId(documentId) }, { $set: updatedData }, (err, result) => {
            if (err) {
                console.error('Error occurred while updating document:\n', err);
                res.status(500).send('Error updating document');
                return;
            }
            res.send('Document updated successfully');
        });
    });

    // Function to read a document in a collection
    app.get('/getDocument/:id', (req, res) => {
        const documentId = req.params.id;
        collection.findOne({ _id: ObjectId(documentId) }, (err, document) => {
            if (err) {
                console.error('Error occurred while reading document:\n', err);
                res.status(500).send('Error reading document');
                return;
            }
            res.send(document);
        });
    });

    // Function to delete a document in a collection
    app.delete('/deleteDocument/:id', (req, res) => {
        const documentId = req.params.id;
        collection.deleteOne({ _id: ObjectId(documentId) }, (err, result) => {
            if (err) {
                console.error('Error occurred while deleting document:\n', err);
                res.status(500).send('Error deleting document');
                return;
            }
            res.send('Document deleted successfully');
        });
    });

    // Function to verify a username does not already exist
    app.post('/verifyUsername', (req, res) => {
        const username = req.body.username;
        collection.findOne({ username: username }, (err, user) => {
            if (err) {
                console.error('Error occurred while verifying username:\n', err);
                res.status(500).send('Error verifying username');
                return;
            }
            if (user) {
                res.send('Username already exists');
            } else {
                res.send('Username is available');
            }
        });
    });

    // Function to generate table based on documents in 'Stored Credentials' collection
    app.get('/generateTable', (req, res) => {
        collection.find({}).toArray((err, documents) => {
            if (err) {
                console.error('Error occurred while generating table:\n', err);
                res.status(500).send('Error generating table');
                return;
            }
            const table = generateTable(documents);
            res.send(table);
        });
    });

    // Function to generate HTML table from documents
    function generateTable(documents) {
        let tableHtml = '<table><tr><th>Name</th><th>Email</th><th>Password</th><th>Entries</th></tr>';
        documents.forEach(document => {
            tableHtml += '<tr>';
            tableHtml += `<td>${document._id}</td>`;
            tableHtml += `<td>${document.email}</td>`;
            tableHtml += `<td>${document.password}</td>`;
            tableHtml += `<td><ul>`;
            document.entries.forEach(entry => {
                tableHtml += `<li>${entry.entry_name} - ${entry.application_name} - ${entry.username} - ${entry.password}</li>`;
            });
            tableHtml += `</ul></td>`;
            tableHtml += '</tr>';
        });
        tableHtml += '</table>';
        return tableHtml;
    }

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});