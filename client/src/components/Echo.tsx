import React, {ChangeEvent, FC, FormEvent, useEffect, useRef, useState} from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/App.scss';
import { useMessageBus, defaultChannels, Message } from '../hooks/useMessageBus'


interface IMessageState {
    data?: string;
    timeStampSent?: number;
    timeStampReceived?: number;
    origin?: string;
    isTrusted?: boolean;
    enteredText: string;
}

const Echo: FC<{}> = () => {
    const initial: IMessageState = {
        data: "",
        timeStampSent: 0,
        timeStampReceived: 0,
        origin: "",
        isTrusted: true,
        enteredText: ""
    };

    const onMessage = (message: Message) => {
        if(message && message.data){
            writeMessageToScreen(message);
            const newState: IMessageState = {
                ...messageState,
                data: message.data.toString() || "",
                timeStampReceived: Date.now(),
            }
            setMessageState(newState);
        }
    };
    const history = useHistory();
    const { sendMessage, unsubscribeRef }  = useMessageBus({clientId: 'Echo',  callback: onMessage, channels: [defaultChannels.echo]});

    const textEntryField = useRef<HTMLInputElement>(null)
    const [messageState, setMessageState] = useState(initial)
    useEffect(() => {
        textEntryField?.current?.focus();
    },[])
    useEffect(() => {
        const unsubscribe = unsubscribeRef.current
        return (() => {
            unsubscribe()
        })
    }, [history.action, unsubscribeRef])

    const writeMessageToScreen = (message: Message) => {
        let displayDiv = document.getElementById("responseDisplay");
        if (displayDiv){
            displayDiv.innerHTML = "";
            const htmltext = Object.entries(message).map(entry => {
                return (entry[0] || "") + " : " + (entry[1] || "")
            }).join("\n")
            displayDiv.innerHTML += (htmltext);
        }
    }    

    const handleSubmit = (e:  FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let timeOfSend = Date.now();
        const text = messageState.enteredText
        const channel = text === 'poke bear' ? defaultChannels.global : defaultChannels.echo
        setMessageState({...messageState, timeStampSent: timeOfSend, enteredText: ""});
        sendMessage(messageState.enteredText, channel);
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
            </div>
            </div>
        );
    } else {
        return null;
    }
}

export default Echo;

