/**
 * the server for the DocumentHolder
 * 
 * this is an express server that provides the following routes:
 * 
 * GET /documents
 * 
 * GET /documents/:name
 * 
 * PUT /document/request/cell/:name/:cell
 * 
 * PUT /document/release/token/:name/:token
 * 
 * PUT /document/add/token/:name/:token
 * 
 * PUT /document/add/cell/:name/:cell
 * 
 * PUT /document/remove/token/:name
 * 
 * PUT /document/clear/formula/:name
 * 
 * GET /document/formula/string/:name
 * 
 * GET /document/result/string/:name
 * 
 * GET /document/editstatus/:name
 */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { DocumentHolder } from '../Engine/DocumentHolder';
import { PortsGlobal } from '../PortsGlobal';

// define a debug flag to turn on debugging
const debug = true;

// define a shim for console.log so we can turn off debugging
if (!debug) {
    console.log = () => { };
}


const app = express();

app.use(bodyParser.json());

// Add a middleware function to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});


app.use(cors());

const documentHolder = new DocumentHolder();

// GET /documents
app.get('/documents', (req: express.Request, res: express.Response) => {
    const documentNames = documentHolder.getDocumentNames();
    res.send(documentNames);
});

// GET /documents/:name
app.get('/documents/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }

    // get the document
    const document = documentHolder.getDocument(name);

    res.status(200).send(document);
});

app.post('/documents/create/:name', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) !== -1) {
        res.status(400).send(`Document ${name} already exists`);
        return;
    }

    // create the document
    const documentOK = documentHolder.createDocument(name, 5, 8);
    if (documentOK) {
        const document = documentHolder.getDocument(name);
        res.status(200).send(document);
    }
    else {
        res.status(500).send(`Document ${name} could not be created`);
    }
});




app.put('/document/request/cell/:name/:cell', (req: express.Request, res: express.Response) => {
    const name = req.params.name;
    const cell = req.params.cell;
    // is this name valid?
    const documentNames = documentHolder.getDocumentNames();
    if (documentNames.indexOf(name) === -1) {
        res.status(404).send(`Document ${name} not found`);
        return;
    }
    // get the user name from the body
    const userName = req.body.userName;
    if (!userName) {
        res.status(400).send('userName is required');
        return;
    }

    res.status(200).send(`request cell ${cell} from document ${name} for user ${userName}`);
});



// get the port we should be using
const port = PortsGlobal.serverPort;
// start the app and test it
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
