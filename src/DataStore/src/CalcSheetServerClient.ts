// Import the http module

import axios from "axios";
import startCalcSheetServerApp from "./CalcSheetServerApp";
import DocumentGenerator from "./DocumentGenerator";


import { start } from "repl";
import { test } from "node:test";
import send from "send";

// Define an interface for the options object
interface RequestOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
}



class CalcSheetServerClient {

    port: number = 3001;
    serverPath: string = "http://localhost:" + this.port;


    constructor(port: number) {
        this.port = port;
    }

    // use the axios library to post a POST to /reset
    public resetDatabase(): Promise<string | undefined> {
        return new Promise((resolve, reject) => {


            let resetPath = this.serverPath + "/reset";
            axios.post(resetPath)
                .then((response) => {
                    resolve(response.data);
                }
                )
                .catch((error) => {
                    reject(error);
                }
                );

        });
    }
    /**
     * sendDocument, sends a document to the server
     
      * @param document
      * @returns the id of the document
      * 
      * */

    public async sendDocument(document: CalcSheetDocument): Promise<string | undefined> {
        let postPath = this.serverPath + "/documents";
        try {
            const response = await axios.post(postPath, document);
            const documentId = response.data;
            console.log(`Document ID: ${documentId}`);
            return documentId;
        } catch (error) {
            console.error(error);
        }
    }




    /**
     * getDocument
     * 
     * @param id 
     * @returns the document with the specified id
     */
    public async getDocument(id: string): Promise<CalcSheetDocument | undefined> {
        let getPath = this.serverPath + "/documents/" + id;
        try {
            const response = await axios.get(getPath);
            const document = response.data;
            console.log(`Document: ${document}`);
            return document;
        } catch (error) {
            console.error(error);
        }
    }

    public async listDocuments(): Promise<string[] | undefined> {
        let listPath = this.serverPath + "/documents";
        try {
            const response = await axios.get(listPath);
            const document = response.data;
            console.log(`Document: ${document}`);
            return document;
        }
        catch (error) {
            console.error(error);
        }

    }

    /**
     * deleteDocument
     * 
     * @param id
     * 
     * the server will return 204 if the document was deleted successfully
     * 
     * No content is returned
     * 
     * */
    public async deleteDocument(id: string): Promise<string | undefined> {
        let deletePath = this.serverPath + "/documents/" + id;
        try {
            const response = await axios.delete(deletePath);
            // check the status code
            if (response.status === 204) {
                console.log(`Document with id ${id} was deleted`);
                return id;
            }
        }
        catch (error) {
            console.error(error)
        }
    }
}


export default CalcSheetServerClient;