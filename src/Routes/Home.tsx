import { useQuery } from "react-query";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  useViewportScroll,
  useScroll,
} from "framer-motion";
import { getMoives, IGetMoives } from "../api";
import { makeImage } from "../utilites";
import React, { useEffect, useState } from "react";
import { Navigate, useMatch, useNavigate } from "react-router-dom";
import { once } from "process";
import Popular from "./Popular";
import NowPlaying from "./Nowplaying";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

interface IrowVariants {
  resize: number;
  back: boolean;
}

function Home() {
  const { data, isLoading } = useQuery<IGetMoives>(
    ["movies", "nowPlaying"],
    getMoives
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImage(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <NowPlaying />
          <Popular />
        </>
      )}
    </Wrapper>
  );
}
export default Home;
