import { useState, useEffect } from 'react';
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket';

type MessageBus = {
    lastMessage: IMessageEvent,
    sendMessage: (message: string) => void,
    unsubscribe: () => void,
    subscribe: () => void
};

export type MessageBusClient = {
    clientId: string,
    callback?: ((message: IMessageEvent) => void)
}

enum MessageType {
    broadcast,
    action,
    bearPoked
}

enum ClientStatus {
    init,
    connected,
    inactive
}

type appMessage<T> = {
    type: MessageType,
    channel: string,
    data: T
}

const url = 'wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev';

const initialMessage: IMessageEvent = {
    data: ""
};

type stateType = {
    clients: Record<string,MessageBusClient>,
    socketClient: W3CWebSocket
}

type clientAction = {
    type: string,
    client: MessageBusClient
}

// function clientsReducer(state: stateType, action: clientAction): stateType {
//     switch (action.type){
//         case 'add':
//             return { clients: {...state.clients, [action.client.clientId] : action.client}}
//         default:
//             throw new Error('no action type')
//     }
// }

function clientsReducer(state: stateType, action: clientAction): stateType {
    switch (action.type){
        case 'add':
            state.clients[action.client.clientId] = action.client
            return state
        case 'drop':
            delete(state.clients[action.client.clientId])
            return state
        default:
            throw new Error('no action type')
    }
}

console.log(`mb socket client initialized`)
const state:stateType = {clients: {}, socketClient: new W3CWebSocket(url)}

function dispatch(action: clientAction){
    clientsReducer(state, action)
}

const unsubscribe = function(messageBusClient: MessageBusClient) {
    return () => {
        console.log(`mb ${Date.now()} unsubscribing ${messageBusClient.clientId}`)
        dispatch({type:'drop', client: messageBusClient})
    }
}

const subscribe = function(messageBusClient: MessageBusClient) {
    return () => {
        if(messageBusClient && (!state.clients[messageBusClient.clientId])){
            console.log(`mb: ${Date.now()} subscribing ${messageBusClient.clientId} into ${JSON.stringify(state.clients)}`)
            dispatch({type: 'add', client: messageBusClient})
        } else {
            console.log(`mb: ${Date.now()} must have already been subscribed for ${JSON.stringify(messageBusClient)} vs ${JSON.stringify(state.clients)}`)
        }
    }
}

export function useMessageBus(messageBusClient: MessageBusClient) : MessageBus {  
    const [message, setMessage] = useState(initialMessage);
    const [status, setStatus] = useState<ClientStatus>(ClientStatus.init);
    //const [state, dispatch] = useReducer(clientsReducer, {clients: {}});

    // useEffect(() => subscribe(messageBusClient))
    // useEffect(() => {
    //     if(messageBusClient.callback){
    //         dispatchClients({ type: 'add', client: messageBusClient})
    //     }
    // },[messageBusClient.clientId])

    useEffect(() => {
        state.socketClient.onopen = () => {
            setStatus(ClientStatus.connected)
            console.log(`mb socket client initialized`)
        };
        state.socketClient.onmessage = (received: IMessageEvent) => {
            console.log(`mb handling message ${received.data}`)
            if(status !== ClientStatus.inactive){
                const clientArray = Object.values(state.clients)
                clientArray.forEach(client => {
                    console.log(`mb invoking callback for ${client.clientId}`)
                    client.callback && client.callback(received)
                })
                setMessage(received);
            } else {
                console.log(`mb status inactive, ignoring message`)
            }           
        };
    })

    return {
        lastMessage: message,
        sendMessage: (message:string) => {
            const payload = JSON.stringify({"action":"sendmessage", "data": message })
            console.log(`sending message ${payload}`)
            state.socketClient.send(payload);
        },
        subscribe: subscribe(messageBusClient),
        unsubscribe: unsubscribe(messageBusClient)
    };
}