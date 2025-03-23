import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout.jsx'
import { Home } from './pages/Home.jsx'
import { Project } from './pages/Project.jsx'
import { Tag } from './pages/Tag.jsx'

function App() {
  

  return (
    
    <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/project" element={<Project />} />
        <Route path="/tags" element={<Tag />} />
      </Route>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
