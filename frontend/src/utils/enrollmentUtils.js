// frontend/src/utils/enrollmentUtils.js
export const savePendingEnrollment = (courseId) => {
  localStorage.setItem('pendingEnrollment', courseId);
};

export const getPendingEnrollment = () => {
  return localStorage.getItem('pendingEnrollment');
};

export const clearPendingEnrollment = () => {
  localStorage.removeItem('pendingEnrollment');
};