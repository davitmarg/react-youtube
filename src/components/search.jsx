import { useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import Home from "../components/home";

// Styled components
const Container = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
`;

const Input = styled.input`
    margin-left: 5px;
    box-sizing: border-box;
    padding: 8px;
    border: none;
    border-radius: 20px;
    height: 40px;
    max-width: 400px;
    flex-grow: 1;
    box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
    margin-left: 5px;
    box-sizing: border-box;
    padding: 8px 16px;
    background-color: #ccebda;
    color: #7291d6;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    height: 40px;
    font-size: 14px;
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
    setSearchParams({ q: query.trim() });
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
      />
      <Button onClick={handleSearch}>Search</Button>
    </Container>
  );
}
