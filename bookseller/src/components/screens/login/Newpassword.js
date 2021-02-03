import React, {useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Newpassword = () =>{
    const {token} = useParams()
    const [password,setPassword] = useState("")
    const history = useHistory()
    
    console.log(token)

    const PostData = ()=>{
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
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
                type = "password"
                placeholder = "Enter new password"
                value={password}
                onChange={(e) =>setPassword(e.target.value.trim())}
                />    
                <button
                style={{margin:20}} 
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={PostData}>
                    Update password
                </button>   
            </div>
        </div>
        
    )
}

export default Newpassword

