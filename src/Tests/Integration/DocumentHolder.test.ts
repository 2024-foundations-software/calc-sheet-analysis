import fs from 'fs';
import path from 'path';

import { DocumentHolder } from '../../Engine/DocumentHolder';

let documentHolder: DocumentHolder;

const documentTestPath = 'documents';
const documentTestPathFull = path.join(__dirname, '..', '..', '..', documentTestPath);

beforeAll(() => {
    // remove the test documents folder if it exists
    if (fs.existsSync(documentTestPathFull)) {
        fs.rmdirSync(documentTestPathFull, { recursive: true });
    }
    documentHolder = new DocumentHolder("documents");

});




describe('DocumentHolder', () => {
    describe('constructor', () => {
        it('should create a document holder', () => {
            const documentHolder = new DocumentHolder(documentTestPath);
            // the document should be in the right folder

            const result = fs.existsSync(documentTestPathFull);

            expect(fs.existsSync(documentTestPathFull)).toBeTruthy();

        });
    });


    describe('createDocument', () => {
        it('should create a document', () => {
            const sheetTestName = 'test' + 1
            const userName = 'testUser';
            const documentHolder = new DocumentHolder(documentTestPath);
            documentHolder.createDocument('test1', 2, 2, userName);


            expect(documentHolder).toBeDefined();
        });
    });

    describe('getDocument', () => {
        it('should get a document', () => {
            const sheetTestName = 'test' + 2
            const userName = 'testUser';
            const documentHolder = new DocumentHolder(documentTestPath);
            documentHolder.createDocument(sheetTestName, 2, 2, userName);

            documentHolder.requestViewAccess(sheetTestName, 'A1', userName);
            const documentJSON = documentHolder.getDocumentJSON(sheetTestName, 'testUser');
            // unpack the JSON
            const document = JSON.parse(documentJSON);

            expect(document).toBeDefined();
            expect(document.columns).toEqual(2);
            expect(document.rows).toEqual(2);
            expect(document.cells).toBeDefined();
            expect(document.cells["A1"]).toBeDefined();
            expect(document.cells["A1"].formula).toEqual([]);
            expect(document.cells["A1"].value).toEqual(0);
            expect(document.cells["A1"].error).toEqual("#EMPTY!");
        });
    });

    it('should delete files that start with xxx', () => {
        // Create some test files
        // create the path for each file
        const file1 = path.join(documentTestPathFull, 'xxx1.json');
        const file2 = path.join(documentTestPathFull, 'xxx2.json');

        fs.writeFileSync(file1, '{"columns":2,"rows":2,"cells":{"A1":{"formula":[],"value":0,"error":"#EMPTY!"},"A2":{"formula":[],"value":0,"error":"#EMPTY!"},"B1":{"formula":[],"value":0,"error":"#EMPTY!"},"B2":{"formula":[],"value":0,"error":"#EMPTY!"}}}');
        fs.writeFileSync(file2, '{"columns":2,"rows":2,"cells":{"A1":{"formula":[],"value":0,"error":"#EMPTY!"},"A2":{"formula":[],"value":0,"error":"#EMPTY!"},"B1":{"formula":[],"value":0,"error":"#EMPTY!"},"B2":{"formula":[],"value":0,"error":"#EMPTY!"}}}');


        // Call the _cleanFiles function
        documentHolder['_cleanFiles']();

        // Check that the xxx files were deleted
        expect(fs.existsSync(file1)).toBe(false);
        expect(fs.existsSync(file2)).toBe(false);


    });

    it('should not add a new document if the document already exists', () => {
        const sheetTestName = 'test' + 3.55
        const userName = 'testUser';
        const documentHolder = new DocumentHolder(documentTestPath);
        let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);
        expect(result).toBeTruthy();
        result = documentHolder.createDocument(sheetTestName, 2, 2, userName);
        expect(result).toBeFalsy();
    });



    it(' add a new controller when a new document is created', () => {
        const sheetTestName = 'NewFiletest' + 3.1
        const userName = 'testUser';
        const documentHolder = new DocumentHolder(documentTestPath);
        const file1 = path.join(documentTestPathFull, sheetTestName + '.json');
        fs.writeFileSync(file1, '{"columns":2,"rows":2,"cells":{"A1":{"formula":[],"value":0,"error":"#EMPTY!"},"A2":{"formula":[],"value":0,"error":"#EMPTY!"},"B1":{"formula":[],"value":0,"error":"#EMPTY!"},"B2":{"formula":[],"value":0,"error":"#EMPTY!"}}}');


        // get the controller
        const names = documentHolder.getDocumentNames();
        expect(names).toContain(sheetTestName);
        const controller = documentHolder['_documents'].get(sheetTestName);
        expect(controller).toBeDefined();

        fs.unlinkSync(file1); // get rid of the file now

    });

    describe('accessing a document', () => {
        describe('Formula Editing', () => {
            it('should add a token to the current formula', () => {
                const sheetTestName = 'test' + 3
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);



                const accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);

                const documentJSON = documentHolder.addToken(sheetTestName, '1', userName,);

                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["A1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be 1
                expect(formula).toEqual(["1"]);
            });

            it('should add a second token to the current formula', () => {
                const sheetTestName = 'test' + 4
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                const accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);
                documentHolder.addToken(sheetTestName, '1', userName);
                const documentJSON = documentHolder.addToken(sheetTestName, '+', userName);

                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["A1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be 1
                expect(formula).toEqual(["1", "+"]);
            });

            it('should not add a cell that references to itself', () => {
                const sheetTestName = 'test' + 5
                const documentHolder = new DocumentHolder(documentTestPath);

                const userName = 'testUser';
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);
                const accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);


                const documentJSON = documentHolder.addCell(sheetTestName, 'A1', userName);


                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["A1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be 1
                expect(formula).toEqual([]);
            });

            it('should add a cell that references another cell', () => {
                const sheetTestName = 'test' + 6
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);



                const accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);


                const documentJSON = documentHolder.addCell(sheetTestName, 'A2', userName);

                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["A1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be ["A2"] and the error "#REF!"
                expect(formula).toEqual(["A2"]);

                const error = cell.error;
                expect(error).toEqual("#REF!");

            });

            it('should be able to edit A1 and A2', () => {
                const sheetTestName = 'test' + 7
                const documentHolder = new DocumentHolder(documentTestPath);
                const userName = 'testUser';
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);


                documentHolder.addCell(sheetTestName, 'A2', userName);
                const viewAccess = documentHolder.requestViewAccess(sheetTestName, 'A2', userName);
                accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);
                const documentJSON = documentHolder.addToken(sheetTestName, '1', userName);

                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cellA1 = document.cells["A1"]
                // get the formula from the cell
                const formula = cellA1.formula;
                // the formula should be ["A2"] and the error "" and the value 1
                expect(formula).toEqual(["A2"]);

                const error = cellA1.error;
                expect(error).toEqual("");

                const value = cellA1.value;
                expect(value).toEqual(1);

                const cellA2 = document.cells["A2"]

                const formulaA2 = cellA2.formula;
                // the formula should be ["1"] and the error "" and the value 1
                expect(formulaA2).toEqual(["1"]);

                const errorA2 = cellA2.error;
                expect(errorA2).toEqual("");

                const valueA2 = cellA2.value;
                expect(valueA2).toEqual(1);
            });

            it('should not allow a user to edit a cell that is being edited by another user', () => {
                const sheetTestName = 'test' + 7.1
                const documentHolder = new DocumentHolder(documentTestPath);
                const userName = 'testUser';
                const otherUserName = 'otherUser';
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);
                // this is a regression test where the other user would view the current cell
                // then they would view and edit another cell
                // then they would stop editing that cell and come back to the A1 cell and enter a
                // token.

                let viewAccess = documentHolder.requestViewAccess(sheetTestName, 'A1', otherUserName);
                accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', otherUserName);
                expect(accessOK).toBeFalsy();

                documentHolder.requestViewAccess(sheetTestName, 'A2', otherUserName);
                accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', otherUserName);
                expect(accessOK).toBeTruthy();
                documentHolder.requestViewAccess(sheetTestName, 'A2', otherUserName);
                documentHolder.requestViewAccess(sheetTestName, 'A1', otherUserName);

                accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', otherUserName);
                expect(accessOK).toBeFalsy();
            });


            it('should remove a token from the formula', () => {
                const sheetTestName = 'test' + 8
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);


                const documentJSON = documentHolder.addCell(sheetTestName, 'A2', userName);

                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["A1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be ["A2"] and the error "#REF!"
                expect(formula).toEqual(["A2"]);

                const error = cell.error;
                expect(error).toEqual("#REF!");

                const documentJSON2 = documentHolder.removeToken(sheetTestName, userName);

                // unpack the JSON
                const document2 = JSON.parse(documentJSON2);

                // get the cell A1 from the cells
                const cell2 = document2.cells["A1"]
                // get the formula from the cell
                const formula2 = cell2.formula;
                // the formula should be [] and the error "#EMPTY!"
                expect(formula2).toEqual([]);

                const error2 = cell2.error;
                expect(error2).toEqual("#EMPTY!");

            });

            it('should not add a cell that makes a loop', () => {
                const sheetTestName = 'test' + 9
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);
                let viewAccess = documentHolder.requestViewAccess(sheetTestName, 'A1', userName);
                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);


                documentHolder.addCell(sheetTestName, 'A2', userName);
                viewAccess = documentHolder.requestViewAccess(sheetTestName, 'A2', userName);
                accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);
                documentHolder.addCell(sheetTestName, 'B1', userName);
                viewAccess = documentHolder.requestViewAccess(sheetTestName, 'B1', userName);
                accessOK = documentHolder.requestEditAccess(sheetTestName, 'B1', userName);

                const documentJSON = documentHolder.addCell(sheetTestName, 'A1', userName);



                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["B1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be [""] and the error "#EMPTY!"
                expect(formula).toEqual([]);

                const error = cell.error;
                expect(error).toEqual("#EMPTY!");

            });

            it('should clear the formula', () => {
                const sheetTestName = 'test' + 10
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);


                documentHolder.addCell(sheetTestName, 'A2', userName);
                const documentJSON = documentHolder.addToken(sheetTestName, '+', userName);

                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["A1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be ["A2"] and the error "#REF!"
                expect(formula).toEqual(["A2", "+"]);

                const documentJSON2 = documentHolder.clearFormula(sheetTestName, userName);

                // unpack the JSON
                const document2 = JSON.parse(documentJSON2);

                // get the cell A1 from the cells
                const cell2 = document2.cells["A1"]
                // get the formula from the cell
                const formula2 = cell2.formula;

                // the formula should be [] and the error "#EMPTY!"
                expect(formula2).toEqual([]);

                const error = cell2.error;
                expect(error).toEqual("#EMPTY!");

            });

            it('should not clear the formula if not owner', () => {
                const sheetTestName = 'test' + 10.1
                const userName = 'testUser';
                const otherUserName = 'otherUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);


                documentHolder.addCell(sheetTestName, 'A2', userName);
                const documentJSON = documentHolder.addToken(sheetTestName, '+', userName);

                // unpack the JSON
                const document = JSON.parse(documentJSON);

                // get the cell A1 from the cells
                const cell = document.cells["A1"]
                // get the formula from the cell
                const formula = cell.formula;
                // the formula should be ["A2"] and the error "#REF!"
                expect(formula).toEqual(["A2", "+"]);


                let documentJSON2 = documentHolder.clearFormula(sheetTestName, otherUserName);



                // unpack the JSON
                const document2 = JSON.parse(documentJSON2);

                // get the cell A1 from the cells
                const cell2 = document2.cells["A1"]
                // get the formula from the cell
                const formula2 = cell2.formula;

                // the formula should be [] and the error "#EMPTY!"
                expect(formula2).toEqual(["A2", "+"]);

            });

            it('should return the FormulaString for the controler', () => {
                const sheetTestName = 'test' + 11
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);

                documentHolder.addToken(sheetTestName, '2', userName);
                documentHolder.addToken(sheetTestName, '+', userName);
                const documentJSON = documentHolder.addToken(sheetTestName, '2', userName);

                const formulaString = documentHolder.getFormulaString(sheetTestName, userName);

                expect(formulaString).toEqual("2 + 2");

                const resultString = documentHolder.getResultString(sheetTestName, userName);

                expect(resultString).toEqual("4");
            });

            it('should return the working cell label when it is set to A2', () => {
                const sheetTestName = 'test' + 12
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);


                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);

                documentHolder.addToken(sheetTestName, '2', userName);
                documentHolder.addToken(sheetTestName, '+', userName);
                const documentJSON = documentHolder.addToken(sheetTestName, '2', userName);

                const label = documentHolder.getWorkingCellLabel(sheetTestName, userName);


                expect(label).toEqual("A2");

                const formulaString = documentHolder.getFormulaString(sheetTestName, userName);

                expect(formulaString).toEqual("2 + 2");

                const resultString = documentHolder.getResultString(sheetTestName, userName);

                expect(resultString).toEqual("4");


            });


            it('should return true if the user has edit access then they request view Access', () => {
                const sheetTestName = 'test' + 14
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);

                const viewAccess = documentHolder.requestViewAccess(sheetTestName, 'A2', userName);

                expect(viewAccess).toBeTruthy();

            });

            it('should return false if another user has edit access then they request view Access', () => {
                const sheetTestName = 'test' + 15
                const userName = 'testUser';
                const otherUserName = 'otherUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, otherUserName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', otherUserName);
                const viewAccess = documentHolder.requestViewAccess(sheetTestName, 'A2', userName);
                const editAccess = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);

                expect(editAccess).toBeFalsy();

            });

            it('should return true if editing one cell then asking to edit another', () => {
                const sheetTestName = 'test' + 16
                const userName = 'testUser';

                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 4, 4, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);

                const editAccess = documentHolder.requestEditAccess(sheetTestName, 'A3', userName);

                expect(editAccess).toBeTruthy();

            });


            it('should return true if the user has edit access then they request edit Access', () => {
                const sheetTestName = 'test' + 17
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);

                const viewAccess = documentHolder.requestEditAccess(sheetTestName, 'A2', userName);

                expect(viewAccess).toBeTruthy();

            });



            it('should return the formula string for the selected cell even if it cannot edit', () => {
                const sheetTestName = 'test' + 18
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                const otherUserName = 'otherUser';
                let accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', userName);
                documentHolder.addToken(sheetTestName, '2', userName);
                documentHolder.addToken(sheetTestName, '+', userName);
                documentHolder.addToken(sheetTestName, '2', userName);
                const viewAccess = documentHolder.requestViewAccess(sheetTestName, 'A1', otherUserName);
                accessOK = documentHolder.requestEditAccess(sheetTestName, 'A1', otherUserName);
                const resultString = documentHolder.getResultString(sheetTestName, otherUserName);
                expect(resultString).toEqual("4");

                documentHolder.addToken(sheetTestName, '+', otherUserName);
                const formulaString = documentHolder.getFormulaString(sheetTestName, otherUserName);
                expect(formulaString).toEqual("2 + 2");


            });

            it('Should not add a cell reference if the user is not editing', () => {
                const sheetTestName = 'test' + 19
                const userName = 'testUser';
                const documentHolder = new DocumentHolder(documentTestPath);
                let result = documentHolder.createDocument(sheetTestName, 2, 2, userName);

                let accessOK = documentHolder.requestViewAccess(sheetTestName, 'A1', userName);
                documentHolder.addCell(sheetTestName, 'A2', userName)


                const formulaString = documentHolder.getFormulaString(sheetTestName, userName);
                expect(formulaString).toEqual("");


            });
        });
    });

});