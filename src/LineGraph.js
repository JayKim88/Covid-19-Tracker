import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  title: {
    display: true,
    text:''
  },
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return;
      },
    },
  },
  hover:{
    mode:'nearest',
    intersect:true
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
        gridLines: {
         display: false
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("1a");
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          // console.log(data)
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          // console.log(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className="app__graph">
      {data?.length > 0 && (
        //! Line with options not working. Mouse-over and label still showing
        <Bar
          data={{
            datasets: [
              {
                backgroundColor: "#c95c47",
                borderColor: "#CC1034",
                data: data,
                label: `New ${casesType}`,
                hoverBackgroundColor: "black",
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;