import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VideoItemWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: ${({ cols, size }) => cols * size}px;
  height: ${({ rows, size }) => rows * size}px;
  box-sizing: border-box;
  cursor: pointer;
  padding: 10px;
  position: relative;
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 40px;
  box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.6);
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
`;

const TitleOverlay = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-size: ${({ rows, cols }) => 10 + 2 * rows * cols}px;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 5px;
  text-align: center;
`;

export default function GridVideoItem({ rows, cols, size, data, index }) {
  const shortTitle = (title) => {
    const maxSize = 70;
    return title.length < maxSize ? title : title.slice(0, maxSize) + "...";
  };

  const ref = useRef(null); // Create a ref to attach to the element
  const isInView = useInView(ref, { once: true }); // Track visibility of the element

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.05 * (index % 5) } },
  };

  return (
    <Link to={`/${data.id.videoId}`} onClick={() => window.scrollTo(0, 0)}>
      <VideoItemWrapper
        ref={ref} // Attach the ref here
        rows={rows}
        cols={cols}
        size={size}
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"} // Trigger animation based on visibility
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ThumbnailWrapper>
          <Thumbnail src={data.snippet.thumbnails.url} alt={data.snippet.title} />
          <TitleOverlay rows={rows} cols={cols}>
            {shortTitle(data.snippet.title)}
          </TitleOverlay>
        </ThumbnailWrapper>
      </VideoItemWrapper>
    </Link>
  );
}
