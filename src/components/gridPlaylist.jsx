import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import useSWR from "swr";
import axios from "axios";
import ReactPlayer from "react-player";
import PlaylistItem from "./playlistItem";

// Fetcher for API requests
const fetcher = async (url) => {
    const response = await axios.get(url);
    return response.data;
};

const PlaylistDivWrapper = styled(motion.div)`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px;
    position: relative;
`;

const PlaylistDiv = styled.div`
    position: relative;
    background-color: white;
    width: 100%;
    height: 100%;
    border-radius: 40px;
    box-sizing: border-box;
    padding-left: 10px;
    padding-right: 10px;
    cursor: pointer;
    box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.6);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const Title = styled.input`
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0;
    color: #333;
    border: none;
    background-color: transparent;
    outline: none;
    width: 100%;
`;

const PlayerWrapper = styled.div`
    width: 100%; /* Customize the width as needed */
    max-width: 720px; /* Set a maximum width */
    margin: 0 auto 20px; /* Center the player and add spacing */
    aspect-ratio: 16 / 9; /* Maintain aspect ratio */
    position: relative; /* Needed for absolute positioning within */
`;

const StyledReactPlayer = styled(ReactPlayer)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    overflow: hidden;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
`;

const NavButton = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

export default function GridPlaylist() {
    const { playlistId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentIndexRef = useRef(parseInt(searchParams.get("index") || "0"));
    const [title, setTitle] = useState("");

    const { data, error, mutate } = useSWR(
        `https://harbour.dev.is/api/playlists/${playlistId}`,
        fetcher,
        {
            refreshInterval: 1000,
        }
    );

    if (!data) {
        return (
        <PlaylistDivWrapper
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <PlaylistDiv>
                <div>Loading...</div>
            </PlaylistDiv>
        </PlaylistDivWrapper>)
    }

    if (error) {
        return (
            <PlaylistDivWrapper
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <PlaylistDiv>
                    <div>Error fetching data.</div>
                </PlaylistDiv>
            </PlaylistDivWrapper>)
    }

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    if (currentIndexRef.current && data.videos.length <= currentIndexRef.current) {
        currentIndexRef.current = 0;
    }

    const handleTitleSave = async () => {
        try {
            await axios.put(`https://harbour.dev.is/api/playlists/${playlistId}`, {
                name: title,
                videos: data.videos,
            });
            mutate();
        } catch (error) {
            console.error("Error saving title:", error);
        }
    };

    const handleVideoEnd = () => {
        if (currentIndexRef.current < data.videos.length - 1) {
            currentIndexRef.current += 1;
            setSearchParams({ index: currentIndexRef.current.toString() });
        }
    };

    const handleNextVideo = () => {
        if (currentIndexRef.current < data.videos.length - 1) {
            currentIndexRef.current += 1;
            setSearchParams({ index: currentIndexRef.current.toString() });
        }
    };

    const handlePrevVideo = () => {
        if (currentIndexRef.current > 0) {
            currentIndexRef.current -= 1;
            setSearchParams({ index: currentIndexRef.current.toString() });
        }
    };

    const handleItemClick = (index) => {
        currentIndexRef.current = index;
        setSearchParams({ index: index.toString() });
    };

    const removeVideo = async (videoId) => {
        try {
            await axios.delete(`https://harbour.dev.is/api/playlists/${playlistId}/videos/${videoId}`);
            mutate();
        } catch (error) {
            console.error("Error removing video:", error);
        }
    };

    return (
        <PlaylistDivWrapper
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <PlaylistDiv>
                <Title
                    value={title || data.name}
                    onChange={handleTitleChange}
                    onBlur={handleTitleSave}
                    placeholder="Enter playlist name"
                />
                {data.videos.length > currentIndexRef.current && (
                    <PlayerWrapper>
                        <StyledReactPlayer
                            url={`https://www.youtube.com/watch?v=${data.videos[currentIndexRef.current].videoId}`}
                            playing
                            controls
                            onEnded={handleVideoEnd}
                            width="100%"
                            height="100%"
                        />
                    </PlayerWrapper>
                )}
                <ButtonContainer>
                    <NavButton onClick={handlePrevVideo} disabled={currentIndexRef.current === 0}>
                        Previous Video
                    </NavButton>
                    <NavButton
                        onClick={handleNextVideo}
                        disabled={currentIndexRef.current === data.videos.length - 1}
                    >
                        Next Video
                    </NavButton>
                </ButtonContainer>
                <div>
                    {data.videos.length > 0 ? (
                        data.videos.map((item, index) => (
                            <PlaylistItem
                                key={index}
                                videoId={item.videoId}
                                title={item.title}
                                thumbnailUrl={item.thumbnailUrl}
                                onClick={() => handleItemClick(index)}
                                isPlaying={currentIndexRef.current === index}
                                onRemove={removeVideo}  // Pass remove function to PlaylistItem
                            />
                        ))
                    ) : (
                        <div>No videos in this playlist</div>
                    )}
                </div>
            </PlaylistDiv>
        </PlaylistDivWrapper>
    );
}
