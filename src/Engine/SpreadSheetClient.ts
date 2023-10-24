/** this is the class for the front end to prepare the fetch
 * requests to the server for the spreadsheet
 * 
 * it is used by SpreadSheet.tsx
 * 
 * It provides the following calls.
 * 
 * getDocument(name: string, user: string): Promise<Document>
 */

import { DocumentTransport, CellTransport, CellTransportMap, ErrorMessages, UserEditing } from '../Engine/GlobalDefinitions';
import { Cell } from '../Engine/Cell';

import { PortsGlobal, LOCAL_SERVER_URL, RENDER_SERVER_URL } from '../ServerDataDefinitions';



class SpreadSheetClient {

    // get the environment variable SERVER_LOCAL 
    // if it is true then use the local server
    // otherwise use the render server



    private _serverPort: number = PortsGlobal.serverPort;
    private _baseURL: string = `${LOCAL_SERVER_URL}:${this._serverPort}`;
    private _userName: string = '';
    private _documentName: string = '';
    private _document: DocumentTransport;
    private _server: string = '';
    private _documentList: string[] = [];
    private _errorCallback: (error: string) => void = (error: string) => { };


    constructor(documentName: string, userName: string, errorCallback: (error: string) => void) {
        this._userName = userName;
        this._documentName = documentName;

        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction) {
            this.setServerSelector('renderhost');
            console.log(' Running production client')
        } else {
            this.setServerSelector('localhost');  // change this to renderhost if you want to default to renderhost
            console.log(' Running development client')
        }

        this._document = this._initializeBlankDocument();
        this._timedFetch();

        this._errorCallback = errorCallback;

