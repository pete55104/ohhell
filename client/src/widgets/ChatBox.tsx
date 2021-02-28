import React, {FC, useReducer, useEffect, useRef, FormEvent } from 'react'
import { useMessageBus, Message, defaultChannels } from '../hooks/useMessageBus'

type chatMessage = {
    text: string,
    userId: string,
    displayName: string,
    timeReceived: string
}

enum chatLogReducerOptions {
    add = 'add'
}

type Action = {
    type: string,
    message: Message
}

type State = {
    messages: chatMessage[]
}
const initialState: State = { 
    messages: [
        {
            text: 'get chattin',
            userId: '',
            displayName: 'nobody',
            timeReceived:new Date().toLocaleTimeString()
        }
    ]
}

const ChatBox: FC<{}> = () => {
    function chatLogReducer(state: State, action: Action){
        console.log(`chatbox reducer executing`)
        switch(action.type){
            case chatLogReducerOptions.add: {
                const lastTenChats = state.messages.slice(-10)
                const nextChat =  {
                    text: action.message.data,
                    userId: 'somebodyId',
                    displayName: 'somebody',
                    timeReceived: new Date().toLocaleTimeString()
                }
                const nextState = { messages: [...lastTenChats,nextChat] }
                console.log(`chatbox newState ${JSON.stringify(nextState)}`)
                return nextState
            }
        default: {
            console.log('invalid reducer action in chatLogReducer')
            return state
        }
            
        }
    }
    const [chatLogState, chatLogDispatch] = useReducer(chatLogReducer, initialState)
    const textEntryField = useRef<HTMLInputElement>(null)
    function onMessage(message: Message) {
        if(message && message.data){
            console.log(`chatbox firing dispatch with ${JSON.stringify(message)}`)
            const action: Action = { type: chatLogReducerOptions.add,  message}
            chatLogDispatch(action)
        }
    }
    const { sendMessage, unsubscribeRef }  = useMessageBus({clientId: 'ChatBox',  callback: onMessage, channels: [defaultChannels.chat]});

    console.log(`chatbot entry ${JSON.stringify(chatLogState)}`)

    

    const handleSubmit = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const text = textEntryField?.current?.value
        const channel = defaultChannels.chat
        // onMessage({ channel, data: 'placeholder ride along' })
        sendMessage (text || '', channel);
        textEntryField.current && (textEntryField.current.value = '')
    }

    return (

        <div className="Echo"><h1>chat</h1>
            <form className="Echo-form" onSubmit={handleSubmit}>
                <input type="text" id="customTextField"  ref={textEntryField} />
                <input type="submit" value="send your custom text" />
            </form>
            {<ul>{chatLogState.messages.map(
                (message: chatMessage) => <li key={'chatline-' + message.timeReceived}><span>{message.timeReceived} - {message.displayName} said {message.text}</span></li>
            )}</ul>}
        </div>
    );
}

export default ChatBox