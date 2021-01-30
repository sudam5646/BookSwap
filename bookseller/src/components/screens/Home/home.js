import React, {useState,useEffect,useContext} from 'react'
import {useHistory,Link} from 'react-router-dom'
import {UserContext} from '../../../App'

const Home = () =>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    useEffect(()=>{
        if(state){
                fetch('/allbooks',{
                    headers:{
                        "Authorization" : "Bearer " + localStorage.getItem("bookswapjwt")
                    }
                }).then(res=>res.json())
                .then(result=>{
                    console.log("result",result)
                    let finalresult = result.filter((item)=>{
                        if(item.postedBy._id != state._id){
                            return item
                        }
                    })
                    console.log("finalresult",finalresult)
                    setData(finalresult)
                })
        }
        else{
            fetch('/allbooks',{
                headers:{
                    "Authorization" : "Bearer " + localStorage.getItem("bookswapjwt")
                }
            }).then(res=>res.json())
            .then(result=>{
                console.log("result",result)
                setData(result)
            })
        }
    },[state])

    return (
        <>
        {data.length ?
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
