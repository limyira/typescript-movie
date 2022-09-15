import { useQueries, useQuery } from "react-query";
import { popularTv, IPopularTv } from "../api";
import styled from "styled-components";
import { motion, useScroll } from "framer-motion";
import { useNavigate, useMatch } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { makeImage } from "../utilites";

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 200px;
  margin-bottom: 100px;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
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
interface IrowVariants {
  resize: number;
  back: boolean;
}

const rowVariants = {
  hidden: ({ resize, back }: IrowVariants) => ({
    x: back
      ? resize
        ? -resize
        : -window.innerWidth
      : resize
      ? resize
      : window.innerWidth,
  }),
  visible: {
    x: 0,
  },
  exit: ({ resize, back }: IrowVariants) => ({
    x: back
      ? resize
        ? resize
        : window.innerWidth
      : resize
      ? -resize
      : -window.innerWidth,
  }),
};
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
const LeftArrow = styled.div`
  position: absolute;
  left: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  width: 40px;
  border: none;
  z-index: 2;
  color: rgb(229, 229, 229);
  svg {
    width: 40px;
    height: 40px;
  }
  path {
    box-sizing: border-box;
  }
`;

const RightArrow = styled.div`
  position: absolute;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  height: 100%;
  width: 40px;
  border: none;
  z-index: 2;
  color: rgb(229, 229, 229);
  svg {
    width: 40px;
    height: 40px;
  }
  path {
    box-sizing: border-box;
  }
`;
const H2 = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 20px;
  margin-left: 10px;
  color: rgb(255, 255, 255);
  text-transform: uppercase;
`;
const offset = 6;
const PopularTv = () => {
  const { isLoading, data } = useQuery<IPopularTv>(["popularTv"], popularTv);
  const [resize, setResize] = useState(window.innerWidth);
  window.onresize = () => setResize(window.innerWidth);
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/popular/:tvId");
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const incraseIndex = async () => {
    await setBack(false);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      await setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreraseIndex = async (le: React.MouseEvent<HTMLDivElement>) => {
    await setBack(true);
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      await setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onOverlayClick = () => navigate("/tv");
  const clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((movie) => movie.id + 1 + "" === bigTvMatch.params.tvId);
  const onBoxClicked = async (tvId: number) => {
    await navigate(`/tv/popular/${tvId}`);
  };
  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Slider>
          <H2>Popular</H2>
          <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
            <Row
              custom={{ resize, back }}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1.5 }}
              key={index}
            >
              {data?.results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((topTv) => (
                  <Box
                    layoutId={topTv.id + 1 + ""}
                    key={topTv.id + 1}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    onClick={() => onBoxClicked(topTv.id + 1)}
                    transition={{ type: "tween" }}
                    bgphoto={makeImage(topTv.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{topTv.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          </AnimatePresence>
          <LeftArrow onClick={decreraseIndex}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 512"
              fill="currentColor"
            >
              <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z"></path>
            </svg>
          </LeftArrow>
          <RightArrow className="right" onClick={incraseIndex}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 512"
              fill="currentColor"
            >
              <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z"></path>
            </svg>
          </RightArrow>
        </Slider>
      )}
      <AnimatePresence>
        {bigTvMatch ? (
          <>
            <Overlay
              onClick={onOverlayClick}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigTvMatch.params.tvId}
            >
              {clickedTv && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImage(
                        clickedTv.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedTv.name}</BigTitle>
                  <BigOverview>{clickedTv.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default PopularTv;
