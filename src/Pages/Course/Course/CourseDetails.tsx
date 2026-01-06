import { useFetchCourseById } from "@/queries/courseQuery";
import { useParams } from "react-router-dom";
const CourseContentsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const { data, isLoading, isError } = useFetchCourseById(courseId!);

  if (isLoading) {
    return (
      <div style={{ padding: 20 }}>
        <p>Loading course contents...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <p>Failed to load course contents</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginBottom: 24 }}>Course Contents</h1>

      {Object.entries(data.contents).map(([tierName, weeks]) => (
        <div key={tierName} style={{ marginBottom: 32 }}>
          {/* Tier */}
          <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: 6 }}>
            {tierName}
          </h2>

          {Object.entries(weeks).map(([week, days]) => (
            <div key={week} style={{ marginLeft: 12, marginTop: 16 }}>
              {/* Week */}
              <h3 style={{ color: "#444" }}>{week}</h3>

              {Object.entries(days).map(([day, items]) => (
                <div key={day} style={{ marginLeft: 16, marginTop: 12 }}>
                  {/* Day */}
                  <h4 style={{ color: "#777" }}>{day}</h4>

                  <ul style={{ marginLeft: 16 }}>
                    {items.map((item) => (
                      <li
                        key={item.id}
                        style={{
                          padding: 10,
                          marginBottom: 8,
                          border: "1px solid #e5e5e5",
                          borderRadius: 6,
                        }}
                      >
                        {item.module_type === "video" ? (
                          <>
                            <strong>🎥 Video:</strong> {item.title}
                            <p style={{ margin: "4px 0" }}>
                              {item.description}
                            </p>
                            <small>
                              Duration: {item.duration}s | Position:{" "}
                              {item.position}
                            </small>
                          </>
                        ) : (
                          <>
                            <strong>📝 Test:</strong> {item.title}
                            <p style={{ margin: "4px 0" }}>
                              Duration: {item.test_duration} mins
                            </p>
                            <small>
                              Questions: {item.quizzes.length} | Position:{" "}
                              {item.position}
                            </small>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CourseContentsPage;
