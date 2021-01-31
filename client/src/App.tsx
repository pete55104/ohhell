import React, {useState, useRef, useEffect} from 'react'
import { Route, Switch, Redirect, NavLink, useHistory } from 'react-router-dom'
import { IMessageEvent } from 'websocket';
import './styles/App.scss'
import Echo from './components/Echo'
import Lobby from './components/Lobby'
import SleepingBear from './components/SleepingBear'
import SatiatedBear from './components/SatiatedBear'
import Sample from './components/Sample'
import Nothing from './components/Nothing'
import { useMessageBus } from './hooks/useMessageBus'

function App() {
    const history = useHistory()
    const [ bearHasBeenPoked, setBearHasBeenPoked] = useState(false)
    const onMessage = (message: IMessageEvent) => {
        console.log(`app on message: ${message.data}`)
        if(message.data.toString().includes("poke") && message.data.toString().includes("bear")){
            console.log(`app setting bear poked true`)
            setBearHasBeenPoked(true)
        }
    }
    const { subscribe } = useMessageBus({clientId: 'App',  callback: onMessage});
    const subscribeRef = useRef<() => void>(subscribe)
    useEffect(() => {
        subscribeRef.current()
    },[])
    useEffect(() => {
        console.log(`app running bear poked check: ${bearHasBeenPoked}`)
        if(bearHasBeenPoked){
            setBearHasBeenPoked(false)
            history.push('/satiated-bear')
        }
    }, [bearHasBeenPoked, history])
    return (
        <div className="App">
            <div className="top-menu">
                <NavLink activeClassName="active" exact to="/">lobby</NavLink>
                <NavLink activeClassName="active" to="/sample">sample</NavLink>
                <NavLink activeClassName="active" to="/nowhere">nowhere</NavLink>
                <NavLink activeClassName="active" to="/sleeping-bear">a sleeping bear</NavLink>
                <NavLink activeClassName="active" to="/echo">echo</NavLink>
                <span>Bear poke status: {bearHasBeenPoked.toString()}</span>
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

