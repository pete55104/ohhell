import React, {FC, useContext } from 'react'
import { AppContext } from '../App'
import ChatBox from '../widgets/ChatBox'
import GamesList from '../widgets/GamesList'

const Lobby: FC<{}> = () => {
    console.log('lobby render')
    const context = useContext(AppContext)
    return (
        <div>
        <h1>welcome to the lobby, {context.userDisplayName}</h1>
        <div className="widget-row">
            <ChatBox></ChatBox>
            <GamesList></GamesList>
         </div>
        </div>
    )
}

export default Lobby;