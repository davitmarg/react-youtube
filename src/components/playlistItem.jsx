import React from "react";
import styled from "styled-components";

const ItemDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  cursor: pointer;
  background-color: ${({ isPlaying }) => (isPlaying ? "#d0f7ff" : "#f9f9f9")}; /* Highlight if playing */
  border-radius: 10px;
  box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${({ isPlaying }) => (isPlaying ? "#aee0f7" : "#f1f1f1")}; /* Slightly different hover color */
  }
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.2);
`;


const RemoveButton = styled.button`
  opacity: 0;
  pointer-events: none;
  background-color: #ff4d4d;
  border: none;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  transition: opacity 0.2s ease, background-color 0.2s ease;
  z-index: 10;

  &:hover {
    background-color: #e63939;
  }

  ${ItemDiv}:hover & {
    opacity: 1;
    pointer-events: auto;
  }
`;


const Title = styled.h3`
  flex: 1;
  margin-left: 15px;
  font-size: 16px;
  color: #333;
  text-align: left;
  position: relative;
  z-index: 1;
`;

export default function PlaylistItem({ videoId, title, thumbnailUrl, onRemove, onClick, isPlaying }) {
  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(videoId);
  };

  return (
    <ItemDiv onClick={() => onClick(videoId)} isPlaying={isPlaying}>
      <Thumbnail src={thumbnailUrl} alt={title} />
      <Title>{title}</Title>
      <RemoveButton onClick={handleRemove}>Remove</RemoveButton>
    </ItemDiv>
  );
}
