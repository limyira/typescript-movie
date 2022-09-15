import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { MultiSearch, ILatestTvResults } from "../api";
import styled from "styled-components";
import {
  motion,
  AnimatePresence,
  useViewportScroll,
  useScroll,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { makeImage } from "../utilites";
import { useMatch } from "react-router-dom";
import { useState } from "react";

const Wrapper = styled.div`
  margin: 150px 60px 0px 90px;
`;
const Category = styled.div`
  display: flex;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: start;
  justify-content: flex-start;
  height: 120px;
`;

const H1 = styled.h1`
  margin: 50px 0px;
  font-size: 36px;
  font-weight: 600;
`;
const SearchBox = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 50px 10px;
  margin-bottom: 100px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
interface ISearch {
  page: number;
  results: ILatestTvResults[];
  total_pages: number;
  total_results: number;
}
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  font-size: 64px;
  background-size: cover;
  background-image: url(${(props) => props.bgphoto});

  background-position: center center;
  cursor: pointer;
`;
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 3;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  z-index: 4;
  background-color: ${(props) => props.theme.black.lighter};
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
interface IParams {
  state: {
    id: number;
  };
}
const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { state } = useLocation() as IParams;
  const { isLoading, data } = useQuery<ISearch>(["search"], () =>
    MultiSearch(keyword!)
  );
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const onBoxClicked = (SearchId: number) => {
    navigate(`/search/${SearchId}?keyword=${keyword}`, {
      state: { id: keyword },
    });
  };
  const bigMovieMatch = useMatch(`/search/:id`);
  const Match =
    bigMovieMatch?.params.id &&
    data?.results.find((movie) => movie.id + "" === bigMovieMatch.params.id);

  const onOverlayClick = () => navigate(-1);
  return (
    <Wrapper>
      <H1>Search: {keyword}</H1>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <SearchBox>
          {data?.results.map((item) =>
            item.poster_path ? (
              <Box
                variants={boxVariants}
                layoutId={item.id + ""}
                key={item.id}
                whileHover="hover"
                initial="normal"
                transition={{ type: "tween" }}
                onClick={() => onBoxClicked(item.id)}
                bgphoto={makeImage(item.poster_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{item.name}</h4>
                </Info>
              </Box>
            ) : null
          )}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.id}
                >
                  {Match && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImage(
                            Match.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{Match.name}</BigTitle>
                      <BigOverview>{Match.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </SearchBox>
      )}
    </Wrapper>
  );
};

export default Search;
