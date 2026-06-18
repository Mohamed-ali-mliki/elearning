const mongoose = require('mongoose');
require('dotenv').config();
const Course = require('./models/Course');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  const courses = await Course.find({});
  for (let course of courses) {
    let modified = false;
    for (let section of course.sections) {
      if (section.type && section.contentUrl) {
        if (section.type === 'video') {
          section.videoUrl = section.contentUrl;
        } else if (section.type === 'pdf') {
          section.pdfUrl = section.contentUrl;
        }
        // Supprimer les anciens champs
        section.type = undefined;
        section.contentUrl = undefined;
        modified = true;
      }
    }
    if (modified) {
      await course.save();
      console.log(`Migré cours ${course._id}`);
    }
  }
  console.log('Migration terminée');
  mongoose.disconnect();
}
migrate();