import React, {useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import navLogo from '../../src/images/BookSwaplogo.jpeg'
import M from 'materialize-css'

const Navbar = (props) =>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList = ()=>{
        if(state){
            return[
                <li key={1}
                    style={{color:'black'}}>
                    <input
                        type='text'
                        placeholder="Search"
                        onChange={(e)=>props.fetchbytitle(e.target.value)}>
                    </input>
                </li>,
                <li key={2}><Link to={`/chatwindow/${null}/${null}`}>Chat</Link></li>,
                <li key={3}><Link to="/sell">Sell</Link></li>,
                <li key={4}><Link to="/profile">Profile</Link></li>,
                <li key={5}>
                    <button className="btn #c62828 red darken-3"
                onClick = {()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/signin')
                }}>
                    Logout
                </button>
                </li>
            ]
        }else{
            return[
                <li key={6}
                    style={{color:'black'}}>
                    <input
                        type='text'
                        placeholder="Search by book name"
                        onChange={(e)=>props.fetchbytitle(e.target.value)}>
                    </input>
                </li>,
                <li key={7} onClick={DecideComponent}><Link to={state?'/sell':'/signin'}>Sell</Link></li>,
                <li key={8}><Link to="/signin">Signin</Link></li>,
                
            
                <li key={9}><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    const DecideComponent = () =>{
        if(!state){
            M.toast({html: "You must be logged in to sell your books",classes:"#f44336 red"})
            history.push('/signin')
        }
    }
    return (
        <div>
            <nav className="sticky">
                <div
                className="nav-wrapper white">
                        <Link to={'/'} className="brand-logo left"><img style={{height:52}} src={navLogo} alt='BookSwap'></img></Link>
                        <ul id="nav-mobile" className="right">
                            {renderList()}
                        </ul>
                        
                </div>
            </nav>
            
        </div>
    )
}

export default Navbar
