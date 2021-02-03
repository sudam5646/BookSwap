const express = require('express')
const app = express();
const mongoose = require('mongoose');
const {MONGOURI} = require('./config/key');

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

require('./models/user');
require('./models/book')
app.use(express.json())

app.use(require('./routes/auth'))
app.use(require('./routes/book'))

if(process.env.NODE_ENV == "production"){
    app.use(express.static('bookseller/build'))
    const path = require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'bookseller','build','index.html',))
    })
}

app.listen(PORT, () => {
    console.log('server running on port : ' + PORT);
})
