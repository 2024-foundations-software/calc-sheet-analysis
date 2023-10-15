import ChatManager, { ChatMessage } from '../../Engine/ChatManager';

describe('ChatManager', () => {
    let chatManager: ChatManager;

    beforeEach(() => {
        chatManager = new ChatManager();
    });

    afterEach(() => {
        chatManager.clearMessages();
    });

    it('should add a message to the chat', () => {
        chatManager.addMessage('Hello, world!', 'user1');
        const receivedMessagesJSONString = chatManager.getMessages('')

        const receivedMessagesJSON = JSON.parse(receivedMessagesJSONString);

        const receivedMessages: ChatMessage[] = receivedMessagesJSON.messages;
        const nextToken = receivedMessagesJSON.nextToken;
        expect(receivedMessages.length).toEqual(1);
        expect(nextToken).toEqual('noMore');

        for (let i = 0; i < 1; i++) {
            const message = receivedMessages[i].message;

            const userName = receivedMessages[i].userName;
            expect(receivedMessages[i].message).toEqual('Hello, world!');
            expect(receivedMessages[i].userName).toEqual('user1');
        }
    });

    it('should return 20 messages and a nextToken when there are more messages', () => {
        for (let i = 0; i < 25; i++) {
            chatManager.addMessage(`Message ${i}`, 'user1');
        }
        const receivedMessagesJSONString = chatManager.getMessages('')

        const receivedMessagesJSON = JSON.parse(receivedMessagesJSONString);

        const receivedMessages: ChatMessage[] = receivedMessagesJSON.messages;
        const nextToken = receivedMessagesJSON.nextToken;
        expect(receivedMessages.length).toEqual(20);
        expect(nextToken).toEqual('20');

        for (let i = 0; i < 20; i++) {
            const message = receivedMessages[i].message;

            const userName = receivedMessages[i].userName;
            expect(receivedMessages[i].message).toEqual(`Message ${i}`);
            expect(receivedMessages[i].userName).toEqual('user1');
        }
    });

    it('should return no messages and a nextToken when there are no messages', () => {
        const receivedMessagesJSONString = chatManager.getMessages('')

        const receivedMessagesJSON = JSON.parse(receivedMessagesJSONString);

        const receivedMessages: ChatMessage[] = receivedMessagesJSON.messages;
        expect(receivedMessages.length).toEqual(0);
        const nextToken = receivedMessagesJSON.nextToken;
        expect(nextToken).toEqual('noMore');
    });

    it('should return no messages and a nextToken when the token is "noMore"', () => {
        const receivedMessagesJSONString = chatManager.getMessages("noMore")

        const receivedMessagesJSON = JSON.parse(receivedMessagesJSONString);

        const receivedMessages: ChatMessage[] = receivedMessagesJSON.messages;
        expect(receivedMessages.length).toEqual(0);
        const nextToken = receivedMessagesJSON.nextToken;
        expect(nextToken).toEqual('noMore');
    });

    it('should return the next 20 messages when the token is valid', () => {
        for (let i = 0; i < 25; i++) {
            chatManager.addMessage(`Message ${i}`, 'user1');
        }
        const receivedMessagesJSONString = chatManager.getMessages('20')

        const receivedMessagesJSON = JSON.parse(receivedMessagesJSONString);

        const receivedMessages: ChatMessage[] = receivedMessagesJSON.messages;
        const nextToken = receivedMessagesJSON.nextToken;


        expect(receivedMessages.length).toEqual(5);
        expect(nextToken).toEqual('noMore');

        for (let i = 0; i < 5; i++) {
            const messageI = receivedMessages[i].message;
            const userNameI = receivedMessages[i].userName
            expect(receivedMessages[i].message).toEqual(`Message ${i + 20}`);
            expect(receivedMessages[i].userName).toEqual('user1');
        }

    });
});