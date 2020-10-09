import React, {Component, FormEvent} from 'react';
import '../styles/App.scss';
import {w3cwebsocket as W3CWebSocket} from "websocket";

const url = 'wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev';
const client = new W3CWebSocket(url);

export interface ICustomAppState {
    data?: string;
    timeStampSent?: number;
    timeStampReceived?: number;
    origin?: string;
    isTrusted?: boolean;
}

class Echo extends Component<{}, ICustomAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: props.data || "defaultName",
            timeStampSent: 12344,
            timeStampReceived: props.timeStampReceived || 12345,
            origin: props.origin ||  "somewhereCool.6789",
            isTrusted: props.isTrusted || true
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
                isTrusted: message.isTrusted
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
        console.log(`custom text is: ${customText}`);
        client.send(JSON.stringify({"action":"sendmessage", "data":customText}));
        let timeOfSend = Date.now();
        this.setState({timeStampSent : timeOfSend} );
        console.log(`sending message at time: ${timeOfSend}`);
    }

    render() {
        if (this.state.isTrusted && this.state.timeStampReceived && this.state.timeStampSent) {
            return (
                <div className="Echo">
                    <form className="Echo-form" onSubmit={this.handleSubmit}>
                        <input type="text" id="customTextField" defaultValue={"Your text"} />
                        <input type="submit" value="send your custom text" />
                        <label>
                            data
                            <input type="text" id="data" value={this.state.data} readOnly />
                        </label>
                        <label>
                            time sent
                            <input type="text" value={this.state.timeStampSent} readOnly />
                        </label>
                        <label>
                            time received
                            <input type="text" value={this.state.timeStampReceived} readOnly />
                        </label>
                        <label>
                            response time
                            <input type="text" value={
                                this.state.timeStampReceived - this.state.timeStampSent
                            } readOnly />
                        </label>
                        <label>
                            origin url
                            <input type="text" value={this.state.origin} readOnly />
                        </label>
                        <label>
                            istrusted
                            <input type="text" value={this.state.isTrusted.toString()} readOnly />
                        </label>
                    </form>
                    <pre>
                        <div id={"responseDisplay"} />
                    </pre>
                </div>
            );
        } else {
            return null;
        }
    }
}

export default Echo;

