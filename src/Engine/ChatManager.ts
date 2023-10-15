import path from 'path';
/**
 * ChatManager
 * @class ChatManager
 * @description ChatManager
 * @exports ChatManager
 * @constructor
 * 
 * manages a chat session for a document.   The chat session is a collection of chat messages that are associated with a document.
 * The chat manager provides the following functions:
 * 
 * addMessage(message: string, userName:string): void
 * 
 * getMessages(documentName:string, token:string): ChatMessage[], nextToken: string
 * returns 20 messages and passes a token to indicate the next 20 messages start.  
 * If the token input is empty then the first 20 messages are returned.
 * if the current return exhausts the messages then the nextToken is set to "noMore"
 * if the token input is "noMore" then no messages are returned.
 * 
 * 
 * 
 * clearMessages()
 * 
 */

export class ChatMessage {
    message: string;
    userName: string;
    timeStamp: Date;
    constructor(message: string, userName: string) {
        this.message = message;
        this.userName = userName;
        this.timeStamp = new Date();
    }

}

class ChatManager {
    private _messages: ChatMessage[];
    private _nextToken: number;
    private _documentFolder: string;

    constructor(documentDirectory: string = 'chats') {
        this._messages = [];
        this._nextToken = 0;
        const rootPath = path.join(__dirname, '..', '..');
        this._documentFolder = path.join(rootPath, documentDirectory); // TODO
    }


    private storeMessages(): void {
        // store the messages in a database
    }

    public addMessage(message: string, userName: string): void {
        let chatMessage = new ChatMessage(message, userName);
        this._messages.push(chatMessage);
    }

    private prepareMessages(token: string): [ChatMessage[], string] {
        let result: ChatMessage[] = [];
        let nextToken: string = "";
        let startIndex = 0;
        if (token === "") {
            startIndex = 0;
        }
        else if (token === "noMore") {
            startIndex = this._messages.length;
            nextToken = "noMore"
            return [[], nextToken];
        }
        else {
            startIndex = parseInt(token);
        }
        nextToken = "noMore";
        if (startIndex < this._messages.length) {
            let endIndex = startIndex + 20;
            if (endIndex > this._messages.length) {
                endIndex = this._messages.length;

            }
            else {
                nextToken = endIndex.toString();
            }
            result = this._messages.slice(startIndex, endIndex);
        }
        return [result, nextToken];
    }

    /**
     * getMessages(documentName:string, token:string): ChatMessage[], nextToken: string
     * @param documentName 
     * @param token 
     * 
     * returns a JSON object with the following structure:
     * {
     * messages: ChatMessage[],
     * nextToken: string
     * }
     */
    public getMessages(token: string): string {
        let [messages, nextToken] = this.prepareMessages(token);
        return JSON.stringify({
            messages: messages,
            nextToken: nextToken
        });
    }


    public clearMessages(): void {
        this._messages = [];
    }
}

export default ChatManager;