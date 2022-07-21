import { useState,useEffect } from 'react';
import { Grid } from '@material-ui/core';
import './App.css';
import Form from './components/form/Form';
import ListContacts from './components/list/ListContacts';


function App() {
  const [clientId, setClienId] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  const [contacts, setContacts] = useState([]);
  const [websckt, setWebsckt] = useState();


  useEffect(() => {
    const url = "ws://0.0.0.0:8080/contacts/" + clientId;
    const ws = new WebSocket(url);


    ws.onopen = (event) => {
      ws.send("Connect");
    };


    // recieve message every start page
    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setContacts(message);
    };
    setContacts([])
    setWebsckt(ws);
    //clean up function when we close page


    return () => ws.close();
  }, []);


  const sendMessage = (message) => {
    websckt.send(message);
    // recieve message every send message
    websckt.onmessage = (e) => {
      const message = JSON.parse(e.data);
      setContacts(message);
    };
    // setMessage([]);
  };
  console.log("contacts", contacts)


  return (
    <div className="App">
      <Form sendMessage={sendMessage} addContact={setContacts} />
      <Grid container justifyContent="center" spacing={1}>
      <Grid item xs={12} md={6}>
          <ListContacts contacts={contacts} />
      </Grid>
      </Grid>


    </div>
  );
}


export default App;