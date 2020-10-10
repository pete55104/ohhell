import React, {Component} from 'react'
import { Route, Switch, Redirect, NavLink } from "react-router-dom"
import './styles/App.scss'
import Echo from "./components/Echo"
import Lobby from "./components/Lobby"
import SleepingBear from "./components/SleepingBear"
import SatiatedBear from "./components/SatiatedBear"
import Sample from "./components/Sample"
import Nothing from "./components/Nothing"

class App extends Component<{}, {}> {
    render() {
        return (
        <div className="App">
            <div className="link-container top-menu">
                <NavLink activeClassName="active" exact to="/">lobby</NavLink>
                <NavLink activeClassName="active" to="/sample">sample</NavLink>
                <NavLink activeClassName="active" to="/nowhere">nowhere</NavLink>
                <NavLink activeClassName="active" to="/sleeping-bear">a sleeping bear</NavLink>
                <NavLink activeClassName="active" to="/echo">echo</NavLink>
            </div>
            <Switch>
                <Route path="/" exact component={Lobby} />
                <Route path="/echo" component={Echo} />
                <Route path="/sample" render={routerProps => <Sample {...routerProps} sampleProp={"sample"}/>} />
                <Route path="/sleeping-bear" component={SleepingBear} />
                <Route path="/satiated-bear" component={SatiatedBear} />
                <Route path='/default' render={() => <Redirect to= "/" />} />
                <Route component={Nothing} />
            </Switch>
        </div>
        )
    }
}

export default App;

