import React, {Component, FormEvent} from 'react'
import { Route, Switch, Redirect } from "react-router-dom"
import './App.css'
import Echo from "./components/Echo"
import SleepingBear from "./components/SleepingBear"
import Sample from "./components/Sample"
import Nothing from "./components/Nothing"
import {w3cwebsocket as W3CWebSocket} from "websocket"

const url = 'wss://ncqq73m9x7.execute-api.us-east-1.amazonaws.com/dev'
const client = new W3CWebSocket(url)

export interface ICustomAppState {
    data?: string;
    timeStampSent?: number;
    timeStampReceived?: number;
    origin?: string;
    isTrusted?: boolean;
}

class App extends Component<{}, ICustomAppState> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
                <div className="App">
                    <Switch>
                        <Route path="/" exact component={Echo} />
                        <Route path="/sample" render={routerProps => <Sample {...routerProps} sampleProp={"sample"}/>} />
                        <Route path="/sleeping-bear" component={SleepingBear} />
                        <Route path='/default' render={() => <Redirect to= "/" />} />
                        <Route component={Nothing} />
                    </Switch>
                </div> 
            )
    }
}

export default App;

