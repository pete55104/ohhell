import React, {Component} from 'react';
import './App.css';
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev');

class App extends Component {
    componentDidMount() {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            console.log(message);
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }
}


export default App;
