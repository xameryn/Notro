import React from 'react'
import LeftSidebar from '../components/LeftSidebar/LeftSidebar'
import Files from '../components/FilesComponent/Files'
import Upload from '../components/Upload/Upload'
import '../App.css'
import '../Index.css'

function App() {

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