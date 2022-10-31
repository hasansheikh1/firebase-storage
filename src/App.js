import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { initializeApp } from "firebase/app";
import {  getFirestore, collection,addDoc, getDocs,
   query,doc,onSnapshot, serverTimestamp,orderBy}
  from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdX9BkXBW8TcWkcPgDH00RBoaunevOI6U",
  authDomain: "fir-crud-react-8108d.firebaseapp.com",
  projectId: "fir-crud-react-8108d",
  storageBucket: "fir-crud-react-8108d.appspot.com",
  messagingSenderId: "141604460143",
  appId: "1:141604460143:web:4363ab9504e43cea519f9a",
  measurementId: "G-XNZTEMQ823",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

function App() {
  // const [data, setData] = useState([]);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //getting data without using realtime function start 
    //     const getData=async()=>{
    //     const querySnapshot = await getDocs(collection(db, "posts"));
    //     querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} =>`, doc.data());

    //      setPosts((prev)=>{

    //       let newArr=[...prev,doc.data()];
    //       return newArr;
    //      })

    // });
    // }
    //   getData();
 //getting data without using realtime function end
 
 let unsubscribe=null;
    const getRealtimeData = async () => {

      const q = query(collection(db, "posts"),orderBy("createdOn","desc"));
       unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());


        });
        setPosts(posts);

        console.log("Posts: ", posts);
      });

      return ()=>{
        unsubscribe();
      }
    }

    getRealtimeData();

  }, []);

  const savePost = async (e) => {
    // axios.get("");
    e.preventDefault();
    console.log("Post text", postText);
    
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        text: postText,
        createdOn: serverTimestamp(),
      });
      setPostText("");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  
  };


  return (
    <div className="App">
      <form onSubmit={savePost}>
        {/* <input
          type="text"
          id="cityName"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          placeholder="Enter City.."
        /> */}

        <div className="wrap">
          <div className="search">
            <input
              id="cityName"
              value={postText}
              onChange={(e) => {
                setPostText(e.target.value);
              }}
              type="text"
              className="searchTerm"
              placeholder="What's in your mind..?"
            />
            <button type="submit" className="searchButton">
              Post
            </button>
          </div>
        </div>

        <div className="allPosts">

        {posts.map((eachPost, i) => (
          <div className="post" key={i}>
            <h1>{eachPost?.text}</h1>

            <span>  
              {moment( 
                (eachPost?.createdOn?.seconds)?eachPost?.createdOn?.seconds*1000
              :undefined).format("MMMM Do YYYY, h:mm a")}
            </span>

            <button className="btn-read">
              <a className="btn-read1" target="_blank" href={eachPost.url}>
                Read More
              </a>
            </button>
          </div>
        ))}

        </div>
      </form>
    </div>
  );
}

export default App;
