import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlay, FaQuestionCircle } from "react-icons/fa";
import EnhancedVideoPlayer from "./EnhancedVideoPlayer";
import "../styles/CourseView.css";

const Assignments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lectures");
  const [activeVideo, setActiveVideo] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [courseResponse, quizzesResponse, userResponse] =
          await Promise.all([
            axios.get(`/api/courses/${courseId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`/api/courses/${courseId}/quizzes`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setCourse(courseResponse.data);
        setQuizzes(quizzesResponse.data);
        setUser(userResponse.data);

        if (courseResponse.data.lectures?.length > 0) {
          setActiveVideo(courseResponse.data.lectures[0]);
        }
      } catch (error) {
        console.log(error);
        navigate("/courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading course content...</p>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="course-view">
      {/* 🔹 Message at the very top */}
      <div className="course-message">
        <p
          style={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "20px",
            marginTop: "20px",
            backgroundColor: "#f0f0f0",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          🚀 YOU CAN TAKE QUIZZES, WATCH LECTURES, AND ENHANCE YOUR LEARNING
          HERE! 🎓
        </p>
      </div>

      <div className="course-header">
        <h1>{course.title}</h1>
        <p className="instructor">by {course.instructorName}</p>
      </div>

      <div className="course-tabs">
        <button
          className={`tab ${activeTab === "lectures" ? "active" : ""}`}
          onClick={() => setActiveTab("lectures")}
        >
          Lectures
        </button>
        <button
          className={`tab ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          Assignments
        </button>
      </div>

      <div className="course-content">
        {activeTab === "lectures" ? (
          <>
            <div className="video-section">
              {activeVideo && (
                <EnhancedVideoPlayer
                  videoUrl={activeVideo.videoUrl}
                  title={activeVideo.title}
                />
              )}
            </div>

            <div className="lectures-list">
              <h2>Course Lectures</h2>
              {course.lectures?.map((lecture, index) => (
                <div
                  key={lecture._id}
                  className={`lecture-item ${
                    activeVideo?._id === lecture._id ? "active" : ""
                  }`}
                  onClick={() => setActiveVideo(lecture)}
                >
                  <FaPlay
                    className="play-icon"
                    style={{ fontSize: "1.5rem" }}
                  />
                  <span className="lecture-number">{index + 1}</span>
                  <span className="lecture-title">{lecture.title}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="assignments-section">
            <div className="assignments-header">
              <h2>Course Assignments</h2>
              {user?.role === "instructor" && (
                <button
                  onClick={() => navigate(`/course/${courseId}/quiz/create`)}
                  className="create-quiz-btn"
                >
                  Create Quiz
                </button>
              )}
            </div>

            {quizzes.length > 0 ? (
              <div className="quizzes-grid">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="quiz-card">
                    <div className="quiz-info">
                      <FaQuestionCircle className="quiz-icon" />
                      <h3>{quiz.title}</h3>
                      <p>Time Limit: {quiz.timeLimit} minutes</p>
                      <p>Questions: {quiz.questions?.length || 0}</p>
                      <p>Passing Score: {quiz.passingScore}%</p>
                    </div>
                    <button
                      className="take-quiz-btn"
                      onClick={() =>
                        navigate(`/course/${courseId}/quiz/${quiz._id}`)
                      }
                    >
                      Take Quiz
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-quizzes">
                <p>No assignments available for this course yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
