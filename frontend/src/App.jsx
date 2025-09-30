import { LandingPage } from './components/LandingPage';
import { AccountPage } from './components/AccountPage';
import { GeneratePage } from './components/GeneratePage';
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
          <Route path="/account/:userId?" element={ <AccountPage /> } />
          <Route path="/form/:method" element={ <Form /> } />
          <Route path="/generate" element={ <GeneratePage /> } />
          <Route path="/*" element={ <PageNotFound /> } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
