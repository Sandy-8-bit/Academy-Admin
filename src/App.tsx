import { Routes, Route } from 'react-router-dom'
import './App.css'
import { appRoutes } from './routes/appRoutes'

import MainLayout from './components/Layout/Mainlayout/MainLayout'
import ProtectedRoute from './components/Layout/Mainlayout/ProtectedRoute'

// Pages
import Home from './Pages/Home/HomePage'
import CourseUpload from './Pages/Course/CourseUpload'
import { SignInPage } from './Pages/Auth/Auth'
import Test from './Pages/Test'

function App() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path={appRoutes.signInPage} element={<SignInPage />} />

      {/* 🔒 Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={appRoutes.dashboard} element={<Home />} />
          <Route path={appRoutes.courses.path} element={<CourseUpload />} />
          <Route path="/test" element={<Test/>}/>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
