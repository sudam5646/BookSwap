import React, {useState,useContext} from 'react'
import {Link, useHistory, withRouter} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../../App'

const Signin = (props) =>{
    const {state,dispatch} = useContext(UserContext)
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const history = useHistory()

    const PostData = ()=>{
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#f44336 red"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email:email.toUpperCase()
            })
            }).then(res =>res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html: data.error,classes:"#f44336 red"})
                }
                else{
                    localStorage.setItem("bookswapjwt",data.token)
                    localStorage.setItem("bookswapuser",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"signedin successfully",classes:"#8bc34a light-green"})
                    console.log(data)
                    history.push('/')
                }
        }).catch(err=>{
            console.log(err)
        })
    }
    
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2 className="brand-logo">BOOK SWAPP</h2>   
                <input
                type = "text"
                placeholder = "email"
                value={email}
                onChange={(e) =>setEmail(e.target.value.trim())}
                />
                <input
                type = "password"
                placeholder = "password"
                value={password}
                onChange={(e) =>setPassword(e.target.value)}
                onKeyPress ={e=>{if(e.key === 'Enter'){
                    {PostData()}
                }}}
                />    
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={PostData}>
                    Login
                </button> 
                <h5>
                    Dont have an account?<Link to='/signup'><span style={{color:"blue"}}>signup</span></Link>    
                </h5> 
                <h6><Link to='/resetpassword'><span style={{color:"blue"}}>Forgot password?</span></Link></h6>      
            </div>
        </div>
        
    )
}

export default withRouter(Signin)

