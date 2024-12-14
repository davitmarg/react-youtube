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
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    body {
        background: radial-gradient(circle, rgba(236,227,211,1) 0%, rgba(220,224,227,1) 38%, rgba(226,205,230,1) 58%, rgba(139,161,209,1) 79%, rgba(86,172,205,1) 100%);
    }
`;

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

function GridVideoWithRandomSize({size, index, data}){
    const rows = getRandIntFrom(1, 2);
    const cols = index ? getRandIntFrom(1, 2) : 2;

    return (
        <GridItem rows={rows} cols={cols} size={size} >
            <GridVideoItem index={index} rows={rows} cols={cols} size={size} data={data} />
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

export default function App() {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    
    const SIZE = 200;
    const ROWS = 20;
    const COLUMNS = Math.max(6, Math.floor((screenSize.width - 20) / SIZE));

    const { videoid } = useParams(); 
    const { isLoading: videoIsLoading, data: videoData, error: videoError } = useSWR(
        `https://harbour.dev.is/api/videos/${videoid}`,
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
        if(!videoid)
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

        if(videoid && videoIsLoading)
            return;
        
        setRandomQuery(getRandomTopics(5));
        
    }, [videoid]);

    const videosSkeleton = Array.from({ length: 30 }).map((item, index) => <GridVideoSkeletonWithRandomSize key={index} index={index} size={SIZE}/>);

    return (
        <>
            <GlobalStyle/>
            <SearchBar onSearch={handleSearch} />
            <Grid rows={ROWS} cols={COLUMNS} size={SIZE}>
                {videoid && (
                    <GridItem rows={2} cols={3} size={SIZE} row_start={1} col_start={1}>
                        <Player width={3 * SIZE} height={2 * SIZE} video_id={videoid} />
                    </GridItem>
                )}
                {!videoIsLoading && videoid && videoData && <GridVideoDetails rows={1} cols={3} size={SIZE} data={videoData}/>}
                {!searchIsLoading &&
                !searchError && 
                searchData &&
                !videoIsLoading && 
                Array.isArray(searchData) &&
                searchData.map((item, index) => ((!videoid || item.id.videoId != videoid) && <GridVideoWithRandomSize key={index} data={item} index={index} size={SIZE}/>))}

                {(searchIsLoading || (videoid && videoIsLoading) || !searchData) && videosSkeleton}
                
            </Grid>
            
        </>
    );
}

function Something(){
    return <GridItem cols={1} rows={1} size={160} bgcolor="red"/>;
}

