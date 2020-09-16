import React, {Component} from 'react';
import './App.css';
import {w3cwebsocket as W3CWebSocket} from "websocket";

const client = new W3CWebSocket('wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev');

export interface ICustomAppState {
    data?: string;
    timeStamp?: number;
    origin?: string;
    isTrusted?: boolean;
}


class App extends Component<ICustomAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            data: props.data || "defaultName",
            timeStamp: props.timeStamp || 12345,
            origin: props.origin ||  "somewhereCool.6789",
            isTrusted: props.isTrusted || true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log(message);
            this.writeMessageToScreen(message);
            this.setState({
                data: message.data,
                // @ts-ignore
                timeStamp: message.timeStamp,
                // @ts-ignore
                origin: message.origin,
                // @ts-ignore
                isTrusted: message.isTrusted
            });
            // @ts-ignore
            console.log(this.state.data);
            // @ts-ignore
            console.log(this.state.isTrusted);
            // @ts-ignore
            console.log(this.state.timeStamp);
            // @ts-ignore
            console.log(this.state.origin);
        };
    }

    writeMessageToScreen(obj: Object) {
        let displayDiv = document.getElementById("responseDisplay");
        if (displayDiv){
            displayDiv.innerHTML = "";
            for (let prop in obj) {
                // @ts-ignore
                displayDiv.innerHTML += (prop + " : " + obj[prop] + "\n");
            }
        }
    }

    handleSubmit() {
        let customText: string;
        // @ts-ignore
        customText = document.getElementById('customTextField').value;
        client.send(JSON.stringify({"action":"sendmessage", "data":customText}));
    }

    render() {

        return (
            <div className="App">
                <form className="App-header" onSubmit={this.handleSubmit}>
                    <input type="text" id="customTextField" defaultValue={"Your text"} />
                    <input type="submit" value="Send your custom text" />
                    <input type="text" value={this.state.data} readOnly />
                    <input type="text" defaultValue="TimeStamp should go here" readOnly />
                    <input type="text" defaultValue="Origin should go here" readOnly />
                    <input type="text" defaultValue="IsTrusted should go here" readOnly />
                </form>
                <pre>
                    <div id={"responseDisplay"} />
                </pre>
            </div>
        );
    }
}

export default App;

//  <input type="text" value={this.state.data} readOnly />
