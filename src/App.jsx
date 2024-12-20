import React, { useState, useEffect } from "react";
import Grid from "./dynamic-grid/grid";
import { GridItem } from "./dynamic-grid/grid-controller";
import Player from "./components/player";
import SearchBar from "./components/search";
import { useSearchParams, useParams } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import GridVideoItem from "./components/gridVideo";
import GridVideoDetails from "./components/gridVideoDetails";
import GridVideoSkeleton from "./components/gridVideoSkeleton";
import { useNavigate } from "react-router";
import GridButton from "./components/gridButton";

import GlobalStyle from "./components/globalStyle";

async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
}

const topics = ['music', 'news','sports','entertainment','technology', 'travel', 'science','politics','cars','movies','books','comics','cinema','podcasts'];

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const getRandIntFrom = (min, max) => {
    return min + getRandomInt(max - min + 1);
};

function GridVideoWithRandomSize({onAdd, size, index, data}) {
    const rows = getRandIntFrom(1, 2);
    const cols = index ? getRandIntFrom(1, 2) : 2;

    return (
        <GridItem rows={rows} cols={cols} size={size}>
            <GridVideoItem onAdd={onAdd} index={index} rows={rows} cols={cols} size={size} data={data} />
        </GridItem>
    );
}

function GridVideoSkeletonWithRandomSize({index, size}) {
    const rows = getRandIntFrom(1, 2);
    const cols = getRandIntFrom(1, 2);
    return (
        <GridItem key={index} rows={rows} cols={cols} size={size}>
            <GridVideoSkeleton rows={rows} cols={cols} size={size} />
        </GridItem>
    );
}

export default function App() {
    const SIZE = 200;
    const ROWS = 20;
    const COLUMNS = Math.max(6, Math.floor((window.innerWidth - 20) / SIZE));
    const userId = 'davit-orz';

    const { videoId } = useParams(); 
    const { isLoading: videoIsLoading, data: videoData, error: videoError } = useSWR(
        `https://harbour.dev.is/api/videos/${videoId}`,
        fetcher
    );
  
    const getRandomTopics = (k) => {
        let res = (!videoIsLoading && videoData ? videoData.title + ', ' : '');
        for(let i = 0; i < k; i++)
            res += ', ' + topics[getRandomInt(topics.length)];
        return res;
    };

    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [randomQuery, setRandomQuery]  = useState(getRandomTopics(10));
    const [isPlaying, setIsPlaying] = useState(false); // Added isPlaying state
    const navigate = useNavigate();

    const { isLoading: searchIsLoading, data: searchData, error: searchError } = useSWR(
        `https://harbour.dev.is/api/search?q=${query ? query : randomQuery}`,
        fetcher
    );

    const handleSearch = (q) => {
        if (!q || q==undefined || q === '') {
            setSearchParams({});
            setRandomQuery(getRandomTopics(5));
        } else {
            setSearchParams({ q });
            setQuery(q);
        }
    };
    
    useEffect(() => {
        if(!videoId)
            return;
        if(videoIsLoading || !videoData)
            return;
        
        setRandomQuery(getRandomTopics(5));
    }, [videoIsLoading]);

    useEffect(() => {
        const newQuery = searchParams.get('q') || '';

        if (query !== newQuery) {
            setQuery(newQuery);
        }

        if(videoId && videoIsLoading)
            return;
        
        setRandomQuery(getRandomTopics(5));
    }, [videoId]);

    const onAdd = async (data) => {
        try {
            const response = await axios.post('https://harbour.dev.is/api/playlists', {
                userId: userId,
            });

            const playlistId = response.data.id;

            await axios.post(`https://harbour.dev.is/api/playlists/${playlistId}/videos`, {
                videoId: data.id.videoId,
                thumbnailUrl: data.snippet.thumbnails.url,
                title: data.snippet.title,
                ...data
            });
            
            navigate(`/playlist/${playlistId}`);
        }
        catch (error) {
            console.error(error);
        }
    };

    const videoPlayer = (
        videoId && (
        <GridItem rows={2} cols={3} size={SIZE}>
            <Player 
                width={3 * SIZE} 
                height={2 * SIZE} 
                videoId={videoId} 
                onPlay={() => setIsPlaying(true)} // Pass onPlay function to set isPlaying to true
                onPause={() => setIsPlaying(false)} // Pass onPause function to set isPlaying to false
            />
        </GridItem>
    ));
    
    const addButton = (
        videoId && videoData && ( <GridItem rows={1} cols={1} size={SIZE}>
            <GridButton onClick={async () => {
                try {
                    const response = await axios.post('https://harbour.dev.is/api/playlists', {
                        userId: userId,
                    });

                    const playlistId = response.data.id;

                    await axios.post(`https://harbour.dev.is/api/playlists/${playlistId}/videos`, {
                        videoId: videoId,
                        ...videoData
                    });
                    
                    navigate(`/playlist/${playlistId}`);
                    
                }
                catch (error) {
                    console.error(error);
                }
            }} >
                +
            </GridButton>
        </GridItem>
    ));

    const videoDetails = (
        !videoIsLoading && 
        videoId && 
        videoData && 
        <GridVideoDetails rows={1} cols={2} size={SIZE} data={videoData} />
    );

    const thumbnailsToRender = (
        !searchIsLoading &&
        !searchError && 
        searchData &&
        !videoIsLoading && 
        Array.isArray(searchData) &&
        searchData.map((item, index) => ((!videoId || item.id.videoId !== videoId) && <GridVideoWithRandomSize onAdd={onAdd} key={index} data={item} index={index} size={SIZE} />))
    );
    
    const videosSkeleton = (
        (searchIsLoading || 
            (videoId && videoIsLoading) || 
            !searchData) && 
            Array.from({ length: 30 }).map((item, index) => <GridVideoSkeletonWithRandomSize key={index} index={index} size={SIZE} />)
    );

    return (
        <>
            <GlobalStyle isPlaying={isPlaying} /> {/* Pass isPlaying state to GlobalStyle */}
            <SearchBar onSearch={handleSearch} />
            <Grid rows={ROWS} cols={COLUMNS} size={SIZE}>
                {videoPlayer}
                {videoDetails}
                {addButton}
                {thumbnailsToRender}
                {videosSkeleton}
            </Grid>
        </>
    );
}
