//import logo from './logo.svg';
import React, {useState,createContext,useReducer,useContext,useEffect} from 'react'
import './App.css';
import Signin from './components/screens/login/signin';
import Signup from './components/screens/register/signup'
import Sell from './components/screens/sell/sell'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from "./components/screens/Home/home";
import Item from './components/screens/item/item'
import Profile from './components/screens/profile/profile'
import Chatwindow from './components/screens/Chat/chat'
import Resetpassword from './components/screens/login/resetpassword'
import Newpassword from './components/screens/login/Newpassword'
import ChatroomPage from './components/screens/Chat/ChatroomPage'
import {reducer,initialState} from './reducers/userReducer'
import M from 'materialize-css'
import DashboardPage from './components/screens/Chat/DashboardPage';
import io from "socket.io-client";

export const UserContext = createContext()

const Routing = (props) =>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("bookswapuser"))
    if(user){
      dispatch({type:"USER",payload:user})
    }
  },[])
  return(
    <Switch>
      <Route exact path = "/">
          <Home data={props.data}/>
        </Route>
        <Route path = "/signin">
          <Signin setupSocket={props.setupSocket} />
        </Route>
        <Route path = "/signup">
          <Signup />
        </Route>
        <Route path = "/sell">
          <Sell />
        </Route>
        <Route path = "/book/:bookid" >
          <Item socket={props.socket} />
        </Route>
        {props.socket?
        <Route path = "/chatwindow/:chatroomId/:messageto">
          <Chatwindow  socket={props.socket}/>
        </Route>
        :''}
        
        <Route path = "/profile">
          <Profile />
        </Route>
        <Route path = "/resetpassword">
          <Resetpassword />
        </Route>
        <Route path = "/reset/:token">
          <Newpassword />
        </Route>
        <Route exact path="/chatroom/:id">
          <ChatroomPage socket={props.socket}/>
        </Route>
        <Route path = "/dashboard">
          <DashboardPage socket={props.socket} />
        </Route>
    </Switch>
  )
}

function App() {
//socket code
const [socket, setSocket] = useState(null);
const history = useHistory()
const [state, dispatch] = useReducer(reducer, initialState)
const [data,setData] = useState([])
useEffect(() => {
  setupSocket();
  //eslint-disable-next-line
}, [state]);

  const setupSocket = () => {
    const token = localStorage.getItem("bookswapjwt");
    if (token && !socket) {
      console.log('setupsocket called')
      const newSocket = io("https://book-swappp.herokuapp.com", {
        query: {
          token: localStorage.getItem("bookswapjwt"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connect", () => {
      });

      setSocket(newSocket);
    }
  };

  
//socket code
  
  const fetchbytitle = (bookname) =>{
    fetch("/searchbytitle",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            bookname
        })
        }).then(res =>res.json())
        .then(data =>{
            if(data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            }
            else{
                if(!data.length){
                    alert("No result found")
                }else{
                    setData(data)
                }
                
            }
    }).catch(err=>{
        console.log(err)
    })
}



  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
        <BrowserRouter >
        <div style={{zIndex:5,position:'fixed'}}>
          <Navbar fetchbytitle={fetchbytitle}/>
        </div>
        <div style={{marginBlockStart:80}}>
          <Routing socket={socket} setupSocket={setupSocket} data={data}/>
        </div>
        
        
        
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
