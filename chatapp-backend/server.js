const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const cors = require('cors');


const app = express();

app.use(cors());
const dbConfig  = require('./config/secret');

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use((req, res, next)  => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 'DELETE', 'PUT','OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true,limit:'50mb'}));

app.use(cookieParser());
// app.use(logger('dev'));
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url,{ useNewUrlParser: true,useUnifiedTopology: true});

require('./socket/stream')(io);
const auth = require('./routes/authRoutes');
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');

app.use('/api/chatapp',auth);
app.use('/api/chatapp',posts);
app.use('/api/chatapp',users);
app.use('/api/chatapp',friends);


server.listen(3000,()=>{
    console.log('Running on port 3000');
})

