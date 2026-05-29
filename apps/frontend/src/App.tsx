import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path='/chat' element={<ChatPage />}/>
        <Route path='/dashboard' element={<DashboardPage />}/>
      </Routes>
    </BrowserRouter>
  )
}
