import React from 'react'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './features/auth/pages/Login';
import Signup from './features/auth/pages/Signup';
import Internships from './features/internships/pages/Internships';
import InternshipDetails from './features/internships/pages/InternshipDetails';
import ApplyInternship from './features/applications/pages/ApplyInternship';
import Applications from './features/applications/pages/Applications';
import MyInternships from './features/applications/pages/MyInternships';
import CompanyDashboard from './features/company/pages/CompanyDashboard';
import ManageInternship from './features/applications/pages/ManageInternship';
import InternshipApplicants from './features/applications/pages/InternshipApplicants';
import ApplicantProfile from './features/applications/pages/ApplicantProfile';
import EditInternship from './features/internships/pages/EditInternship';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/internships' element={<Internships />} />
        <Route path='/internships/:id' element={<InternshipDetails />} />
        <Route path="/internships/:id/apply" element={<ApplyInternship />} />
        <Route path='applications' element={<Applications />} />
        <Route
          path="/company/dashboard"
          element={<CompanyDashboard />}
        />
        <Route
          path="/company/my-internships"
          element={<MyInternships />}
        />
        <Route
          path="/company/internships/:id"
          element={<ManageInternship />}
        />
        <Route
          path="/company/internships/:id/applicants"
          element={<InternshipApplicants />}
        />
        <Route
          path="/company/applications/:applicationId"
          element={<ApplicantProfile />}
        />
        <Route
          path="/company/internships/:id/edit"
          element={<EditInternship />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
