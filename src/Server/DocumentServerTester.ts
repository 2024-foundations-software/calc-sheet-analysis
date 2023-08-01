import axios from 'axios';
import fs from 'fs';
import path from 'path';


// this will run a bunch of tests against the server.

// the server should be running on theport in PortsGlobal.ts

import { PortsGlobal } from '../PortsGlobal';

const serverPort = PortsGlobal.serverPort;

const baseURL = `http://localhost:${serverPort}`;

function cleanFiles() {
    const documentFolder = path.join(__dirname, '..', '..', 'documents');
    const files = fs.readdirSync(documentFolder);
    // delete all files that start with xxx
    files.forEach(file => {
        if (file.startsWith('xxx')) {
            fs.unlinkSync(path.join(documentFolder, file));
        }
    });
}

function getDocuments() {
    return axios.get(`${baseURL}/documents`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function createDocument(name: string) {
    return axios.post(`${baseURL}/documents/create/${name}`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function getDocument(name: string) {
    return axios.get(`${baseURL}/documents/${name}`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function modifyDocument(name: string, cell: string) {
    // put the user name in the body
    const userName = 'testUser';
    return axios.put(`${baseURL}/document/request/cell/${name}/${cell}`, { "userName": userName })
        .then(response => {
            const result = response.data;
            return result;
        });
}

function requestCell(docName: string, cell: string, user: string): Promise<boolean> {
    // put the user name in the body
    const userName = user;
    return axios.put(`${baseURL}/document/request/cell/${docName}/${cell}`, { "userName": userName })
        .then(response => {
            const result = response.data;
            return result;
        });
}


// this is the main function that runs the tests
async function runTests() {

    cleanFiles();
    // first, create a document
    const testDocument1 = 'xxxtestDocument1';
    const testDocument2 = 'xxxtestDocument2';
    const testDocument3 = 'xxxtestDocument3';

    const user1 = 'juancho';
    const user2 = 'yvonne';
    const user3 = 'jose';


    await createDocument(testDocument1);
    await createDocument(testDocument2);
    await createDocument(testDocument3);

    // first, get the list of documents
    const documents = await getDocuments();
    console.log('documents', documents);

    // ask for a cell in the first document for user1

    const cell1 = 'A1';
    const cell2 = 'B2';

    const result1 = await requestCell(testDocument1, cell1, user1);
}

// call the test runner

runTests();