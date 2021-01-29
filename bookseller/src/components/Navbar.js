import React, {useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import navLogo from '../../src/images/BookSwaplogo.jpeg'

const Navbar = () =>{
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const renderList = ()=>{
        if(state){
            return[
                <li><Link to="/chatwindow">Messgaes</Link></li>,
                <li><Link to="/sell">Sell</Link></li>,
                <li>
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
                <li><Link to="/signin">Signin</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    return (
        <div>
            <nav>
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
