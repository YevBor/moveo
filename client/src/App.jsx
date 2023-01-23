import './App.css'
import io from "socket.io-client";
import { useEffect, useState } from 'react';

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const sendMessage = () => {
    console.log('hello')
    socket.emit('send_message',{message})
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  const changeHangler = (e) =>{
    setMessage(e.target.value)
  }
 

  return (
    <div className="App">
      <input type="text"  placeholder='Message...' onChange={changeHangler}/>
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message:{messageReceived}</h1>
    </div>
  )
}

export default App