import React, {useState,useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () =>{
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const history = useHistory()

    useEffect(()=>{
        
    })

    const PostData = ()=>{
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid Email",classes:"#f44336 red"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email:email.toUpperCase()
            })
            }).then(res =>res.json())
            .then(data =>{
                if(data.error){
                    M.toast({html: data.error,classes:"#f44336 red"})
                }
                else{
                    M.toast({html:data.message,classes:"#8bc34a light-green"})
                    history.push('/signin')
                }
        }).catch(err=>{
            console.log(err)
        })
    }


    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>BOOK SWAPP</h2>   
                <input
                type = "text"
                placeholder = "name"
                value={name}
                onChange={(e) =>setName(e.target.value)}
                /> 
                <input
                type = "text"
                placeholder = "email"
                value={email}
                onChange={(e) =>setEmail(e.target.value().trim())}
                />
                <input
                type = "password"
                placeholder = "password"
                value={password}
                onChange={(e) =>setPassword(e.target.value.trim())}
                onKeyPress ={e=>{if(e.key === 'Enter'){
                    {PostData()}
                }}}
                /> 
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={PostData}>
                    Signup
                </button>  
                <h5>
                    Already have an account?<Link to='/signin'><span style={{color:"blue"}}>signin</span></Link>    
                </h5>     
                <h6><Link to='/resetpassword'><span style={{color:"blue"}}>Forgot password?</span></Link></h6>     

            </div>
        </div>
    )
}

export default Signup
