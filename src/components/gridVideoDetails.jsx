import React from "react";
import styled from "styled-components";
import { GridItem } from "../dynamic-grid/grid-controller";
import { motion } from "framer-motion";

const VideoDetailsWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: ${({ cols, size }) => cols * size}px;
  height: ${({ rows, size }) => rows * size}px;
  box-sizing: border-box;
  padding: 10px;
  overflow: hidden;
`;

const InnerWrapper = styled.div`
  background-color: #2f5a9e;
  border-radius: 30px;
  padding-top: 15px;
  padding-left: 15px;
  padding-right: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 0 0 10px 0;
  overflow-wrap: break-word; /* Ensures text wraps to the next line */
  white-space: normal; /* Allows wrapping */
  font-family: 'Arial', sans-serif; /* Use a better font */
`;

const Description = styled.p`
  font-size: 17px;
  color: black;
  margin-top: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* Limits description to 6 lines */
  -webkit-box-orient: vertical;
  font-family: 'Arial', sans-serif; /* Use a better font */
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: white;
`;

export default function GridVideoDetails({ rows, cols, size, data }) {
  return (
    <GridItem rows={rows} cols={cols} size={size}>
        <VideoDetailsWrapper 
        rows={rows} 
        cols={cols} 
        size={size} 
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }} >
        <InnerWrapper>
            {data && 
                <>
                    <Title>{data.title}</Title>
                    <Stats>
                    <div>{data.views.toLocaleString()} views</div>
                    <div>{new Date(data.datePublished).toLocaleDateString()}</div>
                    </Stats>
                    <Description>{data.description}</Description>
                </>
            }
        </InnerWrapper>
        </VideoDetailsWrapper>
    </GridItem>
  );
}
