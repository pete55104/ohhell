import React, { FC } from 'react';
import { useMessageBus, defaultChannels, Message } from '../hooks/useMessageBus'


const SleepingBear: FC<{}> = () => {
    const onMessage = (message: Message) => {
        console.log(`sleeping bear noticed message with data ${JSON.stringify(message.data)}`)
    };

    const wakeBear = () => {
        sendMessage('caution, bear has been poked!', defaultChannels.global);
    }

    const { sendMessage }  = useMessageBus({clientId: 'SleepingBear',  callback: onMessage, channels:[]});

    return (
        <div className="centeringdiv">
        <h1>sleeping bear</h1>
        <span>caution, sleeping bear</span>
        <button onClick={wakeBear} className="active">poke bear</button>
        </div>
    );
}

export default SleepingBear;