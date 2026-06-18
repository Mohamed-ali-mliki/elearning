const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { COMMISSION_RATE } = require('../config/constants');

exports.getAdminFinancialStats = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' });
    let totalSales = 0;
    for (const course of courses) {
      const count = await Enrollment.countDocuments({ courseId: course._id });
      totalSales += count * course.price;
    }
    const adminRevenue = totalSales * COMMISSION_RATE;
    const formateurTotal = totalSales * (1 - COMMISSION_RATE);
    res.json({
      totalSales,
      adminRevenue,
      formateurTotal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFormateurFinancialStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const courses = await Course.find({ userId, status: 'approved' });
    let totalSales = 0;
    for (const course of courses) {
      const count = await Enrollment.countDocuments({ courseId: course._id });
      totalSales += count * course.price;
    }
    const gross = totalSales;
    const commission = totalSales * COMMISSION_RATE;
    const net = totalSales * (1 - COMMISSION_RATE);
    res.json({ gross, commission, net });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};