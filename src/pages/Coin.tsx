import {
  Link,
  Location,
  Outlet,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { IDetailInfo, IPriceInfo } from "../types";
import { NumericFormat } from "react-number-format";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { fetchCoinInfo, fetchCoinTickers } from "../core/services/api";

interface ILocationState {
  name: string;
}

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;
const Loader = styled.span`
  text-align: center;
  display: block;
`;
const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;
const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;
  span {
    &:first-child {
      font-size: 10px;
      font-weight: 400;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
  }
`;
const Description = styled.div`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;
const Tab = styled.span<{ $isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    padding: 7px 0px;
    display: block;
  }
`;

export default function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as Location<ILocationState>;

  const { isLoading: infoLoading, data: infoData } = useQuery<IDetailInfo>({
    queryKey: ["coinInfo", coinId],
    queryFn: () => fetchCoinInfo(coinId),
  });
  const { data: priceData } = useQuery<IPriceInfo>({
    queryKey: ["coinPrice", coinId],
    queryFn: () => fetchCoinTickers(coinId),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  const chartMatch = useMatch("/:coinId/chart");
  const priceMatch = useMatch("/:coinId/price");
  console.log(chartMatch, priceMatch);
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name
            ? state.name
            : infoLoading
            ? "Loading..."
            : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name
            ? state.name
            : infoLoading
            ? "Loading.."
            : infoData?.name}
        </Title>
      </Header>
      {infoLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>Rank:</span>
              <span>{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Symbol:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>Price:</span>
              <span>${priceData?.quotes.USD.price.toFixed(3)}</span>
            </OverviewItem>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <OverviewItem>
              <span>Totla Suply:</span>
              <span>
                <NumericFormat
                  value={priceData?.total_supply}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </span>
            </OverviewItem>
            <OverviewItem>
              <span>Max Suply:</span>
              <span>
                <NumericFormat
                  value={priceData?.max_supply}
                  displayType={"text"}
                  thousandSeparator={true}
                />
              </span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab $isActive={chartMatch !== null}>
              <Link to={"chart"}>Chart</Link>
            </Tab>
            <Tab $isActive={priceMatch !== null}>
              <Link to={"price"}>Price</Link>
            </Tab>
          </Tabs>
          <Outlet />
        </>
      )}
    </Container>
  );
}
