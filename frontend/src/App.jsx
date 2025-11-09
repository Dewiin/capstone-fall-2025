// Page
import { LandingPage } from './components/LandingPage';
import { AccountPage } from './components/AccountPage';
import { ProfilePage } from './components/ProfilePage';
import { GeneratePage } from './components/GeneratePage';
import { StudySetPage } from './components/StudySetPage';
import { ExplorePage } from './components/ExplorePage';
import { PageNotFound } from './components/PageNotFound';
import { UnauthorizedPage } from './components/UnauthorizedPage';
import { ForbiddenPage } from './components/ForbiddenPage';

// Components
import { Form } from '@/components/form/Form';
import { Navbar01 } from './components/ui/shadcn-io/navbar-01';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from './components/contexts/Contexts';
import './App.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar01 />
        <Routes>
          <Route path="/" element={ <LandingPage /> } />
          <Route path="/account" element={ <AccountPage /> } />
          <Route path="/profile/:userId?" element={ <ProfilePage /> } />
          <Route path="/study-set/:studySetId?" element={ <StudySetPage /> } />
          <Route path="/form/:method" element={ <Form /> } />
          <Route path="/generate" element={ <GeneratePage /> } />
          <Route path="/explore" element={ <ExplorePage /> } />
          <Route path="/unauthorized" element={ <UnauthorizedPage /> } />
          <Route path="/forbidden" element={ <ForbiddenPage /> } />
          <Route path="/*" element={ <PageNotFound /> } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
