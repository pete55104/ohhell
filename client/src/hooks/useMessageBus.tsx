import { useState, useEffect, useRef, MutableRefObject, useMemo } from 'react';
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket';

type MessageBus = {
    lastMessage: IMessageEvent,
    sendMessage: (message: string, channel: string) => void,
    unsubscribeRef: MutableRefObject<() => void>,
    subscribe: () => void
};

export type MessageBusClient = {
    clientId: string,
    callback?: ((message: Message) => void),
    channels: string[]
}

export type Message = {
    channel: string,
    data: any
}

export enum defaultChannels {
    global = 'GLOBAL',
    echo = 'ECHO',
    chat = 'CHAT'
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

const initialMessage: Message = {
    data: "",
    channel: ""
};

type busStateType = {
    clients: Record<string,MessageBusClient>,
    socketClient: W3CWebSocket
}

type clientAction = {
    type: string,
    client: MessageBusClient
}

function clientsReducer(state: busStateType, action: clientAction): busStateType {
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
const busState:busStateType = {clients: {}, socketClient: new W3CWebSocket(url)}

function dispatch(action: clientAction){
    clientsReducer(busState, action)
}

const unsubscribe = function(messageBusClient: MessageBusClient) {
    return () => {
        console.log(`mb ${Date.now()} unsubscribing ${messageBusClient.clientId}`)
        dispatch({type:'drop', client: messageBusClient})
    }
}

const subscribe = function(messageBusClient: MessageBusClient) {
    return () => {
        console.log(`mb: ${Date.now()} subscribing ${messageBusClient.clientId} into ${JSON.stringify(busState.clients)}`)
        dispatch({type: 'add', client: messageBusClient})
    }
}

export function useMessageBus(messageBusClient: MessageBusClient) : MessageBus {  
    console.log(`mb: entry with ${messageBusClient.clientId}`)
    const [message, setMessage] = useState(initialMessage);
    const [status, setStatus] = useState<ClientStatus>(ClientStatus.init);
    const sendMessage = useMemo(() => (message:string, channel:string) => {
        const payload = JSON.stringify({action:"sendmessage", data: JSON.stringify({ channel: channel, data: message }) })
        console.log(`sending message ${payload}`)
        busState.socketClient.send(payload)
    },[])
    if(!busState.clients[messageBusClient.clientId]){
        subscribe(messageBusClient)()
    }

    useEffect(() => {
        busState.socketClient.onopen = () => {
            setStatus(ClientStatus.connected)
            console.log(`mb socket client initialized`)
        };
        busState.socketClient.onmessage = (received: IMessageEvent) => {
            console.log(`mb handling message ${received.data}`)
            if(status !== ClientStatus.inactive){
                const { channel, data } = JSON.parse(received.data.toString())
                const message: Message = {
                    channel,
                    data
                }
                const clientArray = Object.values(busState.clients)
                clientArray.forEach(client => {
                    client.callback  && client.channels.includes(channel) && client.callback(message)
                })
                setMessage(message);
            } else {
                console.log(`mb status inactive, ignoring message`)
            }           
        };
    })

    return {
        lastMessage: message,
        sendMessage,
        subscribe: subscribe(messageBusClient),
        unsubscribeRef: useRef(unsubscribe(messageBusClient))
    };
}