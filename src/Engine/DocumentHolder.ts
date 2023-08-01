/**
 * Hold a number of spreadsheets in memory.
 * Each spreadsheet is a type of SpreadSheetController
 * The DocumentHolder exposes the methods of the SpreadSheetController
 * 
 * The document holder is called by a server to manage the documents
 * 
 * It provides a named access to controllers for these functions
 * 
 * addToken(token:string):  void
 * addCell(cell:string): void
 * removeToken(): void
 * clearFormula(): void
 * getFormulaString(): string
 * getResultString(): string
 * setWorkingCellByLabel(label:string): void
 * getWorkingCellLabel(): string
 * setWorkingCellByCoordinates(column:number, row:number): void
 * getSheetDisplayStringsForGUI(): string[][]
 * getEditStatus(): boolean
 * setEditStatus(bool:boolean): void
 * getEditStatusString(): string
 * 
 */
import * as fs from 'fs';
import * as path from 'path';
import { SpreadSheetController } from "./SpreadSheetController";


export class DocumentHolder {
    private _documents: Map<string, SpreadSheetController>;
    // the document folder defaults to a folder called documents in the current directory
    // this can be changed by calling setDocumentFolder
    private _documentFolder: string;

    constructor(documentDirectory: string = 'documents') {
        this._documents = new Map<string, SpreadSheetController>();

        const rootPath = path.join(__dirname, '..', '..');

        this._documentFolder = path.join(rootPath, documentDirectory);
        this._initializeDocumentDirectory();
        this._loadDocuments();
    }

    private _initializeDocumentDirectory(): void {
        if (!fs.existsSync(this._documentFolder)) {
            fs.mkdirSync(this._documentFolder, { recursive: true });
        }
    }

    private _loadDocuments(): void {
        const files = fs.readdirSync(this._documentFolder);
        files.forEach(file => {
            console.log(file)
            const documentPath = path.join(this._documentFolder, file);
            const documentJSON = fs.readFileSync(documentPath, 'utf8');

            // create a new controller
            const controller = SpreadSheetController.spreadsheetFromJSON(documentJSON)
            // add the controller to the map this assumes all files are .json
            this._documents.set(file.slice(0, -5), controller);

        }
        );
    }



    private _saveDocument(name: string): void {
        let document = this._documents.get(name);
        if (document) {
            let documentJSON = document.sheetToJSON();
            const documentPath = path.join(this._documentFolder, name + '.json');
            fs.writeFileSync(documentPath, documentJSON);
        }
    }

    public getDocumentNames(): string[] {
        const documentNames = Array.from(this._documents.keys());
        return documentNames;
    }

    public createDocument(name: string, columns: number, rows: number): boolean {
        if (this._documents.has(name)) {
            return false
        }
        let document = new SpreadSheetController(columns, rows);
        this._documents.set(name, document);
        this._saveDocument(name);

        return true;
    }

    public getDocument(name: string): string {
        let document = this._documents.get(name);
        if (document) {
            // get the json string for the controler
            const documentJSON = document.sheetToJSON();
            return documentJSON;
        }
        throw new Error('Document not found');
    }

    public addToken(docName: string, user: string, token: string): string {
        let document = this._documents.get(docName);
        if (document) {
            document.addToken(token, user);
            this._saveDocument(docName);
            // get the json string for the controler
            const documentJSON = document.sheetToJSON();
            return documentJSON;
        }
        throw new Error('Document not found');

    }

    public addCell(name: string, cell: string): string {
        let document = this._documents.get(name);
        if (document) {
            document.addCell(cell);
            this._saveDocument(name);
            // get the json string for the controler
            const documentJSON = document.sheetToJSON();
            return documentJSON;
        }
        throw new Error('Document not found');
    }

    public removeToken(name: string): string {
        let document = this._documents.get(name);
        if (document) {
            document.removeToken();
            this._saveDocument(name);
            // get the json string for the controler
            const documentJSON = document.sheetToJSON();
            return documentJSON;
        }
        throw new Error('Document not found');
    }

    public clearFormula(name: string): string {
        let document = this._documents.get(name);
        if (document) {
            document.clearFormula();
            this._saveDocument(name);
            // get the json string for the controler
            const documentJSON = document.sheetToJSON();
            return documentJSON;
        }
        throw new Error('Document not found');
    }

    public getFormulaString(name: string): string {
        let document = this._documents.get(name);
        if (document) {
            const formulaString = document.getFormulaString();
            return formulaString;
        }
        throw new Error('Document not found');
    }

    public getResultString(name: string): string {
        let document = this._documents.get(name);
        if (document) {
            const resultString = document.getResultString();
            return resultString;
        }
        throw new Error('Document not found');
    }

    public getWorkingCellLabel(name: string): string {
        let document = this._documents.get(name);
        if (document) {
            const workingCellLabel = document.getWorkingCellLabel();
            return workingCellLabel;
        }
        throw new Error('Document not found');
    }


    public setWorkingCellByLabel(name: string, label: string): string {
        let document = this._documents.get(name);
        if (document) {
            document.setWorkingCellByLabel(label);
            this._saveDocument(name);
            // get the json string for the controler
            const documentJSON = document.sheetToJSON();
            return documentJSON;
        }
        throw new Error('Document not found');
    }

    public getEditStatus(name: string): boolean {
        let document = this._documents.get(name);
        if (document) {
            const editStatus = document.getEditStatus();
            return editStatus;
        }
        throw new Error('Document not found');
    }

    public setEditStatus(name: string, bool: boolean): string {
        let document = this._documents.get(name);
        if (document) {
            document.setEditStatus(bool);
            this._saveDocument(name);
            // get the json string for the controler
            const documentJSON = document.sheetToJSON();
            return documentJSON;
        }
        throw new Error('Document not found');
    }

    public getEditStatusString(name: string): string {
        let document = this._documents.get(name);
        if (document) {
            const editStatusString = document.getEditStatusString();
            return editStatusString;
        }
        throw new Error('Document not found');
    }




}

