import React, {Component } from 'react'
import { RouteComponentProps } from 'react-router-dom';

interface SampleProps extends RouteComponentProps {
    sampleProp: string
} 

class Sample extends Component<SampleProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        console.log(this.props);
        const redirect = () => {
          this.props.history.push("/");
        };
        return (
          <div>
            This is the {this.props.sampleProp} component route
            <button onClick={redirect}>Redirect to /</button>
          </div>
        );
    }
}

export default Sample;