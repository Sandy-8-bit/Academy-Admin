import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/Mainlayout/MainLayout";

// Pages
import AdminDashboard from "./Pages/Home/HomePage";
import { CourseManagement } from "./Pages/Course/CourseManagement";
import { SignInPage } from "./Pages/Auth/Auth";
import { appRoutes } from "./routes/appRoutes";

function App() {
  return (
    <Routes>
      {/* 🔓 Public Routes */}
      <Route path={appRoutes.signInPage} element={<SignInPage />} />

      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path={appRoutes.dashboard} element={<AdminDashboard />} />

        {/* Management */}
        <Route path={appRoutes.course.path} element={<CourseManagement />} />

        {/* Management → Create Pages */}
        {/* <Route
          path={appRoutes.management.children.courseCreate}
          element={<CourseUpload />}
        /> */}
      </Route>
    </Routes>
  );
}

export default App;
