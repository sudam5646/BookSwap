import React, {useState,useEffect, useContext} from 'react'
import {UserContext} from '../../../App'
import {useParams,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import Chatwindow from '../Chat/chat'

const Item=({socket})=> {
    const {bookid} = useParams()
    const [data,setData] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(()=>{
        fetch(`/item/${bookid}`,{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("bookswapjwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
    },[])
    const DecideComponent = async(postedbyid,messageto) =>{
        console.log("decidecomponent called")
        console.log('state',state)
        console.log('socket',socket)

        if(state && socket){
            var chatroomname1 = state._id.toString() + postedbyid.toString()
            var chatroomname2 = postedbyid.toString() + state._id.toString()
            socket.emit("joinRoom", {
                chatroomname1,
                chatroomname2,
                postedbyid
              });
              fetch('/chatroom',{
                method:"post",
                headers:{
                    "Authorization" : "Bearer " + localStorage.getItem("bookswapjwt"),
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    chatroomname1,
                    chatroomname2
                })
              }).then(res=>res.json())
              .then(data=>{
                  console.log(data)
                  if(data){
                      var chatroomId = data._id
                    history.push(`/chatwindow/${chatroomId}/${messageto}`)
                  }else{
                    DecideComponent(postedbyid,messageto)
                  }
                  
              })
            
        }
        else{
            M.toast({html: "You must be logged in",classes:"#f44336 red"})
            history.push('/signin')
        }
    }
    return (
        <>
            {data?
                <div style={{marginTop:80}}>
                    <div>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-6" style={{marginRight:20}}>
                            <div style={{height:"400px"}} className="card home-card">
                                <img style={{height:"400px"}} src={data.pic} alt={data.short_form}></img>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="card home-card">
                                <h1 style={{margin:10}}>₹ {data.amount}</h1>
                                <h5 style={{margin:20}}>{data.title}</h5>
                                <h5 style={{margin:20}}>{data.college} {data.city}</h5>
                            </div>
                            <div className="card home-card">
                                <h4 style={{margin:10}}>Seller description</h4>
                                <h5 style={{margin:20}}>{data.postedBy.name}</h5>
                                <p style={{margin:10}}>
                                    <button 
                                    type="button" 
                                    className="btn btn-info btn-block"
                                    onClick={()=>DecideComponent(data.postedBy._id,data.postedBy.name)}>
                                        Chat with seller</button>
                                </p>
                                
                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                        
                    </div>
                </div>
                :""
            }
        </>
    )
}

export default Item
