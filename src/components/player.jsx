import styled from "styled-components";
import { motion } from "framer-motion";

const PlayerDiv = styled(motion.div)`
  border-radius: 40px;
  width: ${({ width }) => width + "px" || "auto"};
  height: ${({ height }) => height + "px" || "auto"};
  box-sizing: border-box;
  padding: 10px;
`;

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border-radius: 30px;
  border: none;
  box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.6);
`;

export default function Player({ width, height, video_id }) {
  return (
    <PlayerDiv id="youtube-player" 
    width={width} 
    height={height} 
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }} >
      <StyledIframe
        src={`https://www.youtube.com/embed/${video_id}?autoplay=1&controls=1&modestbranding=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></StyledIframe>
    </PlayerDiv>
  );
}
