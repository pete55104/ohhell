import React, {Component } from 'react'
import { NavLink } from 'react-router-dom';

class SatiatedBear extends Component<{}, {}> {
    componentWillMount() {
      document.body.style.backgroundColor = "black";
    } 

    componentWillUnmount() {
        document.body.style.backgroundColor = "lightgray";
    }
    render() {
        return (
        <div className="centeringdiv darkmode">
            <h1>you have been eaten by a bear</h1>
          <div>
            <NavLink activeClassName="active" exact to="/">out</NavLink>
          </div>
          </div>
        );
    }
}

export default SatiatedBear;