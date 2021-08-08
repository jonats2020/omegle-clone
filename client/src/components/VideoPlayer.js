import React from 'react';

import './VideoPlayer.css';

const VideoPlayer = ({ video, id }) => {
  return (
    <div className="container">
      <video
        playsInline
        muted
        ref={video}
        autoPlay
        width="768"
        height="432"
        controls
      />
      <p>{id}</p>
    </div>
  );
};

export default VideoPlayer;
