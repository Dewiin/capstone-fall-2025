import { LandingPage } from './components/LandingPage';
import { Account } from './components/Account';
import { PageNotFound } from './components/PageNotFound';
import { Form } from '@/components/form/Form';
import { Navbar01 } from './components/ui/shadcn-io/navbar-01';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from './components/contexts/Contexts';
import './App.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative w-full">
          <Navbar01 />
        </div>
        <Routes>
          <Route path="/" element={ <LandingPage /> } />
          <Route path="/account/:userId?" element={ <Account /> } />
          <Route path="/form/:method" element={ <Form /> } />
          <Route path="/*" element={ <PageNotFound /> } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
