import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/Layout/Mainlayout/MainLayout";
import { appRoutes } from "./routes/appRoutes";
import { Spinner } from "./components/Common/Buttons";
<<<<<<< HEAD
import TierManagement from "./Pages/Course/Tier/TierManagement";
=======
import CourseContentsPage from "./Pages/Course/Course/CourseDetails";
>>>>>>> cd097b2b9d9b01b9f558c5b54a22fde399d807f1

// 🔹 Lazy-loaded pages
const SignInPage = lazy(() => import("./Pages/Auth/Auth"));
const AdminDashboard = lazy(() => import("./Pages/Home/HomePage"));
const CourseManagement = lazy(
  () => import("./Pages/Course/Course/CourseManagement")
);

<<<<<<< HEAD

=======
>>>>>>> cd097b2b9d9b01b9f558c5b54a22fde399d807f1
function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path={appRoutes.signInPage} element={<SignInPage />} />

        {/* 🔐 Protected / Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route path={appRoutes.dashboard} element={<AdminDashboard />} />

          {/* Course Management */}
          <Route path={appRoutes.course.path} element={<CourseManagement />} />
          <Route
            path={appRoutes.course.children.courseDetails}
            element={<CourseContentsPage />}
          />

          <Route 
            path={appRoutes.course.children.courseTiers}
            element={<TierManagement />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
