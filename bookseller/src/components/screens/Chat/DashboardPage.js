import React, {useState,useEffect,useContext} from "react";
import { Link,useHistory,withRouter } from "react-router-dom";
import './dashboard.css'
import {UserContext} from '../../../App'

const DashboardPage = ({socket}) => {
  const [chatrooms, setChatrooms] = useState([]);
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const selectChat=(chatroomId,messageto)=>{
    if(state && socket){
      history.push(`/chatwindow/${chatroomId}/${messageto}`)
    }
  }
  const getChatrooms = () => {
    fetch("/getallchatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("bookswapjwt"),
        },
      }).then(res=>res.json())
      .then((result) => {
        setChatrooms(result);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };

  useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboardSection">
      {chatrooms.map((chatroom,i) => (
        <div key={i}>
          {chatroom.id1._id === state._id?'':<div onClick = {()=>selectChat(chatroom._id,chatroom.id1.name)}>{chatroom.id1.name}</div>}
          {chatroom.id2._id === state._id?'':<div onClick = {()=>selectChat(chatroom._id,chatroom.id2.name)}>{chatroom.id2.name}</div>}
        </div>
      ))}
    </div>
    );
};

export default withRouter(DashboardPage);