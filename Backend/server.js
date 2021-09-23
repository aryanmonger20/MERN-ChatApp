import express from "express"
import mongoose from "mongoose"
import Messages from"./dbmessages.js"
import Pusher from 'pusher'
import cors from 'cors'
//const bodyParser=require('body-parser')
import bodyParser from 'body-parser'

const app=express();
const port =process.env.PORT||5000

 //middleware
 
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json())
 app.use(express.json());
 app.use(cors());

//dbconfig
const connection_url="mongodb+srv://aryan:mohit2009@cluster0.mduhl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

 const pusher = new Pusher({
    appId: "1108723",
    key: "e2f0b8495eb7220a67c3",
    secret: "77e75de5da64f9da127e",
    cluster: "ap2",
    useTLS: true
  });
 
//   app.use(req,res,next=>{
//       res.setHeader("Access-Control-Allow-Origin","*");
//       res.setHeader("Access-Control-Allow-Headers","*");
//       next();
//   })



//   pusher.trigger("messages", "inserted", {
//     message: "hello world"
//   });


  const db=mongoose.connection;

  db.once('open',()=>{
      console.log("DB connected")
      const msgCollection=db.collection('messagecontents')
      const changeStream=msgCollection.watch()
      
      changeStream.on("change",(change)=>{
          console.log("change occured");
         

          if (change.operationType==='insert'){
              const messageDetails=change.fullDocument
              pusher.trigger('messages','inserted',
              {
                  name:messageDetails.user,
                  message:messageDetails.message,
                  timestamp:messageDetails.timestamp,
                  received:messageDetails,
              }
              )
          }else{
              console.log('Error triggering Pusher')
          }
      })
  })
//routes
app.get("/",(req,res)=>res.status(200).send("hello world"))

app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err)

        }
        else{
            res.status(200).send(data)
        }
    })
})
app.post('/messages/new',(req,res)=>{
    const dbMessage=req.body;
    console.log(dbMessage);
    console.log(req.body);
    
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
            console.log(data);
            console.log(dbMessage);
        }
    })
})
app.listen(port,()=>console.log(`Running on:${port}`))
