// pages/Courses/WatchCourse.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function WatchCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/client/courses/${courseId}/content`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCourse(data);
    };
    fetchCourse();
  }, [courseId]);

  if (!course) return <div>Chargement...</div>;

  return (
    <div className="watch-course container">
      <div className="video-section">
        <video src={course.chapters[currentChapter].videoUrl} controls width="100%" />
        <h3>{course.chapters[currentChapter].title}</h3>
      </div>
      <div className="chapters-list">
        {course.chapters.map((ch, idx) => (
          <button key={idx} onClick={() => setCurrentChapter(idx)} className={idx === currentChapter ? 'active' : ''}>
            {ch.title}
          </button>
        ))}
      </div>
      {/* Quiz simple à implémenter ici */}
    </div>
  );
}