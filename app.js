const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Idea service
class IdeaService {
  constructor() {
    this.ideas = [];
  }
  async find() {
    return this.ideas;
  }
  async create(data) {
    const idea = {
      id: this.ideas.length,
      text: data.text,
      tech: data.tech,
      viewer: data.viewer
    };

    idea.time = moment().format('h:mm:ss a');

    this.ideas.push(idea);

    return idea;
  }
}

const app = express(feathers());

// Parse JSON
app.use(express.json());
// Config socket.io realtime apis
app.configure(socketio());
// Enable REST services
app.configure(express.rest());
// Register services
app.use('/ideas', new IdeaService());

// New connections connect to steam channel
app.on('connection', conn => app.channel('stream').join(conn));
// Publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

// Server Listening for connection
app
  .listen(PORT)
  .on('listening', () =>
    console.log(`Realtime server running on port ${PORT}`)
  );

// Seed the feed "database" for testing in the browser at /ideas
// app.service('ideas').create({
//   text: 'Build a feathers.js app',
//   tech: 'Node.js, Feathers.js',
//   viewer: 'John Smith'
// });
