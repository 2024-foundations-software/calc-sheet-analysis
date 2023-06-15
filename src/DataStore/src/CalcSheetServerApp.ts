// Import the required dependencies
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import net from "net";
import CalcSheetDatabase from "./CalcSheetDatabase";


// 
// 
let calcDB = new CalcSheetDatabase();

// Extend the Error interface to include the code property
interface NodeJSError extends Error {
  code?: string;
}




// Create an Express application
const calcSheetServerApp = express();

// Use middleware functions to parse JSON bodies and enable CORS
calcSheetServerApp.use(bodyParser.json());
calcSheetServerApp.use(cors());

// Create a mock database to store the documents
// You can use a real database or a file system instead
const db: Record<string, Document> = {};

// Define the route and handler for listing documents
calcSheetServerApp.get("/documents", (req, res) => {
  // Get the keys of the db object as an array of document ids
  console.log("Server: listing documents")
  const documentIds = calcDB.listDocuments();
  // Send the array as a JSON response
  res.json(documentIds);
});


// Define the route that will reset the database
calcSheetServerApp.post("/reset", (req, res) => {
  // Delete all documents from the db object
  console.log("Server: resetting database")
  calcDB.deleteAllDocuments();
  // Send a 204 status code and no content
  res.status(204).send();
});



// Define the route and handler for getting a document by id
calcSheetServerApp.get("/documents/:id", (req, res) => {
  // Get the id parameter from the request
  const id = req.params.id;
  console.log("Server: getting document with id " + id);
  // Get the document from the db object by id
  const document = calcDB.getDocument(id);
  // Check if the document exists
  if (document) {
    console.log("Server: found document with id " + id);

    // Send the document as a JSON response
    res.json(document);
  } else {
    // Send a 404 status code and an error message
    res.status(404).send("Document not found");
  }
});

// Define the route and handler for storing a document
calcSheetServerApp.post("/documents", (req, res) => {
  // Get the document from the request body
  const document = req.body as CalcSheetDocument;

  const id = calcDB.setDocument(document);
  // Send the id as a JSON response
  res.json(id);
  
  console.log("Server: stored document with id " + id);
});

// Define the route and handler for deleting a document by id
calcSheetServerApp.delete("/documents/:id", (req, res) => {
  // Get the id parameter from the request
  const id = req.params.id;
  // Delete the document from the db object by id
  calcDB.deleteDocument(id);

  // Send a 204 status code and no content
  res.status(204).send();
});

// Now define the function that we will send back so we can start on arbitrary ports
function startCalcSheetServerApp(port: number) {
  const server = net.createServer();
    server.once('error', (err: NodeJSError) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use`);
        }
    });
    server.once('listening', () => {
        server.close();
        calcSheetServerApp.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    });
    server.listen(port);
    return calcSheetServerApp;
}

export default startCalcSheetServerApp;