const express = require('express')
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require('./config/key');
var cors = require('cors')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('./config/key')

const PORT = process.env.PORT || 5000;


mongoose.connect(MONGOURI, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

mongoose.connection.on('connected', () =>{
    console.log("Connected to mongo");
})

mongoose.connection.on('error', (err) => {
    console.log("err connecting",err);
})
app.use(cors())
require('./models/user');
require('./models/book')
require('./models/Message')
require('./models/Chatroom')
const Message = mongoose.model("Message");
const User = mongoose.model("User");
const Chatroom = mongoose.model("Chatroom")
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/book'))
app.use(require('./routes/chatroom'))
app.use(require('./routes/messages'))

if(process.env.NODE_ENV == "production"){
    app.use(express.static('bookseller/build'))
    const path = require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'bookseller','build','index.html',))
    })
}

const server = app.listen(PORT, () => {
    console.log("Server listening on port "+PORT);
  });

  const io = require("socket.io")(server, {
    cors: {
      origin: "https://book-swappp.herokuapp.com",
      methods: ["GET", "POST"]
    }
  });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      jwt.verify(token,JWT_SECRET,(err,payload) =>{
        if(err){
            return res.status(401).json({error:"you must be loged in"})
        }
        const {_id} = payload
        socket.userId = _id
        next()
    })
    } catch (err) {}
  });
  
  io.on("connection", (socket) => {
    console.log("Connected: " + socket.userId);
  
    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.userId);
    });

    socket.on("joinRoom2",({chatroomId})=>{
      socket.join(chatroomId)
      console.log("A user joined chatroom 2: " + chatroomId);
    })
    socket.on("joinRoom", async({ chatroomname1,chatroomname2,postedbyid }) => {
      var chatroom = await Chatroom.findOne({name:chatroomname1})
      if(chatroom){
        socket.join(chatroom._id);
        console.log("A user joined chatroom: " + chatroom._id);
      }else{
        var chatroom = await Chatroom.findOne({name:chatroomname2})
        if(chatroom){
          socket.join(chatroom._id);
          console.log("A user joined chatroom: " + chatroom._id);
        }else{
            const newchatroom = new Chatroom({
            name : chatroomname1,
            id1 : socket.userId,
            id2 : postedbyid
          })
          await newchatroom.save().then(()=>{
            socket.join(newchatroom._id);
            console.log("A user joined chatroom: " + newchatroom._id);
            console.log("newChatroomid",newchatroom._id)
          })
        }
        
      }
      
    });
  
    socket.on("leaveRoom", async({ chatroomId }) => {
        socket.leave(chatroomId);
        console.log("A user left chatroom: " + chatroomId);                                           
      
    });
    socket.on("chatroomMessage", async ({ chatroomId, message }) => {
      console.log('message from chatroomMessage ',message)
      if (message.trim().length > 0) {
        const user = await User.findOne({ _id: socket.userId });
        const newMessage = new Message({
          chatroom: chatroomId,
          user: socket.userId,
          message,
        });
        console.log("chatroomId ",chatroomId)
        io.to(chatroomId).emit("newMessage", {
          message,
          name: user.name,
          userId: socket.userId,
        });
        await newMessage.save();
        
      }
    });
  });
