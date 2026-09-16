import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/common/Hero'
import RecommendationList from '../features/recommendations/components/RecommendationList'
import InternshipList from '../features/internships/components/InternshipList'
const Home = () => {
  return (
    <div className='min-h-screen bg-slate-500'>
      <Navbar/>
      <main>
        <Hero/>
        <InternshipList />
        <RecommendationList />
      </main>
    </div>
  )
}

export default Home
