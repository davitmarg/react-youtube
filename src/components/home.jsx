import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const HomeWrapper = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 70px;
  box-sizing: border-box;
  background-color: #f9f9f9;
  overflow: hidden; /* Ensures content outside is hidden */
  border-radius: 40px; /* Adds rounded edges to the container */
  position: relative;
  box-shadow: 1px 5px 6px rgba(0, 0, 0, 0.3);
  
`;

const LogoImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export default function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogoClick = () => {
    setSearchParams({});
    if (window.location.pathname === "/") {
      window.location.reload(); // Reload the page if already on homepage
    } else {
      navigate("/"); // Navigate to the homepage
    }
  };

  return (
    <HomeWrapper 
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <LogoImage src="/logo.jpg" alt="Home Logo" onClick={handleLogoClick} />
    </HomeWrapper>
  );
}
