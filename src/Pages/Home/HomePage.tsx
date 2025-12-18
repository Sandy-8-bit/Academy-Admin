
import {
  BookOpen,
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  Video,
  ChevronRight,
  Clock,
  Eye,
} from "lucide-react";

/* =======================
   DASHBOARD DATA
======================= */

const stats = [
  {
    title: "Courses Uploaded",
    value: "24",
    change: "Content ready",
    icon: BookOpen,
    color: "blue",
  },
  {
    title: "Total Modules",
    value: "186",
    change: "Across all courses",
    icon: FileText,
    color: "green",
  },
  {
    title: "Video Lessons",
    value: "412",
    change: "Videos uploaded",
    icon: Video,
    color: "purple",
  },
  {
    title: "Last Upload",
    value: "2 hrs ago",
    change: "Recently updated",
    icon: Clock,
    color: "orange",
  },
];

const mainActions = [
  {
    name: "Upload New Course",
    icon: BookOpen,
    description: "Create a course and start adding content",
  },
  {
    name: "Upload Course Videos",
    icon: Video,
    description: "Add or replace video lessons",
  },
  {
    name: "Upload Study Materials",
    icon: FileText,
    description: "PDFs, assignments, and resources",
  },
  {
    name: "Manage Course Structure",
    icon: Calendar,
    description: "Organize modules and lessons",
  },
  {
    name: "Preview Course",
    icon: Eye,
    description: "View the course before publishing",
  },
  {
    name: "Course Analytics",
    icon: BarChart3,
    description: "Track course engagement",
  },
];

const recentActivities = [
  {
    icon: Video,
    text: '12 videos uploaded to "React Mastery"',
    time: "10 mins ago",
    type: "success",
  },
  {
    icon: FileText,
    text: 'New PDFs added to "UI/UX Design"',
    time: "45 mins ago",
    type: "success",
  },
  {
    icon: BookOpen,
    text: 'Course "Node.js Essentials" created',
    time: "Today",
    type: "info",
  },
];

const pendingTasks = [
  { task: "Add videos to 3 courses", count: 3, priority: "high" },
  { task: "Upload materials for 2 modules", count: 2, priority: "medium" },
  { task: "Complete course descriptions", count: 4, priority: "low" },
  { task: "Preview courses before publish", count: 1, priority: "low" },
];

const topCourses = [
  {
    name: "React Mastery",
    students: "Content Ready",
    rating: "Complete",
    revenue: "24 Videos",
  },
  {
    name: "Python for Beginners",
    students: "In Progress",
    rating: "Modules Added",
    revenue: "18 Videos",
  },
  {
    name: "UI/UX Design",
    students: "Draft",
    rating: "Structure Ready",
    revenue: "9 Videos",
  },
];

/* =======================
   COMPONENT
======================= */

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-2 py-2">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "purple"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                  }`}
                >
                  <stat.icon
                    className={`w-6 h-6 ${
                      stat.color === "blue"
                        ? "text-blue-900"
                        : stat.color === "green"
                        ? "text-green-700"
                        : stat.color === "purple"
                        ? "text-purple-700"
                        : "text-orange-700"
                    }`}
                  />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT ================= */}
          <div className="lg:col-span-2">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Course Upload Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mainActions.map((action, index) => (
                  <button
                    key={index}
                    className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-blue-900 hover:bg-blue-50 transition-all text-left group"
                  >
                    <action.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-900 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-1">
                        {action.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {action.description}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-900" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Upload Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="p-2 rounded-lg bg-blue-100">
                      <activity.icon className="w-4 h-4 text-blue-900" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="space-y-6">
            {/* Upload Tasks */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Upload Checklist
              </h2>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-sm text-gray-900 font-medium">
                      {task.task}
                    </p>
                    <span className="text-xs bg-white border border-gray-200 px-2 py-1 rounded font-semibold">
                      {task.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Progress */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Course Progress
              </h2>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {course.name}
                      </h3>
                      <span className="text-sm font-bold text-blue-900">
                        {course.revenue}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 flex justify-between">
                      <span>{course.students}</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                System Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Upload Mode</span>
                  <span className="font-semibold text-green-600">
                    Enabled
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Storage Usage</span>
                  <span className="font-semibold text-gray-900">42%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Video Processing</span>
                  <span className="font-semibold text-blue-900">Normal</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Mode</span>
                  <span className="font-semibold text-green-600">
                    Course Upload
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
