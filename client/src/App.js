import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

import './styles.css';
import logo from './images/omegle-logo.png';
import VideoPlayer from './components/VideoPlayer';

const SERVER_URL = 'https://omegle-clone-nats.herokuapp.com/';

const socket = io(SERVER_URL);

const App = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [myStreamId, setMyStreamId] = useState('');
  const [otherStreamId, setOtherStreamId] = useState('');
  const [callInformation, setCallInformation] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef();
  const otherVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentMediaStream) => {
          setMediaStream(currentMediaStream);

          myVideo.current.srcObject = currentMediaStream;
        });
    } catch (error) {
      console.log(error);
    }

    socket.on('me', (id) => setMyStreamId(id));

    socket.on('calluser', ({ from, signal }) => {
      setCallInformation({
        isReceived: true,
        from,
        signal,
      });
    });
  }, []);

  useEffect(() => {
    if (callInformation.isReceived && !callAccepted) {
      answercall();
    }
  }, [callInformation]);

  const answercall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: mediaStream,
    });

    peer.on('signal', (data) => {
      socket.emit('answercall', { signal: data, to: callInformation.from });
    });

    peer.on('stream', (currentStream) => {
      otherVideo.current.srcObject = currentStream;
    });

    peer.signal(callInformation.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: mediaStream,
    });

    peer.on('signal', (data) => {
      socket.emit('calluser', {
        userToCall: id,
        signalData: data,
        from: myStreamId,
      });
    });

    peer.on('stream', (currentStream) => {
      otherVideo.current.srcObject = currentStream;
    });

    socket.on('callaccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    if (connectionRef) {
      connectionRef.current?.destroy();

      window.location.reload();
    }
  };

  const callRandomUser = async () => {
    const response = await fetch(SERVER_URL);

    const activeUsers = await response.json();

    const index = activeUsers.indexOf(myStreamId);
    if (index > -1) {
      activeUsers.splice(index, 1);
    }

    const numberOfActiveUsers = activeUsers.length;

    const selectedRandomUser = getRandomInt(numberOfActiveUsers);

    setOtherStreamId(activeUsers[selectedRandomUser]);

    callUser(activeUsers[selectedRandomUser]);
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  return (
    <div>
      <img src={logo} alt="omegle" height={100} />

      <div className="videoPlayerContainer">
        <VideoPlayer video={otherVideo} id={otherStreamId} />
        <VideoPlayer video={myVideo} id={myStreamId} />
      </div>

      <div className="controls">
        <div className="controls__container">
          <button onClick={callRandomUser}>NEXT</button>
          <button onClick={leaveCall}>STOP</button>
        </div>

        <div className="chat__container"></div>
      </div>
    </div>
  );
};

export default App;
