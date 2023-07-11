
import CalcSheetServerClient from "../src/CalcSheetServerClient";
import DocumentGenerator from "../src/DocumentGenerator";
import startCalcSheetServerApp from "../src/CalcSheetServerApp";




const testPort = 3001;

let documentGenerator: DocumentGenerator;


beforeAll(() => {
    startCalcSheetServerApp(testPort);
    documentGenerator = new DocumentGenerator();
});


describe('CalcSheetServerClient', () => {

    it('should reset the database', async () => {
        const client = new CalcSheetServerClient(testPort);
        const result = await client.resetDatabase();

        const listDocuments = await client.listDocuments();

        expect(listDocuments).toBeDefined();
        expect(listDocuments).toHaveLength(0);
    });

    /* it('should create a document', async () => {
         const client = new CalcSheetServerClient(testPort);
 
         const sampleDocument = documentGenerator.generateDocument();
 
         const documentID = await client.sendDocument(sampleDocument);
         expect(documentID).toBeDefined();
     });
 
     it('should delete a document', async () => {
         const client = new CalcSheetServerClient(testPort);
 
         const sampleDocument = documentGenerator.generateDocument();
 
         const documentID = await client.sendDocument(sampleDocument);
         expect(documentID).toBeDefined();
 
         if (documentID === undefined) {
             console.log("documentID is undefined");
             throw new Error("documentID is undefined");
         }
         else {
 
             const result = await client.deleteDocument(documentID);
 
             const listDocuments = await client.listDocuments();
 
             expect(listDocuments).toBeDefined();
             expect(listDocuments).not.toContain(documentID);
         }
     });
 
     it('should be listing the sent document', async () => {
         const client = new CalcSheetServerClient(testPort);
 
         const documentsBefore = await client.listDocuments();
 
 
 
 
         const sampleDocument = documentGenerator.generateDocument();
         const documentID = await client.sendDocument(sampleDocument);
 
         if (documentID === undefined) {
             console.log("documentID is undefined");
             throw new Error("documentID is undefined");
         }
         expect(documentsBefore).not.toContain(documentID);
 
         const documentsAfter = await client.listDocuments();
 
         expect(documentsAfter).toContain(documentID);
 
     });*/

});

