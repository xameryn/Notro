import './App.css'
import LeftSidebar from './components/LeftSidebar/LeftSidebar'
import Files from './components/Files/Files'
import Upload from './components/Upload/Upload'

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
