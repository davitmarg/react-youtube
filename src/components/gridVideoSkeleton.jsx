import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

// Styling for the video item
const VideoItemWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Make the layout vertical */
  width: ${({ cols, size }) => cols * size}px;
  height: ${({ rows, size }) => rows * size}px;
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  opacity: 0.1;
`;

const ThumbnailWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 30px;
  background-color: #cce3e3;
`;

export default function GridVideoSkeleton({ rows, cols, size }) {

  return (
    <VideoItemWrapper rows={rows} cols={cols} size={size}>
      <ThumbnailWrapper>
      </ThumbnailWrapper>
    </VideoItemWrapper>
  );
}