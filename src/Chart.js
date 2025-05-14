import { useRef, useEffect } from "react";
import {createChart, HistogramSeries, CandlestickSeries, LineStyle} from "lightweight-charts";
import { useNavigate } from 'react-router-dom';
import OrderInput from "./OrderInput";
import {useLocation} from 'react-router-dom';

const Chart = () => {

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
    const currentBarLastLowNifty = useRef(100);
    const currentBarTimeNifty = useRef(null);


    const currentBarLastOpenCE = useRef(0);
    const currentBarLastCloseCE = useRef(null);
    const currentBarLastHighCE = useRef(0);
    const currentBarLastLowCE = useRef(100);
    const currentBarTimeCE = useRef(null);


    const currentBarLastOpenPE = useRef(0);
    const currentBarLastClosePE = useRef(null);
    const currentBarLastHighPE = useRef(0);
    const currentBarLastLowPE = useRef(100);
    const currentBarTimePE = useRef(null);

    const socket = new WebSocket('ws://localhost:8765');
    socket.onopen = () => {
        console.log('WebSocket connection opened');
    };

    const chartPropertiesNifty = {
        layout: {
            textColor: "white",
            background: { type: "solid", color: "black" }
        },
        width: '1200',
        height: '480',
    };

    const chartPropertiesOptions = {
        layout: {
            textColor: "white",
            background: { type: "solid", color: "black" },
        },
        width: '594',
        height: '480',
    };

    useEffect(() => {
        chartNifty.current = createChart(chartContainerNifty.current, chartPropertiesNifty);
        chartCE.current = createChart(chartContainerCE.current, chartPropertiesOptions);
        chartPE.current = createChart(chartContainerPE.current, chartPropertiesOptions);

        //const histogramSeries = chartNifty.addSeries(HistogramSeries, { color: "#26a69a" });
        candlestickSeriesNifty.current = chartNifty.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        candlestickSeriesCE.current = chartCE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        candlestickSeriesPE.current = chartPE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});

        //currentBarLastCloseNifty.current = 10.96 + Math.random();
        //candlestickSeriesNifty.current.setData(candleData);

        //histogramSeries.setData(initialData);

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
        return () => {
            chartNifty.current.remove();
            chartCE.current.remove();
            chartPE.current.remove();
        };
    }, []);

   /** useEffect(() => {
        const intervalId = setInterval(() => {

            const min = -1;
            const max = 1;
            const openrand = previousBarClose.current;
            const closerand = currentBarLastCloseNifty.current + min + Math.random() * (max - min);

            currentBarLastHighNifty.current = Math.max(currentBarLastHighNifty.current, Math.max(openrand, closerand));
            currentBarLastLow.current = Math.min(currentBarLastLow.current, Math.min(openrand, closerand));
            latestTimestamp.current = latestTimestamp.current;

            const candleDataUpdate =
                {open: openrand, high: currentBarLastHighNifty.current, low: currentBarLastLow.current, close: closerand, time: latestTimestamp.current};
            candlestickSeriesNifty.current.update(candleDataUpdate, false);
            currentBarLastCloseNifty.current = closerand;
            //chartNifty.current.timeScale().fitContent();
            //previousClose.current = closerand;

        }, 1000);
        return () => clearInterval(intervalId);
    }, []); **/

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.hasOwnProperty('prev_data')) {
            const stockDataArray = data['prev_data']['stock']
            const ceDataArray = data['prev_data']['ce']
            const peDataArray = data['prev_data']['pe']

            candlestickSeriesNifty.current.setData(stockDataArray)
            candlestickSeriesCE.current.setData(ceDataArray)
            candlestickSeriesPE.current.setData(peDataArray)
        } else {
            const stockData = data['stock']
            const ceData = data['ce']
            const peData = data['pe']

            const barEpochTime = stockData['time']
            const barTimeDate = new Date(barEpochTime * 1000)

            const oldTime = new Date(currentBarTimeNifty.current * 1000)
            if ((currentBarLastOpenNifty.current === 0) ||
                (((barTimeDate.getMinutes() % 3) === 0) && (barTimeDate.getMinutes() !== oldTime.getMinutes()))) {
                currentBarTimeNifty.current = barEpochTime
                currentBarLastOpenNifty.current = stockData['open']
                currentBarLastLowNifty.current = stockData['low']
                currentBarLastHighNifty.current = stockData['high']

                currentBarTimeCE.current = barEpochTime
                currentBarLastOpenCE.current = ceData['open']
                currentBarLastLowCE.current = ceData['low']
                currentBarLastHighCE.current = ceData['high']

                currentBarTimePE.current = barEpochTime
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

            const displayTime = currentBarTimeNifty.current + 19800

            const candleDataUpdateNifty =
                {
                    open: currentBarLastOpenNifty.current,
                    high: currentBarLastHighNifty.current,
                    low: currentBarLastLowNifty.current,
                    close: currentBarLastCloseNifty.current,
                    time: displayTime
                };
            candlestickSeriesNifty.current.update(candleDataUpdateNifty, false);

            const candleDataUpdateCE =
                {
                    open: currentBarLastOpenCE.current,
                    high: currentBarLastHighCE.current,
                    low: currentBarLastLowCE.current,
                    close: currentBarLastCloseCE.current,
                    time: displayTime
                };
            candlestickSeriesCE.current.update(candleDataUpdateCE, false);

            const candleDataUpdatePE =
                {
                    open: currentBarLastOpenPE.current,
                    high: currentBarLastHighPE.current,
                    low: currentBarLastLowPE.current,
                    close: currentBarLastClosePE.current,
                    time: displayTime
                };
            candlestickSeriesPE.current.update(candleDataUpdatePE, false);
        }
    };

    const onReset = (event) => {
        event.preventDefault();
        fetch('http://localhost:9060/simtrading/reset', {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
        navigate('/');
    }

    return (
        <div>
            <div style={{float:"left", marginLeft:'1%', width:'65%', height:'90%'}}>
                <h4>Chart</h4>
                <div style={{float:"left", marginLeft:'1%', width:'90%', height:'35%'}} ref={chartContainerNifty}></div>
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginRight:'1%', marginTop:'1%'}} ref={chartContainerCE}></div>
                <div style={{float:"left", marginTop:'1%'}} ref={chartContainerPE}></div>
                <p></p>
                <div style={{clear:"both", float:"left", borderLeft:-10, borderTop:-25, marginLeft:10, marginTop:20}}>
                    <button type="button"
                        onClick={onReset}
                        title="Return">Reset</button>
                </div>
            </div>
            <div style={{float:"left", width:'25%', height:'90%'}} ><OrderInput/></div>
        </div>
    );


};

export default Chart;