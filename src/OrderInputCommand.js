import { useState, useEffect, useRef } from "react";
import {useReactMediaRecorder} from "react-media-recorder";
import { useNavigate } from 'react-router-dom';
import notificationSound from './alarm01.mp3';
import {
    orderTypeOptions, orderstrategyoptions
} from "./StrategyVariables";
import {useLocation} from "react-router-dom";


const OrderInputCommand = () =>{

    const location = useLocation();
    const ipAddress = location.state['ipAddress'];
    const tradingStyle = location.state['tradingStyle'];
    const tradeDate = location.state['tradeDate']
    const rangeLow = location.state['rangeLow'];
    const rangeHigh = location.state['rangeHigh'];
    const [ceStrikePrice, setCEStrikePrice] = useState(location.state['ceStrikePrice'])
    const [peStrikePrice, setPEStrikePrice] = useState(location.state['peStrikePrice'])

    const absCommandDiffValue = -0.00
    const isRecording = useRef(false);
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ screen: true, video:true }); // Set screen: true for screen recording
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
    const barCurrentTime = useRef(new Date())
    const nextAudioTime = useRef(1)
    const minuteEndAlarm = new Audio(notificationSound);
    const navigate = useNavigate();

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
                setCEStrikePrice(data['response']['ce_strike_price']);
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
                console.log(data);
                setPEStrikePrice(data['response']['pe_strike_price']);
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
                    // Handle data
                })
                .catch((err) => {
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
            <label style={{clear:"both", float:"left", marginLeft:'1%'}} id="cepeLable">CE :: {ceStrikePrice} PE :: {peStrikePrice}</label>
            <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}} name="orderInfo" rows={10} cols={40} value={orderInfo}>value</textarea>
            <button style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%'}} type="button"
                    onClick={onOrderInfo}
                    title="OrderState">OrderState</button>
            <p></p>
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
                {orderstrategyoptions.map((option) => (
                    <div key={option.value} style={{float:"left"}}>
                        <input
                            type="radio"
                            id={option.value}
                            name="orderStrategyRadioGroup" // All radios in a group must have the same name
                            value={option.value}
                            checked={orderStrategy === option.value}
                            onChange={(e) => setOrderStrategy(e.target.value)}
                        />
                        <label htmlFor={option.value}>{option.label}</label>
                    </div>
                ))}
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
            <p></p>
            <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Trade Management Command :: </label>
            <select  style={{float:"left", marginTop:'1%'}} name="ManagementCmd" id="managementCmd" defaultValue={tdMngmtCmd} value={tdMngmtCmd} onChange={(e) => setTdMngmtCmd(e.target.value)}>
                <option>L</option>
                <option>LT</option>
                <option>LTO</option>
                <option>LN</option>
                <option>Q</option>
                <option>QT</option>
                <option>ABS</option>
                <option>STRATGY</option>
            </select>
            <input style={{clear:"both", float:"left", marginTop:'1%',  width:'24%'}} type="commandInput" value={cmdInputMngTd}  onChange={(e) => setCmdInputMngTd(e.target.value)}/>
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
    );
};

export default OrderInputCommand;