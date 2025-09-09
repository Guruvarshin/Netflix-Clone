import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import { Routes, Route } from 'react-router'
import Moviepage from './pages/Moviepage'
import SignIn from './pages/Signin'
import SignUp from './pages/SignUp'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import AIRecommendations from './pages/AIRecommendations'

import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import People from './pages/People'
import TopRated from './pages/TopRated'
import NewandPopular from './pages/NewandPopular'
import Trending from './pages/Trending'

import ScrollToTop from './components/ScrollToTop'  // ⬅️ add this

const App = () => {
  const {fetchUser, fetchingUser}=useAuthStore();

  useEffect(()=>{
    fetchUser();
  },[fetchUser]);

  if(fetchingUser){
    return <p>Loading...</p>
  }
  return (
    <div>
      <Toaster/>
      {/* Scroll to top on every navigation */}
      <ScrollToTop behavior="smooth" />
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />

        {/* Unified detail page for movie/tv/person */}
        <Route path='/:type/:id' element={<Moviepage/>} />
        {/* Legacy movie route – still supported */}
        <Route path='/movie/:id' element={<Moviepage/>} />

        <Route path='/movies' element={<Movies />} />
        <Route path='/tv' element={<TVShows />} />
        <Route path='/people' element={<People />} />
        <Route path='/top-rated' element={<TopRated />} />
        <Route path='/new-and-popular' element={<NewandPopular />} />
        <Route path='/trending' element={<Trending />} />

        <Route path='/signin' element={<SignIn/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/ai-recommendations' element={<AIRecommendations/>}/>
      </Routes>
    </div>
  )
}

export default App
