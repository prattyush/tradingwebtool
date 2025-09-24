import {useRef, useEffect, useState} from "react";
import {createChart, LineSeries, CandlestickSeries, LineStyle, createSeriesMarkers} from "lightweight-charts";
import { useNavigate } from 'react-router-dom';
import OrderInput from "./OrderInput";
import {useLocation} from 'react-router-dom';
import {useReactMediaRecorder} from "react-media-recorder";
import {getWindowDimensions, orderTypeOptions, tradestrategyoptions} from "./StrategyVariables";
import OrderInputTrade from "./OrderInputTrade";

const ChartTrade = () => {

    const location = useLocation();
    const ipAddress = location.state['ipAddress'];
    const chartTime = useRef(null);
    const [orderInfo, setOrderInfo] = useState("OrderInfo")
    const orderIdMarkerPrimitiveMap = useRef(new Map());

    const {width, height} = getWindowDimensions()
    const tradingStyle = location.state['tradingStyle'];
    const replaySpeed = location.state['replaySpeed'];
    const websocketPort = location.state['port'];
    const tradeDate = location.state['tradeDate'];
    const ceStrikePrice = location.state['ceStrikePrice'];
    const peStrikePrice = location.state['peStrikePrice'];
    const rangeHigh = location.state['rangeHigh'];
    const rangeLow = location.state['rangeLow'];
    const isRecording = useRef(false);
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ screen: true, video:true }); // Set screen: true for screen recording

    const optionsChartWidth = 0.48
    const stockChartWidth = 0.97

    const optionsChartHeight = 0.40
    const stockChartHeight = 0.40

    const nineEMALine = []
    const twentyOneEMALine = []
    let nineEMALineCE = []
    let twentyOneEMALineCE = []

    let nineEMALinePE = []
    let twentyOneEMALinePE = []

    const multiplierNineEMA = 2 / (9 + 1)
    const multiplierTwentyOneEMA = 2 / (21 + 1)
    const lineSeriesNineEMA = useRef(null);
    const lineSeriesTwentyOneEMA = useRef(null);
    const lineSeriesNineCEEMA = useRef(null);
    const lineSeriesTwentyOneCEEMA = useRef(null);
    const lineSeriesNinePEEMA = useRef(null);
    const lineSeriesTwentyOnePEEMA = useRef(null);

    const timeInfoLegend = useRef(null);

    const navigate = useNavigate();
    const chartContainerNifty = useRef(null);
    const chartContainerCE = useRef(null);
    const chartContainerPE = useRef(null);

    const candlestickSeriesNifty = useRef(null);
    const candlestickSeriesCE = useRef(null);
    const candlestickSeriesPE = useRef(null);

    const chartNifty = useRef(null);
    const chartCE = useRef(null);
    const chartPE = useRef(null);

    const currentBarLastOpenNifty = useRef(0);
    const currentBarLastCloseNifty = useRef(null);
    const currentBarLastHighNifty = useRef(0);
    const currentBarLastLowNifty = useRef(1000000);
    const currentBarTimeNifty = useRef(null);

    const currentBarLastOpenCE = useRef(0);
    const currentBarLastCloseCE = useRef(null);
    const currentBarLastHighCE = useRef(0);
    const currentBarLastLowCE = useRef(100000);
    const currentBarTimeCE = useRef(null);

    const currentBarLastOpenPE = useRef(0);
    const currentBarLastClosePE = useRef(null);
    const currentBarLastHighPE = useRef(0);
    const currentBarLastLowPE = useRef(100000);
    const currentBarTimePE = useRef(null);

    const socket = new WebSocket('ws://' + ipAddress + ':' + websocketPort);
    socket.onopen = () => {
        console.log('WebSocket connection opened');
    };

    const chartPropertiesNifty = {
        layout: {
            textColor: "white",
            background: { type: "solid", color: "black" }
        },
        autosize: true,
    };

    const chartPropertiesOptions = {
        layout: {
            textColor: "white",
            background: { type: "solid", color: "black" },
        },
        autosize: true,
    };

    useEffect(() => {
        timeInfoLegend.current = document.createElement('div');
        timeInfoLegend.current.style = `clear:both; float:right; z-index: 2; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
        chartContainerNifty.current.appendChild(timeInfoLegend.current);

        chartNifty.current = createChart(chartContainerNifty.current, chartPropertiesNifty);
        chartNifty.current.resize(window.innerWidth*stockChartWidth, window.innerHeight*stockChartHeight)
        chartCE.current = createChart(chartContainerCE.current, chartPropertiesOptions);
        chartCE.current.resize(window.innerWidth*optionsChartWidth, window.innerHeight*optionsChartHeight)
        chartPE.current = createChart(chartContainerPE.current, chartPropertiesOptions);
        chartPE.current.resize(window.innerWidth*optionsChartWidth, window.innerHeight*optionsChartHeight);

        candlestickSeriesNifty.current = chartNifty.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        candlestickSeriesCE.current = chartCE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        candlestickSeriesPE.current = chartPE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});

        lineSeriesNineEMA.current = chartNifty.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
        lineSeriesTwentyOneEMA.current = chartNifty.current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

        lineSeriesNineCEEMA.current = chartCE.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
        lineSeriesTwentyOneCEEMA.current = chartCE.current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

        lineSeriesNinePEEMA.current = chartPE.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
        lineSeriesTwentyOnePEEMA.current = chartPE.current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

        const chartOptions = {
            timeScale: {
                timeVisible: true,
            },
            grid: {
                vertLines: {
                    style: LineStyle.SparseDotted,
                    visible: true,
                },
                horzLines: {
                    style: LineStyle.SparseDotted,
                    visible: true,
                },
            },
        }

        chartNifty.current.applyOptions(chartOptions);
        chartNifty.current.timeScale().fitContent();

        chartCE.current.applyOptions(chartOptions);
        chartCE.current.timeScale().fitContent();

        chartPE.current.applyOptions(chartOptions);
        chartPE.current.timeScale().fitContent();

        window.addEventListener("load", () => {
            chartNifty.current.resize(window.innerWidth*stockChartWidth, window.innerHeight*stockChartHeight)
            chartCE.current.resize(window.innerWidth*optionsChartWidth, window.innerHeight*optionsChartHeight)
            chartPE.current.resize(window.innerWidth*optionsChartWidth, window.innerHeight*optionsChartHeight)
        });
        return () => {
            chartNifty.current.remove();
            chartCE.current.remove();
            chartPE.current.remove();
        };
    }, []);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.hasOwnProperty('prev_data')) {
            const stockDataArray = data['prev_data']['stock']
            const ceDataArray = data['prev_data']['ce']
            const peDataArray = data['prev_data']['pe']

            nineEMALine.push({time:stockDataArray[0]['time'], value: stockDataArray[0]['close']})
            twentyOneEMALine.push({time:stockDataArray[0]['time'], value: stockDataArray[0]['close']})

            for (let i = 1; i < stockDataArray.length; i++) {
                const nineEMAValue = stockDataArray[i]['close'] * multiplierNineEMA + nineEMALine[i-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValue = stockDataArray[i]['close'] * multiplierTwentyOneEMA + twentyOneEMALine[i-1]['value'] * (1-multiplierTwentyOneEMA)
                nineEMALine.push({time:stockDataArray[i]['time'], value: nineEMAValue})
                twentyOneEMALine.push({time:stockDataArray[i]['time'], value: twentyOneEMAValue})
            }

            nineEMALineCE.push({time:ceDataArray[0]['time'], value: ceDataArray[0]['close']})
            twentyOneEMALineCE.push({time:ceDataArray[0]['time'], value: ceDataArray[0]['close']})

            nineEMALinePE.push({time:peDataArray[0]['time'], value: peDataArray[0]['close']})
            twentyOneEMALinePE.push({time:peDataArray[0]['time'], value: peDataArray[0]['close']})

            for (let i = 1; i < ceDataArray.length; i++) {
                const nineEMAValueCE = ceDataArray[i]['close'] * multiplierNineEMA + nineEMALineCE[i-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValueCE = ceDataArray[i]['close'] * multiplierTwentyOneEMA + twentyOneEMALineCE[i-1]['value'] * (1-multiplierTwentyOneEMA)
                nineEMALineCE.push({time:ceDataArray[i]['time'], value: nineEMAValueCE})
                twentyOneEMALineCE.push({time:ceDataArray[i]['time'], value: twentyOneEMAValueCE})
            }

            for (let i = 1; i < peDataArray.length; i++) {
                const nineEMAValuePE = peDataArray[i]['close'] * multiplierNineEMA + nineEMALinePE[i-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValuePE = peDataArray[i]['close'] * multiplierTwentyOneEMA + twentyOneEMALinePE[i-1]['value'] * (1-multiplierTwentyOneEMA)
                nineEMALinePE.push({time:peDataArray[i]['time'], value: nineEMAValuePE})
                twentyOneEMALinePE.push({time:peDataArray[i]['time'], value: twentyOneEMAValuePE})
            }

            currentBarLastOpenNifty.current = 0
            candlestickSeriesNifty.current.setData(stockDataArray)
            candlestickSeriesCE.current.setData(ceDataArray)
            candlestickSeriesPE.current.setData(peDataArray)

            lineSeriesNineEMA.current.setData(nineEMALine)
            lineSeriesTwentyOneEMA.current.setData(twentyOneEMALine)

            lineSeriesNineCEEMA.current.setData(nineEMALineCE)
            lineSeriesTwentyOneCEEMA.current.setData(twentyOneEMALineCE)

            lineSeriesNinePEEMA.current.setData(nineEMALinePE)
            lineSeriesTwentyOnePEEMA.current.setData(twentyOneEMALinePE)
        } else {
            const stockData = data['stock']
            const ceData = data['ce']
            const peData = data['pe']

            let ordersData = null
            if (data.hasOwnProperty('orders')) {
                ordersData = data['orders']
                console.log("Orders Data")
                console.log(ordersData)
            }

            const barEpochTimeStock = stockData['time']
            const barEpochTimeCE = ceData['time']
            const barEpochTimePE = peData['time']

            const barTimeDateStock = new Date(barEpochTimeStock * 1000)
            const barTimeDateCE = new Date(barEpochTimeCE * 1000)
            const barTimeDatePE = new Date(barEpochTimePE * 1000)

            chartTime.current = barTimeDateStock.getHours() + ":" + barTimeDateStock.getMinutes() + ":" + barTimeDateStock.getSeconds()

            const oldTimeStock = new Date(currentBarTimeNifty.current * 1000)
            if ((currentBarLastOpenNifty.current === 0) || (Math.floor(barTimeDateStock.getMinutes()/3) !== Math.floor(oldTimeStock.getMinutes()/3))) {
                currentBarTimeNifty.current = Math.floor(barEpochTimeStock/180)*180
                currentBarLastOpenNifty.current = stockData['open']
                currentBarLastLowNifty.current = stockData['low']
                currentBarLastHighNifty.current = stockData['high']

                const nineEMAValue = stockData['close'] * multiplierNineEMA + nineEMALine[nineEMALine.length-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValue = stockData['close'] * multiplierTwentyOneEMA + twentyOneEMALine[twentyOneEMALine.length-1]['value'] * (1-multiplierTwentyOneEMA)

                if (nineEMALine[nineEMALine.length-1]['time']  !== currentBarTimeNifty.current) {
                    nineEMALine.push({time:currentBarTimeNifty.current, value: nineEMAValue})
                    twentyOneEMALine.push({time:currentBarTimeNifty.current, value: twentyOneEMAValue})
                }

                //lineSeriesNineEMA.current.update({time:currentBarTimeNifty.current, value: tempNineEMALine[tempNineEMALine.length-1]}, false)
                //lineSeriesTwentyOneEMA.current.update({time:currentBarTimeNifty.current, value: tempTwentyOneEMALine[tempTwentyOneEMALine.length-1]}, false)

                lineSeriesNineEMA.current.setData(nineEMALine)
                lineSeriesTwentyOneEMA.current.setData(twentyOneEMALine)
            }
            const oldTimeCE = new Date(currentBarTimeCE.current * 1000)
            if ((currentBarLastOpenCE.current === 0) || (Math.floor(barTimeDateCE.getMinutes()/3) !== Math.floor(oldTimeCE.getMinutes()/3))) {
                currentBarTimeCE.current = Math.floor(barEpochTimeCE / 180) * 180
                currentBarLastOpenCE.current = ceData['open']
                currentBarLastLowCE.current = ceData['low']
                currentBarLastHighCE.current = ceData['high']

                const nineEMAValue = ceData['close'] * multiplierNineEMA + nineEMALineCE[nineEMALineCE.length-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValue = ceData['close'] * multiplierTwentyOneEMA + twentyOneEMALineCE[twentyOneEMALineCE.length-1]['value'] * (1-multiplierTwentyOneEMA)

                if (nineEMALineCE[nineEMALineCE.length-1]['time']  !== currentBarTimeCE.current) {
                    nineEMALineCE.push({time: currentBarTimeCE.current, value: nineEMAValue})
                    twentyOneEMALineCE.push({time: currentBarTimeCE.current, value: twentyOneEMAValue})
                }
                lineSeriesNineCEEMA.current.setData(nineEMALineCE)
                lineSeriesTwentyOneCEEMA.current.setData(twentyOneEMALineCE)
            }

            const oldTimePE = new Date(currentBarTimePE.current * 1000)
            if ((currentBarLastOpenPE.current === 0) || (Math.floor(barTimeDatePE.getMinutes()/3) !== Math.floor(oldTimePE.getMinutes()/3))) {
                currentBarTimePE.current = Math.floor(barEpochTimePE / 180) * 180
                currentBarLastOpenPE.current = peData['open']
                currentBarLastLowPE.current = peData['low']
                currentBarLastHighPE.current = peData['high']

                const nineEMAValue = peData['close'] * multiplierNineEMA + nineEMALinePE[nineEMALinePE.length-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValue = peData['close'] * multiplierTwentyOneEMA + twentyOneEMALinePE[twentyOneEMALinePE.length-1]['value'] * (1-multiplierTwentyOneEMA)

                if (nineEMALinePE[nineEMALinePE.length-1]['time']  !== currentBarTimePE.current) {
                    nineEMALinePE.push({time: currentBarTimePE.current, value: nineEMAValue})
                    twentyOneEMALinePE.push({time: currentBarTimePE.current, value: twentyOneEMAValue})
                }
                lineSeriesNinePEEMA.current.setData(nineEMALinePE)
                lineSeriesTwentyOnePEEMA.current.setData(twentyOneEMALinePE)
            }

            currentBarLastCloseNifty.current = stockData['close']
            currentBarLastCloseCE.current = ceData['close']
            currentBarLastClosePE.current = peData['close']

            currentBarLastLowNifty.current = Math.min(currentBarLastLowNifty.current, stockData['low'])
            currentBarLastHighNifty.current = Math.max(currentBarLastHighNifty.current, stockData['high'])

            currentBarLastLowCE.current = Math.min(currentBarLastLowCE.current, ceData['low'])
            currentBarLastHighCE.current = Math.max(currentBarLastHighCE.current, ceData['high'])

            currentBarLastLowPE.current = Math.min(currentBarLastLowPE.current, peData['low'])
            currentBarLastHighPE.current = Math.max(currentBarLastHighPE.current, peData['high'])

            const displayTimeStock = currentBarTimeNifty.current
            const displayTimeCE = currentBarTimeCE.current
            const displayTimePE = currentBarTimePE.current
            try {
                const candleDataUpdateNifty =
                    {
                        open: currentBarLastOpenNifty.current,
                        high: currentBarLastHighNifty.current,
                        low: currentBarLastLowNifty.current,
                        close: currentBarLastCloseNifty.current,
                        time: displayTimeStock
                    };
                candlestickSeriesNifty.current.update(candleDataUpdateNifty, false);
                timeInfoLegend.current.innerHTML = formatTimeLocale(stockData['time'])

                const candleDataUpdatePE =
                    {
                        open: currentBarLastOpenPE.current,
                        high: currentBarLastHighPE.current,
                        low: currentBarLastLowPE.current,
                        close: currentBarLastClosePE.current,
                        time: displayTimePE
                    };
                candlestickSeriesPE.current.update(candleDataUpdatePE, false);

                const candleDataUpdateCE =
                    {
                        open: currentBarLastOpenCE.current,
                        high: currentBarLastHighCE.current,
                        low: currentBarLastLowCE.current,
                        close: currentBarLastCloseCE.current,
                        time: displayTimeCE
                    };
                candlestickSeriesCE.current.update(candleDataUpdateCE, false);

                if (ordersData !== null) {
                    console.log(ordersData)
                    plotOrders(ordersData)
                }
            } catch (error) {
                console.error("Caught error in updating series:", error);
            }
        }
    };

    function formatTimeLocale(barTime) {
        const barDate = new Date((barTime - (5.5*60*60)) *1000)
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false, second:'2-digit' }; // Use hour12: false for 24-hour format
        const formattedTime = barDate.toLocaleTimeString('en-GB', timeOptions);

        return `${formattedTime}`;
    }

    const onCEFeedReset = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/cefeedreset?rlow=' + rangeLow + "&rhigh=" + rangeHigh, {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': 'true'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const ceDataArray = data['response']['prev_data']

                nineEMALineCE = []
                twentyOneEMALineCE = []

                nineEMALineCE.push({time:ceDataArray[0]['time'], value: ceDataArray[0]['close']})
                twentyOneEMALineCE.push({time:ceDataArray[0]['time'], value: ceDataArray[0]['close']})

                for (let i = 1; i < ceDataArray.length; i++) {
                    const nineEMAValueCE = ceDataArray[i]['close'] * multiplierNineEMA + nineEMALineCE[i-1]['value'] * (1-multiplierNineEMA)
                    const twentyOneEMAValueCE = ceDataArray[i]['close'] * multiplierTwentyOneEMA + twentyOneEMALineCE[i-1]['value'] * (1-multiplierTwentyOneEMA)
                    nineEMALineCE.push({time:ceDataArray[i]['time'], value: nineEMAValueCE})
                    twentyOneEMALineCE.push({time:ceDataArray[i]['time'], value: twentyOneEMAValueCE})
                }
                candlestickSeriesCE.current.setData(ceDataArray);

                lineSeriesNineCEEMA.current.setData(nineEMALineCE)
                lineSeriesTwentyOneCEEMA.current.setData(twentyOneEMALineCE)
                currentBarLastOpenCE.current = 0

                chartCE.current.timeScale().fitContent();
                // Handle data
            }).catch((err) => {
            console.log(err.message);
        });
    }

    const onPEFeedReset = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/pefeedreset?rlow=' + rangeLow + "&rhigh=" + rangeHigh, {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin': 'true'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const peDataArray = data['response']['prev_data']

                nineEMALinePE = []
                twentyOneEMALinePE = []

                nineEMALinePE.push({time:peDataArray[0]['time'], value: peDataArray[0]['close']})
                twentyOneEMALinePE.push({time:peDataArray[0]['time'], value: peDataArray[0]['close']})

                for (let i = 1; i < peDataArray.length; i++) {
                    const nineEMAValuePE = peDataArray[i]['close'] * multiplierNineEMA + nineEMALinePE[i-1]['value'] * (1-multiplierNineEMA)
                    const twentyOneEMAValuePE = peDataArray[i]['close'] * multiplierTwentyOneEMA + twentyOneEMALinePE[i-1]['value'] * (1-multiplierTwentyOneEMA)
                    nineEMALinePE.push({time:peDataArray[i]['time'], value: nineEMAValuePE})
                    twentyOneEMALinePE.push({time:peDataArray[i]['time'], value: twentyOneEMAValuePE})
                }
                candlestickSeriesPE.current.setData(peDataArray);

                lineSeriesNinePEEMA.current.setData(nineEMALinePE)
                lineSeriesTwentyOnePEEMA.current.setData(twentyOneEMALinePE)
                currentBarLastOpenPE.current = 0

                chartPE.current.timeScale().fitContent();
            }).catch((err) => {
            console.log(err.message);
        });
    }

    function plotOrders(ordersData) {
        console.log(ordersData)

        const orderCEMarkers = []
        const orderPEMarkers = []
        const markerSize = 0.1;

        for (let i = 0; i < ordersData.length; i++) {
            let shape = 'circle'
            let color = '#0000FF'
            let text = 'Buy'
            let stockText = 'Buy'
            let stockColor = '#0000FF'
            let orderMarker = null
            const orderId = parseInt(ordersData[i]['order_id']).toString()
            if (ordersData[i]['action'] === 'Sell') {
                shape = 'circle';
                if (ordersData[i]['status'] === "Ordered") {
                    text = 'SL'
                } else {
                    text = 'Sell'
                }
                color = '#ffffff'
                stockColor = '#ffffff'
                stockText = 'Sell'
            }
            if (ordersData[i]['action'] === 'Sell' && ordersData[i]['type'] === 'Put') {
                stockColor = '#2196F3'
                stockText = 'Buy'
            }
            if (ordersData[i]['action'] === 'Buy' && ordersData[i]['type'] === 'Put') {
                stockColor = '#e91e63'
                stockText = 'Sell'
            }
            if (ordersData[i]['type'] === 'Call' && parseInt(ordersData[i]['strike_price']) === parseInt(ceStrikePrice)) {
                orderMarker = {
                    time: ordersData[i]['time'],
                    price: ordersData[i]['price'],
                    position: 'atPriceMiddle',
                    color: color,
                    size: markerSize,
                    shape: shape,
                    text: text
                }
                console.log("Order Id " + orderId)
                console.log("CE Markers Map")
                console.log(orderIdMarkerPrimitiveMap.current)
                if (orderIdMarkerPrimitiveMap.current.has(orderId)) {
                    console.log("Deleting Old CE Markers")
                    orderIdMarkerPrimitiveMap.current.get(orderId).setMarkers([]);
                    orderIdMarkerPrimitiveMap.current.get(orderId).detach();
                }
                orderIdMarkerPrimitiveMap.current.set(orderId, createSeriesMarkers(candlestickSeriesCE.current, [orderMarker]))
            } else if (ordersData[i]['type'] === 'Put' && parseInt(ordersData[i]['strike_price']) === parseInt(peStrikePrice)) {
                orderMarker = {
                    time: ordersData[i]['time'],
                    price: ordersData[i]['price'],
                    position: 'atPriceMiddle',
                    color: color,
                    size: markerSize,
                    shape: shape,
                    text: text
                }
                console.log("Order Id " + orderId)
                console.log("PE Markers Map")
                console.log(orderIdMarkerPrimitiveMap.current)
                if (orderIdMarkerPrimitiveMap.current.has(orderId)) {
                    console.log("Deleting Old PE Markers")
                    orderIdMarkerPrimitiveMap.current.get(orderId).setMarkers([]);
                    orderIdMarkerPrimitiveMap.current.get(orderId).detach();
                }
                orderIdMarkerPrimitiveMap.current.set(orderId, createSeriesMarkers(candlestickSeriesPE.current, [orderMarker]))
            }
        }
    }

    const onOrderOptionsChartCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/orderoptionschart', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const ordersData = data['response']['orders']
                console.log(ordersData)
                plotOrders(ordersData)
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onReset = (event) => {
        event.preventDefault();
        downloadRecording(event);
        if (!isRecording.current) {
            fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/reset', {
                method: 'POST',
                body: JSON.stringify({
                    // Add parameters here
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Access-Control-Allow-Origin': 'true'
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    socket.close()
                    // Handle data
                }).then(() => socket.close())
                .catch((err) => {
                    socket.close()
                    console.log(err.message);
                });
            navigate('/');
        }
    }

    const triggerRecording = (event) => {
        startRecording();
        isRecording.current = true;
    }

    const downloadRecording = (event) => {
        if (isRecording.current) {
            stopRecording();
            if (mediaBlobUrl) {
                const min = 1;
                const max = 100;
                const rand = Math.floor(min + Math.random() * (max - min)).toFixed(0);

                const link = document.createElement('a');
                link.href = mediaBlobUrl;
                link.download =  tradingStyle + '_' + tradeDate + '_recorded_media_' + rand.toString() + '.webm';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(mediaBlobUrl);
                isRecording.current = false;
            }
        }
    };

    const onOpenOrderInfo = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/openorderstate/', {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setOrderInfo(data['response'])
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onOrderInfo = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/orderstate/', {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setOrderInfo(data['response'])
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    return (
        <div>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={triggerRecording} title="StartRecord">Record</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={downloadRecording} title="StopRecord">StopRecord</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button"  onClick={onReset} title="Return">Reset</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button"  onClick={onCEFeedReset} title="CEReset">CEFeedReset</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button"  onClick={onPEFeedReset} title="PEReset">PEFeedReset</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button"  onClick={onOrderOptionsChartCommandPlaced} title="OptionsOrderChart">OrderChart</button>
            <label style={{float:"left", marginTop:'1%', marginLeft:'1%'}}>CE :: {ceStrikePrice} PE :: {peStrikePrice}</label>
            <div style={{clear:"both", float:"left", width:width*0.99, height: height*0.84, border: '1px solid black'}}>
                <div style={{clear:"both", float:"left", marginLeft:'0.5%', marginRight:'0.5%', width:'98%', height:height*stockChartHeight}} id="stockChartContainer" ref={chartContainerNifty}></div>
                <div style={{clear:"both", float:"left", marginLeft:'0.5%', marginTop:"1.25%", marginRight:'0.5%', width:'49%',height:height*optionsChartHeight}} ref={chartContainerCE} id="chartContainerCE"></div>
                <div style={{float:"left", marginTop:"1.25%", marginLeft:'0.2%', height:height*optionsChartHeight}} ref={chartContainerPE} id="chartContainerPE"></div>
            </div>
            <div style={{float:"left", width:'96%', height:'10%', marginLeft:'1%',  border: '1px solid black'}} >
                <OrderInputTrade tradingStyle={tradingStyle} ipAddress={ipAddress} replaySpeed={replaySpeed} ceStrikePrice={ceStrikePrice} peStrikePrice={peStrikePrice} tradeDate={tradeDate}/>
            </div>
        </div>
    );


};

export default ChartTrade;