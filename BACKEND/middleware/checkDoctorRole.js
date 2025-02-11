const checkDoctorRole = (req, res, next) => {
  if (req.user.role !== 'Doctor') {
      return res.status(403).json({ message: 'Access denied: Doctor role required' });
  }
  next();
};

module.exports = checkDoctorRole;