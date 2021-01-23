import { useState, useEffect } from 'react';
import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket';

type MessageBus = {
    lastMessage: IMessageEvent,
    sendMessage: (message: string) => void,
    unsubscribe: () => void
};

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
const client = new W3CWebSocket(url);

const initialMessage: IMessageEvent = {
    data: ""
};

export function useMessageBus(callback?: ((message: IMessageEvent) => void)) : MessageBus {  
    const [message, setMessage] = useState(initialMessage);
    const [status, setStatus] = useState<ClientStatus>(ClientStatus.init)
    const unsubscribe = function() {
        if(status !== ClientStatus.inactive){
            setStatus(ClientStatus.inactive)
        }
    }
    useEffect(() => {
        client.onopen = () => {
            setStatus(ClientStatus.connected)
        };
        client.onmessage = (received: IMessageEvent) => {
            if(status !== ClientStatus.inactive){
                if(callback){
                    callback(received)
                }
                setMessage(received);
            }            
        };
    })

    return {
        lastMessage: message,
        sendMessage: (message:string) => {
            client.send(JSON.stringify({"action":"sendmessage", "data": message }));
        },
        unsubscribe
    };
}