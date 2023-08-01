/**
 * Hold a number of spreadsheets in memory.
 * Each spreadsheet is a type of SpreadSheetController
 * The DocumentHolder exposes the methods of the SpreadSheetController
 * 
 * The document holder is called by a server to manage the documents
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

    constructor() {
        this._documents = new Map<string, SpreadSheetController>();
        this._documentFolder = path.join(__dirname, 'documents');
        this._initializeDocumentDirectory();
        this._loadDocuments();
    }

    private _initializeDocumentDirectory(): void {
        if (!fs.existsSync(this._documentFolder)) {
            fs.mkdirSync(this._documentFolder, { recursive: true });
        }
    }

    private _saveDocument(name: string): void {
        let document = this._documents.get(name);
        if (document) {
            let documentJSON = document.sheetToJSON();

    public createDocument(name: string, columns: number, rows: number): void {
        let document = new SpreadSheetController(columns, rows);
        this._documents.set(name, document);
        this._saveDocument(name);
    }

