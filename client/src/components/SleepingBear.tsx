import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { IMessageEvent } from 'websocket';
import { useMessageBus } from '../hooks/useMessageBus'


const SleepingBear: FC<{}> = () => {
    const onMessage = (message: IMessageEvent) => {
        console.log(`sleeping bear noticed message with data ${JSON.stringify(message.data)}`)
    };

    const wakeBear = () => {
        sendMessage('caution, bear has been poked!');
    }

    const { lastMessage, sendMessage }  = useMessageBus({clientId: 'SleepingBear',  callback: onMessage});

    return (
        <div className="centeringdiv">
        <h1>sleeping bear</h1>
        <span>caution, sleeping bear</span>
        <button onClick={wakeBear} className="active">poke bear</button>
        {lastMessage.data.toString().includes("poke") && lastMessage.data.toString().includes("bear") && <Redirect push to="/satiated-bear" />}
        </div>
    );
}

export default SleepingBear;