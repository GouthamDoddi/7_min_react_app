import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    // firebase db config
    apiKey: "AIzaSyAkVbENRCYa_jqnyFgibHTSBLadPwKnmXo",
    authDomain: "superchat-66a2b.firebaseapp.com",
    databaseURL: "https://superchat-66a2b.firebaseio.com",
    projectId: "superchat-66a2b",
    storageBucket: "superchat-66a2b.appspot.com",
    messagingSenderId: "577557713943",
    appId: "1:577557713943:web:7a1fb173d896b95a103852",
    measurementId: "G-JQ96Z2E1F5"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
        <header>

        </header>
        <section>
            {user ? <ChatRom /> : <SignIn />}
        </section>
    </div>
  );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
            <p>Do not violate the community guidlines or you will be banned for life!</p>
        </>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function ChatRom() {

    const dummy = useRef()

    const messagesRef = firestore.collection('messages');
    const qurey = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(qurey, {idField: 'id'});

    const [ formValue, setFormValue ] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add(
            {
                text: formValue,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                uid,
                photoURL
            }
        )

        setFormValue('');

        dummy.current.scrollIntoView({ behaviour: 'smooth' });
    }

    return (
        <>
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

                <span ref={dummy}></span>

            </main>

            <form onSubmit={sendMessage}>

                <input value={formValue} onChange={ (e) => setFormValue(e.target.value) } placeholder='say something nice' />

                <button type='submit'disabled={!formValue}>🕊️</button>

            </form>
        </>
    )
}

function ChatMessage(props) {
    const {text, uid, photoURL} = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <>
            <div className={`message ${messageClass}`}>
                <img src={photoURL} />
                <p>{text}</p>
            </div>
        </>
    )
}

export default App;
