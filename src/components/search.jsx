import { useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Home from "../components/home";
import { motion } from "framer-motion";

// Styled components
const Container = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
`;

const Input = styled(motion.input)`
    margin-left: 10px;
    font-size: 20px;
    box-sizing: border-box;
    padding: 8px;
    border: none;
    border-radius: 25px;
    height: 50px;
    max-width: 400px;
    flex-grow: 1;
    box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.3);
    
    &:focus {
        outline: none;
    }
`;

const Button = styled(motion.button)`
    margin-left: 10px;
    box-sizing: border-box;
    padding: 8px 16px;
    background-color: #ccebda;
    color: #7291d6;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    height: 50px;
    font-size: 20px;
    font-weight: bold;

    &:hover {
        background-color: #0e909e;
        color: white;
    }
    box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.3);
`;


export default function SearchBar({onSearch}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e) => {
    e.preventDefault();

    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("q", query.trim());

    setSearchParams(currentParams);
    onSearch(query);
  };

  return (
    <Container>
        <Home/>
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      <Button 
      whileHover={{ scale: 1.2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleSearch}>Search</Button>
    </Container>
  );
}
