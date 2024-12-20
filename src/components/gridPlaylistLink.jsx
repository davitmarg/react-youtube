import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PlaylistItemWrapper = styled(motion.div)`
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

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  background-position: center;
  filter: blur(3px);
  opacity: 0.5;
`;

const BackgroundGrid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* Adjust the number of columns */
    grid-template-rows: repeat(1, 1fr); /* Adjust the number of rows */
    gap: 10px;
    z-index: 1;
    width: 100%;
    height: 100%;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  opacity: 0.3; /* Dim the thumbnails */
  transition: opacity 0.3s ease;
`;

const TitleOverlay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px;
  border-radius: 5px;
  text-align: center;
  z-index: 2; /* Ensures text is above the overlay */
`;

export default function GridPlaylistThumbnail({ rows, cols, size, data }) {
  const shortTitle = (title) => {
    const maxSize = 70;
    return title.length < maxSize ? title : title.slice(0, maxSize) + "...";
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.05 * (rows % 7) } },
  };

  // Check if playlist has videos, and use the thumbnails of the videos for the grid background
  const thumbnails = data.videos && data.videos.length > 0 ? data.videos.map(video => video.thumbnailUrl) : [];
  const firstThumbnail = thumbnails.length > 0 ? thumbnails[0] : ""; // Get the first video thumbnail for background

  const title = data.name || "Untitled Playlist"; // Fallback for playlist name

  return (
    <Link to={`/playlist/${data.id}`} onClick={() => window.scrollTo(0, 0)}>
      <PlaylistItemWrapper
        ref={ref}
        variants={variants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ThumbnailWrapper>
          {firstThumbnail && <BackgroundWrapper backgroundImage={firstThumbnail} />}
          <BackgroundGrid>
            {thumbnails.slice(1, 10).map((thumbnail, index) => (
              <Thumbnail key={index} src={thumbnail} alt={`video-thumbnail-${index}`} />
            ))}
          </BackgroundGrid>
          <TitleOverlay rows={rows} cols={cols}>
            Playlist: {shortTitle(title)}
          </TitleOverlay>
        </ThumbnailWrapper>
      </PlaylistItemWrapper>
    </Link>
  );
}
