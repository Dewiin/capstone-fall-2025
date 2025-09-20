import { useState } from 'react'
import { LandingPage } from './components/LandingPage';
import { Account } from './components/Account';
import { PageNotFound } from './components/PageNotFound';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/account/:userId?" element={ <Account /> } />
        <Route path="/*" element={ <PageNotFound /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
