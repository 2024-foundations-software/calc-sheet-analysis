import React, { useState, useEffect } from 'react';
import './LoginPageComponent.css';

/**
 * Login PageComponent is the component that will be used to display the login page
 * If the user is logged in, then this component will display the list of documents
 * that the user has access to.  Each document will have a button that will allow the
 * user to edit the document. when the user clicks on the button, the user will be
 * taken to the document page.
 * @returns 
 */

import SpreadSheetClient from '../Engine/SpreadSheetClient';
import { spread } from 'axios';

interface LoginPageProps {
  spreadSheetClient: SpreadSheetClient;
}

function LoginPageComponent({ spreadSheetClient }: LoginPageProps): JSX.Element {
  const [userName, setUserName] = useState(window.sessionStorage.getItem('userName') || "");
  const [documents, setDocuments] = useState<string[]>([]);

  // SpreadSheetClient is fetching the documents from the server so we should
  // check every 1/20 of a second to see if the documents have been fetched
  useEffect(() => {
    const interval = setInterval(() => {
      const sheets = spreadSheetClient.getSheets();
      if (sheets.length > 0) {
        setDocuments(sheets);
      }
    }, 50);
    return () => clearInterval(interval);
  });

  function getUserLogin() {
    return <div>
      <input
        type="text"
        placeholder="User name"
        defaultValue={userName}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            // get the text from the input
            let userName = (event.target as HTMLInputElement).value;
            window.sessionStorage.setItem('userName', userName);
            // set the user name
            setUserName(userName);
            spreadSheetClient.userName = userName;
          }
        }} />
    </div>

  }

  function checkUserName(): boolean {
    if (userName === "") {
      alert("Please enter a user name");
      return false;
    }
    return true;
  }
  function loadDocument(documentName: string) {
    // set the document name
    spreadSheetClient.documentName = documentName;
    // reload the page

    // the href needs to be updated.   Remove /documnents from the end of the URL
    const href = window.location.href;
    const index = href.lastIndexOf('/');
    let newURL = href.substring(0, index);
    newURL = newURL + "/" + documentName
    window.history.pushState({}, '', newURL);
    window.location.reload();

  }


  function logout() {
    // clear the user name
    window.sessionStorage.setItem('userName', "");
    // reload the page
    window.location.reload();
  }


  function buildFileSelector() {
    if (userName === "") {
      return <div>
        <h4>Please enter a user name</h4>
        <br />
        You must be logged in to<br />
        access the documents!
      </div>;
    }

    const sheets: string[] = spreadSheetClient.getSheets();
    // make a table with the list of sheets and a button beside each one to edit the sheet
    return <div>
      <table>
        <thead>
          <tr className="selector-title">
            <th>Document Name---</th>
            <th>Actions</th>

          </tr>
        </thead>
        <tbody>
          {sheets.map((sheet) => {
            return <tr className="selector-item">
              <td >{sheet}</td>
              <td><button onClick={() => loadDocument(sheet)}>
                Edit
              </button></td>
            </tr>
          })}
        </tbody>
      </table>
    </div >
  }

  function getLoginPanel() {
    return <div>
      <h5 >Login Page</h5>
      {getUserLogin()}
      <button onClick={() => logout()}>Logout</button>
    </div>
  }

  function loginPage() {

    return <table>


      <tbody>
        <tr>
          <td>
            {getLoginPanel()}
          </td>
          <td>
            {buildFileSelector()}
          </td>
        </tr>
      </tbody>
    </table>


  }



  return (
    <div className="LoginPageComponent">
      {loginPage()}
    </div>
  );
}

export default LoginPageComponent;