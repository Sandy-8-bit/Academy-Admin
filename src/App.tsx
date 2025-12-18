import { Routes, Route } from 'react-router-dom'
import './App.css'
import { appRoutes } from './routes/appRoutes'

import MainLayout from './components/Layout/Mainlayout/MainLayout'

// Pages
import Home from './Pages/Home/HomePage'
import CourseUpload from './Pages/Course/CourseUpload'
import { SignInPage } from './Pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/* 🔹 Public routes */}
      <Route path={appRoutes.signInPage} element={<SignInPage />} />

      {/* 🔹 Main authenticated layout */}
      <Route element={<MainLayout />}>
        <Route path={appRoutes.home} element={<Home />} />
        <Route path={appRoutes.courses.path} element={<CourseUpload />} />
      </Route>
    </Routes>
  )
}

export default App
