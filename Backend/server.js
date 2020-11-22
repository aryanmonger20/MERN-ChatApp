import express from "express"
import mongoose from "mongoose"
import Messages from"./dbmessages.js"
import Pusher from 'pusher'

const app=express();
const port =process.env.PORT||3000


//dbconfig
const connection_url="mongodb+srv://aryan:kkU5vaihkG5evGa4@cluster0.gvfde.mongodb.net/chatappdb?retryWrites=true&w=majority";

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
  
  pusher.trigger("my-channel", "my-event", {
    message: "hello world"
  });


  const db=mongoose.connection

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
                  message:messageDetails.message
              }
              )
          }else{
              console.log('Error triggering Pusher')
          }
      })
  })
//routes
app.get("/",(req,res)=>res.status(200).send("hello world"))

app.get('messages/sync',(req,res)=>{
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
    const dbMessage=req.body
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})
app.listen(port,()=>console.log(`Running on:${port}`))