import React from 'react'
import { Route, Switch, Redirect, NavLink, useHistory } from 'react-router-dom'
import { IMessageEvent } from 'websocket';
import './styles/App.scss'
import Echo from './components/Echo'
import Lobby from './components/Lobby'
import SleepingBear from './components/SleepingBear'
import SatiatedBear from './components/SatiatedBear'
import Sample from './components/Sample'
import Nothing from './components/Nothing'
import { useMessageBus, defaultChannels } from './hooks/useMessageBus'

const globalNavWait = 30

function App() {
    const history = useHistory()
    const onMessage = (message: IMessageEvent) => {
        console.log(`app on message: ${message.data}`)
        if(message.data.toString().includes("poke") && message.data.toString().includes("bear")){
            console.log(`app setting bear poked true`)
            setTimeout(() => {
                console.log('App: pushing to history')
                history.push('/satiated-bear')
            }, globalNavWait)
        }
    }
    useMessageBus({clientId: 'App',  callback: onMessage, channels: [defaultChannels.global]});

    return (
        <div className="App">
            <div className="top-menu">
                <NavLink activeClassName="active" exact to="/">lobby</NavLink>
                <NavLink activeClassName="active" to="/sample">sample</NavLink>
                <NavLink activeClassName="active" to="/nowhere">nowhere</NavLink>
                <NavLink activeClassName="active" to="/sleeping-bear">a sleeping bear</NavLink>
                <NavLink activeClassName="active" to="/echo">echo</NavLink>
            </div>
            <Switch>
                <Route path="/" exact component={Lobby} />
                <Route path="/echo" component={Echo} />
                <Route path="/sample" render={routerProps => <Sample {...routerProps} sampleProp={"sample"} initialColor={"blue"}/>} />
                <Route path="/sleeping-bear" component={SleepingBear} />
                <Route path="/satiated-bear" component={SatiatedBear} />
                <Route path='/default' render={() => <Redirect to= "/" />} />
                <Route component={Nothing} />
            </Switch>
        </div>
    )
}

export default App;

