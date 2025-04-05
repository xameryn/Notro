import React, { useEffect } from 'react'
import LeftSidebar from '../components/LeftSidebar/LeftSidebar'
import Files from '../components/FilesComponent/Files'
import Upload from '../components/Upload/Upload'
import '../App.css'
import '../Index.css'

function App() {

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:4000/auth/me', {
          credentials: 'include',
        });
  
        if (!res.ok) throw new Error("Not logged in");
  
        const user = await res.json();
        console.log("Logged-in user:", user);
      } catch (err) {
        console.log("User not logged in:", err.message);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <>
    <div id="main">
      <LeftSidebar />
      <Files />
      <Upload />
    </div>
    </>
  )
}

export default App