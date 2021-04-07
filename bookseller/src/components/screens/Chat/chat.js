import React, {useEffect} from 'react'
import ChatroomPage from './ChatroomPage'
import DashboardPage from './DashboardPage'
import { withRouter } from "react-router-dom";
import './chat.css'

const Chat = ({socket,match})=> {
    const chatroomId = match.params.chatroomId
    const messageto = match.params.messageto
    
    return (
        <div className="flex-container">
                <div><DashboardPage  socket={socket}/></div>
                <div><ChatroomPage chatroomId={chatroomId}
                                    socket={socket}
                                    messageto={messageto}/></div>
        </div>
    )
}

export default withRouter(Chat)
