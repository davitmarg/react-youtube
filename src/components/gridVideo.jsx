import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VideoItemWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 40px;
  cursor: pointer;
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

const AddButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(147, 188, 201, 0.3);
  color: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 40%;
  width: 70px;
  height: 70px;
  font-size: 50px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: rgba(92, 136, 150, 0.7);
    color: rgba(255, 255, 255, 1);
  }
`;

const ThumbnailWrapperHover = styled(ThumbnailWrapper)`
  &:hover ${AddButton} {
    display: flex;
  }
`;

export default function GridVideoItem({ rows, cols, size, data, index, onAdd, onClick }) {
  const shortTitle = (title) => {
    const maxSize = 70;
    return title.length < maxSize ? title : title.slice(0, maxSize) + "...";
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.01 * (index % 7) } },
  };

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(data);
    }
  };

  return onClick ? (
    <VideoItemWrapper
      ref={ref}
      rows={rows}
      cols={cols}
      size={size}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
    >
      <ThumbnailWrapperHover>
        <Thumbnail src={data.snippet.thumbnails.url} alt={data.snippet.title} />
        <TitleOverlay rows={rows} cols={cols}>
          {shortTitle(data.snippet.title)}
        </TitleOverlay>
        <AddButton
          onClick={(e) => {
            e.stopPropagation();
            onAdd(data);
          }}
        >
          +
        </AddButton>
      </ThumbnailWrapperHover>
    </VideoItemWrapper>
  ) : (
    <Link to={`/${data.id.videoId}`} onClick={() => window.scrollTo(0, 0)}>
      <VideoItemWrapper
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ThumbnailWrapperHover>
          <Thumbnail src={data.snippet.thumbnails.url} alt={data.snippet.title} />
          <TitleOverlay rows={rows} cols={cols}>
            {shortTitle(data.snippet.title)}
          </TitleOverlay>
          <AddButton
            onClick={(e) => {
              e.preventDefault();
              onAdd(data);
            }}
          >
            +
          </AddButton>
        </ThumbnailWrapperHover>
      </VideoItemWrapper>
    </Link>
  );
}
