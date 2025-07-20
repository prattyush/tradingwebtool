import {useEffect, useRef, useState} from "react";
import Chart from "./Chart";
import { useNavigate } from 'react-router-dom'
import {useLocation} from 'react-router-dom';
import {CandlestickSeries, createChart, LineStyle, createSeriesMarkers} from "lightweight-charts";
import {strategyoptions, previousDayOptions, todayStartOptions, baroptions} from "./StrategyVariables";

const AnalyticsPage = ({ipAddress}) => {
    const [tradeDate, setTradeDate] = useState("")
    const [analyticsTradingStyle, setAnalyticsTradingStyle] = useState("simtrading")
    const [buttonState, setButtonState] = useState(true)

    const [analyticsStrategy, setAnalyticsStrategy] = useState("breakout")
    const [analyticsStrategyTradingStyle, setAnalyticsStrategyTradingStyle] = useState("simtrading")
    const [analyticsStrategyLookback, setAnalyticsStrategyLookback] = useState("0")

    const analyticsChartContainerStock = useRef(null);
    const analyticsChartContainerCE = useRef(null);
    const analyticsChartContainerPE = useRef(null);

    const analyticsCandlestickSeriesNifty = useRef(null);
    const analyticsCandlestickSeriesCE = useRef(null);
    const analyticsCandlestickSeriesPE = useRef(null);

    const analyticsOrderMarkersNifty = useRef(null);
    const analyticsOrderMarkersCE = useRef(null);
    const analyticsOrderMarkersPE = useRef(null);

    const analyticsChartNifty = useRef(null);
    const analyticsChartCE = useRef(null);
    const analyticsChartPE = useRef(null);

    const [historyInfo, setHistoryInfo] = useState("");


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
        analyticsChartNifty.current = createChart(analyticsChartContainerStock.current, chartPropertiesNifty);
        analyticsChartNifty.current.resize(window.innerWidth*0.63, window.innerHeight*0.4)
        analyticsChartCE.current = createChart(analyticsChartContainerCE.current, chartPropertiesOptions);
        analyticsChartCE.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)
        analyticsChartPE.current = createChart(analyticsChartContainerPE.current, chartPropertiesOptions);
        analyticsChartPE.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)

        //const histogramSeries = chartNifty.addSeries(HistogramSeries, { color: "#26a69a" });
        analyticsCandlestickSeriesNifty.current = analyticsChartNifty.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesCE.current = analyticsChartCE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesPE.current = analyticsChartPE.current.addSeries(CandlestickSeries,
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

        analyticsChartNifty.current.applyOptions(chartOptions);
        analyticsChartNifty.current.timeScale().fitContent();

        analyticsChartCE.current.applyOptions(chartOptions);
        analyticsChartCE.current.timeScale().fitContent();

        analyticsChartPE.current.applyOptions(chartOptions);
        analyticsChartPE.current.timeScale().fitContent();

        window.addEventListener("load", () => {
            analyticsChartNifty.current.resize(window.innerWidth*0.63, window.innerHeight*0.4)
            analyticsChartCE.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)
            analyticsChartPE.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)
        });
        return () => {
            analyticsChartNifty.current.remove();
            analyticsChartCE.current.remove();
            analyticsChartPE.current.remove();
        };
    }, []);


    const handleAnalyticsRequestSubmitted = (event) => {
        event.preventDefault();
        setButtonState(true)
        fetch('http://' + ipAddress + ':9060/analytics/orderchart?tradedate=' + tradeDate + '&tradingstyle=' + analyticsTradingStyle, {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => {
                response.json();
                setButtonState(false)
            })
            .then((data) => {
                console.log(data);
                setButtonState(false)
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleStrategyAnalyticsRequestSubmitted = (event) => {
        event.preventDefault();
        setButtonState(true)
        fetch('http://' + ipAddress + ':9060/analytics/strategyorderchart?tradedate=' + tradeDate + '&tradingstyle=' + analyticsStrategyTradingStyle + '&strategy=' + analyticsStrategy + '&lookback=' + analyticsStrategyLookback, {
            method: 'POST',
            body: JSON.stringify({
                // Add parameters here
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => {
                response.json();
                setButtonState(false)
            })
            .then((data) => {
                console.log(data);
                setButtonState(false)
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const plotChart = (event) => {
        event.preventDefault();
        const socket = new WebSocket('ws://' + ipAddress + ':9006');
        socket.onopen = () => {
            console.log('WebSocket connection opened');
        };
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const stockDataArray = data['price_action']['stock'];
            const ceDataArray = data['price_action']['ce'];
            const peDataArray = data['price_action']['pe']
            const ordersData = data['orders']

            analyticsCandlestickSeriesNifty.current.setData(stockDataArray)
            analyticsCandlestickSeriesCE.current.setData(ceDataArray)
            analyticsCandlestickSeriesPE.current.setData(peDataArray)

            const orderStockMarkers = []
            const orderCEMarkers = []
            const orderPEMarkers = []
            const markerSize = 0.1;

            for (let i = 0; i < ordersData.length; i++) {
                let shape = 'circle'
                let color = '#2196F3'
                let text = 'Buy'
                let stockText = 'Buy'
                let stockColor = '#2196F3'
                if (ordersData[i]['action'] === 'Sell') {
                    shape = 'circle';
                    color = '#e91e63'
                    stockColor = '#e91e63'
                    text = 'Sell'
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
                orderStockMarkers.push({
                    time: ordersData[i]['time'],
                    price: ordersData[i]['stock_price'],
                    position: 'atPriceMiddle',
                    color: stockColor,
                    size: markerSize,
                    shape: shape,
                    text: stockText
                })
                if (ordersData[i]['type'] === 'Call') {
                    orderCEMarkers.push({
                        time: ordersData[i]['time'],
                        price: ordersData[i]['price'],
                        position: 'atPriceMiddle',
                        color: color,
                        size: markerSize,
                        shape: shape,
                        text: text
                    })
                } else {
                    orderPEMarkers.push({
                        time: ordersData[i]['time'],
                        price: ordersData[i]['price'],
                        position: 'atPriceMiddle',
                        color: color,
                        size: markerSize,
                        shape: shape,
                        text: text
                    })
                }
            }
            createSeriesMarkers(analyticsCandlestickSeriesNifty.current, orderStockMarkers);
            createSeriesMarkers(analyticsCandlestickSeriesCE.current, orderCEMarkers);
            createSeriesMarkers(analyticsCandlestickSeriesPE.current, orderPEMarkers);

            analyticsChartNifty.current.timeScale().fitContent();
            analyticsChartCE.current.timeScale().fitContent();
            analyticsChartPE.current.timeScale().fitContent();
        }

        fetch('http://' + ipAddress + ':9060/analytics/strategyhistoryinfo?tradedate=' + tradeDate + '&tradingstyle=' + analyticsTradingStyle + '&strategy=' + analyticsStrategy + '&lookback=' + analyticsStrategyLookback, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setHistoryInfo(data['response'])
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    return (
        <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'96%', height:'70%', border: '1px solid black'}}>
            <div style={{float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'20%'}}>
                <h4>ANALYTICS</h4>
                <form name="analytics" onSubmit={handleAnalyticsRequestSubmitted} style={{float:"left", marginRight:'1%'}}>
                    <label style={{float:"left"}}> Enter Trade Date:
                        <input type="text" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)}/>
                    </label>
                    <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Trading Style :: </label>
                    <select  style={{float:"left", marginTop:'1%', width:'auto'}} name="ManagementCmd" id="managementCmd" defaultValue={analyticsTradingStyle} onChange={(e) => setAnalyticsTradingStyle(e.target.value)}>
                        <option>simtrading</option>
                        <option>papertrading</option>
                    </select>
                    <input style={{clear:"both", float:"left", marginTop:'1%', marginLeft:'1%'}} type="submit"/>
                </form>
                <button type="button" disabled={buttonState} onClick={plotChart} title="Return" style={{float:"left", marginTop:'1%', marginLeft:'2%'}}>Plot Chart</button>
            </div>
            <div style={{float:"left", marginTop:'1%', marginLeft:'1%', marginBottom:'1%', border: '1px solid black', width:'30%'}}>
                <h4>ANALYTICS-STRATEGY</h4>
                <form name="analytics" onSubmit={handleStrategyAnalyticsRequestSubmitted} style={{float:"left", marginRight:'1%'}}>
                    <label style={{float:"left"}}> Enter Trade Date:
                        <input type="text" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)}/>
                    </label>
                    <label style={{float:"left"}}> Enter Lookback Days :
                        <input type="text" value={analyticsStrategyLookback} onChange={(e) => setAnalyticsStrategyLookback(e.target.value)}/>
                    </label>
                    <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Trading Style :: </label>
                    <select  style={{float:"left", marginTop:'1%', width:'auto'}} name="StrategyTdStyle" id="strategyTdStyle" defaultValue={analyticsStrategyTradingStyle} onChange={(e) => setAnalyticsStrategyTradingStyle(e.target.value)}>
                        <option>simtrading</option>
                        <option>papertrading</option>
                    </select>
                    <label style={{float:"left", marginLeft:'1%', marginTop:'1%', marginRight: '1%'}}>Strategy :: </label>
                    <select style={{float:"left", marginLeft:'1%', marginTop:'1%'}} name="StrategyCmd" id="strategyCmd" defaultValue={analyticsStrategy} onChange={(e) => setAnalyticsStrategy(e.target.value)}>
                        {strategyoptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="submit"/>
                </form>
            </div>
            <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'70%'}}>
                <div style={{float:"left", marginLeft:'1%', width:'96%', height:'40%', border: '2px solid black'}} ref={analyticsChartContainerStock}></div>
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginRight:'1%', marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerCE}></div>
                <div style={{float:"left", marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerPE}></div>
            </div>
            <div style={{float:"left", marginTop:'1%', marginBottom:'1%', marginLeft:'1%', width:'20%', height:'80%', border: '1px solid black'}}>
                <textarea style={{float:"left", marginTop:'1%', marginRight: '1%', width:'90%', height:'80%',}} name="tradeInfo" rows={24} cols={60} value={historyInfo} readOnly={true}>info</textarea>
            </div>
        </div>

    );
};

export default AnalyticsPage;