import { useQueries, useQuery } from "react-query";
import { LatestTv, ILatestTv } from "../api";
import styled from "styled-components";
import { makeImage } from "../utilites";
import PopularTv from "./PopularTv";
import TopTv from "./Top";
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
const Tv = () => {
  const { isLoading, data } = useQuery<ILatestTv>(["latestTv"], LatestTv);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImage(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <TopTv />
          <PopularTv />
        </>
      )}
    </Wrapper>
  );
};

export default Tv;
