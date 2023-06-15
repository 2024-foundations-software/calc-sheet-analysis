/**
 * 
 * this is the database for the calc sheet
 * 
 * it will store a set of documents in memory that is stored in a file
 * 
 * the file will be in ~/tmp/calcSheetDatabase.json
 * 
 * the file will be a json file with the following format:
 * 
 * {
 *  "documents": [
 *     {
 *      "id": "12345678",
 *     "document": {
 *        "name": "my document",
 *       "cells": [
 *         {
 *          "id": "A1",
 *         "value": ["1" + "2"]
 *       },
 *      {
 *        "id": "A2",
 *      "value":" ["2" + "3"]
 * }
 * 
 * ]
 * }
 * }
 * ]
 * }
 * 
 * 
 * */
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CalcSheetDatabase {

  /** a private dictionary of all the documents indexed by a key */
  private documents: Record<string, CalcSheetDocument> = {};
  // get the path to the user home directory

  private homePath = process.env.HOME || process.env.USERPROFILE;
  private databasePath = this.homePath+"/tmp/calcSheetDatabase.json"

  constructor() {
    this.loadDataFromDisk();
    console.log("CalcSheetDatabase: loaded " + Object.keys(this.documents).length + " documents");
  }

  /**
   * @function listDocuments
   * @description lists the documents in the database
   * @returns {string[]}
   * 
   * @example
   * 
   * const documents = listDocuments();
   * 
   * // documents = ["12345678", "87654321"]
   * 
   * */
  listDocuments(): string[] {
    return Object.keys(this.documents);
  }

  /**
   * @function getDocument
   * @description gets a document from the database
   * @param {string} id - the id of the document to get
   * 
   * @returns undefined if the document does not exist
   * @returns {CalcSheetDocument} if the document exists
   * 
   * */
  getDocument(id: string):  CalcSheetDocument | undefined {
    if (!this.documents[id]) {
      return undefined;
    }
    return this.documents[id];
  }
/**
 * @function setDocument
 * @description sets a document in the database
 * @param {CalcSheetDocument} document - the document to set
 * @returns {string} the id of the document
 * 
 * */
  setDocument( document: CalcSheetDocument):string {
    // generate a unique id for the document
    const id = uuidv4();

    // set the document in the database
    this.documents[id] = document;
    this.saveDataToDisk();
    return id;
  }

  /**
   * @function deleteDocument
   * @description deletes a document from the database
   * @param {string} id - the id of the document to delete
   * 
   * */
  deleteDocument(id: string): void {
    // check if the document exists
    if (!this.documents[id]) {
      console.log("document ["+id+"] does not exist");
      return;
    }
    delete this.documents[id];
    this.saveDataToDisk();
  }

  /** make a json blob with the current value of the database ID
   * and the documents
   */
  saveDataToDisk(): void {

    let filePath = this.databasePath;
    let fileContents = JSON.stringify(this.documents);
    // write the file
    fs.writeFileSync(filePath, fileContents);
  }

  loadDataFromDisk(): void {
    // load the data from disk
    let filePath = this.databasePath;
    if (!fs.existsSync(filePath)) {
      this.documents = {};
      return;
    }
    let fileContents = fs.readFileSync(filePath, "utf8");
    this.documents = JSON.parse(fileContents);
  }

  deleteAllDocuments(): void {
    this.documents = {};
    this.saveDataToDisk();
  }

}

export default CalcSheetDatabase;