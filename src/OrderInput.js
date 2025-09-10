import { useState, useEffect, useRef } from "react";

import notificationSound from './alarm01.mp3';
import {
    strategyoptions,
    orderstrategyoptions,
    orderTypeOptions, previousDayOptions,
    todayStartOptions,
    baroptions, optionstype, tradestrategyoptions
} from "./StrategyVariables";

const OrderInput = ({tradingStyle, ipAddress, replaySpeed, ceStrikePrice, peStrikePrice, tradeDate}) => {
    const [orderType, setOrderType] = useState("R")
    const [orderStrategy, setOrderStrategy] = useState("breakout")
    const [stoploss, setStoploss] = useState("3")
    const [ratio, setRatio] = useState("l")
    const [targetValue, setTargetValue] = useState(0.0)
    const [cmdInputMngTd, setCmdInputMngTd] = useState("")
    const [tdMngmtCmd, setTdMngmtCmd] = useState("L")
    const [strategyValue, setStrategyValue] = useState("fast")
    const [tdInfoCmd, setTdInfoCmd] = useState("P")
    const [orderInfo, setOrderInfo] = useState("OrderInfo")
    const [tradeInfo, setTradeInfo] = useState("TradeInfo")
    const [timeInfo, setTimeInfo] = useState("")
    const absCommandDiffValue = -0.00
    const barCurrentTime = useRef(new Date())
    const nextAudioTime = useRef(1)
    const minuteEndAlarm = new Audio(notificationSound);

    const onCEOrderPlaced = (event) => {
        event.preventDefault();
        placeOrder("CE")
        setRatio("l")
    }

    const onPEOrderPlaced = (event) => {
        event.preventDefault();
        placeOrder("PE")
        setRatio("l")
    }

    function placeOrder(optionsType) {
        const ratiocommands = ratio.split(" ");
        const riskrewardType = ratiocommands[0];
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/orderplace?optiontype=' + optionsType + "&command=" + orderType + "&stoploss=" + stoploss + "&ratiotype=" + ratio + "&target=" + targetValue.toString() + "&strategy=" + orderStrategy, {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onTdManagementCommandPlaced = (event) => {
        event.preventDefault();
        const cmdParams = cmdInputMngTd.replace(" ", "|");
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/ordermngmnt?command=' + tdMngmtCmd + "&params=" + cmdParams, {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });

        setTdMngmtCmd("L")
    }

    const onStrategyCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/ordermngmnt?command=STRATGY&params=' + strategyValue, {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onLNManagementCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + "/ordermngmnt?command=LN&params=", {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onLN1ManagementCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + "/ordermngmnt?command=LN&params=1", {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onLN2ManagementCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + "/ordermngmnt?command=LN&params=2", {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onBLManagementCommandPlaced = (event) => {
        event.preventDefault();
        postBLCommand("low");
    }

    const onBLMidManagementCommandPlaced = (event) => {
        event.preventDefault();
        postBLCommand("mid");
    }

    function postBLCommand(barPosition) {
        const cmdParams = barPosition + "|" + cmdInputMngTd.replace(" ", "|");
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + "/ordermngmnt?command=BL&params=" + cmdParams, {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onOrderBlockerPlaced = (event) => {
        event.preventDefault();
        postOrderBlockerCommand("0");
    }
    const onOrderBlockerPlaced1 = (event) => {
        event.preventDefault();
        postOrderBlockerCommand("1");
    }
    const onOrderBlockerPlaced2 = (event) => {
        event.preventDefault();
        postOrderBlockerCommand("2");
    }

    function postOrderBlockerCommand(barCount) {
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + "/blockorders?count=" + barCount, {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }


    const onABSManagementCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + "/ordermngmnt?command=ABS&params=" + absCommandDiffValue.toString(), {
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
                console.log(data);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onTdInfoCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/tradeinfo?command=' + tdInfoCmd, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Access-Control-Allow-Origin':'true'
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTradeInfo(data['response']);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        const timeInfoInterval = setInterval(() => {
            fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/timeinfo', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Access-Control-Allow-Origin':'true'
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const barTimeDate = new Date((data['response']['time']-19800) * 1000)
                    const barTime = barTimeDate.getHours() + ":" + barTimeDate.getMinutes() + ":" + barTimeDate.getSeconds()
                    setTimeInfo(barTime)
                    if (nextAudioTime.current === 1) {
                        nextAudioTime.current = (Math.floor(barTimeDate.getMinutes()/3) * 3) + 3
                    }

                    console.log(nextAudioTime.current);
                    barCurrentTime.current = barTimeDate
                    // Handle data
                })
                .catch((err) => {
                    console.log(err.message);
                });
            if (((barCurrentTime.current.getMinutes()+1) === nextAudioTime.current) && (barCurrentTime.current.getSeconds() > 20)) {
                console.log(nextAudioTime.current);
                console.log(barCurrentTime.current);
                minuteEndAlarm.play();
                minuteEndAlarm.play();
                nextAudioTime.current = nextAudioTime.current + 3
            }

        }, replaySpeed*1000*10)

        return () => clearInterval(timeInfoInterval);
    }, []);

    useEffect(() => {
        const orderStateInterval = setInterval(() => {
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
        }, 6000);

        return () => clearInterval(orderStateInterval);
    }, []);

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
            <div style={{float:"left"}}>
                <label style={{clear:"both", float:"left", marginLeft:'1%'}}>CE :: {ceStrikePrice} PE :: {peStrikePrice}</label>
                <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%', fontSize:'0.6rem'}} name="orderInfo" rows={10} cols={40} value={orderInfo}>value</textarea>
                <button style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%'}} type="button"
                        onClick={onOrderInfo}
                        title="OrderState">OrderState</button>
                <p></p>
            </div>
            <div style={{float:"left", marginTop:'1%', marginRight: '1%', marginLeft: '1%'}}>
                <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Order Type :: </label>
                <div style={{clear:"both", float:"left"}}>
                {orderTypeOptions.map((option) => (
                    <div key={option.value} style={{float:"left"}}>
                        <input
                            type="radio"
                            id={option.value}
                            name="orderTypeOptionsRadioGroup" // All radios in a group must have the same name
                            value={option.value}
                            checked={orderType === option.value}
                            onChange={(e) => setOrderType(e.target.value)}
                        />
                        <label htmlFor={option.value}>{option.label}</label>
                    </div>
                ))}
                </div>
                <label style={{clear:"both", float:"left", marginTop:'1%', marginLeft: '1%'}}>Choose Order Strategy :: </label>
                <div style={{clear:"both", float:"left", marginBottom:'1%'}}>
                    <select style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="orderStrategyRadioGroup" id="orderStrategyRadioGroup" defaultValue="1" onChange={(e) => setOrderStrategy(e.target.value)}>
                        {tradestrategyoptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <select  style={{clear:"both", float:"left", marginTop:'1%'}} name="RatioValue" id="ratioValue" defaultValue={ratio} value={ratio} onChange={(e) => setRatio(e.target.value)}>
                    <option>l</option>
                    <option>m</option>
                    <option>h</option>
                </select>
                <input style={{float:"left", marginTop:'1%', width:'12%'}} type="targetInput" value={targetValue}  onChange={(e) => setTargetValue(e.target.value)}/>
                <input style={{float:"left", marginLeft: '1%', marginTop:'1%', width:'12%'}} type="commandInput" value={stoploss}  onChange={(e) => setStoploss(e.target.value)}/>
                <button style={{float:"left", marginTop:'1%', marginLeft: '1%'}} type="button" onClick={onCEOrderPlaced} title="PlaceOrderCE">CE-Order</button>
                <button style={{float:"left", marginTop:'1%', marginLeft: '1%'}} type="button" onClick={onPEOrderPlaced} title="PlaceOrderPE">PE-Order</button>
                <button style={{clear:"both", float:"left", marginTop:'1%'}} type="button" onClick={onOrderBlockerPlaced} title="OrderBlocker">BLK</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onOrderBlockerPlaced1} title="OrderBlocker1">BLK1</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onOrderBlockerPlaced2} title="OrderBlocker2">BLK2</button>

            </div>
            <p></p>
            <div style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>
                <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Trade Management Command :: </label>
                <select  style={{float:"left", marginTop:'1%'}} name="ManagementCmd" id="managementCmd" defaultValue={tdMngmtCmd} value={tdMngmtCmd} onChange={(e) => setTdMngmtCmd(e.target.value)}>
                    <option>L</option>
                    <option>LT</option>
                    <option>LTO</option>
                    <option>LN</option>
                    <option>Q</option>
                    <option>QT</option>
                    <option>ABS</option>
                </select>
                <input style={{float:"left", marginLeft: '1%', marginTop:'1%',  width:'15%'}} type="commandInput" value={cmdInputMngTd}  onChange={(e) => setCmdInputMngTd(e.target.value)}/>
                <select  style={{float:"left", marginTop:'1%', marginLeft:'1%'}} name="StrategyValue" id="strategyValue" defaultValue={strategyValue} onChange={(e) => setStrategyValue(e.target.value)}>
                    <option>fast</option>
                    <option>scalp</option>
                    <option>e</option>
                </select>
                <button style={{clear:"both", float:"left", marginTop:'1%'}} type="button" onClick={onTdManagementCommandPlaced} title="ManageTrade">ManageTrade</button>
                <p></p>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onLNManagementCommandPlaced} title="LN">LN</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onLN1ManagementCommandPlaced} title="LN-1">LN-1</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onLN2ManagementCommandPlaced} title="LN-2">LN-2</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onBLManagementCommandPlaced} title="BL">BL</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onBLMidManagementCommandPlaced} title="BL-Mid">BL-Mi</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onABSManagementCommandPlaced} title="ABS">ABS</button>
                <button style={{float:"left", marginTop:'1%', marginLeft:'1%'}} type="button" onClick={onStrategyCommandPlaced} title="Strategy">STRATGY</button>
            </div>
            <div style={{float:"left", marginTop:'1%', marginRight: '1%'}}>
                <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Info Command :: </label>
                <select style={{float:"left", marginTop:'1%'}} name="InfoCmd" id="infoCmd" defaultValue={tdInfoCmd} onChange={(e) => setTdInfoCmd(e.target.value)}>
                    <option>H</option>
                    <option>P</option>
                    <option>R</option>
                    <option>RS</option>
                </select>
                <button style={{clear:"both", float:"left", marginTop:'1%'}} type="button" onClick={onTdInfoCommandPlaced} title="TradeInfo">TradeInfo</button>
                <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%', fontSize:'0.6rem'}} name="tradeInfo" rows={10} cols={40} value={tradeInfo} readOnly={true}>info</textarea>
            </div>
        </div>
    );
};

export default OrderInput;