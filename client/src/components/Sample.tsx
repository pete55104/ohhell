import React, { FC, ChangeEvent, useState } from 'react'
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { useMessageBus } from '../hooks/useMessageBus'

interface IProps extends RouteComponentProps {
    sampleProp: string,
    initialColor: string
} 

const stateTicker = { renderCount: 0}

const Sample: FC<IProps> = props => {
    const [color, setColor] = useState(props.initialColor);
    const [truthiness, setTruthiness] = useState(true);
    const { lastMessage, sendMessage }  = useMessageBus();
    const toggleTruthiness = () => {
        setTruthiness(!truthiness)
    }
    stateTicker.renderCount = stateTicker.renderCount + 1;
    const handleColorChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(`render count is ${stateTicker.renderCount}`)
        setColor(event.currentTarget.value);
        sendMessage(event.currentTarget.value);
    }

    console.log(`props: ${JSON.stringify(props)}`);
    return (
    <div className="centeringdiv">
        <h1>sample</h1>
    <div>
        <span>This is the {props.sampleProp} component route</span>
        <NavLink activeClassName="active" exact to="/">Redirect to /</NavLink>
    <p>This page's truthiness is rated at {truthiness ? "true" : "false"} <button onClick={toggleTruthiness}>toggle truthiness</button></p>
    <p>This page's color is rated at {color} 
        <input 
            type="text"
            id="color"
            value={color}
            onChange={handleColorChange}/></p>
    <p>This page's last message is rated at {lastMessage.data}</p>
    <p>Has been rendered {stateTicker.renderCount}</p>
    </div>
    </div>
    );
}

export default Sample;