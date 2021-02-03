//import logo from './logo.svg';
import React, {createContext,useReducer,useContext,useEffect} from 'react'
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
import {reducer,initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () =>{
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
          <Home />
        </Route>
        <Route path = "/signin">
          <Signin />
        </Route>
        <Route path = "/signup">
          <Signup />
        </Route>
        <Route path = "/sell">
          <Sell />
        </Route>
        <Route path = "/book/:bookid">
          <Item />
        </Route>
        <Route path = "/chatwindow">
          <Chatwindow />
        </Route>
        <Route path = "/profile">
          <Profile />
        </Route>
        <Route path = "/resetpassword">
          <Resetpassword />
        </Route>
        <Route path = "/reset/:token">
          <Newpassword />
        </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <div className="App">
      <UserContext.Provider value={{state,dispatch}}>
        <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
