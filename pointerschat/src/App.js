import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
//import { signInWithRedirect } from 'firebase/auth';

firebase.initializeApp({
  apiKey: "AIzaSyCrdMPj6Lxh0ce0wD_CjnQAWW7wWo6Jv0Q",
  authDomain: "react-firechat-2d191.firebaseapp.com",
  projectId: "react-firechat-2d191",
  storageBucket: "react-firechat-2d191.appspot.com",
  messagingSenderId: "872066371588",
  appId: "1:872066371588:web:feda22fabb0e7a3b57e551"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function getRandomIcons(){
  const IconUrls = [
    "https://cdn-icons-png.flaticon.com/512/188/188987.png",
    "https://cdn-icons-png.flaticon.com/512/188/188995.png",
    "https://cdn-icons-png.flaticon.com/512/188/188989.png",
    "https://cdn-icons-png.flaticon.com/512/189/189001.png",
    "https://cdn-icons-png.flaticon.com/512/188/188990.png",
    "https://cdn-icons-png.flaticon.com/512/188/188997.png",
    "https://cdn-icons-png.flaticon.com/512/1752/1752681.png",
    "https://cdn-icons-png.flaticon.com/512/189/189000.png",
    "https://cdn-icons-png.flaticon.com/512/188/188993.png",
    "https://cdn-icons-png.flaticon.com/512/188/188988.png",
    "https://cdn-icons-png.flaticon.com/512/188/188991.png",
    "https://cdn-icons-png.flaticon.com/512/188/188994.png",
    "https://cdn-icons-png.flaticon.com/512/188/188924.png",
    "https://cdn-icons-png.flaticon.com/512/189/189004.png",
    "https://cdn-icons-png.flaticon.com/512/528/528101.png",
    "https://cdn-icons-png.flaticon.com/512/189/189003.png",
    "https://cdn-icons-png.flaticon.com/512/188/188998.png",
    "https://cdn-icons-png.flaticon.com/512/1752/1752867.png",
    "https://cdn-icons-png.flaticon.com/512/189/189006.png",
    "https://cdn-icons-png.flaticon.com/512/1752/1752816.png"
  ];

  const randomIndex = Math.floor(Math.random() * IconUrls.length);
  return IconUrls[randomIndex];
}

const randomIcon = getRandomIcons();

function App() {

  const [user] = useAuthState(auth);


  return (
    <div className="App">
      <header>
        <h1>pointers chat 💻👩🏻‍💻🧑🏻‍💻</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  
  const signInAnonymously = () => {
    auth.signInAnonymously();
  }
  
  /*
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithRedirect(provider);
    auth.catch((error) => alert(error.message));
  }
  */


  /*
  const signInWithEmailPassword = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithEmailAndPassword();
  }
  */

  return (
    <>
      <button className="sign-in" onClick={signInAnonymously}>sign in anonymously</button>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>sign out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(1000);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();
    

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL: randomIcon,
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something..." />

      <button type="submit" disabled={!formValue}>send</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;