import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { DocumentTransport, CellTransport } from '../Engine/GlobalDefinitions';


// this will run a bunch of tests against the server.

// the server should be running on theport in PortsGlobal.ts

import * as PortsGlobal from '../ServerDataDefinitions';
import e from 'express';

const serverPort = PortsGlobal.PortsGlobal.serverPort;

const baseURL = `http://localhost:${serverPort}`;



function cleanFiles() {
    return axios.post(`${baseURL}/documents/reset`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function getDocuments() {
    return axios.get(`${baseURL}/documents`)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function createDocument(name: string, user: string): Promise<DocumentTransport> {
    // put the user name in the body
    const userName = user;

    return axios.post(`${baseURL}/documents/create/${name}`, { "userName": userName })
        .then(response => {
            const result = response.data;
            return result;
        });
}

function getDocument(name: string, userName: string): Promise<DocumentTransport> {
    const body = {
        "userName": userName,
    }
    return axios.put(`${baseURL}/documents/${name}`, body)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function clearFormula(docName: string, user: string): Promise<DocumentTransport> {
    // put the user name in the body
    const userName = user;
    const body = {
        "userName": userName,
    }

    return axios.put(`${baseURL}/document/clear/formula/${docName}`, body)
        .then(response => {
            const result = response.data;
            return result;
        });
}


function addToken(docName: string, token: string, user: string): Promise<DocumentTransport> {
    // put the user name in the body
    const userName = user;
    const body = {
        "userName": userName,
        "token": token
    }

    return axios.put(`${baseURL}/document/addtoken/${docName}`, body)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function addCell(docName: string, cell: string, user: string): Promise<DocumentTransport> {
    // put the user name in the body
    const userName = user;
    const body = {
        "userName": userName,
        "cell": cell
    }
    return axios.put(`${baseURL}/document/addcell/${docName}`, body)
        .then(response => {
            const result = response.data;
            return result as DocumentTransport;
        });
}

function removeToken(docName: string, user: string): Promise<DocumentTransport> {
    // put the user name in the body
    const userName = user;
    const body = {
        "userName": userName,
    }
    return axios.put(`${baseURL}/document/removetoken/${docName}`, body)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function requestEditCell(docName: string, cell: string, user: string): Promise<DocumentTransport> {
    // put the user name in the body
    const userName = user;
    const body = {
        "userName": userName,
        "cell": cell
    }
    return axios.put(`${baseURL}/document/cell/edit/${docName}`, body)
        .then(response => {
            const result = response.data;
            return result;
        });
}

function requestViewCell(docName: string, cell: string, user: string): Promise<DocumentTransport> {
    // put the user name in the body
    const userName = user;
    const body = {
        "userName": userName,
        "cell": cell
    }
    return axios.put(`${baseURL}/document/cell/view/${docName}`, body)
        .then(response => {
            const result = response.data;
            return result;
        });
}



function checkFormula(expected: string[], found: string[]): boolean {
    for (let i = 0; i < expected.length; i++) {
        if (expected[i] !== found[i]) {
            console.log(`expected ${expected[i]} found ${found[i]}`);
            return false;
        }
    }
    return true;
}

// this function returns a boolean, in the current implementation we are not checking the result
function checkFormulaAndDisplay(document: any, formula: string, result: string) {
    const formulaFound = document.formula;
    const resultFound = document.result;

    if (formulaFound !== formula) {
        console.log(`FAILURE: formula is not ${formula}, found ${formulaFound} instead`);
        return false;
    } else {
        console.log(`SUCCESS: formula is ${formula}, this succeeded`);
    }

    if (resultFound !== result) {
        console.log(`FAILURE: result is not ${result}, found ${resultFound} instead`);
        return false;
    } else {
        console.log(`SUCCESS: result is ${result}, this succeeded`);
    }
    return true;
}
function checkIsEditing(document: any, isEditing: boolean) {
    const isEditingFound = document.isEditing;

    if (isEditingFound !== isEditing) {
        console.log(`FAILURE: isEditing is not ${isEditing}, found ${isEditingFound} instead`);
        return false;
    } else {
        console.log(`SUCCESS: isEditing is ${isEditing}, this succeeded`);
    }
    return true;
}

// this function returns a boolean, in the current implementation we are not checking the result
function checkCell(document: any, cell: string, value: number, formula: string[], error: string) {
    const cells = document.cells;
    const cellTransport = cells[cell] as CellTransport;
    if (cellTransport.value !== value) {
        console.log(`FAILURE: cell ${cell} value is not ${value}, found ${cellTransport.value} instead`);
        return false;
    } else {
        console.log(`SUCCESS: cell ${cell} value is ${value}, this succeeded`);
    }
    if (cellTransport.formula.length !== formula.length) {
        console.log(`FAILURE: cell ${cell} formula length is not ${formula.length}, found ${cellTransport.formula.length} instead`);
        return false;
    } else {
        console.log(`SUCCESS: cell ${cell} formula length is ${formula.length}, this succeeded`);
    }
    const foundFormula = cellTransport.formula as string[];
    if (!checkFormula(formula, foundFormula)) {
        console.log(`FAILURE: cell ${cell} formula is not [${formula}], found [${cellTransport.formula}] instead`);
        return false;
    } else {
        console.log(`SUCCESS: cell ${cell} formula is [${formula}], this succeeded`);
    }
    if (cellTransport.error !== error) {
        console.log(`FAILURE: cell ${cell} error is not ${error}, found ${cellTransport.error} instead`);
        return false;
    }
    else {
        console.log(`SUCCESS: cell ${cell} error is "${error}", this succeeded`);
    }
    return true;
}

function checkErrorOccured(document: any, expectedError: string) {
    const error = document.errorOccurred;
    if (error !== expectedError) {
        console.log(`FAILURE: error is not ${expectedError}, found ${error} instead`);
        return false;
    }
    else {
        console.log(`SUCCESS: error is "${expectedError}", this succeeded`);
    }
    return true;
}

// this is the main function that runs the tests
async function runTests() {

    cleanFiles();
    // first, create a document
    const testDocument1 = 'xxxtestDocument1';
    const testDocument2 = 'xxxtestDocument2';
    const testDocument3 = 'xxxtestDocument3';

    const userJuancho = 'juancho';
    const userYvonne = 'yvonne';
    const userJose = 'jose';


    await createDocument(testDocument1, userJuancho);
    await createDocument(testDocument2, userYvonne);
    await createDocument(testDocument3, userJose);

    // first, get the list of documents
    const documents = await getDocuments();
    console.log('documents', documents);

    // ask for a cell in the first document for user1

    const cellA1 = 'A1';
    const cellB2 = 'B2';
    const cellC3 = 'C3';

    let resultDocument = await requestViewCell(testDocument1, cellA1, userJuancho);
    resultDocument = await requestViewCell(testDocument1, cellA1, userYvonne);
    resultDocument = await requestViewCell(testDocument1, cellA1, userJose);

    // add the token 1 to the document in A1
    resultDocument = await requestEditCell(testDocument1, cellA1, userJuancho);
    resultDocument = await addToken(testDocument1, '1', userJuancho);
    checkFormulaAndDisplay(resultDocument, '1', '1');
    checkCell(resultDocument, cellA1, 1, ['1'], '');

    // add 2 (makes 12) 
    resultDocument = await addToken(testDocument1, '2', userJuancho);
    checkFormulaAndDisplay(resultDocument, '12', '12');
    checkCell(resultDocument, cellA1, 12, ['12'], '');


    // add a +
    resultDocument = await addToken(testDocument1, '+', userJuancho);
    checkFormulaAndDisplay(resultDocument, '12 +', '#ERR');
    checkCell(resultDocument, cellA1, 12, ['12', '+'], '#ERR');

    // add a reference to B2
    resultDocument = await addCell(testDocument1, cellB2, userJuancho);
    checkFormulaAndDisplay(resultDocument, '12 + B2', '#REF!');
    checkCell(resultDocument, cellA1, 12, ['12', '+', 'B2'], '#REF!');
    resultDocument = await requestEditCell(testDocument1, cellB2, userYvonne);
    checkFormulaAndDisplay(resultDocument, '', '');
    checkCell(resultDocument, cellB2, 0, [], '#EMPTY!');

    resultDocument = await addToken(testDocument1, '3', userYvonne);
    checkCell(resultDocument, cellB2, 3, ['3'], '');
    checkCell(resultDocument, cellA1, 15, ['12', '+', 'B2'], '');

    // check for period
    resultDocument = await addToken(testDocument1, '.', userYvonne);
    checkCell(resultDocument, cellB2, 3, ['3.'], '');

    // check for period
    resultDocument = await addToken(testDocument1, '.', userYvonne);
    checkCell(resultDocument, cellB2, 3, ['3.'], '');

    // check for back space
    resultDocument = await removeToken(testDocument1, userYvonne);
    checkCell(resultDocument, cellB2, 3, ['3'], '');

    // check for request view cell
    resultDocument = await requestViewCell(testDocument1, cellB2, userJose);
    checkFormulaAndDisplay(resultDocument, '3', '3');

    // check for request view cell on another cell
    resultDocument = await requestViewCell(testDocument1, cellA1, userJose);
    checkFormulaAndDisplay(resultDocument, '12 + B2', '15');


    resultDocument = await requestEditCell(testDocument1, cellC3, userJose);
    checkFormulaAndDisplay(resultDocument, '', '');

    resultDocument = await addToken(testDocument1, '4', userJose);
    checkFormulaAndDisplay(resultDocument, '4', '4');

    resultDocument = await addToken(testDocument1, '4', userJose);
    checkFormulaAndDisplay(resultDocument, '44', '44');

    resultDocument = await clearFormula(testDocument1, userJose);
    checkFormulaAndDisplay(resultDocument, '', '');
    checkCell(resultDocument, cellC3, 0, [], '#EMPTY!');

    // Check for request document
    resultDocument = await getDocument(testDocument2, userJose);
    checkFormulaAndDisplay(resultDocument, '', '');
    checkCell(resultDocument, cellA1, 0, [], '#EMPTY!');

    resultDocument = await requestEditCell(testDocument2, cellA1, userYvonne);
    resultDocument = await addToken(testDocument2, '1', userYvonne);
    resultDocument = await requestViewCell(testDocument2, cellA1, userYvonne);
    checkFormulaAndDisplay(resultDocument, '1', '1');
    checkCell(resultDocument, cellA1, 1, ['1'], '');

    resultDocument = await getDocument(testDocument1, userJose);
    resultDocument = await requestViewCell(testDocument1, cellA1, userJose);
    checkFormulaAndDisplay(resultDocument, '12 + B2', '15');


    // check for failed request edit cell
    // user 1 requests edit
    resultDocument = await requestEditCell(testDocument1, cellA1, userJuancho);
    checkFormulaAndDisplay(resultDocument, '12 + B2', '15');
    checkIsEditing(resultDocument, true);

    // user 2 requests edit and fails
    resultDocument = await requestEditCell(testDocument1, cellA1, userYvonne);
    checkFormulaAndDisplay(resultDocument, '12 + B2', '15');
    checkIsEditing(resultDocument, false);

    // user 1 adds a +
    resultDocument = await addToken(testDocument1, '+', userJuancho);
    checkFormulaAndDisplay(resultDocument, '12 + B2 +', '#ERR');

    // user 2 requests view and sees the change
    resultDocument = await requestViewCell(testDocument1, cellA1, userYvonne);
    checkFormulaAndDisplay(resultDocument, '12 + B2 +', '#ERR');

    // user1 releases the cell
    resultDocument = await requestViewCell(testDocument1, cellA1, userJuancho);
    checkIsEditing(resultDocument, false);

    // user2 requests edit to fix the bug
    resultDocument = await requestEditCell(testDocument1, cellA1, userYvonne);
    checkFormulaAndDisplay(resultDocument, '12 + B2 +', '#ERR');
    checkIsEditing(resultDocument, true);

    // user2 adds a 1
    resultDocument = await addToken(testDocument1, '1', userYvonne);
    checkFormulaAndDisplay(resultDocument, '12 + B2 + 1', '16');

    // user1 requests Edit and faile
    resultDocument = await requestEditCell(testDocument1, cellA1, userJuancho);
    checkFormulaAndDisplay(resultDocument, '12 + B2 + 1', '16');
    checkIsEditing(resultDocument, false);
    checkErrorOccured(resultDocument, 'Cell is being edited by yvonne');

    // user Jose is going to try to make a loop in Document 3
    resultDocument = await requestViewCell(testDocument3, cellA1, userJose);
    resultDocument = await requestEditCell(testDocument3, cellA1, userJose);
    resultDocument = await addCell(testDocument3, cellB2, userJose);
    resultDocument = await requestViewCell(testDocument3, cellB2, userJose);
    resultDocument = await requestEditCell(testDocument3, cellB2, userJose);
    resultDocument = await addCell(testDocument3, cellA1, userJose);
    checkErrorOccured(resultDocument, 'Circular dependency detected, A1 cannot depend on B2');








}

// call the test runner

runTests();