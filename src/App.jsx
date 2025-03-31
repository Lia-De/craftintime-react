import './App.css'
import { BrowserRouter, Routes, Route, HashRouter } from 'react-router'
import { Layout } from './components/Layout.jsx'
import { Home } from './pages/Home.jsx'
import { Project } from './pages/Project.jsx'
import { Tag } from './pages/Tag.jsx'
import { HashRouter as Router } from "react-router-dom";

function App() {
  
  return (
    // <BrowserRouter  basename="/craftintime-react">
    <HashRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="/tags" element={<Tag />} />
      </Route>
    </Routes>
    </HashRouter>
    // </BrowserRouter>
    
    
  )
}

export default App
