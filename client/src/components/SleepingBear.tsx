import React, {Component } from 'react'
import { NavLink } from 'react-router-dom';

class SleepingBear extends Component<{}, {}> {
    render() {
        return (
          <div className="centeringdiv">
            <h1>sleeping bear</h1>
            <span>caution, sleeping bear</span>
            <NavLink activeClassName="active" exact to="/satiated-bear">poke bear</NavLink>
          </div>
        );
    }
}

export default SleepingBear;