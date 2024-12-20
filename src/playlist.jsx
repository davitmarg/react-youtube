import React, { useState, useEffect, useRef  } from "react";
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
import GridPlaylist from "./components/gridPlaylist";
import GridButton from "./components/gridButton";
import GlobalStyle from "./components/globalStyle";
import GridPlaylistThumbnail from "./components/gridPlaylistLink";

async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
}

const topics = ['music', 'news','sports','entertainment','technology', 'travel', 'science','politics','cars','movies','books','comics','cinema','podcasts']

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const getRandIntFrom = (min, max) => {
    return min + getRandomInt(max - min + 1);
};

function GridVideoWithRandomSize({size, onAdd, index, data, onClick}){
    const rows = getRandIntFrom(1, 2);
    const cols = index ? getRandIntFrom(1, 2) : 2;

    return (
        <GridItem rows={rows} cols={cols} size={size} >
            <GridVideoItem index={index} rows={rows} cols={cols} size={size} data={data} onClick={onClick} onAdd={onAdd}/>
        </GridItem>
    );
}

function GridVideoSkeletonWithRandomSize({index, size}){
    const rows = getRandIntFrom(1, 2);
    const cols = getRandIntFrom(1, 2);
    return (
        <GridItem key={index} rows={rows} cols={cols} size={size} >
            <GridVideoSkeleton rows={rows} cols={cols} size={size} />
        </GridItem>
    )
}

function GridPlaylistWithRandomSize({ data, size, index }) {
  const rows = getRandIntFrom(1, 2);
  const cols = getRandIntFrom(1, 2);

  return (
    <GridItem rows={rows} cols={cols} size={size}>
        <GridPlaylistThumbnail data={data} rows={rows} cols={cols} size={size}/>
    </GridItem>
  );
}

export default function PlaylistPage() {
    
    const SIZE = 200;
    const ROWS = 20;
    const COLUMNS = Math.max(6, Math.floor((window.innerWidth - 20) / SIZE));
    const userId = 'davit-orz';

    const { playlistId } = useParams();
    const [videoId, setVideoId] = useState();
    const { isLoading: videoIsLoading, data: videoData, error: videoError } = useSWR(
        `https://harbour.dev.is/api/videos/${videoId}`,
        fetcher
    );

    
    const { isLoading: playlistIsLoading, data: playlistsData, error: playlistError } = useSWR(
        `https://harbour.dev.is/api/playlists?userId=${userId}`,
        fetcher
    );

    const getRandomTopics = (k) => {
        let res = (!videoIsLoading && videoData ? videoData.title + ', ' : '');
        for(let i = 0; i < k; i++)
            res += ', ' + topics[getRandomInt(topics.length)];
        return res;
    };

    const [query, setQuery] = useState('');
    const [randomQuery, setRandomQuery]  = useState(getRandomTopics(10));

    const { isLoading: searchIsLoading, data: searchData, error: searchError } = useSWR(
    `https://harbour.dev.is/api/search?q=${query ? query : randomQuery}`,
    fetcher
    );



    const handleSearch = (q) => {
        if (!q || q==undefined || q === '') {
            setRandomQuery(getRandomTopics(5));
        } else {
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

        if(videoId && videoIsLoading)
            return;
        
        setRandomQuery(getRandomTopics(5));
        
    }, [videoId]);

    const onThumbnailClick = (data) => {
        // console.log(data);
        setVideoId(data.id.videoId);
    }

    const onAdd = async (data) => {
        const videoToAdd = {
            videoId: data.id.videoId,
            thumbnailUrl: data.snippet.thumbnails.url,
            title: data.snippet.title,
            ...data
        };
    
        try {
    
            // Send the PUT request to update the playlist
            await axios.post(`https://harbour.dev.is/api/playlists/${playlistId}/videos`, videoToAdd);
    
            console.log("Video added to playlist successfully!");
        } catch (error) {
            console.error("Error adding video to playlist:", error);
        }
    };
      
      

    const videoPlayer = (
        
        videoId && (
            <GridItem rows={1} cols={2} size={SIZE}>
                <Player videoId={videoId} />
            </GridItem>
    ));

    const addButton = (
        videoId && ( <GridItem rows={1} cols={1} size={SIZE}>
            <GridButton onClick={async () => {

                if(!videoData)
                    return;

                console.log(videoData);

                const videoToAdd = {
                    videoId: videoId,
                    ...videoData
                };

                try {
                    // Send the PUT request to update the playlist
                    await axios.post(`https://harbour.dev.is/api/playlists/${playlistId}/videos`, videoToAdd);

                    console.log("Video added to playlist successfully!");
                } catch (error) {
                    console.error("Error adding video to playlist:", error);
                }
            }}>
                +
            </GridButton>
        </GridItem>
    ));

    const videoDetails = (
        !videoIsLoading && 
        videoId && 
        videoData && 
        <GridVideoDetails rows={1} cols={2} size={SIZE} data={videoData}/>);
    
    const playlistsToRender = (
        !playlistIsLoading &&
        !playlistError &&
        playlistsData.playlists &&
        playlistsData.playlists.map((playlist, index) => (
        <GridPlaylistWithRandomSize
            key={playlist.id}
            data={playlist}
            size={SIZE}
            index={index}
        />
        ))
    );

    const thumbnailsToRender = (
        !searchIsLoading &&
        !searchError && 
        searchData &&
        !videoIsLoading && 
        Array.isArray(searchData) &&
        searchData.map((item, index) => ((!videoId || item.id.videoId != videoId) && <GridVideoWithRandomSize onAdd={onAdd} onClick={onThumbnailClick} key={index} data={item} index={index} size={SIZE}/>)));
    
    const videosSkeleton = (
        (searchIsLoading || 
            (videoId && videoIsLoading) || 
            !searchData) && 
            Array.from({ length: 30 }).map((item, index) => <GridVideoSkeletonWithRandomSize key={index} index={index} size={SIZE}/>));

    return (
        <>
            <GlobalStyle/>
            <SearchBar onSearch={handleSearch} />
            <Grid rows={ROWS} cols={COLUMNS} size={SIZE}>
                <GridItem rows={3} cols={3} size={SIZE}>
                    <GridPlaylist/>
                </GridItem>
                {videoPlayer}
                {addButton}
                {/* {videoDetails} */}
                {thumbnailsToRender}
                {videosSkeleton}
                {playlistsToRender}
            </Grid>
        </>
    );
}
