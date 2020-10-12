import React, {ChangeEvent, FC, FormEvent, useEffect, useRef, useState} from 'react';
import '../styles/App.scss';
import {w3cwebsocket as W3CWebSocket} from "websocket";
import { Redirect } from 'react-router-dom';

const url = 'wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev';
const client = new W3CWebSocket(url);

interface IMessageState {
    data?: string;
    timeStampSent?: number;
    timeStampReceived?: number;
    origin?: string;
    isTrusted?: boolean;
    bearHasBeenPoked: boolean;
    enteredText: string;
}

const Echo: FC<{}> = () => {
    const intial: IMessageState = {
        data: "",
        timeStampSent: 0,
        timeStampReceived: 0,
        origin: "",
        isTrusted: true,
        bearHasBeenPoked: false,
        enteredText: ""
    };
    const textEntryField = useRef<HTMLInputElement>(null)
    const [messageState, setMessageState] = useState(intial)

    useEffect(() => {
        textEntryField?.current?.focus()
    },[])

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected:');
            console.log(client);
        };
        client.onmessage = (message) => {
            console.log(message);
            writeMessageToScreen(message);
            const newState: IMessageState = {
                ...messageState,
                data: message.data.toString() || "",
                timeStampReceived: Date.now(),
                // @ts-ignore
                origin: message.origin,
                // @ts-ignore
                isTrusted: message.isTrusted
            }
            if(message.data.toString().includes("poke") && message.data.toString().includes("bear")){
                newState.bearHasBeenPoked = true
            }
            setMessageState(newState);
            console.log(messageState.data);
            console.log(messageState.isTrusted);
            console.log(messageState.timeStampReceived);
            console.log(messageState.origin);
        };
    })

    const writeMessageToScreen = (obj: Object) => {
        let displayDiv = document.getElementById("responseDisplay");
        if (displayDiv){
            displayDiv.innerHTML = "";
            for (let prop in obj) {
                //@ts-ignore
                displayDiv.innerHTML += (prop + " : " + obj[prop] + "\n");
            }
        }
    }

    const handleSubmit = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        client.send(JSON.stringify({"action":"sendmessage", "data": messageState.enteredText}));
        let timeOfSend = Date.now();
        setMessageState({...messageState, timeStampSent: timeOfSend, enteredText: ""});

        console.log(`sending message at time: ${timeOfSend}`);
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessageState({...messageState, enteredText: event.target.value});
    }

    if (messageState.isTrusted) {
        return (
            <div><h1>you can make a websocket echo here</h1>
            <div className="Echo">
                <form className="Echo-form" onSubmit={handleSubmit}>
                    <ul>
                        <li><input type="text" id="customTextField"  value={messageState.enteredText} onChange={handleInputChange} ref={textEntryField} />
                        <input type="submit" value="send your custom text" /></li>
                    <li>
                        <label htmlFor="data">data</label>
                        <input type="text" id="data" value={messageState.data} readOnly />
                    </li>
                    <li>
                        <label htmlFor="timeStampSent">time sent</label>
                        <input type="text" id="timeStampSent" value={messageState.timeStampSent} readOnly />
                        
                    </li>
                    <li>
                        <label htmlFor="timeStampReceived">time received</label>
                        <input type="text" id="timeStampReceived" value={messageState.timeStampReceived} readOnly />
                    </li>
                    <li>
                        <label htmlFor="responseTime">response time</label>
                        <input type="text" id="responseTime" value={
                            (messageState.timeStampReceived || 0) - (messageState.timeStampSent || 0)
                        } readOnly />
                    </li>
                    <li>
                        <label htmlFor="origin">origin url</label>
                        <input type="text" id="origin" value={messageState.origin} readOnly />
                    </li>
                    <li>
                        <label htmlFor="isTrusted">istrusted</label>
                        <input type="text" id="isTrusted" value={messageState.isTrusted.toString()} readOnly />
                    </li>
                    </ul>
                </form>
                <pre>
                    <div className="echo-response-display" id={"responseDisplay"} />
                </pre>
                {messageState.bearHasBeenPoked && <Redirect push to="/satiated-bear" />}
            </div>
            </div>
        );
    } else {
        return null;
    }
}

export default Echo;

