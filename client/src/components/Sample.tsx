import React, {Component } from 'react'
import { NavLink, RouteComponentProps } from 'react-router-dom';

interface SampleProps extends RouteComponentProps {
    sampleProp: string
} 

class Sample extends Component<SampleProps, {}> {

    render() {
        console.log(this.props);
        return (
        <div className="centeringdiv">
            <h1>sample</h1>
          <div>
            <span>This is the {this.props.sampleProp} component route</span>
            <NavLink activeClassName="active" exact to="/">Redirect to /</NavLink>
          </div>
          </div>
        );
    }
}

export default Sample;