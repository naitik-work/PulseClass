const mongoose = require('mongoose');
const env = require('./config/env');
const User = require('./models/User');
const Institute = require('./models/Institute');
const Classroom = require('./models/Classroom');
const Session = require('./models/Session');
const Poll = require('./models/Poll');
const Response = require('./models/Response');

async function seed() {
  console.log('Connecting to MongoDB at:', env.MONGODB_URI);
  await mongoose.connect(env.MONGODB_URI);

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Institute.deleteMany({}),
    Classroom.deleteMany({}),
    Session.deleteMany({}),
    Poll.deleteMany({}),
    Response.deleteMany({}),
  ]);

  console.log('Creating demo users...');
  // Password is saved via pre-save hook which hashes passwordHash
  const instructor = await User.create({
    name: 'Prof. Vikram Sharma',
    email: 'instructor@pulseclass.dev',
    passwordHash: 'Password123!',
    role: 'instructor',
    institutes: [],
  });

  const student1 = await User.create({
    name: 'Aarav Patel',
    email: 'student1@pulseclass.dev',
    passwordHash: 'Password123!',
    role: 'student',
    institutes: [],
  });

  const student2 = await User.create({
    name: 'Priya Nair',
    email: 'student2@pulseclass.dev',
    passwordHash: 'Password123!',
    role: 'student',
    institutes: [],
  });

  console.log('Creating demo institute...');
  const institute = await Institute.create({
    name: 'Apex Institute of Technology',
    code: 'APEX2026',
    owner: instructor._id,
    members: [instructor._id, student1._id, student2._id],
  });

  instructor.institutes.push(institute._id);
  student1.institutes.push(institute._id);
  student2.institutes.push(institute._id);
  await Promise.all([instructor.save(), student1.save(), student2.save()]);

  console.log('Creating demo classroom...');
  const classroom = await Classroom.create({
    name: 'CS101: Distributed Systems & Cloud',
    institute: institute._id,
    instructor: instructor._id,
    students: [student1._id, student2._id],
    activeSession: null,
  });

  console.log('Creating past completed session with sample pulses...');
  const oneHourAgo = new Date(Date.now() - 3600 * 1000);
  const twentyMinsAgo = new Date(Date.now() - 1200 * 1000);

  const pastSession = await Session.create({
    classroom: classroom._id,
    instructor: instructor._id,
    participants: [instructor._id, student1._id, student2._id],
    isActive: false,
    startedAt: oneHourAgo,
    endedAt: twentyMinsAgo,
  });

  // Sample Poll 1: Understanding check
  const poll1 = await Poll.create({
    session: pastSession._id,
    question: 'Should I move ahead to Raft consensus?',
    category: 'understanding',
    responseType: 'yesno',
    options: ['Yes', 'No'],
    timer: 10,
    isAnonymous: true,
    isActive: false,
    launchedAt: new Date(oneHourAgo.getTime() + 10 * 60 * 1000),
    closedAt: new Date(oneHourAgo.getTime() + 10 * 60 * 1000 + 10 * 1000),
  });

  await Response.create([
    { poll: poll1._id, student: student1._id, answer: 'Yes' },
    { poll: poll1._id, student: student2._id, answer: 'Yes' },
  ]);

  // Sample Poll 2: Pace check
  const poll2 = await Poll.create({
    session: pastSession._id,
    question: 'Am I going too fast through the log replication section?',
    category: 'pace',
    responseType: 'yesno',
    options: ['Yes', 'No'],
    timer: 10,
    isAnonymous: true,
    isActive: false,
    launchedAt: new Date(oneHourAgo.getTime() + 25 * 60 * 1000),
    closedAt: new Date(oneHourAgo.getTime() + 25 * 60 * 1000 + 10 * 1000),
  });

  await Response.create([
    { poll: poll2._id, student: student1._id, answer: 'No' },
    { poll: poll2._id, student: student2._id, answer: 'Yes' },
  ]);

  // Sample Poll 3: Feedback rating
  const poll3 = await Poll.create({
    session: pastSession._id,
    question: 'How would you rate this session so far?',
    category: 'feedback',
    responseType: 'rating',
    options: ['1', '2', '3', '4', '5'],
    timer: 15,
    isAnonymous: true,
    isActive: false,
    launchedAt: new Date(oneHourAgo.getTime() + 35 * 60 * 1000),
    closedAt: new Date(oneHourAgo.getTime() + 35 * 60 * 1000 + 15 * 1000),
  });

  await Response.create([
    { poll: poll3._id, student: student1._id, answer: '5' },
    { poll: poll3._id, student: student2._id, answer: '4' },
  ]);

  console.log(`
══════════════════════════════════════════════════════════════
  ✅ PulseClass Seed Data Successfully Inserted!
══════════════════════════════════════════════════════════════
  Instructor:
    Email:    instructor@pulseclass.dev
    Password: Password123!

  Students:
    Student 1: student1@pulseclass.dev / Password123!
    Student 2: student2@pulseclass.dev / Password123!

  Institute:
    Name: Apex Institute of Technology
    Code: APEX2026

  Classroom:
    Name: CS101: Distributed Systems & Cloud
══════════════════════════════════════════════════════════════
  `);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
