import React, {useEffect, useState, useRef} from 'react';
import '../App.css';
import firebase from '../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Button from '@material-ui/core/Button';
import {lightBlue} from '@material-ui/core/colors';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';



const firestore = firebase.firestore()
const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(lightBlue[100]),
    backgroundColor: lightBlue[50],
  },
}))(Button);
function Board() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('time').limit(10);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');
  const [buffer, updateBuffer] = useState([]);
  let deleteRef = useRef();

  const sendMessage = async () => {
    console.log(formValue)
    if (messages.length >= 10){
      messagesRef.orderBy('time').limit(1).get().then((item) => {
        item.docs[0].ref.delete();
      })
    }
    await messagesRef.add({
      text: formValue,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    })
    setFormValue('');
  }

  function handleinput(e){
    updateBuffer(oldArray => [...oldArray, e.target.textContent])
  };

  function handlesubmit(){
    let string_value = '';
    for(let i = 0; i < buffer.length; i++){
      string_value = string_value + buffer[i]
    };
    let res;
    let new_str;
    res = calculator_result(string_value);
    if (res != null){
      new_str = string_value+'='+res;
    } else {
      new_str = 'No Value'
    }
    console.log(new_str);
    setFormValue(new_str);
    console.log(formValue)
    handleclear();
  };

  useEffect(() => {
    if (formValue != ''){
      if (messages.length >= 10){
        messagesRef.orderBy('time').limit(1).get().then((item) => {
          item.docs[0].ref.delete();
        })
      }
    messagesRef.add({
        text: formValue,
        time: firebase.firestore.FieldValue.serverTimestamp(),
      })
      setFormValue('');
    }
  }, [formValue])

  function calculator_result(s){
    if (!s) return null;
    const stack = [];
    let num = 0;
    let operator = '+';
  
    for (let i = 0; i <= s.length; i++) {
      if (s[i] === ' ') continue;
      if (s[i] >= '0' && s[i] <= '9') {
        num = num * 10 + +s[i];
        continue;
      }
      if (i === s.length-1){
        if (s[i] === '-' || s[i] === '+' || s[i] === '×' || s[i] === '÷'){
          return null
        }
      }
      if (i > 0){
        if (s[i] === '-' || s[i] === '+' || s[i] === '×' || s[i] === '÷'){
          if (s[i-1] === '-' || s[i-1] === '+' || s[i-1] === '×' || s[i-1] === '÷'){
            return null
          }
        }
      }
      if (operator === '-') stack.push(-num);
      else if (operator === '+') stack.push(num);
      else if (operator === '×') stack.push(stack.pop() * num);
      else if (operator === '÷') stack.push(Math.trunc(stack.pop() / num));
      operator = s[i];
      num = 0;
    }
    return stack.reduce((a, b) => a + b);
  }
  function handleclear(){
    updateBuffer(oldArray => [])
  }
  function handleback(){
    updateBuffer(oldArray => oldArray.slice(0, -1))
  }
  /*
  return (<>
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </main>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
      <button type="submit" disabled={!formValue}>🕊️</button>
    </form>
  </>)
  */
  return (
    <div style = {{height: '100%', width: '100%' , display:'flex', flexDirection:'column'}}>
      <div style = {{height: "49.5%"}}>
        <div style = {{ height: "100%"}}>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        </div>
      </div>
      <div className = 'cal'>
        <div style = {{height: "10%", display:'flex', flexDirection:'row'}}>
            <div style = {{width:'79%', textAlign: 'right', height: '100%', fontSize:'50px'}}>
              {buffer}
            </div>
            <div style = {{width:'22%',  display:'flex', flexDirection:'column'}}>
              <div style = {{height:'20%'}}></div>
              <div style = {{height:'80%'}}>
                <IconButton onClick = {handleclear} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </div>
        <table className = 'maintable'>
          <tbody className = 'tablebody'>
            <tr className = 'tablerow'>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  1
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  2
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  3
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  +
                </Button>
              </td>
            </tr>
            <tr className = 'tablerow'>
            <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  4
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  5
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  6
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  -
                </Button>
              </td>
            </tr>
            <tr className = 'tablerow'>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  7
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  8
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  9
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  ×
                </Button>
              </td>
            </tr>
            <tr className = 'tablerow'>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  0
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleback} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  ←
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handlesubmit} variant="outlined" color="secondary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  =
                </Button>
              </td>
              <td className = 'tablespace'>
                <Button onClick={handleinput} variant="outlined" color="primary" style = {{width:'100%', height:'100%', fontSize:'40px'}}>
                  ÷
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
function ChatMessage(props) {
  console.log(props.message)
  const { text, uid, photoURL } = props.message;
  return (<>
    <div>
      <p style = {{color: 'black', textAlign: 'center', fontSize: '30px', lineHeight: '0.2'}}>{text}</p>
    </div>
  </>)
}

export default Board