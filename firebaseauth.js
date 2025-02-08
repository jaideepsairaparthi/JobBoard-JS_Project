// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"
import {getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNltdxcCt3bLGNkorsBr9_gsPu87mZxq0",
  authDomain: "jobboard-f89df.firebaseapp.com",
  projectId: "jobboard-f89df",
  storageBucket: "jobboard-f89df.firebasestorage.app",
  messagingSenderId: "314091125232",
  appId: "1:314091125232:web:10845396f3816ca0830535"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function showMessage(message,divId){
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000)
}

const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click",(event)=>{
    event.preventDefault();
    const email=document.getElementById("rEmail").value;
    const password=document.getElementById("rPassword").value;
    const firstName=document.getElementById("fName").value;
    const lastName=document.getElementById("lName").value;

    const auth=getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user = userCredential.user;
        const userData={
            email:email,
            firstName:firstName,
            lastName:lastName
        };
        showMessage("Account Created Successfully","signUpMessage");
        const docRef=doc(db,"users",user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href="index.html"
        })
        .catch((error)=>{
            console.error("error writing document",error);
        })
    })
    .catch((error)=>{
        const errorCode =error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage("Email Address Already Exists !!!","signUpMessage");
        }
        else{
            showMessage('unable to create User','signUpMessage');
        }
    })
});

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click',(event)=>{
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const auth = getAuth();
    
    if (!email || !password) {
        showMessage('Please fill in all fields', 'signInMessage');
        return;
    }

    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        showMessage('login is successful','signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId',user.uid);
        window.location.href="./JobHelperProject/index.html";
    })
    .catch((error)=>{
        const errorCode = error.code;
        if(errorCode=='auth/invalid-credential'){
            showMessage('incorrect Email or Password','signInMessage');
        }
        else{
            showMessage('Account does not Exist','signInMessage');
        }
    })
})

const guestLogin = document.getElementById("guestLogin");
guestLogin.addEventListener("click", () => {
    const auth = getAuth();
    signInAnonymously(auth)
        .then(() => {
            showMessage("Logged in as Guest", "signInMessage");
            window.location.href = "./JobHelperProject/index.html"; 
        })
        .catch((error) => {
            showMessage("Unable to login as Guest", "signInMessage");
            console.error(error.message);
        });
});
