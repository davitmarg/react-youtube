import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

const PlayerDiv = styled(motion.div)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: none;
`;

const StyledPlayer = styled(ReactPlayer)`
  border-radius: 30px;
  overflow: hidden;
  border: none;
  box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.6);
`;

export default function Player({ videoId, onPlay, onPause }) {
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <PlayerDiv
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <StyledPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        playing
        modestbranding
        onPlay={onPlay} 
        onPause={onPause} 
      />
    </PlayerDiv>
  );
}
