import React, { FC } from 'react'
import { NavLink, RouteComponentProps } from 'react-router-dom';

interface SampleProps extends RouteComponentProps {
    sampleProp: string
} 

const Sample: FC<SampleProps> = ( props: SampleProps): JSX.Element => {
    console.log(props);
    return (
    <div className="centeringdiv">
        <h1>sample</h1>
    <div>
        <span>This is the {props.sampleProp} component route</span>
        <NavLink activeClassName="active" exact to="/">Redirect to /</NavLink>
    </div>
    </div>
    );
}

export default Sample;