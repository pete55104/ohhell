import React, {Component} from 'react'
import { Route, Switch, Redirect, NavLink } from "react-router-dom"
import './App.css'
import Echo from "./components/Echo"
import Lobby from "./components/Lobby"
import SleepingBear from "./components/SleepingBear"
import Sample from "./components/Sample"
import Nothing from "./components/Nothing"

class App extends Component<{}, {}> {
    render() {
        return (
        <div className="App">
            <div className="link-container">
                <NavLink activeClassName="active" exact to="/" style={{paddingLeft: "10px"}}>lobby</NavLink>
                <NavLink activeClassName="active" to="/sample" style={{paddingLeft: "10px"}}>sample</NavLink>
                <NavLink activeClassName="active" to="/nowhere" style={{paddingLeft: "10px"}}>nowhere</NavLink>
                <NavLink activeClassName="active" to="/sleeping-bear" style={{paddingLeft: "10px"}}>a sleeping bear</NavLink>
                <NavLink activeClassName="active" to="/echo" style={{paddingLeft: "10px"}}>echo</NavLink>
            </div>
            <Switch>
                <Route path="/" exact component={Lobby} />
                <Route path="/echo" component={Echo} />
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

