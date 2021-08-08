const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

let socketIds = [];

const addSocketId = (id) => {
  if (id) {
    if (socketIds.indexOf(id) === -1) {
      socketIds.push(id);
    }
  }
};

const removeSocketId = (id) => {
  const index = socketIds.indexOf(id);
  if (index > -1) {
    socketIds.splice(index, 1);
  }
};

app.get('/', (req, res) => {
  res.send(socketIds);
});

io.on('connection', (socket) => {
  socket.emit('me', socket.id);

  addSocketId(socket.id);

  socket.on('disconnect', () => {
    socket.broadcast.emit('callended');

    removeSocketId(socket.id);
  });

  socket.on('calluser', ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit('calluser', { signal: signalData, from });
  });

  socket.on('answercall', (data) => {
    io.to(data.to).emit('callaccepted', data.signal);
  });
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
