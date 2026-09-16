import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import Internships from './features/internships/pages/Internships';
import InternshipDetails from './features/internships/pages/InternshipDetails';
import ApplyInternship from './features/applications/pages/ApplyInternship';
import Applications from './features/applications/pages/Applications';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/internships' element={<Internships />} />
        <Route path='/internships/:id' element={<InternshipDetails />} />
        <Route path="/internships/:id/apply" element={<ApplyInternship />}/>
        <Route path='applications' element={<Applications/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
