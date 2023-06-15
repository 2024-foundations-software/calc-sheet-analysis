
import startCalcSheetServerApp from "./CalcSheetServerApp";
import DocumentGenerator from "./DocumentGenerator";
import CalcSheetServerClient from "./CalcSheetServerClient";


const documentGenerator = new DocumentGenerator();


/**
 * a command line interface for the test server
 * 
 * this is a simple command line interface for the test server that allows you to test the server from the command line
 * 
 * 
 * this provides a prompt that allows you to enter commands
 * 
 * the commands are:
 * 
 * list: list all the documents on the server
 * 
 * get: get a document from the server (get list from server first, then get a random one, if no documnets, then error)
 * 
 * get documentId: do not fetch list from server, just get the document with the specified id (if no document with that id, then error)
 * 
 * post: post a document to the server (generate a new random one)
 * 
 * delete: delete a document from the server (test before and after with list documents)
 * 
 * delete: documentId: delete a document from the server (test before and after with list documents)
 * 
 * reset: delete all the documents from the server
 * 
 * 
 * help: print this help message
 * 
 * quit: quit the program
 */


function runCommandLineInterfaceWithPort(port: number): void {
  startCalcSheetServerApp(port);
  const client = new CalcSheetServerClient(port);

  function checkDocumentIdInServer(documentId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      client.listDocuments()
        .then(result => {
          const documents = result;
          if (documents === undefined) {
            reject("no documents");
          }
          else if (documents.length === 0) {
            reject("no documents");
          }
          else {
            // check to see if the document we sent is in the list
            let found = false;
            for (let i = 0; i < documents.length; i++) {
              if (documents[i] === documentId) {
                found = true;
                break;
              }
            }
          }

        })
        .catch(error => {
          reject(error);
        });
    });
  }

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  readline.setPrompt("\n type help for commands\n\tserver-tester : ");
  readline.prompt();

  readline.on('line', (line: string) => {
    console.log(`Received: ${line}`);
    const command = line.split(" ");
    switch (command[0]) {
      case "help":
        console.log("list: \tlist all the documents");
        console.log("get: \tget a random document from the server ");

        console.log("get id: get specific document");
        console.log("post: \tpost a new random document");

        console.log("delete: delete a document from the server ");
        console.log("delete id: delete a specific document from the server ");
        console.log("reset: \tdelete all the documents from the server");
        console.log("help: \tprint this help message")
        console.log("quit: \tquit the program");
        break;

      // reset the database.   this resets the database to the original state
      // it then reads the list of documents to make sure that the database is empty
      case "reset":
        client.resetDatabase()
          .then(result => {
            console.log("getting list of documents");
            console.log("to test if it is empty")
            return client.listDocuments();
          })
          .then(result => {
            if (result === undefined) {
              console.log("FAILURE: reset failed");
            }
            else {
              const documents = result;
              if (documents.length === 0) {
                console.log("SUCCESS: reset was successful");
              } else {
                console.log("FAILURE reset failed");
              }
            }
          })
          .catch(error => {
            console.error(error);
          });

        break

      // list the documents in the database
      case "list":
        client.listDocuments()
          .then(result => {
            // print out the result prefixed with "list was successful: " one id per line
            console.log("SUCCESS list was successful: ");
            console.log("The documents on the server are:")
            console.log("----------------------------------------------");
            const documents = result
            if (documents === undefined) {
              console.log("FAILURE: list failed");
            }
            else {
              documents.forEach((documentId: string) => {
                console.log("\t[" + documentId + "]");
              }
              );
            }

            console.log("----------------------------------------------");
          })
          .catch(error => {
            console.error(error);
          }
          );
        break;

      // There are two parts to this test
      // the first one is get with no parameters, in  this case we get a list of documents from the server
      // we pick a random one and get that document
      // the second one is get with a parameter, in this case we get a specific document from the server  
      case "get":
        if (command.length === 1) {
          client.listDocuments()
            .then(result => {
              if (result === undefined) {
                console.log("FAILURE: list failed");
              }
              else {
                console.log("list was successful: " + result);

                const documents = result;
                if (documents.length > 0) { // get a random document from the server
                  const index = Math.floor(Math.random() * documents.length);
                  const documentId = documents[index];
                  client.getDocument(documentId)
                    .then(document => {
                      console.log("get was successful");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }
              }
            })
            .catch(error => {
              console.error(error);
            }
            )
            .catch(error => {
              console.error(error);
            }
            );
        }
        else {
          client.getDocument(command[1])
            .then(document => {
              console.log("get was successful");
            })
            .catch(error => {
              console.log(error);
            });
        }
        break;

      // post a new document to the server
      // first we generate a new document
      // then we post it to the server
      // then we get it back from the server
      // then we compare the two documents
      case "post":
        let newDocument = documentGenerator.generateDocument();
        client.sendDocument(newDocument)
          .then(result => {
            console.log("post was successful: ");
            if (result === undefined) {
              console.log("FAILURE: post failed");
            }
            else {
              let documentId = result;

              // now test the document we sent
              console.log("testing document we sent");
              client.getDocument(documentId)
                .then(document => {
                  if (document === undefined) {
                    console.log("FAILURE: get failed");
                  }
                  else {
                    const success = documentGenerator.compareSpreadsheets(newDocument, document);
                    if (success) {
                      console.log("get was successful");
                      console.log("the document we sent was the same as the document we got back")
                    }
                    else {
                      console.log("get failed");

                    }
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            console.error(error);
          }

          );
        break;

      // delete a document from the server
      // there are two ways to run this test.  
      // the first one is delete with no parameters, in  this case we get a list of documents from the server
      // we pick a random one and delete that document
      // the second one is delete with a parameter, in this case we delete a specific document from the server

      case "delete":
        if (command.length === 1) {
          client.listDocuments()
            .then(result => {
              if (result === undefined) {
                console.log("FAILURE: list failed");
              }
              else {
                const documents = result;
                console.log(" we are goint to delete a random document from the server")

                if (documents.length > 0) { // get a random document from the server
                  const index = Math.floor(Math.random() * documents.length);
                  const documentId = documents[index];

                  console.log("we are going to delete document: " + documentId);
                  client.deleteDocument(documentId)
                    .then(document => {
                      if (document === undefined) {
                        console.log("FAILURE: delete failed");
                      }
                      else {
                        checkDocumentIdInServer(documentId)
                          .then(result => {
                            if (result) {
                              console.log("FAILURE: delete failed");
                            }
                            else {
                              console.log("SUCCESS: delete was successful");
                            }
                          }


                          )
                          .catch(error => {
                            console.log(error);
                          });
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
                }
                else {
                  console.log("no documents on server");
                }
              }
            })
            .catch(error => {
              console.error(error);
            }
            );

        }
        else { // delete a specific document
          client.deleteDocument(command[1])
            .then(document => {
              if (document === undefined) {
                console.log("FAILURE: delete failed");
              }
              else {
                checkDocumentIdInServer(command[1])
                  .then(result => {
                    if (result) {
                      console.log("FAILURE: delete failed");
                    }
                    else {
                      console.log("SUCCESS: delete was successful");
                    }
                  }


                  )
                  .catch(error => {
                    console.log(error);
                  });
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
        break;
      case "quit":
        readline.close();
        break;
      default:
        console.log("unknown command");
        break;
    }
    readline.setPrompt("\n type help for commands\n\tserver-tester : ");
    readline.prompt();
  }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
  }
  );
}

// print the comand line arguments to the console one per line prefixed with an integer starting at 0
function printCommandLineArguments() {
  process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`);
  }
  );
}

// If there are no command line arguments then run the command line interface with test port 3000
// If there is one command line argument then run the command line interface with the port specified in the command line argument
// If there are more than one command line arguments then print an error message and exit
function runCommandLineInterface() {
  if (process.argv.length === 2) {
    runCommandLineInterfaceWithPort(3000);
  }
  else if (process.argv.length === 3) {
    // convert the command line argument to a number
    const port = parseInt(process.argv[2]);
    runCommandLineInterfaceWithPort(port);
  }
  else {
    console.log("usage: npm test [port]");
  }
}


runCommandLineInterface();










