const express = require("express");
const fileUpload = require("express-fileupload");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT, MONGODB_URI } = require("./config");
const { authMiddleware } = require("./src/middlewares/authMiddleware");
const authRouter = require("./src/routers/authRouter")
const userRouter = require("./src/routers/userRouter");
const chatRouter = require("./src/routers/chatRouter");
const messageRouter = require("./src/routers/messageRouter");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // origin: "*",
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
  },
});

// to save files for public
app.use(express.static('src/public'))

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(fileUpload())

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", authMiddleware, userRouter);
app.use("/api/chat", authMiddleware, chatRouter);
app.use("/api/message", authMiddleware, messageRouter);

app.get('/', (req, res)=> {
  res.send('Chat app')
})

// WebSocket functions
let activeUsers = []

io.on("connection", (socket) => {
  // console.log("Client dasturga ulandi");
  socket.on('new-user-add', (newUserId)=>{
    // if user is not added previously
    if(!activeUsers.some((user)=> user.userId === newUserId)){
      activeUsers.push({userId: newUserId, socketId: socket.id})
      // console.log('New user Connected');
    }
    // send all active users to new user
    io.emit('get-users', activeUsers)
  })

  socket.on('disconnect', ()=> {
    // remove user from active users
    activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id)
    // console.log('User disconnected!');
    // send all active users to all users
    io.emit('get-users', activeUsers)
  })

  // send message to a specific user
  socket.on("send-message", (data)=> {
    const {receivedId} = data
    const user = activeUsers.find(user => user.userId === receivedId)
    if(user){
      io.to(user.socketId).emit('recieve-message', data)
    }
  })
});


mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=> {
  server.listen(PORT, ()=> console.log(`Server started on port: ${PORT}`))
}).catch((error) => console.log(error))