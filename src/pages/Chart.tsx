import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ApexChart from "react-apexcharts";

import { fetchCoinHistory } from "../core/services/api";
import { IHistoryInfo } from "../types";

export default function Chart() {
  const { coinId } = useParams();

  const { isLoading, data } = useQuery<IHistoryInfo[]>({
    queryKey: ["coinHistory", coinId],
    queryFn: () => fetchCoinHistory(coinId),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
  });

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "Price",
              data: (data || []).map((price) => price.close),
            },
          ]}
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: { show: false },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: false },
              type: "datetime",
              categories: data?.map((price) => price.time_close),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </div>
  );
}
