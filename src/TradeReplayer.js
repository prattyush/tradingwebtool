import {useState, useCallback, useRef, useEffect, use} from "react";
import {useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {CandlestickSeries, createChart, LineSeries, LineStyle} from "lightweight-charts";
import {
    priceIntervalRangeMap,
    optionstype,
    orderTypeOptions,
    tradestrategyoptions,
    optionvaluerangeoptions
} from "./StrategyVariables";


const TradeReplayer = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const ipAddress = location.state['ipAddress'];
    const [tradeDate, setTradeDate] = useState("")
    const [tradeStrategy, setTradeStrategy] = useState("none")
    const timeBarCount = useRef(1);
    const timeBarCountOneMin = useRef(3);
    const currDayTotalBars = 120;
    const currDayTotalBarsOneMin = 120*3;
    const currentTotalPEQuantity = useRef(0);
    const currentTotalCEQuantity = useRef(0);
    const currentTotalPEAvgPrice = useRef(0.0);
    const currentTotalCEAvgPrice = useRef(0.0);
    const maxTradeQuantity = useRef(0);

    const [priceRange, setPriceRange] = useState("vlow")

    let ceBuyOrderPending = false;
    let ceBuyOrderPendingTrade = null;
    let peBuyOrderPending = false;
    let peBuyOrderPendingTrade = null;

    const [ceStrikePrice, setCEStrikePrice] = useState(1);
    const [peStrikePrice, setPEStrikePrice] = useState(1);

    const stockDataArray = useRef(null);
    const ceDataArray = useRef(null);
    const peDataArray = useRef(null);
    const stockDataArrayOneMin = useRef(null);
    const ceDataArrayOneMin = useRef(null);
    const peDataArrayOneMin = useRef(null);

    const [tradeInfo, setTradeInfo] = useState("");
    const [historyInfo, setHistoryInfo] = useState("");
    const [orderType, setOrderType] = useState("R");
    const [optionType, setOptionType] = useState("Call");

    const [rrRatio, setRRRatio] = useState("l");
    const [stoploss, setStoploss] = useState(3.0);
    const [manageTarget, setManageTarget] = useState("0.0");
    const [targetPrice, setTargetPrice] = useState(0.0);

    const [tradeRecorder, setTradeRecorder] = useState([]);

    const nineEMALineStock = useRef([]);
    const twentyOneEMALineStock = useRef([]);
    const nineEMALineCE = useRef([]);
    const twentyOneEMALineCE = useRef([]);
    const nineEMALinePE = useRef([]);
    const twentyOneEMALinePE = useRef([]);

    const analyticsChartContainerStock = useRef(null);
    const analyticsChartContainerCE = useRef(null);
    const analyticsChartContainerPE = useRef(null);

    const analyticsCandlestickSeriesNifty = useRef(null);
    const analyticsCandlestickSeriesCE = useRef(null);
    const analyticsCandlestickSeriesPE = useRef(null);

    const analyticsChartNifty = useRef(null);
    const analyticsChartCE = useRef(null);
    const analyticsChartPE = useRef(null);

    const analyticsNineEMALineChartStock = useRef(null)
    const analyticsTwentyOneEMALineChartStock = useRef(null)

    const analyticsNineEMALineChartCE = useRef(null)
    const analyticsTwentyOneEMALineChartCE = useRef(null)

    const analyticsNineEMALineChartPE = useRef(null)
    const analyticsTwentyOneEMALineChartPE = useRef(null)
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
        analyticsChartNifty.current.resize(window.innerWidth*0.67, window.innerHeight*0.5)
        analyticsChartCE.current = createChart(analyticsChartContainerCE.current, chartPropertiesOptions);
        analyticsChartCE.current.resize(window.innerWidth*0.33, window.innerHeight*0.5)
        analyticsChartPE.current = createChart(analyticsChartContainerPE.current, chartPropertiesOptions);
        analyticsChartPE.current.resize(window.innerWidth*0.33, window.innerHeight*0.5)

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

        analyticsNineEMALineChartStock.current = analyticsChartNifty.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
        analyticsTwentyOneEMALineChartStock.current = analyticsChartNifty.current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

        analyticsNineEMALineChartCE.current = analyticsChartCE.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
        analyticsTwentyOneEMALineChartCE.current = analyticsChartCE.current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

        analyticsNineEMALineChartPE.current = analyticsChartPE.current.addSeries(LineSeries, { color: '#2962FF', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });
        analyticsTwentyOneEMALineChartPE.current = analyticsChartPE.current.addSeries(LineSeries, { color: '#26a69a', lineWidth: 1, lastValueVisible:false, priceLineVisible: false });

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
            analyticsChartNifty.current.resize(window.innerWidth*0.67, window.innerHeight*0.5)
            analyticsChartCE.current.resize(window.innerWidth*0.33, window.innerHeight*0.5)
            analyticsChartPE.current.resize(window.innerWidth*0.33, window.innerHeight*0.5)
        });
        return () => {
            analyticsChartNifty.current.remove();
            analyticsChartCE.current.remove();
            analyticsChartPE.current.remove();
        };
    }, []);

    const handleTradeReplayRequestSubmitted = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/tools?name=replay&type=alldata&forward=3&tradedate=' + tradeDate + "&opmaxv=" + priceIntervalRangeMap.get(priceRange)[1] + "&opminv=" + priceIntervalRangeMap.get(priceRange)[0], {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                const tradeReplayResponse = data['response']
                stockDataArray.current = tradeReplayResponse['price_action']['stock']
                ceDataArray.current = tradeReplayResponse['price_action']['ce'];
                peDataArray.current = tradeReplayResponse['price_action']['pe']

                stockDataArrayOneMin.current = tradeReplayResponse['price_action']['stock_1']
                ceDataArrayOneMin.current = tradeReplayResponse['price_action']['ce_1']
                peDataArrayOneMin.current = tradeReplayResponse['price_action']['pe_1']

                setCEStrikePrice(tradeReplayResponse['strike_price']['ce'])
                setPEStrikePrice(tradeReplayResponse['strike_price']['pe'])

                for (let i = 0; i < stockDataArray.current.length; i++) {
                    nineEMALineStock.current.push({time:stockDataArray.current[i]['time'], value: stockDataArray.current[i]['ema_9']})
                    twentyOneEMALineStock.current.push({time:stockDataArray.current[i]['time'], value: stockDataArray.current[i]['ema_21']})
                }
                for (let i = 0; i < ceDataArray.current.length; i++) {
                    nineEMALineCE.current.push({time:ceDataArray.current[i]['time'], value: ceDataArray.current[i]['ema_9']})
                    twentyOneEMALineCE.current.push({time:ceDataArray.current[i]['time'], value: ceDataArray.current[i]['ema_21']})
                }
                for (let i = 0; i < peDataArray.current.length; i++) {
                    nineEMALinePE.current.push({time:peDataArray.current[i]['time'], value: peDataArray.current[i]['ema_9']})
                    twentyOneEMALinePE.current.push({time:peDataArray.current[i]['time'], value: peDataArray.current[i]['ema_21']})
                }

                drawChart()
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleCEPEPriceReset = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/tools?name=replay&type=optionsdata&tradedate=' + tradeDate+ '&forward=' + timeBarCount.current*3, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                const tradeReplayResponse = data['response']
                ceDataArray.current = tradeReplayResponse['price_action']['ce'];
                peDataArray.current = tradeReplayResponse['price_action']['pe']

                setCEStrikePrice(tradeReplayResponse['strike_price']['ce'])
                setPEStrikePrice(tradeReplayResponse['strike_price']['pe'])

                nineEMALineCE.current = []
                twentyOneEMALineCE.current = []
                nineEMALinePE.current = []
                twentyOneEMALinePE.current = []

                for (let k = 0; k < ceDataArray.current.length; k++) {
                    nineEMALineCE.current.push({time:ceDataArray.current[k]['time'], value: ceDataArray.current[k]['ema_9']})
                    twentyOneEMALineCE.current.push({time:ceDataArray.current[k]['time'], value: ceDataArray.current[k]['ema_21']})
                }
                for (let p = 0; p < peDataArray.current.length; p++) {
                    nineEMALinePE.current.push({time:peDataArray.current[p]['time'], value: peDataArray.current[p]['ema_9']})
                    twentyOneEMALinePE.current.push({time:peDataArray.current[p]['time'], value: peDataArray.current[p]['ema_21']})
                }

                console.log(ceDataArray.current);
                console.log(peDataArray.current);

                drawChart()
                // Handle data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    function drawChart() {
        analyticsNineEMALineChartStock.current.setData(nineEMALineStock.current.slice(0, nineEMALineStock.current.length-currDayTotalBars+timeBarCount.current));
        analyticsTwentyOneEMALineChartStock.current.setData(twentyOneEMALineStock.current.slice(0, twentyOneEMALineStock.current.length-currDayTotalBars+timeBarCount.current));

        analyticsNineEMALineChartCE.current.setData(nineEMALineCE.current.slice(0, nineEMALineCE.current.length-currDayTotalBars+timeBarCount.current));
        analyticsTwentyOneEMALineChartCE.current.setData(twentyOneEMALineCE.current.slice(0, twentyOneEMALineCE.current.length-currDayTotalBars+timeBarCount.current));

        analyticsNineEMALineChartPE.current.setData(nineEMALinePE.current.slice(0, nineEMALinePE.current.length-currDayTotalBars+timeBarCount.current));
        analyticsTwentyOneEMALineChartPE.current.setData(twentyOneEMALinePE.current.slice(0, twentyOneEMALinePE.current.length-currDayTotalBars+timeBarCount.current));

        const stockSlicedArray = stockDataArray.current.slice(0, stockDataArray.current.length-currDayTotalBars+timeBarCount.current);
        analyticsCandlestickSeriesNifty.current.setData(stockSlicedArray);
        const ceSlicedArray = ceDataArray.current.slice(0, ceDataArray.current.length-currDayTotalBars+timeBarCount.current);
        analyticsCandlestickSeriesCE.current.setData(ceSlicedArray);
        const peSlicedArray = peDataArray.current.slice(0, peDataArray.current.length-currDayTotalBars+timeBarCount.current);
        analyticsCandlestickSeriesPE.current.setData(peSlicedArray);

        analyticsChartNifty.current.timeScale().fitContent();
        analyticsChartCE.current.timeScale().fitContent();
        analyticsChartPE.current.timeScale().fitContent();
    }

    const handleTimePrev = (event) => {
        event.preventDefault();
        timeBarCount.current = timeBarCount.current - 1
        drawChart()
    }

    function performBuyAction(tradeData, time) {
        let currentBuyQuantity = currentTotalPEQuantity.current;
        let currentAvgPrice = currentTotalPEAvgPrice.current;
        if (optionType === "Call") {
            currentBuyQuantity = currentTotalCEQuantity.current;
            currentAvgPrice = currentTotalCEAvgPrice.current;
        }

        tradeData['time'] = formatDateTimeLocale(time);

        currentAvgPrice = ((currentBuyQuantity*currentAvgPrice) + (tradeData['quantity']*tradeData['price']))/(currentBuyQuantity + tradeData['quantity']);
        currentBuyQuantity = currentBuyQuantity + tradeData['quantity'];

        if (optionType === "Call") {
            currentTotalCEQuantity.current = currentBuyQuantity;
            currentTotalCEAvgPrice.current = currentAvgPrice;
        } else {
            currentTotalPEQuantity.current = currentBuyQuantity;
            currentTotalPEAvgPrice.current = currentAvgPrice;
        }

        tradeRecorder.push(tradeData);
        setTradeInfo(getTradeInfoContent())
    }

    function performSellAction(sellPrice, type, time) {
        const currentBuyQuantity = type === "Call" ? currentTotalCEQuantity.current : currentTotalPEQuantity.current;
        const currentAvgPrice = type === "Call" ? currentTotalCEAvgPrice.current : currentTotalPEAvgPrice.current;
        const strikePrice = type === "Call" ? ceStrikePrice : peStrikePrice;

        console.log(type);
        console.log(currentBuyQuantity);
        console.log(currentAvgPrice);

        const tradeData = new Map();
        tradeData['type'] = type;
        tradeData['strike_price'] = strikePrice;
        tradeData['price'] = sellPrice;
        tradeData['quantity'] = currentBuyQuantity;
        tradeData['time'] = formatDateTimeLocale(time);
        tradeData['action'] = 'SELL';

        const tradeProfitPoints = sellPrice - currentAvgPrice;
        const overallProfitPoints = ((sellPrice*tradeData['quantity']) - (currentAvgPrice*currentBuyQuantity))/maxTradeQuantity.current;
        if (type === "Call") {
            currentTotalCEQuantity.current = 0;
            currentTotalCEAvgPrice.current = 0.0;
        } else {
            currentTotalPEQuantity.current = 0;
            currentTotalPEAvgPrice.current = 0.0;
        }

        setTradeInfo("\nTrade Profit Points :: " + tradeProfitPoints.toFixed(2)
            + "\nTotal Profit Points :: " + overallProfitPoints.toFixed(2));

        tradeRecorder.push(tradeData);
    }

    function getTradeInfoContent() {
        let infoContent = '';
        let cePresent = false;
        let pePresent = false;
        for (let i = 0; i < tradeRecorder.length; i++) {
            const tradeData = tradeRecorder[i];
            if (tradeData['type'] === "Call") {cePresent = true;}
            if (tradeData['type'] === "Put") {pePresent = true;}
            infoContent = infoContent + "\n" + tradeData['type'] + " " + tradeData['quantity'] + " " + tradeData['price'] + " " + tradeData['stoploss'] + " " + formatTimeLocale(tradeData['rawTime']);
        }
        if (cePresent)
            infoContent += '\nAvg CE Price :: ' + currentTotalCEAvgPrice.current + ' \n';
        if (pePresent)
            infoContent += '\nAvg PE Price :: ' + currentTotalPEAvgPrice.current + ' \n';
        return infoContent;
    }

    const handleBuyOptions = (event) => {
        event.preventDefault();

        const optionDataArray = optionType === "Call" ? ceDataArray : peDataArray;
        const quantityType = optionType === "Call" ? "cequantity" : "pequantity";
        const strikePrice = optionType === "Call" ? ceStrikePrice : peStrikePrice;

        const currentBarData = optionDataArray.current[optionDataArray.current.length-currDayTotalBars+timeBarCount.current-1+1];
        let buyPrice = currentBarData['open']+0.5
        if (orderType === "RL") {
            buyPrice = targetPrice;
        } else if (orderType === "RT") {
            buyPrice = targetPrice + 0.5;
        }
        console.log("Buy Price :: " + buyPrice);
        fetch('http://' + ipAddress + ':9060/tools?name=replay&type=' + quantityType + '&stoploss=' + stoploss + "&riskreward=" + rrRatio + "&price=" + buyPrice + "&tradedate=" + tradeDate, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const quantity = data['response']['quantity'];
                const batchCount = data['response']['batch_count']
                const percentage =  data['response']['percentage']

                maxTradeQuantity.current =  data['response']['max_quantity']

                const tradeData = new Map();
                tradeData['type'] = optionType;
                tradeData['strike_price'] = strikePrice;
                tradeData['price'] = buyPrice;
                tradeData['targetPrice'] = targetPrice;
                tradeData['stoploss'] = stoploss;
                tradeData['quantity'] = quantity*batchCount;
                tradeData['time'] = formatDateTimeLocale(currentBarData['time']);
                tradeData['rawTime'] =  parseInt(currentBarData['time']);
                tradeData['percentage'] = percentage;
                tradeData['action'] = 'BUY';

                if (orderType === "RL" || orderType === "RT") {
                    console.log("Future Action " + orderTypeOptions + " " + optionType)
                    if (optionType === "Call") {
                        ceBuyOrderPendingTrade = tradeData;
                        ceBuyOrderPending = true;
                    } else {
                        peBuyOrderPendingTrade = tradeData;
                        peBuyOrderPending = true;
                    }
                }
                else {
                    performBuyAction(tradeData, currentBarData['time'])
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleSellOptions = (event) => {
        event.preventDefault();

        let optionDataArray = peDataArray;
        if (optionType === "Call") {
            optionDataArray = ceDataArray;
        }

        const optionCurrentBarData = optionDataArray.current[optionDataArray.current.length - currDayTotalBars + timeBarCount.current-1];
        const optionNextBarData = optionDataArray.current[optionDataArray.current.length - currDayTotalBars + timeBarCount.current];
        let sellPrice = optionCurrentBarData['close']-0.5

        if (optionCurrentBarData['low'] <= stoploss && optionCurrentBarData['high'] >= stoploss) {
            sellPrice = stoploss - 0.5;
        }
        performSellAction(sellPrice, optionType, optionNextBarData['time']-1)
    }

    function formatTimeLocale(barTime) {
        const barDate = new Date((barTime - (5.5*60*60)) *1000)
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false, second:'2-digit' }; // Use hour12: false for 24-hour format
        const formattedTime = barDate.toLocaleTimeString('en-GB', timeOptions);

        return `${formattedTime}`;
    }

    function formatDateTimeLocale(barTime) {
        const barDate = new Date((barTime - (5.5*60*60))*1000)
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false, second:'2-digit' }; // Use hour12: false for 24-hour format

        const formattedDate = barDate.toLocaleDateString('en-GB', dateOptions).replace(/\//g, '-'); // 'en-GB' for dd/mm/yyyy
        const formattedTime = barDate.toLocaleTimeString('en-GB', timeOptions);

        return `${formattedDate} ${formattedTime}`;
    }

    function updateStoploss(stoplossValue) {
        setStoploss(parseFloat(stoplossValue));
        for(let i=0;i<tradeRecorder.length;i++) {
            const tradeData = tradeRecorder[i];
            tradeData['stoploss'] = stoplossValue;
            tradeRecorder[i] = tradeData;
        }

        setTradeInfo(getTradeInfoContent())
    }

    const handleSubmitTradeData = (event) => {
        event.preventDefault();
        console.log(tradeRecorder);

        const dataToSend = {
            'tradedate': tradeDate,
            'tradesList': tradeRecorder,
            'strategy': tradeStrategy,
            'type':'tradesubmit'
        };
        const jsonString = JSON.stringify(dataToSend);
        setTradeRecorder([]);
        console.log(jsonString);

        fetch('http://' + ipAddress + ':9060/tools?name=replay', {
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
                setHistoryInfo(data['response']['history'])
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleClearPendingOrders = (event) => {
        event.preventDefault();
        ceBuyOrderPending = false;
        peBuyOrderPending = false;
        ceBuyOrderPendingTrade = null;
        peBuyOrderPendingTrade = null;
    };

    const handleSubmitTradeReset = (event) => {
        event.preventDefault();
        const dataToSend = {
            'tradedate': tradeDate,
            'type':'tradereset'
        };
        const jsonString = JSON.stringify(dataToSend);
        setTradeRecorder([]);
        setHistoryInfo("")
        setTradeInfo("")

        fetch('http://' + ipAddress + ':9060/tools?name=replay', {
            method: 'POST',
            body: jsonString,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'false',
            },
        })
            .then((response) => response.json())
            .then((data) => {
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const handleClearCurrentTrade = (event) => {
        event.preventDefault();

        setTradeRecorder([]);
        setHistoryInfo("")
        setTradeInfo("");

        ceBuyOrderPending = false;
        peBuyOrderPending = false;
        ceBuyOrderPendingTrade = null;
        peBuyOrderPendingTrade = null;
    }

    function setRatioAndPrice(fieldValue) {
        const splitValues = fieldValue.split(' ')
        setRRRatio(splitValues[0]);
        if (splitValues.length > 1) {
            setTargetPrice(parseFloat(splitValues[1]));
        }
    }

    const handleInputPageRedirection = (event) => {
        event.preventDefault();
        navigate("/");
    }

    function getAggregatedBar(barArray) {
        if (barArray.length === 1) {
            return barArray[0];
        } else if (barArray.length === 2) {
            const resultData = barArray[0];
            resultData['time'] = barArray[0]['time'];
            resultData['low'] = Math.min(barArray[0]['low'], barArray[1]['low']);
            resultData['high'] = Math.max(barArray[0]['high'], barArray[1]['high']);
            resultData['open'] = barArray[0]['open']
            resultData['close'] = barArray[1]['close']
            return resultData
        }
        return barArray[0]
    }

    const handleTimeNextOneMin = (event) => {
        event.preventDefault();

        timeBarCountOneMin.current = timeBarCountOneMin.current + 1
        if (timeBarCountOneMin.current % 3 === 0) {
            timeBarCount.current = timeBarCount.current + 1
        }
        const stockData = stockDataArray.current[stockDataArray.current.length-currDayTotalBars+timeBarCount.current-1];
        const ceData = ceDataArray.current[ceDataArray.current.length-currDayTotalBars+timeBarCount.current-1];
        const peData = peDataArray.current[peDataArray.current.length-currDayTotalBars+timeBarCount.current-1];

        const stockDataOneMinArray = []
        const ceDataOneMinArray = []
        const peDataOneMinArray = []


        if  (timeBarCountOneMin.current % 3 === 1) {
            stockDataOneMinArray.push(stockDataArrayOneMin.current[stockDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-1])
            ceDataOneMinArray.push(ceDataArrayOneMin.current[ceDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-1])
            peDataOneMinArray.push(peDataArrayOneMin.current[peDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-1])
        } else if (timeBarCountOneMin.current % 3 === 2) {
            stockDataOneMinArray.push(stockDataArrayOneMin.current[stockDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-2])
            stockDataOneMinArray.push(stockDataArrayOneMin.current[stockDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-1])

            ceDataOneMinArray.push(ceDataArrayOneMin.current[ceDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-2])
            ceDataOneMinArray.push(ceDataArrayOneMin.current[ceDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-1])

            peDataOneMinArray.push(peDataArrayOneMin.current[peDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-2])
            peDataOneMinArray.push(peDataArrayOneMin.current[peDataArrayOneMin.current.length-currDayTotalBarsOneMin+timeBarCountOneMin.current-1])
        } else if (timeBarCountOneMin.current % 3 === 0) {
            stockDataOneMinArray.push(stockData)
            ceDataOneMinArray.push(ceData)
            peDataOneMinArray.push(peData)
        }

        const stockDataAgg = getAggregatedBar(stockDataOneMinArray)
        const ceDataAgg = getAggregatedBar(ceDataOneMinArray)
        const peDataAgg = getAggregatedBar(peDataOneMinArray)

        analyticsCandlestickSeriesNifty.current.update(stockDataAgg, false);
        analyticsCandlestickSeriesCE.current.update(ceDataAgg, false);
        analyticsCandlestickSeriesPE.current.update(peDataAgg, false);

        if (ceBuyOrderPending === true || peBuyOrderPending === true) {
            if (ceBuyOrderPending === true && ceBuyOrderPendingTrade['targetPrice'] <= ceDataAgg['high'] && ceBuyOrderPendingTrade['targetPrice'] >= ceDataAgg['low']) {
                performBuyAction(ceBuyOrderPendingTrade, ceDataAgg['time'])
                ceBuyOrderPending = false;
                ceBuyOrderPendingTrade = null;
            } else if (peBuyOrderPending === true && peBuyOrderPendingTrade['targetPrice'] <= peDataAgg['high'] && peBuyOrderPendingTrade['targetPrice'] >= peDataAgg['low']) {
                performBuyAction(peBuyOrderPendingTrade, peDataAgg['time'])
                peBuyOrderPending = false;
                peBuyOrderPendingTrade = null;
            }
        }

        console.log(stoploss)
        console.log(currentTotalPEQuantity.current)
        if (currentTotalPEQuantity.current > 0 || currentTotalCEQuantity.current > 0) {
            if (currentTotalCEQuantity.current > 0 && ceDataAgg['low'] <= stoploss && ceDataAgg['high'] >= stoploss) {
                performSellAction(stoploss-0.5, "Call", ceDataAgg['time']-1)
            } else if (currentTotalPEQuantity.current > 0 && peDataAgg['low'] <= stoploss && peDataAgg['high'] >= stoploss) {
                performSellAction(stoploss-0.5, "Put", peDataAgg['time']-1)
            }
        }

        if (timeBarCountOneMin.current % 3 === 0) {
            analyticsNineEMALineChartStock.current.update(nineEMALineStock.current[nineEMALineStock.current.length - currDayTotalBars + timeBarCount.current - 1], false);
            analyticsTwentyOneEMALineChartStock.current.update(twentyOneEMALineStock.current[twentyOneEMALineStock.current.length - currDayTotalBars + timeBarCount.current - 1], false);

            analyticsNineEMALineChartCE.current.update(nineEMALineCE.current[nineEMALineCE.current.length - currDayTotalBars + timeBarCount.current - 1], false);
            analyticsTwentyOneEMALineChartCE.current.update(twentyOneEMALineCE.current[twentyOneEMALineCE.current.length - currDayTotalBars + timeBarCount.current - 1], false);

            analyticsNineEMALineChartPE.current.update(nineEMALinePE.current[nineEMALinePE.current.length - currDayTotalBars + timeBarCount.current - 1], false);
            analyticsTwentyOneEMALineChartPE.current.update(twentyOneEMALinePE.current[twentyOneEMALinePE.current.length - currDayTotalBars + timeBarCount.current - 1], false);
        }
    }

    const handleTimeNext = (event) => {
        event.preventDefault();
        timeBarCount.current = timeBarCount.current + 1
        timeBarCountOneMin.current = timeBarCountOneMin.current + 3

        const stockData = stockDataArray.current[stockDataArray.current.length-currDayTotalBars+timeBarCount.current-1];
        analyticsCandlestickSeriesNifty.current.update(stockData, false);
        const ceData = ceDataArray.current[ceDataArray.current.length-currDayTotalBars+timeBarCount.current-1];
        analyticsCandlestickSeriesCE.current.update(ceData, false);
        const peData = peDataArray.current[peDataArray.current.length-currDayTotalBars+timeBarCount.current-1];
        analyticsCandlestickSeriesPE.current.update(peData, false);

        if (ceBuyOrderPending === true || peBuyOrderPending === true) {
            if (ceBuyOrderPending === true && ceBuyOrderPendingTrade['targetPrice'] <= ceData['high'] && ceBuyOrderPendingTrade['targetPrice'] >= ceData['low']) {
                performBuyAction(ceBuyOrderPendingTrade, ceData['time'])
                ceBuyOrderPending = false;
                ceBuyOrderPendingTrade = null;
            } else if (peBuyOrderPending === true && peBuyOrderPendingTrade['targetPrice'] <= peData['high'] && peBuyOrderPendingTrade['targetPrice'] >= peData['low']) {
                performBuyAction(peBuyOrderPendingTrade, peData['time'])
                peBuyOrderPending = false;
                peBuyOrderPendingTrade = null;
            }
        }

        console.log(stoploss)
        console.log(currentTotalPEQuantity.current)
        if (currentTotalPEQuantity.current > 0 || currentTotalCEQuantity.current > 0) {
            if (currentTotalCEQuantity.current > 0 && ceData['low'] <= stoploss && ceData['high'] >= stoploss) {
                performSellAction(stoploss-0.5, "Call", ceData['time']-1)
            } else if (currentTotalPEQuantity.current > 0 && peData['low'] <= stoploss && peData['high'] >= stoploss) {
                performSellAction(stoploss-0.5, "Put", peData['time']-1)
            }
        }

        analyticsNineEMALineChartStock.current.update(nineEMALineStock.current[nineEMALineStock.current.length-currDayTotalBars+timeBarCount.current-1], false);
        analyticsTwentyOneEMALineChartStock.current.update(twentyOneEMALineStock.current[twentyOneEMALineStock.current.length-currDayTotalBars+timeBarCount.current-1], false);

        analyticsNineEMALineChartCE.current.update(nineEMALineCE.current[nineEMALineCE.current.length-currDayTotalBars+timeBarCount.current-1], false);
        analyticsTwentyOneEMALineChartCE.current.update(twentyOneEMALineCE.current[twentyOneEMALineCE.current.length-currDayTotalBars+timeBarCount.current-1], false);

        analyticsNineEMALineChartPE.current.update(nineEMALinePE.current[nineEMALinePE.current.length-currDayTotalBars+timeBarCount.current-1], false);
        analyticsTwentyOneEMALineChartPE.current.update(twentyOneEMALinePE.current[twentyOneEMALinePE.current.length-currDayTotalBars+timeBarCount.current-1], false);
    }

    return (
        <div>
            <div style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'68%', height:'80%'}}>
                <div style={{float:"left", marginLeft:'1%', width:'96%', height:'40%', border: '2px solid black'}} ref={analyticsChartContainerStock}></div>
                <div style={{clear:"both", float:"left", marginLeft:'1%', marginRight:'1%', marginTop:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerCE}></div>
                <div style={{float:"left", marginTop:'1%', marginLeft:'1%', width:'47%', border: '1px solid black'}} ref={analyticsChartContainerPE}></div>
            </div>
            <div style={{float:"left", marginTop:'1%', marginBottom:'1%', marginLeft:'1%', border: '1px solid black', width:'25%', height:'80%'}}>
                <div style={{float:"left", marginTop:'1%', marginBottom:'1%', border: '1px solid black', width:'70%'}}>
                    <h4>TRADE-REPLAYER</h4>
                    <form name="analytics" onSubmit={handleTradeReplayRequestSubmitted} style={{float:"left", marginRight:'1%'}}>
                        <label style={{float:"left"}}> Enter Trade Date:
                            <input type="text" value={tradeDate} onChange={(e) => setTradeDate(e.target.value)}/>
                        </label>
                        <input style={{clear:"both", float:"left", marginTop:'1%', marginLeft:'1%'}} type="submit"/>
                    </form>

                    <label style={{clear:"both", float:"left", marginLeft:'1%'}}>Price Interval
                        <select name="PriceRange" id="optionType" defaultValue={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                            {optionvaluerangeoptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button type="button" onClick={handleTimePrev} title="timeNext" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Prev</button>
                    <button type="button" onClick={handleTimeNext} title="timeNext" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Next</button>
                    <button type="button" onClick={handleTimeNextOneMin} title="timeNext" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Next-1</button>
                    <button type="button" id="inputPage" onClick={handleInputPageRedirection} title="inputPage" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Back to Input</button>
                </div>
                <div style={{float:"left", width:"80%",  border: '1px solid black'}}>
                    <div style={{float:"left", marginTop:'1%', marginLeft:'1%', marginBottom:'1%'}}>
                        <h5 style={{clear:"both", float:"left"}}>CE - {ceStrikePrice}  PE - {peStrikePrice}</h5>
                        <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}} name="tradeInfo" rows={6} cols={30} value={tradeInfo}>{tradeInfo}</textarea>
                    </div>
                    <div style={{clear:"both", float:"left", marginTop:"1%"}}>
                        <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="OrderTYPE" id="ordertype" defaultValue="1" onChange={(e) => setOrderType(e.target.value)}>
                            {orderTypeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="OptionsType" id="optionstype" defaultValue="1" onChange={(e) => setOptionType(e.target.value)}>
                            {optionstype.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <input type="text" style={{width:'25%', float:"left", marginLeft:"1%"}} onChange={(e) => setRatioAndPrice(e.target.value)}/>
                        <input type="text" value={stoploss} style={{width:'10%', float:"left", marginLeft:"1%"}} onChange={(e) => updateStoploss(parseFloat(e.target.value))}/>
                    </div>

                    <button type="button" onClick={handleBuyOptions} title="buyoptions" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Buy</button>
                    <button type="button" onClick={handleSellOptions} title="selloptions" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Sell</button>
                    <label style={{clear:"both", float:"left", marginTop:'1%'}}>Strategy:: </label>
                    <select style={{float:"left", marginTop:'1%', fontSize:'.75rem'}} name="tradeStrategy" id="tradeStrategy" defaultValue="none" onChange={(e) => setTradeStrategy(e.target.value)}>
                        {tradestrategyoptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <label style={{clear:"both", float:"left", marginTop:'1%'}}>Manage Trade :: </label>
                    <input type="text" style={{width:'25%', float:"left", marginLeft:"1%"}} onChange={(e) => setManageTarget(e.target.value)}/>
                </div>

                <div style={{clear:"both", float:"left", width:"80%", marginTop:'3%'}}>
                    <button type="button" onClick={handleSubmitTradeData} title="submitTradeData" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Submit Trade Data</button>
                    <button type="button" onClick={handleSubmitTradeReset} title="submitTradeReset" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Reset Trade Data</button>
                    <button type="button" onClick={handleClearPendingOrders} title="clearPendingOrders" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Clear Pending Orders</button>
                    <button type="button" onClick={handleClearCurrentTrade} title="clearCurrentTrade" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Clear Current Trade</button>
                    <button type="button" onClick={handleCEPEPriceReset} title="resetcepe" style={{float:"left", marginTop:"1%", marginRight:'1%', marginLeft:'1%'}}>Reset CE-PE</button>

                    <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}} name="historyInfo" rows={15} cols={50} value={historyInfo}>{historyInfo}</textarea>
                </div>
            </div>
        </div>
    )
}


export default TradeReplayer;