import React, {useState,useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../../App'

const Resetpassword = () =>{
    const [email,setEmail] = useState("")
    const history = useHistory()

    const PostData = ()=>{
        console.log('keypress called')
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#f44336 red"})
            return
        }
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email:email.toUpperCase()
            })
            }).then(res =>res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html: data.error,classes:"#f44336 red"})
                }
                else{
                    M.toast({html:data.message,classes:"#8bc34a light-green"})
                    console.log(data)
                    history.push('/signin')
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
                onKeyPress ={e=>{if(e.key === 'Enter'){
                    {PostData()}
                }}}
                />     
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={PostData}>
                    Reset Password
                </button> 
                <h5>
                    Dont have an account?<Link to='/signup'><span style={{color:"blue"}}>signup</span></Link>    
                </h5>       
            </div>
        </div>
        
    )
}

export default Resetpassword

