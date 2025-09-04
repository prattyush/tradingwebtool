import {useRef, useEffect} from "react";
import {createChart, LineSeries, CandlestickSeries, LineStyle} from "lightweight-charts";
import { useNavigate } from 'react-router-dom';
import OrderInput from "./OrderInput";
import {useLocation} from 'react-router-dom';
import {useReactMediaRecorder} from "react-media-recorder";

const OptionsChart = () => {

    const location = useLocation();
    const ipAddress = location.state['ipAddress'];
    const chartTime = useRef(null);
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

    let nineEMALineCE = []
    let twentyOneEMALineCE = []

    let nineEMALinePE = []
    let twentyOneEMALinePE = []

    const multiplierNineEMA = 2 / (9 + 1)
    const multiplierTwentyOneEMA = 2 / (21 + 1)
    const lineSeriesNineCEEMA = useRef(null);
    const lineSeriesTwentyOneCEEMA = useRef(null);
    const lineSeriesNinePEEMA = useRef(null);
    const lineSeriesTwentyOnePEEMA = useRef(null);

    const timeInfoLegend = useRef(null);

    const navigate = useNavigate();
    const chartContainerCE = useRef(null);
    const chartContainerPE = useRef(null);

    const candlestickSeriesCE = useRef(null);
    const candlestickSeriesPE = useRef(null);

    const chartCE = useRef(null);
    const chartPE = useRef(null);

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
        chartContainerCE.current.appendChild(timeInfoLegend.current);

        chartCE.current = createChart(chartContainerCE.current, chartPropertiesOptions);
        chartCE.current.resize(window.innerWidth*0.68, window.innerHeight*0.45)
        chartPE.current = createChart(chartContainerPE.current, chartPropertiesOptions);
        chartPE.current.resize(window.innerWidth*0.68, window.innerHeight*0.45);

        candlestickSeriesCE.current = chartCE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        candlestickSeriesPE.current = chartPE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});

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

        chartCE.current.applyOptions(chartOptions);
        chartCE.current.timeScale().fitContent();

        chartPE.current.applyOptions(chartOptions);
        chartPE.current.timeScale().fitContent();

        window.addEventListener("load", () => {
            chartCE.current.resize(window.innerWidth*0.68, window.innerHeight*0.45)
            chartPE.current.resize(window.innerWidth*0.68, window.innerHeight*0.45)
        });
        return () => {
            chartCE.current.remove();
            chartPE.current.remove();
        };
    }, []);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.hasOwnProperty('prev_data')) {
            const ceDataArray = data['prev_data']['ce']
            const peDataArray = data['prev_data']['pe']

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

            candlestickSeriesCE.current.setData(ceDataArray)
            candlestickSeriesPE.current.setData(peDataArray)

            lineSeriesNineCEEMA.current.setData(nineEMALineCE)
            lineSeriesTwentyOneCEEMA.current.setData(twentyOneEMALineCE)

            lineSeriesNinePEEMA.current.setData(nineEMALinePE)
            lineSeriesTwentyOnePEEMA.current.setData(twentyOneEMALinePE)
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

            const oldTimeCE = new Date(currentBarTimeCE.current * 1000)
            if ((currentBarLastOpenCE.current === 0) || (Math.floor(barTimeDateCE.getMinutes()/3) !== Math.floor(oldTimeCE.getMinutes()/3))) {
                currentBarTimeCE.current = Math.floor(barEpochTimeCE / 180) * 180
                currentBarLastOpenCE.current = ceData['open']
                currentBarLastLowCE.current = ceData['low']
                currentBarLastHighCE.current = ceData['high']

                const nineEMAValue = ceData['close'] * multiplierNineEMA + nineEMALineCE[nineEMALineCE.length-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValue = ceData['close'] * multiplierTwentyOneEMA + twentyOneEMALineCE[twentyOneEMALineCE.length-1]['value'] * (1-multiplierTwentyOneEMA)

                nineEMALineCE.push({time:currentBarTimeCE.current, value: nineEMAValue})
                twentyOneEMALineCE.push({time:currentBarTimeCE.current, value: twentyOneEMAValue})
                lineSeriesNineCEEMA.current.update({time:currentBarTimeCE.current, value: nineEMAValue}, false)
                lineSeriesTwentyOneCEEMA.current.update({time:currentBarTimeCE.current, value: twentyOneEMAValue}, false)
            }

            const oldTimePE = new Date(currentBarTimePE.current * 1000)
            if ((currentBarLastOpenPE.current === 0) || (Math.floor(barTimeDatePE.getMinutes()/3) !== Math.floor(oldTimePE.getMinutes()/3))) {
                currentBarTimePE.current = Math.floor(barEpochTimePE / 180) * 180
                currentBarLastOpenPE.current = peData['open']
                currentBarLastLowPE.current = peData['low']
                currentBarLastHighPE.current = peData['high']

                const nineEMAValue = peData['close'] * multiplierNineEMA + nineEMALinePE[nineEMALinePE.length-1]['value'] * (1-multiplierNineEMA)
                const twentyOneEMAValue = peData['close'] * multiplierTwentyOneEMA + twentyOneEMALinePE[twentyOneEMALinePE.length-1]['value'] * (1-multiplierTwentyOneEMA)

                nineEMALinePE.push({time:currentBarTimePE.current, value: nineEMAValue})
                twentyOneEMALinePE.push({time:currentBarTimePE.current, value: twentyOneEMAValue})
                lineSeriesNinePEEMA.current.update({time:currentBarTimePE.current, value: nineEMAValue}, false)
                lineSeriesTwentyOnePEEMA.current.update({time:currentBarTimePE.current, value: twentyOneEMAValue}, false)
            }

            currentBarLastCloseCE.current = ceData['close']
            currentBarLastClosePE.current = peData['close']

            currentBarLastLowCE.current = Math.min(currentBarLastLowCE.current, ceData['low'])
            currentBarLastHighCE.current = Math.max(currentBarLastHighCE.current, ceData['high'])

            currentBarLastLowPE.current = Math.min(currentBarLastLowPE.current, peData['low'])
            currentBarLastHighPE.current = Math.max(currentBarLastHighPE.current, peData['high'])

            const displayTimeCE = currentBarTimeCE.current
            const displayTimePE = currentBarTimePE.current
            try {
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

                timeInfoLegend.current.innerHTML = formatTimeLocale(stockData['time'])
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
            }).catch((err) => {
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
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginTop:"1%", marginRight:'1%'}} ref={chartContainerCE} id="chartContainerCE"></div>
                <div style={{clear:"both", float:"left", marginTop:"1%", marginLeft:'1%'}} ref={chartContainerPE}></div>
            </div>
            <div style={{float:"left", width:'25%', height:'90%', marginLeft:'1%'}} ><OrderInput tradingStyle={tradingStyle} ipAddress={ipAddress} replaySpeed={replaySpeed} ceStrikePrice={ceStrikePrice} peStrikePrice={peStrikePrice} tradeDate={tradeDate}/></div>
        </div>
    );


};

export default OptionsChart;