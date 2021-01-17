import { useState, useEffect } from 'react';
import {IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";

type MessageBus = {
    lastMessage: IMessageEvent,
    sendMessage: (message: string) => void
};

enum messageType {
    broadcast,
    action,
    bearPoked
}

type appMessage<T> = {
    type: messageType,
    channel: string,
    data: T
}

const url = 'wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev';
const client = new W3CWebSocket(url);

const initialMessage: IMessageEvent = {
    data: ""
};

export function useMessageBus(callback?: ((message: IMessageEvent) => void)) : MessageBus {  
    const [message, setMessage] = useState(initialMessage);
    useEffect(() => {
        client.onopen = () => {
            console.debug(`WebSocket Client Connected: ${client}`);
        };
        client.onmessage = (received) => {
            console.debug(`received message ${received.data}`);
            if(callback){
                callback(received)
            }
            setMessage(received);
        };
    })

    return {
        lastMessage: message,
        sendMessage: (message:string) => {
            client.send(JSON.stringify({"action":"sendmessage", "data": message }));
        }
    };
}