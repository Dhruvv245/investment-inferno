import "@babel/polyfill";
import { createChart } from "lightweight-charts";
import io from "socket.io-client";

function calculateSMA(data, windowSize) {
  let rAvg = [];
  for (let i = 0; i < data.length - windowSize + 1; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += data[i + j].close;
    }
    rAvg.push({ time: data[i + windowSize - 1].time, value: sum / windowSize });
  }
  return rAvg;
}

function calculateRSI(data, windowSize) {
  let diff = data.map((a, i, arr) => (i > 0 ? a.close - arr[i - 1].close : 0));
  let gains = diff.map((a) => (a > 0 ? a : 0));
  let losses = diff.map((a) => (a < 0 ? Math.abs(a) : 0));

  let avgGain = [];
  let avgLoss = [];

  for (let i = 0; i < data.length; i++) {
    if (i < windowSize) {
      avgGain[i] = (i > 0 ? avgGain[i - 1] * (i - 1) : 0) + gains[i];
      avgLoss[i] = (i > 0 ? avgLoss[i - 1] * (i - 1) : 0) + losses[i];
      if (i === windowSize - 1) {
        avgGain[i] /= windowSize;
        avgLoss[i] /= windowSize;
      }
    } else {
      avgGain[i] = (avgGain[i - 1] * (windowSize - 1) + gains[i]) / windowSize;
      avgLoss[i] = (avgLoss[i - 1] * (windowSize - 1) + losses[i]) / windowSize;
    }
  }

  let rs = avgGain.map((a, i) => (avgLoss[i] !== 0 ? a / avgLoss[i] : 0));
  let rsi = rs.map((a) => 100 - 100 / (1 + a));

  return rsi.map((a, i) => ({ time: data[i].time, value: a }));
}

function calculateEMA(data, windowSize) {
  let multiplier = 2 / (windowSize + 1);
  let emaArray = [{ time: data[0].time, value: data[0].close }];

  for (let i = 1; i < data.length; i++) {
    let ema =
      (data[i].close - emaArray[i - 1].value) * multiplier +
      emaArray[i - 1].value;
    emaArray.push({ time: data[i].time, value: ema });
  }

  return emaArray;
}
function calculateMACD(data, shortPeriod, longPeriod, signalPeriod) {
  let shortEMA = calculateEMA(data, shortPeriod);
  let longEMA = calculateEMA(data, longPeriod);

  let MACDLine = shortEMA.map((ema, i) => ({
    time: ema.time,
    value: ema.value - (longEMA[i] ? longEMA[i].value : 0),
  }));

  let signalLine = calculateEMA(MACDLine, signalPeriod);

  return { MACDLine, signalLine };
}

const socket = io();

let chart = createChart(document.getElementById("chart"), {
  width: 800,
  height: 600,
  layout: {
    backgroundColor: "#253248",
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    vertLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
    horzLines: {
      color: "rgba(197, 203, 206, 0.5)",
    },
  },
});

let candleSeries = chart.addCandlestickSeries({
  upColor: "rgba(0, 150, 136, 1)",
  downColor: "rgba(255, 82, 82, 1)",
  wickUpColor: "rgba(0, 150, 136, 1)",
  wickDownColor: "rgba(255, 82, 82, 1)",
});

let lineSeries = chart.addLineSeries(); // Main chart data series
let smaSeries = chart.addLineSeries({
  color: "rgba(4, 111, 232, 1)",
  lineWidth: 2,
}); // SMA line series
let emaSeries = chart.addLineSeries({
  color: "rgba(255, 165, 0, 1)",
  lineWidth: 2,
});
let rsiSeries = chart.addLineSeries({
  color: "rgba(165, 42, 42, 1)",
  lineWidth: 2,
});
let macdSeries = chart.addLineSeries({
  color: "rgba(255, 0, 0, 1)",
  lineWidth: 2,
});
const stockNum = document.getElementById(`chartContainer`).dataset.stocknum;
socket.emit(`join`, stockNum);

socket.on("stockData", (data) => {
  if (stockNum == data.stockNum) {
    const newData = data.data.map((stockData, i) => {
      const timeInSeconds = Math.floor(Date.now() / 1000) + i * 15;
      return {
        time: timeInSeconds,
        open: stockData.OPEN,
        high: stockData.HIGH,
        low: stockData.LOW,
        close: stockData.CLOSE,
      };
    });

    candleSeries.setData(newData);
    lineSeries.setData(newData);
    const smaData = calculateSMA(newData, 14);
    const emaData = calculateEMA(newData, 14);
    const rsiData = calculateRSI(newData, 14); // 14 is the window size for the RSI
    const macdData = calculateMACD(newData, 12, 26, 9); // 12, 26, 9 are the typical periods used for MACD
    macdSeries.setData(macdData.MACDLine);
    rsiSeries.setData(rsiData); // 14 is the window size for the EMA
    smaSeries.setData(smaData);
    emaSeries.setData(emaData); // 14 is the window size for the SMA
  }
});
