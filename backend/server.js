import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User, OD, Achievement, Event } from './models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
if (process.env.MONGO_URI && process.env.MONGO_URI.includes('mongodb+srv://')) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('Connected to MongoDB Atlas');
      // Seed initial admin if no users exist
      const count = await User.countDocuments();
      if (count === 0) {
        console.log('Seeding initial admin and events...');
        await User.create([
          { name: 'System Admin', email: 'admin@test.com', password: 'password', role: 'admin' },
          { name: 'Faculty John', email: 'faculty@test.com', password: 'password', role: 'faculty' },
        ]);
        await Event.create([
          { title: 'Annual Tech Symposium', type: 'External', description: 'Join us for the national level tech symposium this coming Friday.', date: new Date('2026-11-20') },
          { title: 'Department Coding Contest', type: 'Internal', description: 'Internal coding competition. Top 3 go to external events.', date: new Date('2026-11-25') }
        ]);
      }
    }).catch(err => {
      console.error('MongoDB connection error:', err);
    });
} else {
  console.log('Please configure your valid MONGO_URI in the .env file to connect to Atlas');
}

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- Faculties Route for Registration ---
app.get('/api/faculties', async (req, res) => {
  try {
    const faculties = await User.find({ role: 'faculty' }).select('name _id');
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Registration Route (Students Only) ---
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber } = req.body;
    if (!name || !email || !password || !rollNumber) return res.status(400).json({ message: 'Name, email, password, and roll number are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already exists' });

    const newUser = await User.create({
      name,
      email,
      password,
      rollNumber,
      role: 'student'
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Login Route ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userData = user.toObject();
    delete userData.password;

    res.json({ token, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Student API Routes ---
app.get('/api/student/dashboard', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Access denied' });

    const studentOds = await OD.find({ studentId: req.user.id });
    const studentAchievements = await Achievement.find({ studentId: req.user.id });
    const events = await Event.find().limit(5).sort({ date: -1 });

    const pendingOds = studentOds.filter(od => od.status === 'Pending').length;
    const approvedOds = studentOds.filter(od => od.status === 'Approved').length;

    const recentActivity = [
      ...studentOds.map(od => ({ type: `OD: ${od.eventName}`, date: od.date, status: od.status, timestamp: new Date(od.date).getTime() })),
      ...studentAchievements.map(a => ({ type: `Achievement: ${a.eventName} (${a.rank})`, date: a.date, status: 'Published', timestamp: new Date(a.date).getTime() }))
    ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    res.json({
      stats: {
        pendingOds,
        approvedOds,
        achievementsCount: studentAchievements.length
      },
      recentEvents: events,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/student/ods', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Access denied' });
    const studentOds = await OD.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(studentOds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/student/ods', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Access denied' });

    const { eventName, startDate, startTime, endDate, endTime, description, venue, proofLink } = req.body;
    if (!eventName || !startDate || !startTime || !endDate || !endTime || !description || !venue || !proofLink) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findById(req.user.id);

    const newOd = await OD.create({
      studentId: req.user.id,
      mentorId: user.mentorId,
      studentName: user.name,
      studentRollNumber: user.rollNumber,
      eventName,
      startDate,
      startTime,
      endDate,
      endTime,
      description,
      venue,
      proofLink,
      status: 'Pending'
    });

    res.status(201).json(newOd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/student/achievements', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Access denied' });
    const studentAchievements = await Achievement.find({ studentId: req.user.id }).sort({ date: -1 });
    res.json(studentAchievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/student/achievements', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Access denied' });

    const { eventName, rank, date, description } = req.body;
    if (!eventName || !rank || !date || !description) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findById(req.user.id);

    const newAchievement = await Achievement.create({
      studentId: req.user.id,
      studentName: user.name,
      studentRollNumber: user.rollNumber,
      eventName,
      rank,
      date,
      description
    });

    res.status(201).json(newAchievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Faculty API Routes ---
app.get('/api/faculty/dashboard', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    let odFilter = {};
    if (req.user.role === 'faculty') odFilter.mentorId = req.user.id;

    const allOds = await OD.find(odFilter);

    const pendingApprovals = allOds.filter(od => od.status === 'Pending').length;
    const totalOdsApproved = allOds.filter(od => od.status === 'Approved').length;

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const achievementsMonth = await Achievement.countDocuments({ date: { $gte: startOfMonth } });

    const recentPendingOds = await OD.find({ ...odFilter, status: 'Pending' })
      .sort({ date: 1 })
      .limit(5);

    res.json({
      stats: {
        pendingApprovals,
        totalOdsApproved,
        achievementsMonth
      },
      pendingOds: recentPendingOds
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/faculty/ods', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    let filter = {};
    if (req.user.role === 'faculty') filter.mentorId = req.user.id;
    const allOds = await OD.find(filter).sort({ createdAt: -1 });
    res.json(allOds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/faculty/ods/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });

    const updatedOd = await OD.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedOd) return res.status(404).json({ message: 'OD not found' });
    res.json(updatedOd);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/faculty/students', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    let filter = { role: 'student' };
    if (req.user.role === 'faculty') filter.mentorId = req.user.id;
    const students = await User.find(filter).select('-password');
    const enrichedStudents = await Promise.all(students.map(async (student) => {
      const ods = await OD.find({ studentId: student._id, status: 'Approved' });
      const achievements = await Achievement.countDocuments({ studentId: student._id });

      return {
        ...student.toObject(),
        approvedOdsCount: ods.length,
        achievementsCount: achievements
      };
    }));

    res.json(enrichedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/faculty/students/:id/achievements', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    if (req.user.role === 'faculty') {
      const student = await User.findById(req.params.id);
      if (!student || student.mentorId?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Students not assigned to you' });
      }
    }

    const achievements = await Achievement.find({ studentId: req.params.id }).sort({ date: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/faculty/students/:id/ods', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'faculty' && req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    if (req.user.role === 'faculty') {
      const student = await User.findById(req.params.id);
      if (!student || student.mentorId?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Students not assigned to you' });
      }
    }

    const ods = await OD.find({ studentId: req.params.id, status: 'Approved' }).sort({ createdAt: -1 });
    res.json(ods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

app.post('/api/admin/faculty', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already exists' });

    const newFaculty = await User.create({
      name,
      email,
      password,
      role: 'faculty'
    });

    const userData = newFaculty.toObject();
    delete userData.password;

    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/events', authenticateToken, async (req, res) => {
  try {
    // Both admin and students/faculty might need events, but this admin route can be used to manage them.
    // For now, allow admin to manage.
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/admin/events', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, type, description, date } = req.body;
    if (!title || !type || !description || !date) return res.status(400).json({ message: 'Missing fields' });

    const newEvent = await Event.create({
      title,
      type,
      description,
      date
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, type, description, date } = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, type, description, date },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/admin/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const eventsConducted = await Event.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const studentAchievements = await Achievement.countDocuments({
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const odsApproved = await OD.countDocuments({
      status: 'Approved',
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    res.json({
      period: monthName,
      eventsCount: eventsConducted,
      achievementsCount: studentAchievements,
      odsApprovedCount: odsApproved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/admin/students', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .populate('mentorId', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/admin/students/:id/mentor', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { mentorId } = req.body;
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { mentorId },
      { new: true }
    ).select('-password');
    
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
