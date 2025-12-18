import { Routes, Route } from "react-router-dom";
import "./App.css";
import { appRoutes } from "./routes/appRoutes";

import MainLayout from "./components/Layout/Mainlayout/MainLayout";
import ProtectedRoute from "./components/Layout/Mainlayout/ProtectedRoute";

// Pages
import AdminDashboard from "./Pages/Home/HomePage";
import { Management } from "./Pages/Course/Managment";
import CourseUpload from "./Pages/Course/CourseUpload";
import ModuleCreate from "./Pages/Course/ModuleCreate";
import ContentCreate from "./Pages/Course/ContentCreate";
import { SignInPage } from "./Pages/Auth/Auth";
import Test from "./Pages/Test";

function App() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path={appRoutes.signInPage} element={<SignInPage />} />

  
        <Route element={<MainLayout />}>

          {/* Dashboard */}
          <Route
            path={appRoutes.dashboard}
            element={<AdminDashboard />}
          />

          {/* Management */}
          <Route
            path={appRoutes.management.path}
            element={<Management />}
          />

          {/* Management → Create Pages */}
          <Route
            path={appRoutes.management.children.courseCreate}
            element={<CourseUpload />}
          />
          <Route
            path={appRoutes.management.children.moduleCreate}
            element={<ModuleCreate />}
          />
          <Route
            path={appRoutes.management.children.contentCreate}
            element={<ContentCreate />}
          />

          {/* Test */}
          <Route path="/test" element={<Test />} />

        </Route>

    </Routes>
  );
}

export default App;
