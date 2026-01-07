import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./components/Layout/mainLayout/MainLayout";
import { appRoutes } from "./routes/appRoutes";
import { Spinner } from "./components/common/Buttons";
import TierManagement from "./pages/courseManagement/tier/TierManagement";
import { ContentManagement } from "./pages/courseManagement/content/ContentManagement";

// 🔹 Lazy-loaded pages
const SignInPage = lazy(() => import("./pages/auth/Auth"));
const AdminDashboard = lazy(() => import("./pages/home/HomePage"));
const CourseManagement = lazy(
  () => import("./pages/courseManagement/course/CourseManagement")
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
          <Route path={appRoutes.dashboard} element={<AdminDashboard />} />

          {/* Course Management */}
          <Route path={appRoutes.course.path} element={<CourseManagement />} />

          <Route
            path={appRoutes.course.children.courseTiers}
            element={<TierManagement />}
          />
          <Route
            path={appRoutes.course.children.courseContent}
            element={<ContentManagement />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
