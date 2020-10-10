import React, {Component, FormEvent} from 'react';
import '../styles/App.scss';
import {w3cwebsocket as W3CWebSocket} from "websocket";
import { Redirect } from 'react-router-dom';

const url = 'wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev';
const client = new W3CWebSocket(url);

export interface ICustomAppState {
    data?: string;
    timeStampSent?: number;
    timeStampReceived?: number;
    origin?: string;
    isTrusted?: boolean;
    bearHasBeenPoked: boolean;
}

class Echo extends Component<{}, ICustomAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: props.data || "",
            timeStampSent: 0,
            timeStampReceived: props.timeStampReceived || 0,
            origin: props.origin ||  "",
            isTrusted: props.isTrusted || true,
            bearHasBeenPoked: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected:');
            console.log(client);
        };
        client.onmessage = (message) => {
            console.log(message);
            this.writeMessageToScreen(message);
            const newState: ICustomAppState = {
                data: message.data.toString() || "",

                timeStampReceived: Date.now(),
                //timeStampReceived: message.timeStamp,

                // @ts-ignore
                origin: message.origin,
                // @ts-ignore
                isTrusted: message.isTrusted,
                bearHasBeenPoked: false
            }
            if(message.data.toString().includes("poke") && message.data.toString().includes("bear")){
                newState.bearHasBeenPoked = true
            }
            this.setState(newState);
            console.log(this.state.data);
            console.log(this.state.isTrusted);
            console.log(this.state.timeStampReceived);
            console.log(this.state.origin);
        };
    }

    writeMessageToScreen(obj: Object) {
        let displayDiv = document.getElementById("responseDisplay");
        if (displayDiv){
            displayDiv.innerHTML = "";
            for (let prop in obj) {
                //@ts-ignore
                displayDiv.innerHTML += (prop + " : " + obj[prop] + "\n");
            }
        }
    }

    handleSubmit(e:  FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let customText: string;
        //@ts-ignore
        customText = document.getElementById('customTextField').value;
        //@ts-ignore
        document.getElementById('customTextField').value = "";
        console.log(`custom text is: ${customText}`);
        client.send(JSON.stringify({"action":"sendmessage", "data":customText}));
        let timeOfSend = Date.now();
        this.setState({timeStampSent : timeOfSend} );
        console.log(`sending message at time: ${timeOfSend}`);
    }

    render() {
        if (this.state.isTrusted) {// && this.state.timeStampReceived && this.state.timeStampSent) {
            return (
                <div><h1>you can make a websocket echo here</h1>
                <div className="Echo">
                    <form className="Echo-form" onSubmit={this.handleSubmit}>
                        <ul>
                            <li><input type="text" id="customTextField" defaultValue={"Your text"} />
                            <input type="submit" value="send your custom text" /></li>
                        <li>
                            <label htmlFor="data">data</label>
                            <input type="text" id="data" value={this.state.data} readOnly />
                        </li>
                        <li>
                            <label htmlFor="timeStampSent">time sent</label>
                            <input type="text" id="timeStampSent" value={this.state.timeStampSent} readOnly />
                            
                        </li>
                        <li>
                            <label htmlFor="timeStampReceived">time received</label>
                            <input type="text" id="timeStampReceived" value={this.state.timeStampReceived} readOnly />
                        </li>
                        <li>
                            <label htmlFor="responseTime">response time</label>
                            <input type="text" id="responseTime" value={
                                (this.state.timeStampReceived || 0) - (this.state.timeStampSent || 0)
                            } readOnly />
                        </li>
                        <li>
                            <label htmlFor="origin">origin url</label>
                            <input type="text" id="origin" value={this.state.origin} readOnly />
                            
                        </li>
                        <li>
                            <label htmlFor="isTrusted">istrusted</label>
                            <input type="text" id="isTrusted" value={this.state.isTrusted.toString()} readOnly />
                        </li>
                        </ul>
                    </form>
                    <pre>
                        <div className="echo-response-display" id={"responseDisplay"} />
                    </pre>
                    {this.state.bearHasBeenPoked && <Redirect push to="/satiated-bear" />}
                </div>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Echo;

