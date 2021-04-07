import React, {useState,useEffect,useContext} from 'react'
import {useHistory,Link} from 'react-router-dom'
import {UserContext} from '../../../App'
import M from 'materialize-css'

const Home = (props) =>{
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        if(state){
                fetch('/allbooks',{
                    headers:{
                        "Content-Type":"application/json"
                    }
                }).then(res=>res.json())
                .then(result=>{
                    let finalresult = result.filter((item)=>{
                        if(item.postedBy._id != state._id){
                            return item
                        }
                    })
                    setData(finalresult)
                    setLoading(true)
                })
        }
        else{
            fetch('/allbooks',{
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(res=>res.json())
            .then(result=>{
                setData(result)
                setLoading(true)
            })
        }
    },[state])
const datafromsearch = props.data
    useEffect(()=>{
        setLoading(false)
        if(datafromsearch){
            if(state){
                    let result = datafromsearch
                    let finalresult = result.filter((item)=>{
                        if(item.postedBy._id != state._id){
                            return item
                        }
                    })
                    setData(finalresult)
                    setLoading(true)
            }
            else{
            setData(datafromsearch)
            setLoading(true)
            }
        }
    },[datafromsearch])


    return (
        <>        
        {loading && data.length ?
        <div className="home">
            {    
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style = {{padding:"10px"}}>
                                <span style={{paddingLeft:"20px"}}>{item.short_form}</span>
                                
                                </h5>
                            <div className="card-image">
                                <Link to={"/book/"+item._id} >
                                    <img src={item.pic} />
                                </Link>
                                
                            </div>
                            <div className="card-content">
                                <h5>{item.amount} ₹</h5>
                                <p>{item.title}</p>
                                <p>{item.city}</p>

                            </div>
                        </div>
                    )
                })
                
            }
            
        </div>
        :<h2>loading....</h2>
        }
        </>
    )
}

export default Home