        console.log(`process.env = ${JSON.stringify(process.env)}`);
        this.getDocuments(this._userName);

    }

    private _initializeBlankDocument(): DocumentTransport {
        const document: DocumentTransport = {
            columns: 5,
            rows: 8,
            formula: 'holding',
            result: 'holding',
            currentCell: 'A1',
            isEditing: false,
            cells: new Map<string, CellTransport>(),
            contributingUsers: [],
            errorOccurred: ''
        };
        for (let row = 0; row < document.rows; row++) {
            for (let column = 0; column < document.columns; column++) {
                const cellName = Cell.columnRowToCell(column, row);
                const cell: CellTransport = {
                    formula: [],
                    value: 0,
                    error: ErrorMessages.emptyFormula,
                    editing: '',
                };
                document.cells.set(cellName, cell);
            }
        }
        return document;
    }


    /**
     * 
     * Every .1 seconds, fetch the document from the server
     * call this.getDocument(name, user) to get the document
     * and this.getDocuments(user) to get the list of documents
     */

    private async _timedFetch(): Promise<Response> {

        // only get the document list every 2 seconds
        let documentListInterval = 20;
        let documentFetchCount = 0;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.getDocument(this._documentName, this._userName);
                documentFetchCount++;
                if (documentFetchCount > documentListInterval) {
                    documentFetchCount = 0;
                    this.getDocuments(this._userName);
                }
                this._timedFetch();
            }, 100);
        });
    }

    public get userName(): string {
        return this._userName;
    }

    public set userName(userName: string) {
        this._userName = userName;
    }

    public get documentName(): string {
        return this._documentName;
    }

    public set documentName(documentName: string) {
        this._documentName = documentName;
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

        const result = this._document.result;
        if (result) {
            return result;
        }
        return '';
    }

    private _getCellValue(cellTransport: CellTransport): string {
        if (cellTransport.error === '') {
            return cellTransport.value.toString();
        } else if (cellTransport.error === ErrorMessages.emptyFormula) {
            return '';
        } else {
            return cellTransport.error;
        }
    }

    getSheets(): string[] {
        return this._documentList;
    }


    // Interim solution for pushing the editing data through to the GUI
    // we will add a | to each cell value and we will then add the name of 
    // the user who is editing that cell.   If there is no user then the 
    // user is blank.  This is a hack to get the data through to the GUI
    public getSheetDisplayStringsForGUI(): string[][] {
        if (!this._document) {
            return [];
        }
        const columns = this._document.columns;
        const rows = this._document.rows;
        const cells: Map<string, CellTransport> = this._document.cells as Map<string, CellTransport>;
        const sheetDisplayStrings: string[][] = [];
        // create a 2d array of strings that is [row][column]



        for (let row = 0; row < rows; row++) {
            sheetDisplayStrings[row] = [];
            for (let column = 0; column < columns; column++) {
                const cellName = Cell.columnRowToCell(column, row)!;
                const cell = cells.get(cellName) as CellTransport;
                if (cell) {
                    // add the cell value and the editing status
                    sheetDisplayStrings[row][column] = this._getCellValue(cell) + "|" + cell.editing;
                } else {
                    throw new Error(`cell ${cellName} not found`);
                }
            }
        }
        return sheetDisplayStrings;
    }

    public getEditStatusString(): string {
        if (!this._document) {
            return 'no document';
        }
        if (this._document.isEditing) {
            return `editing: ${this._document.currentCell}`;
        }
        return `viewing: ${this._document.currentCell}`;
    }

    public getWorkingCellLabel(): string {
        if (!this._document) {
            return '';
        }
        return this._document.currentCell;
    }

    public getEditStatus(): boolean {
        return this._document.isEditing;
    }

    /**
     * ask for permission to edit a cell
     * @param bool 
     * @returns 
     */
    public setEditStatus(isEditing: boolean): void {

        // request edit status of the current cell
        const body = {
            "userName": this._userName,
            "cell": this._document.currentCell
        };
        let requestEditViewURL = `${this._baseURL}/document/cell/view/${this._documentName}`;
        if (isEditing) {
            requestEditViewURL = `${this._baseURL}/document/cell/edit/${this._documentName}`;
        }

        fetch(requestEditViewURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                return response.json() as Promise<DocumentTransport>;
            }).then((document: DocumentTransport) => {
                this._updateDocument(document);
            });
    }



    public addToken(token: string): void {

        const body = {
            "userName": this._userName,
            "token": token
        };

        const requestAddTokenURL = `${this._baseURL}/document/addtoken/${this._documentName}`;
        fetch(requestAddTokenURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {

                return response.json() as Promise<DocumentTransport>;
            }
            ).then((document: DocumentTransport) => {
                this._updateDocument(document);
            });
    }

    public addCell(cell: string): void {
        const requestAddCellURL = `${this._baseURL}/document/addcell/${this._documentName}`;

        const body = {
            "userName": this._userName,
            "cell": cell
        };

        fetch(requestAddCellURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                return response.json() as Promise<DocumentTransport>;
            }
            ).then((document: DocumentTransport) => {
                this._updateDocument(document);
            });

    }

    public removeToken(): void {
        const requestRemoveTokenURL = `${this._baseURL}/document/removetoken/${this._documentName}`;
        fetch(requestRemoveTokenURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userName": this._userName })
        })
            .then(response => {
                return response.json() as Promise<DocumentTransport>;
            }
            ).then((document: DocumentTransport) => {
                this._updateDocument(document);
            });
    }

    public requestViewByLabel(label: string): void {
        const requestViewURL = `${this._baseURL}/document/cell/view/${this._documentName}`;

        const body = {
            "userName": this._userName,
            "cell": label
        };
        fetch(requestViewURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                return response.json() as Promise<DocumentTransport>;
            }).then((document: DocumentTransport) => {
                this._updateDocument(document);
            });
    }

    public clearFormula(): void {
        const requestClearFormulaURL = `${this._baseURL}/document/clear/formula/${this._documentName}`;
        fetch(requestClearFormulaURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userName": this._userName })
        })
            .then(response => {
                return response.json() as Promise<DocumentTransport>;
            }).then((document: DocumentTransport) => {
                this._updateDocument(document);
            });
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
        if (name === "documents") {
            return;  // This is not ready for production but for this assignment will do
        }
        const userName = user;
        const fetchURL = `${this._baseURL}/documents/${name}`;
        fetch(fetchURL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userName": userName })
        })
            .then(response => {
                return response.json() as Promise<DocumentTransport>;
            }).then((document: DocumentTransport) => {
                this._updateDocument(document);

            });

    }

    /**
     * get the document list from the server
     * 
     * @param user the user name
     * 
     * this is client side so we use fetch
     */
    public getDocuments(user: string) {
        // put the user name in the body
        const userName = user;
        const fetchURL = `${this._baseURL}/documents/`;
        fetch(fetchURL)
            .then(response => {
                return response.json() as Promise<string[]>;
            }).then((documents: string[]) => {
                this._updateDocumentList(documents);
            });

    }


    private _getEditorString(contributingUsers: UserEditing[], cellLabel: string): string {
        for (let user of contributingUsers) {
            if (user.cell === cellLabel) {
                return user.user;
            }
        }
        return '';
    }

    private _updateDocumentList(documents: string[]): void {
        this._documentList = documents;
    }


    private _updateDocument(document: DocumentTransport): void {
        const formula = document.formula;
        const result = document.result;
        const currentCell = document.currentCell;
        const columns = document.columns;
        const rows = document.rows;
        const isEditing = document.isEditing;
        const contributingUsers = document.contributingUsers;
        const errorOccurred = document.errorOccurred;


        // create the document
        this._document = {
            formula: formula,
            result: result,

            currentCell: currentCell,
            columns: columns,
            rows: rows,
            isEditing: isEditing,
            cells: new Map<string, CellTransport>(),
            contributingUsers: contributingUsers,
            errorOccurred: errorOccurred
        };
        // create the cells
        const cells = document.cells as unknown as CellTransportMap;

        for (let cellName in cells) {

            let cellTransport = cells[cellName];
            const [column, row] = Cell.cellToColumnRow(cellName);
            const cell: CellTransport = {
                formula: cellTransport.formula,
                value: cellTransport.value,
                error: cellTransport.error,
                editing: this._getEditorString(contributingUsers, cellName)
            };
            this._document!.cells.set(cellName, cell);
        }
        if (errorOccurred !== '') {
            this._errorCallback(errorOccurred)
        }

    }

    /**
     * Server selector for the fetch
     */
    setServerSelector(server: string): void {
        if (server === this._server) {
            return;
        }
        if (server === 'localhost') {
            this._baseURL = `${LOCAL_SERVER_URL}:${this._serverPort}`;
        } else {
            this._baseURL = RENDER_SERVER_URL;
        }

        this.getDocument(this._documentName, this._userName);
        this._server = server;

    }
}


export default SpreadSheetClient;