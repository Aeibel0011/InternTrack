const Student = require('../models/student');
const Mentor = require('../models/mentor');

// Load current user into res.locals if session is present
async function loadUser(req, res, next) {
  try {
    if (req.session && req.session.studentId) {
      const student = await Student.findById(req.session.studentId).lean();
      if (student) {
        res.locals.currentStudent = {
          name: `${student.firstName} ${student.lastName}`,
          email: student.studentEmail,
        };
        req.student = student;
      } else {
        // destroy invalid session
        req.session.destroy(() => {});
      }
    } else if (req.session && req.session.mentorId) {
      const mentor = await Mentor.findById(req.session.mentorId).lean();
      if (mentor) {
        res.locals.currentMentor = {
          name: mentor.fullName,
          email: mentor.email,
        };
        req.mentor = mentor;
      } else {
        // destroy invalid session
        req.session.destroy(() => {});
      }
    }
    next();
  } catch (err) {
    next(err);
  }
}

// Protect routes that require authentication
function isAuthenticated(req, res, next) {
  if (req.session && (req.session.studentId || req.session.mentorId)) {
    return next();
  }
  return res.redirect('/student/login');
}

module.exports = { loadUser, isAuthenticated };