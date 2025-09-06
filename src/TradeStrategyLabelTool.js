import {useEffect, useRef, useState} from "react";
import Chart from "./Chart";
import { useNavigate } from 'react-router-dom'
import {useLocation} from 'react-router-dom';
import {CandlestickSeries, createChart, LineStyle, createSeriesMarkers} from "lightweight-charts";
import {
    strategyoptions,
    previousDayOptions,
    todayStartOptions,
    baroptions,
    tradestrategyoptions
} from "./StrategyVariables";
import OrderInput from "./OrderInput";

const TradeStrategyLabelTool = () => {
    const location = useLocation();
    const ipAddress = location.state['ipAddress'];

    const navigate = useNavigate();
    const [tradeDate, setTradeDate] = useState("")
    const [buttonState, setButtonState] = useState(true)
    const tradesLabeledStrategyMap = useRef(new Map());

    const [analyticsStrategy, setAnalyticsStrategy] = useState("all")
    const [tradingstyle, setTradingstyle] = useState("simtrading")
    const [tradingQuantity, setTradingQuantity] = useState("0")

    const [ordersGroupCount, setOrdersGroupCount] = useState([])
    const ordersReportList = useRef([''])
    const [groupedOrdersData, setGroupedOrdersData] = useState([])

    const analyticsChartContainerStock = useRef(null);
    const analyticsChartContainerCE = useRef(null);
    const analyticsChartContainerPE = useRef(null);
    const analyticsChartContainerCE2 = useRef(null);
    const analyticsChartContainerPE2 = useRef(null);
    const analyticsChartContainerCE3 = useRef(null);
    const analyticsChartContainerPE3 = useRef(null);

    const analyticsCandlestickSeriesNifty = useRef(null);
    const analyticsCandlestickSeriesCE = useRef(null);
    const analyticsCandlestickSeriesPE = useRef(null);
    const analyticsCandlestickSeriesCE2 = useRef(null);
    const analyticsCandlestickSeriesPE2 = useRef(null);
    const analyticsCandlestickSeriesCE3 = useRef(null);
    const analyticsCandlestickSeriesPE3 = useRef(null);

    const analyticsChartNifty = useRef(null);
    const analyticsChartCE = useRef(null);
    const analyticsChartPE = useRef(null);
    const analyticsChartCE2 = useRef(null);
    const analyticsChartPE2 = useRef(null);
    const analyticsChartCE3 = useRef(null);
    const analyticsChartPE3 = useRef(null);

    const [historyInfo, setHistoryInfo] = useState("");
    const [reportSummary, setReportSummary] = useState("");


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

        analyticsChartCE2.current = createChart(analyticsChartContainerCE2.current, chartPropertiesOptions);
        analyticsChartCE2.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)
        analyticsChartPE2.current = createChart(analyticsChartContainerPE2.current, chartPropertiesOptions);
        analyticsChartPE2.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)

        analyticsChartCE3.current = createChart(analyticsChartContainerCE2.current, chartPropertiesOptions);
        analyticsChartCE3.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)
        analyticsChartPE3.current = createChart(analyticsChartContainerPE2.current, chartPropertiesOptions);
        analyticsChartPE3.current.resize(window.innerWidth*0.31, window.innerHeight*0.4)

        //const histogramSeries = chartNifty.addSeries(HistogramSeries, { color: "#26a69a" });
        analyticsCandlestickSeriesNifty.current = analyticsChartNifty.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesCE.current = analyticsChartCE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesPE.current = analyticsChartPE.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesCE2.current = analyticsChartCE2.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesPE2.current = analyticsChartPE2.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesCE3.current = analyticsChartCE3.current.addSeries(CandlestickSeries,
            { upColor: '#26a69a', downColor: '#ef5350', borderVisible: false, wickUpColor: '#26a69a', wickDownColor: '#ef5350'});
        analyticsCandlestickSeriesPE3.current = analyticsChartPE3.current.addSeries(CandlestickSeries,
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

        analyticsChartPE2.current.applyOptions(chartOptions);
        analyticsChartPE2.current.timeScale().fitContent();

        analyticsChartPE3.current.applyOptions(chartOptions);
        analyticsChartPE3.current.timeScale().fitContent();

        analyticsChartCE2.current.applyOptions(chartOptions);
        analyticsChartCE2.current.timeScale().fitContent();

        analyticsChartCE3.current.applyOptions(chartOptions);
        analyticsChartCE3.current.timeScale().fitContent();

        window.addEventListener("load", () => {
            analyticsChartNifty.current.resize(window.innerWidth*0.63, window.innerHeight*0.45)
            analyticsChartCE.current.resize(window.innerWidth*0.31, window.innerHeight*0.45)
            analyticsChartPE.current.resize(window.innerWidth*0.31, window.innerHeight*0.45)
            analyticsChartCE2.current.resize(window.innerWidth*0.31, window.innerHeight*0.45)
            analyticsChartPE2.current.resize(window.innerWidth*0.31, window.innerHeight*0.45)
            analyticsChartCE3.current.resize(window.innerWidth*0.31, window.innerHeight*0.45)
            analyticsChartPE3.current.resize(window.innerWidth*0.31, window.innerHeight*0.45)
        });
        return () => {
            analyticsChartNifty.current.remove();
            analyticsChartCE.current.remove();
            analyticsChartPE.current.remove();
            analyticsChartCE2.current.remove();
            analyticsChartPE2.current.remove();
            analyticsChartCE3.current.remove();
            analyticsChartPE3.current.remove();
        };
    }, []);


    const handleStrategyAnalyticsRequestSubmitted = (event) => {
        event.preventDefault();
        setButtonState(true)
        fetch('http://' + ipAddress + ':9060/analytics/strategyorderchart?tradedate=' + tradeDate + '&tradingstyle=' + tradingstyle + '&strategy=all&lookback=0&quantity=' + tradingQuantity, {
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

            const ceDataMap = data['price_action']['ce']
            const ceDataMapKeys = Object.keys(ceDataMap);
            const ceDataArray = ceDataMapKeys.length > 0 ? ceDataMap[ceDataMapKeys[ceDataMapKeys.length-1]] : []
            const ceDataArray2 = ceDataMapKeys.length > 1 ? ceDataMap[ceDataMapKeys[ceDataMapKeys.length-2]] : []
            const ceDataArray3 = ceDataMapKeys.length > 2 ? ceDataMap[ceDataMapKeys[ceDataMapKeys.length-3]] : []
            const ceStrikePrice = ceDataMapKeys.length > 0 ? ceDataMapKeys[ceDataMapKeys.length-1] : 0
            const ceStrikePrice2 = ceDataMapKeys.length > 1 ? ceDataMapKeys[ceDataMapKeys.length-2] : 0
            const ceStrikePrice3 = ceDataMapKeys.length > 2 ? ceDataMapKeys[ceDataMapKeys.length-3] : 0

            const peDataMap = data['price_action']['pe']
            const peDataMapKeys = Object.keys(peDataMap);
            const peDataArray = peDataMapKeys.length > 0 ? peDataMap[peDataMapKeys[peDataMapKeys.length-1]] : []
            const peDataArray2 = peDataMapKeys.length > 1 ? peDataMap[peDataMapKeys[peDataMapKeys.length-2]] : []
            const peDataArray3 = peDataMapKeys.length > 2 ? peDataMap[peDataMapKeys[peDataMapKeys.length-3]] : []
            const peStrikePrice = peDataMapKeys.length > 0 ? peDataMapKeys[peDataMapKeys.length-1] : 0
            const peStrikePrice2 = peDataMapKeys.length > 1 ? peDataMapKeys[peDataMapKeys.length-2] : 0
            const peStrikePrice3 = peDataMapKeys.length > 2 ? peDataMapKeys[peDataMapKeys.length-3] : 0

            const ordersData = data['orders']

            analyticsCandlestickSeriesNifty.current.setData(stockDataArray)
            analyticsCandlestickSeriesCE.current.setData(ceDataArray)
            analyticsCandlestickSeriesPE.current.setData(peDataArray)
            analyticsCandlestickSeriesCE2.current.setData(ceDataArray2)
            analyticsCandlestickSeriesPE2.current.setData(peDataArray2)
            analyticsCandlestickSeriesCE3.current.setData(ceDataArray3)
            analyticsCandlestickSeriesPE3.current.setData(peDataArray3)


            const orderStockMarkers = []
            const orderCEMarkers = []
            const orderPEMarkers = []
            const orderCEMarkers2 = []
            const orderPEMarkers2 = []
            const orderCEMarkers3 = []
            const orderPEMarkers3 = []
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
                if (ordersData[i]['type'] === 'Call' && parseInt(ordersData[i]['strike_price']) === parseInt(ceStrikePrice)) {
                    orderCEMarkers.push({
                        time: ordersData[i]['time'],
                        price: ordersData[i]['price'],
                        position: 'atPriceMiddle',
                        color: color,
                        size: markerSize,
                        shape: shape,
                        text: text
                    })
                } else if (ordersData[i]['type'] === 'Put' && parseInt(ordersData[i]['strike_price']) === parseInt(peStrikePrice)) {
                    orderPEMarkers.push({
                        time: ordersData[i]['time'],
                        price: ordersData[i]['price'],
                        position: 'atPriceMiddle',
                        color: color,
                        size: markerSize,
                        shape: shape,
                        text: text
                    })
                } else if (ordersData[i]['type'] === 'Call' && parseInt(ordersData[i]['strike_price']) === parseInt(ceStrikePrice2)) {
                    orderCEMarkers2.push({
                        time: ordersData[i]['time'],
                        price: ordersData[i]['price'],
                        position: 'atPriceMiddle',
                        color: color,
                        size: markerSize,
                        shape: shape,
                        text: text
                    })
                } else if (ordersData[i]['type'] === 'Put' && parseInt(ordersData[i]['strike_price']) === parseInt(peStrikePrice2))  {
                    orderPEMarkers2.push({
                        time: ordersData[i]['time'],
                        price: ordersData[i]['price'],
                        position: 'atPriceMiddle',
                        color: color,
                        size: markerSize,
                        shape: shape,
                        text: text
                    })
                } else if (ordersData[i]['type'] === 'Call' && parseInt(ordersData[i]['strike_price']) === parseInt(ceStrikePrice3)) {
                    orderCEMarkers3.push({
                        time: ordersData[i]['time'],
                        price: ordersData[i]['price'],
                        position: 'atPriceMiddle',
                        color: color,
                        size: markerSize,
                        shape: shape,
                        text: text
                    })
                } else if (ordersData[i]['type'] === 'Put' && parseInt(ordersData[i]['strike_price']) === parseInt(peStrikePrice3))  {
                    orderPEMarkers3.push({
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
            createSeriesMarkers(analyticsCandlestickSeriesCE2.current, orderCEMarkers2);
            createSeriesMarkers(analyticsCandlestickSeriesPE2.current, orderPEMarkers2);
            createSeriesMarkers(analyticsCandlestickSeriesCE3.current, orderCEMarkers3);
            createSeriesMarkers(analyticsCandlestickSeriesPE3.current, orderPEMarkers3);


            analyticsChartNifty.current.timeScale().fitContent();
            analyticsChartCE.current.timeScale().fitContent();
            analyticsChartPE.current.timeScale().fitContent();
            analyticsChartCE2.current.timeScale().fitContent();
            analyticsChartPE2.current.timeScale().fitContent();
            analyticsChartCE3.current.timeScale().fitContent();
            analyticsChartPE3.current.timeScale().fitContent();
        }

        fetch('http://' + ipAddress + ':9060/tools?name=tradestrategylabel&tradedate=' + tradeDate + '&tradingstyle=' + tradingstyle + "&quantity=" + tradingQuantity, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                const groupedOrdersData = data['response']
                setGroupedOrdersData(groupedOrdersData);
                ordersReportList.current = []
                for (let i = 0; i < groupedOrdersData.length; i++) {
                    ordersReportList.current.push(groupedOrdersData[i]['text'])
                }
                const indexArray = []
                for (let j=0;j < groupedOrdersData.length; j++) {
                    indexArray.push(j);
                }
                setOrdersGroupCount(indexArray)
                setHistoryInfo(data['response']['history'])
                setReportSummary(data['response']['report_summary'])
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleLabeledTradesSubmmit = (event) => {
        event.preventDefault();
        const dataToSend = {
            'tradedate': tradeDate,
            'tradingstyle': tradingstyle,
            'tradesmap': tradesLabeledStrategyMap.current
        };

        const jsonString = JSON.stringify(dataToSend);
        fetch('http://' + ipAddress + ':9060/tools?name=tradestrategylabel&tradedate=' + tradeDate + '&tradingstyle=' + tradingstyle, {
            method: 'POST',
            body: jsonString,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'false',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

    }

    const handleInputPageRedirection = (event) => {
        event.preventDefault();
        navigate("/");
    }

    const handleTradeLabelStrategySelect = (event, index) => {
        const strategyName = event.target.value;
        const ordersIdList = groupedOrdersData[index]['order_ids_list']
        for (let i = 0; i < ordersIdList.length; i++) {
            tradesLabeledStrategyMap.current[ordersIdList[i]] = strategyName;
        }

        console.log(tradesLabeledStrategyMap)
    }

    return (
        <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'96%', height:'100%', border: '1px solid black'}}>
            <div style={{float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'68%'}}>
                <div style={{float:"left", marginLeft:'1%', width:'96%', height:'50%', border: '2px solid black'}} ref={analyticsChartContainerStock}></div>
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginRight:'1%', marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerCE}></div>
                <div style={{float:"left", marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerPE}></div>
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginRight:'1%', marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerCE2}></div>
                <div style={{float:"left", marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerPE2}></div>
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginRight:'1%', marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerCE3}></div>
                <div style={{float:"left", marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerPE3}></div>
            </div>
            <div style={{float:"left", marginTop:'1%', marginLeft:'1%', marginBottom:'1%', border: '1px solid black', width:'28%'}}>
                <div style={{float:"left", marginTop:'1%', marginLeft:'1%', marginBottom:'1%', border: '1px solid black', width:'100%'}}>
                    <h4>TRADE-LABELING-TOOL</h4>
                    <form name="analytics" onSubmit={handleStrategyAnalyticsRequestSubmitted} style={{float:"left", marginRight:'1%'}}>
                        <label style={{float:"left"}}> Enter Trade Date:
                            <input type="text" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)}/>
                        </label>
                        <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Trading Style :: </label>
                        <select  style={{float:"left", marginTop:'1%', width:'auto'}} name="StrategyTdStyle" id="strategyTdStyle" defaultValue={tradingstyle} onChange={(e) => setTradingstyle(e.target.value)}>
                            <option>simtrading</option>
                            <option>papertrading</option>
                            <option>realtrading</option>
                        </select>
                        <label style={{float:"left"}}> Enter Quantity :
                            <input type="text" value={tradingQuantity} onChange={(e) => setTradingQuantity(e.target.value)}/>
                        </label>
                        <input style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="submit"/>
                        <button type="button" disabled={buttonState} onClick={plotChart} title="Return" style={{float:"left", marginTop:'1%', marginLeft:'2%'}}>Plot Chart</button>

                        <button type="button" id="getChartData" onClick={handleInputPageRedirection} title="inputPage" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Back to Input</button>
                        <button type="button" onClick={handleLabeledTradesSubmmit} title="Submit Strategies" style={{float:"left", marginTop:'1%', marginLeft:'2%'}}>LabelTrades</button>
                    </form>
                </div>

                <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', marginLeft:'1%', width:'100%', height:'80%', border: '1px solid black'}}>
                    <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', width:'98%', height:'120%', border: '1px solid black'}}>
                        {ordersGroupCount.map((index) => (
                            <div>
                                <textarea style={{float:"left", marginTop:'1%', marginRight: '1%', width:'90%', height:'80%',}} name="reportSummary" rows={10} cols={30} value={ordersReportList.current[index]} readOnly={true}>report</textarea>
                                <label style={{clear:"both", float:"left", marginTop:'1%'}}>Strategy ::</label>
                                <select style={{float:"left", marginTop:'1%'}} name="tradestrategy" id="tradestrategy" defaultValue="none" onChange={(e) => handleTradeLabelStrategySelect(e, index)}>
                                    {tradestrategyoptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default TradeStrategyLabelTool;