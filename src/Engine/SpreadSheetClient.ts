/** this is the class for the front end to prepare the fetch
 * requests to the server for the spreadsheet
 * 
 * it is used by SpreadSheet.tsx
 * 
 * It provides the following calls.
 * 
 * getDocument(name: string, user: string): Promise<Document>
 */

import { DocumentTransport, CellTransport, ErrorMessages } from '../Engine/GlobalDefinitions';
import { Cell } from '../Engine/Cell';

import { PortsGlobal } from '../PortsGlobal';



class SpreadSheetClient {
    private _serverPort: number = PortsGlobal.serverPort;
    private _baseURL: string = `http://localhost:${this._serverPort}`;
    private _userName: string = 'juancho';
    private _documentName: string = 'test';
    private _document: DocumentTransport;

    constructor(documentName: string, userName: string) {
        this._userName = userName;
        this._documentName = documentName;
        this.getDocument(this._documentName, this._userName);

        this._document = this._initializeBlankDocument();
    }

    private _initializeBlankDocument(): DocumentTransport {
        const document: DocumentTransport = {
            columns: 5,
            rows: 8,
            formula: 'holding',
            value: 'holding',
            currentCell: 'A1',
            cells: new Map<string, CellTransport>(),
        };
        for (let row = 0; row < document.rows; row++) {
            for (let column = 0; column < document.columns; column++) {
                const cellName = Cell.columnRowToCell(column, row);
                const cell: CellTransport = {
                    formula: [],
                    value: 0,
                    error: ErrorMessages.emptyFormula,
                };
                document.cells.set(cellName, cell);
            }
        }
        return document;
    }

    public getFormulaString(): string {
        if (!this._document) {
            return '';
        }
        const formula = this._document.formula;
        if (formula) {
            return formula
        }
        return '';
    }

    public getResultString(): string {
        if (!this._document) {
            return '';
        }
        const result = this._document.value;
        if (result) {
            return result;
        }
        return '';
    }

    public getSheetDisplayStringsForGUI(): string[][] {
        if (!this._document) {
            return [];
        }
        const columns = this._document.columns;
        const rows = this._document.rows;
        const cells: Map<string, CellTransport> = this._document.cells;
        const sheetDisplayStrings: string[][] = [];
        // create a 2d array of strings that is [row][column]
        for (let row = 0; row < rows; row++) {
            sheetDisplayStrings[row] = [];
            for (let column = 0; column < columns; column++) {
                const cellName = Cell.columnRowToCell(column, row)!;
                const cell = cells.get(cellName);
                if (cell) {
                    if (cell.error === '') {
                        sheetDisplayStrings[row][column] = cell.value.toString();
                    } else if (cell.error === ErrorMessages.emptyFormula) {
                        sheetDisplayStrings[row][column] = '';
                    } else {
                        sheetDisplayStrings[row][column] = cell.error;
                    }
                } else {
                    sheetDisplayStrings[row][column] = 'XXX';
                }
            }
        }
        return sheetDisplayStrings;
    }

    public getEditStatusString(): string {
        return "edit status string";
    }

    public getWorkingCellLabel(): string {
        if (!this._document) {
            return '';
        }
        return this._document.currentCell;
    }

    public getEditStatus(): boolean {
        return true;
    }

    public setEditStatus(bool: boolean): void {
        return;
    }

    public addToken(token: string): void {
        return;
    }

    public addCell(cell: string): void {
        return;
    }

    public removeToken(): void {
        return;
    }

    public setWorkingCellByLabel(label: string): void {
        return;
    }

    public clearFormula(): void {
        return;
    }



    /**
     * get the document from the server
     * 
     * @param name the name of the document
     * @param user the user name
     * 
     * this is client side so we use fetch
     */
    public getDocument(name: string, user: string) {
        // put the user name in the body
        const userName = user;
        const fetchURL = `${this._baseURL}/documents/${name}`;
        console.log(fetchURL);
        fetch(fetchURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userName": userName })
        })
            .then(response => {
                console.log(response);
                return response.json() as Promise<DocumentTransport>;
            }).then((document: DocumentTransport) => {
                this._document = document;
                console.log(document);

            });

    }
}

export default SpreadSheetClient;