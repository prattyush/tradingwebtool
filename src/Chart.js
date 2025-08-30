import {useRef, useEffect, useState} from "react";
import {createChart, LineSeries, CandlestickSeries, LineStyle} from "lightweight-charts";
import { useNavigate } from 'react-router-dom';
import OrderInput from "./OrderInput";
import {useLocation} from 'react-router-dom';
import {useReactMediaRecorder} from "react-media-recorder";

const Chart = () => {

    const location = useLocation();
    const ipAddress = location.state['ipAddress'];
    const chartTime = useRef(null);
    const tradingStyle = location.state['tradingStyle'];
    const [ceStrikePrice, setCEStrikePrice] = useState(location.state['ceStrikePrice']);
    const [peStrikePrice, setPEStrikePrice] = useState(location.state['peStrikePrice']);
    const replaySpeed = location.state['replaySpeed'];
    const websocketPort = location.state['port'];
    const tradeDate = location.state['tradeDate'];
    const rangeHigh = location.state['rangeHigh'];
    const rangeLow = location.state['rangeLow'];
    const isRecording = useRef(false);
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ screen: true, video:true }); // Set screen: true for screen recording


    const nineEMALine = []
    const twentyOneEMALine = []
    const multiplierNineEMA = 2 / (9 + 1)
    const multiplierTwentyOneEMA = 2 / (21 + 1)
    const lineSeriesNineEMA = useRef(null);
    const lineSeriesTwentyOneEMA = useRef(null);

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
        timeInfoLegend.current.style = `float:right; clear:both; z-index: 2; font-size: 14px; font-family: sans-serif; line-height: 18px; font-weight: 300;`;
        chartContainerNifty.current.appendChild(timeInfoLegend.current);

        chartNifty.current = createChart(chartContainerNifty.current, chartPropertiesNifty);
        chartNifty.current.resize(window.innerWidth*0.68, window.innerHeight*0.5)
        chartCE.current = createChart(chartContainerCE.current, chartPropertiesOptions);
        chartCE.current.resize(window.innerWidth*0.33, window.innerHeight*0.45)
        chartPE.current = createChart(chartContainerPE.current, chartPropertiesOptions);
        chartPE.current.resize(window.innerWidth*0.33, window.innerHeight*0.45);



        candlestickSeriesNifty.current = chartNifty.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        candlestickSeriesCE.current = chartCE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        candlestickSeriesPE.current = chartPE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});

        lineSeriesNineEMA.current = chartNifty.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
        lineSeriesTwentyOneEMA.current = chartNifty.current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

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
            chartNifty.current.resize(window.innerWidth*0.68, window.innerHeight*0.5)
            chartCE.current.resize(window.innerWidth*0.33, window.innerHeight*0.5)
            chartPE.current.resize(window.innerWidth*0.33, window.innerHeight*0.5)
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

            currentBarLastOpenNifty.current = 0
            candlestickSeriesNifty.current.setData(stockDataArray)
            candlestickSeriesCE.current.setData(ceDataArray)
            candlestickSeriesPE.current.setData(peDataArray)

            lineSeriesNineEMA.current.setData(nineEMALine)
            lineSeriesTwentyOneEMA.current.setData(twentyOneEMALine)
        } else {
            const stockData = data['stock']
            const ceData = data['ce']
            const peData = data['pe']

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

                nineEMALine.push({time:currentBarTimeNifty.current, value: nineEMAValue})
                twentyOneEMALine.push({time:currentBarTimeNifty.current, value: twentyOneEMAValue})
                lineSeriesNineEMA.current.update({time:currentBarTimeNifty.current, value: nineEMAValue}, false)
                lineSeriesTwentyOneEMA.current.update({time:currentBarTimeNifty.current, value: twentyOneEMAValue}, false)
            }
            const oldTimeCE = new Date(currentBarTimeCE.current * 1000)
            if ((currentBarLastOpenCE.current === 0) || (Math.floor(barTimeDateCE.getMinutes()/3) !== Math.floor(oldTimeCE.getMinutes()/3))) {
                currentBarTimeCE.current = Math.floor(barEpochTimeCE/180)*180
                currentBarLastOpenCE.current = ceData['open']
                currentBarLastLowCE.current = ceData['low']
                currentBarLastHighCE.current = ceData['high']
            }

            const oldTimePE = new Date(currentBarTimePE.current * 1000)
            if ((currentBarLastOpenPE.current === 0) || (Math.floor(barTimeDatePE.getMinutes()/3) !== Math.floor(oldTimePE.getMinutes()/3))) {
                currentBarTimePE.current = Math.floor(barEpochTimePE/180)*180
                currentBarLastOpenPE.current = peData['open']
                currentBarLastLowPE.current = peData['low']
                currentBarLastHighPE.current = peData['high']
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
                const ceDataArray = data['prev_data']
                candlestickSeriesCE.current.setData(ceDataArray);
                currentBarLastOpenCE.current = 0
                setCEStrikePrice(data['ce_strike_price'])
                chartCE.current.timeScale().fitContent();
                // Handle data
            }).then(() => socket.close())
            .catch((err) => {
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
                console.log(data);
                const peDataArray = data['prev_data']
                candlestickSeriesPE.current.setData(peDataArray);
                currentBarLastOpenPE.current = 0
                setPEStrikePrice(data['pe_strike_price'])
                chartPE.current.timeScale().fitContent();
                // Handle data
            }).then(() => socket.close())
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

    return (
        <div>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={triggerRecording} title="StartRecord">Record</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={downloadRecording} title="StopRecord">StopRecord</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button"  onClick={onReset} title="Return">Reset</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button"  onClick={onCEFeedReset} title="CEReset">CEFeedReset</button>
            <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button"  onClick={onPEFeedReset} title="PEReset">PEFeedReset</button>
            <label style={{float:"left", marginTop:'1%', marginLeft:'1%'}}>CE :: {ceStrikePrice} PE :: {peStrikePrice}</label>
            <div style={{clear:"both", float:"left", marginLeft:'1%', width:'70%', height:'96%', border: '1px solid black'}}>
                <div style={{clear:"both", float:"left", marginLeft:'1%', width:'98%', height:'35%'}} id="stockChartContainer" ref={chartContainerNifty}></div>
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginTop:"1%", marginRight:'1%'}} ref={chartContainerCE} id="chartContainerCE"></div>
                <div style={{float:"left", marginTop:"1%", marginLeft:'0.5%'}} ref={chartContainerPE}></div>
            </div>
            <div style={{float:"left", width:'25%', height:'90%', marginLeft:'1%'}} ><OrderInput tradingStyle={tradingStyle} ipAddress={ipAddress} replaySpeed={replaySpeed} ceStrikePrice={ceStrikePrice} peStrikePrice={peStrikePrice} tradeDate={tradeDate}/></div>
        </div>
    );


};

export default Chart;