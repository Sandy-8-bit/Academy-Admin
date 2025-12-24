import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/Layout/Mainlayout/MainLayout";
import { appRoutes } from "./routes/appRoutes";
import { Spinner } from "./components/Common/Buttons";

// 🔹 Lazy-loaded pages
const SignInPage = lazy(() => import("./Pages/Auth/Auth"));
const AdminDashboard = lazy(() => import("./Pages/Home/HomePage"));
const CourseManagement = lazy(() =>
  import("./Pages/Course/Course/CourseManagement")
);



function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path={appRoutes.signInPage} element={<SignInPage />} />

        {/* 🔐 Protected / Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route
            path={appRoutes.dashboard}
            element={<AdminDashboard />}
          />

          {/* Course Management */}
          <Route
            path={appRoutes.course.path}
            element={<CourseManagement />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
