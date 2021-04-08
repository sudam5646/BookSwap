import React, {useEffect,useState,useRef,useContext} from "react";
import { withRouter } from "react-router-dom";
import './chatroom.css'
import {UserContext} from '../../../App'
import BSlogo from '../../../images/BSlogo.jpeg'
import Background from '../../../images/background3.png'

const ChatroomPage = ({ match, socket,chatroomId,messageto }) => {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [userId, setUserId] = useState("");
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=> {
    if(chatroomId !== 'null'){
      fetch("/getmessages", {
      method:'post',
      headers: {
        Authorization: "Bearer " + localStorage.getItem("bookswapjwt"),
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        chatroomId:chatroomId
      })
    }).then(res=>res.json())
    .then((result) => {
      setMessages(result);
    })
    .catch((err) => {
    });
    }
    
  },[chatroomId]);

  const sendMessage = () => {
    
    if (socket) {
      socket.emit("chatroomMessage", {
        chatroomId,
        message: messageRef.current.value,
      });
      messageRef.current.value = "";
    }
  };
  
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
    const newMessages = [...messages, message];
    setMessages(newMessages);
  });
    }
    //eslint-disable-next-line
  }, [messages]);
  

  useEffect(() => {
    if (socket && chatroomId !== 'null') {
      socket.emit("joinRoom2", {
        chatroomId
      });
    }
    return () => {
      //Component Unmount
      if (socket && chatroomId !== 'null') {
        socket.emit("leaveRoom", {
          chatroomId
        });
      }
    };
    //eslint-disable-next-line
  }, [socket,chatroomId]);

  return (
    <div>
      <div className="chatroomPage">
      <div className="chatroomSection">
        {messageto === 'null'?<div>
          <img style={{padding:10}} className="center-image" src={BSlogo} alt='BookSwap'></img>
          <p style={{paddingLeft:50}}>Exchange your books through book-swap.com</p>
        </div>:
        <>
        <div className="cardHeader"  style={{textAlign:"center",margin:10}}>{messageto}</div>
        <div style={{  
                    backgroundImage: `url(${Background})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                  }} className="chatroomContent">
          {messages.map((message, i) => (
            <div key={i} className="chatroommessage">
              <span
                className={
                  state._id === message.userId ? "ownMessage" : "otherMessage"
                }
              >
                {message.name}:
              </span>{" "}
              {message.message}
            </div>          
          ))}
        </div>
        <div className="chatroomActions">
          <div>
            <input
              type="text"
              name="message"
              placeholder="Say something!"
              ref={messageRef}
              onKeyPress ={e=>{if(e.key === 'Enter'){
                {sendMessage()}
            }}}
            />
          </div>
          <div>
            <button className="join" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </>}
        
        </div>
    </div>
    </div>
    );
    
};

export default withRouter(ChatroomPage);