const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongoMemoryInstance = null;

const autoSeedIfEmpty = async () => {
  try {
    const User = require('../models/User');
    const Assignment = require('../models/Assignment');

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Database] Database is fresh. Automatically creating demo student and sample coursework...');

      const demoStudent = await User.create({
        name: 'Alex Johnson',
        email: 'student@university.edu',
        password: 'password123'
      });

      const now = new Date();
      const daysAgo = (days) => {
        const d = new Date(now);
        d.setDate(d.getDate() - days);
        return d;
      };
      const daysFromNow = (days) => {
        const d = new Date(now);
        d.setDate(d.getDate() + days);
        return d;
      };

      const sampleAssignments = [
        {
          title: 'Build Single-Page Application with React Hooks & Router',
          subject: 'React.js',
          description: 'Implement useState, useEffect, dynamic routing, and controlled forms in a full dashboard.',
          dueDate: daysFromNow(2),
          priority: 'High',
          status: 'In Progress',
          userId: demoStudent._id
        },
        {
          title: 'Asynchronous JavaScript & Fetch API Assignment',
          subject: 'JavaScript',
          description: 'Complete hands-on exercises covering Promises, Async/Await, and event loop microtasks.',
          dueDate: daysFromNow(5),
          priority: 'Medium',
          status: 'Pending',
          userId: demoStudent._id
        },
        {
          title: 'Exploratory Data Analysis with Pandas & Seaborn',
          subject: 'Data Analytics',
          description: 'Clean dataset, visualize distributions, detect outliers, and generate summary report.',
          dueDate: daysFromNow(7),
          priority: 'Medium',
          status: 'Pending',
          userId: demoStudent._id
        },
        {
          title: 'Subnetting & TCP/IP Protocol Analysis Lab',
          subject: 'Computer Networks',
          description: 'Analyze Wireshark packet capture file and submit IPv4 subnet breakdown report.',
          dueDate: daysAgo(2),
          priority: 'High',
          status: 'Pending',
          userId: demoStudent._id
        },
        {
          title: 'Train Supervised Classification Model (Decision Trees)',
          subject: 'Machine Learning',
          description: 'Tune hyperparameters, plot ROC curve, and achieve >85% accuracy on test split.',
          dueDate: now,
          priority: 'High',
          status: 'In Progress',
          userId: demoStudent._id
        },
        {
          title: 'Process Scheduling & Memory Management Simulation',
          subject: 'Operating Systems',
          description: 'Simulate Round-Robin and Shortest-Job-First CPU scheduling algorithms in C/Python.',
          dueDate: daysAgo(5),
          priority: 'Low',
          status: 'Completed',
          userId: demoStudent._id
        }
      ];

      await Assignment.insertMany(sampleAssignments);
      console.log('[Database] Demo student data auto-seeded successfully! (student@university.edu / password123)');
    }
  } catch (seedErr) {
    console.warn('[Database] Auto-seed warning:', seedErr.message);
  }
};

const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_assignment_workspace';

  // 1. Try standard MongoDB (Atlas or local service)
  try {
    const conn = await mongoose.connect(configuredUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    await autoSeedIfEmpty();
    return conn;
  } catch (err) {
    console.warn(`[Database] Standard MongoDB connection not reachable: ${err.message}`);
    console.log('[Database] Activating robust embedded MongoDB server via MongoMemoryServer...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const binPath = path.resolve(__dirname, '../bin/mongod.exe');

      const config = {};
      if (fs.existsSync(binPath)) {
        config.binary = { systemBinary: binPath };
      }

      mongoMemoryInstance = await MongoMemoryServer.create(config);
      const embeddedUri = mongoMemoryInstance.getUri();

      const conn = await mongoose.connect(embeddedUri);
      console.log(`[Database] Embedded MongoDB Engine Connected successfully at: ${embeddedUri}`);

      await autoSeedIfEmpty();
      return conn;
    } catch (fallbackErr) {
      console.error(`[Database] Fatal database connection failure: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryInstance) {
      console.log('[Database] Stopping MongoMemoryServer...');
      await mongoMemoryInstance.stop();
      mongoMemoryInstance = null;
    }
  } catch (err) {
    console.error('Error during database disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };
