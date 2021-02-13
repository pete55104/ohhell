import React, {FC, useContext } from 'react'
import { AppContext } from '../App'

const Lobby: FC<{}> = () => {
    const context = useContext(AppContext)
    return (
          <h1>welcome to the lobby, {context.userDisplayName}</h1>
    )
}

export default Lobby;