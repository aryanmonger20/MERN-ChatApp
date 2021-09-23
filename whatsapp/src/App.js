import React,{useEffect,useState} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import "./App.css";
import Pusher from 'pusher-js'
import axios from "./axios"
import Login from './Pages/Login';

// import Login from './Pages/Login';

function App() {
  const [messages,setMessages]=useState([]);

    useEffect(()=>{
      axios.get('/messages/sync')
      .then(response=>{
        setMessages(response.data);
      })

    },[])
    useEffect(()=>{
      const pusher = new Pusher('e2f0b8495eb7220a67c3', {
        cluster: 'ap2'
      });
  
      const channel = pusher.subscribe('messages');
      channel.bind('inserted', function(newMessage) {
     //   alert(JSON.stringify(newMessage));
       setMessages([...messages,newMessage])
      });
      return()=>{
        channel.unbind_all();
        channel.unsubscribe();
              }
    },[messages]);

    console.log(messages);
    return (
    <div className="app">
     <div className="app_body">
       
      {/* <Sidebar />  */}
   {/* <Chat messages={messages} /> */}
   <Router>
    <Switch>
      <Route exact path="/" component={Login} />
    </Switch>
  </Router>

      
       </div>
   
     </div>

  );
}

export default App;
