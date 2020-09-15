import React, {Component} from 'react';
import './App.css';
import {IMessageEvent, w3cwebsocket as W3CWebSocket} from "websocket";

const client = new W3CWebSocket('wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev');

class App extends Component {

    componentDidMount() {
        client.onopen = () => {
            //console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log(message);
            this.writeMessageToScreen(message);
        };
    }

    writeMessageToScreen(obj: Object) {
        let theDiv = document.getElementById("responseDisplay");
        // @ts-ignore
        theDiv.innerHTML = "";

        for (let prop in obj) {
            // @ts-ignore
            if (obj[prop] instanceof Object) {

                //  ** If it matters, print nested layers of objects here **


                // @ts-ignore
                theDiv.innerHTML += (prop + " : " + obj[prop] + "\n");
            } else {
                // @ts-ignore
                theDiv.innerHTML += (prop + " : " + obj[prop] + "\n");
            }
        }
    }

    sendHardcodedMessage() {
        client.send(JSON.stringify({"action":"sendmessage", "data":"hello world"}));
    }

    sendCustomMessage() {
        let customText: any;
        // @ts-ignore
        customText = document.getElementById('customTextField').value;
        client.send(JSON.stringify({"action":"sendmessage", "data":customText}));
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <button onClick={this.sendHardcodedMessage}>
                        Send hello world
                    </button>
                    <input type="text" id="customTextField" defaultValue={"Your text"}>
                    </input>
                    <button onClick={this.sendCustomMessage}>
                        Send your custom text
                    </button>
                </header>
                <pre>
                    <div id={"responseDisplay"}></div>
                </pre>
            </div>
        );
    }
}

export default App;