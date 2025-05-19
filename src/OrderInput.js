import { useState, useEffect } from "react";

const OrderInput = ({tradingStyle, ipAddress, replaySpeed}) => {
    const [orderType, setOrderType] = useState("R")
    const [stoploss, setStoploss] = useState("")
    const [ratio, setRatio] = useState("m")
    const [cmdInputMngTd, setCmdInputMngTd] = useState("")
    const [tdMngmtCmd, setTdMngmtCmd] = useState("L")
    const [tdInfoCmd, setTdInfoCmd] = useState("P")
    const [optionsType, setOptionsType] = useState("CE")
    const [orderInfo, setOrderInfo] = useState("OrderInfo")
    const [tradeInfo, setTradeInfo] = useState("TradeInfo")
    const [timeInfo, setTimeInfo] = useState("")

    const onOrderPlaced = (event) => {
        event.preventDefault();
        const ratiocommands = ratio.split(" ");
        const riskrewardType = ratiocommands[0];
        let targetvalue = "0.0";
        if (ratiocommands.length > 1)
            targetvalue = ratiocommands[1]
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/orderplace?optiontype=' + optionsType + "&command=" + orderType + "&stoploss=" + stoploss + "&ratiotype=" + riskrewardType + "&target=" + targetvalue, {
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
    }

    const onTdInfoCommandPlaced = (event) => {
        event.preventDefault();
        fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/tradeinfo?command=' + tdInfoCmd, {
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
                setTradeInfo(data['response']);
                // Handle data
            }).then()
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        const timeInfoInterval = setInterval(() => {
            fetch('http://' + ipAddress + ':9060/' + tradingStyle + '/timeinfo/', {
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
                    const barTimeDate = new Date((data['response']['time']-19800) * 1000)
                    const barTime = barTimeDate.getHours() + ":" + barTimeDate.getMinutes() + ":" + barTimeDate.getSeconds()
                    setTimeInfo(barTime)
                    // Handle data
                })
                .catch((err) => {
                    console.log(err.message);
                });
            console.log('This will be called every 12 seconds');
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
            console.log('This will be called every 12 seconds');
        }, 12000);

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
            <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%', fontSize:'.5'}} name="tradeInfo" rows={1} cols={9} value={timeInfo} readOnly={true}>timeInfo</textarea>
            <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}} name="orderInfo" rows={10} cols={40} value={orderInfo}>value</textarea>
            <button style={{clear:"both", float:"left", marginTop:'1%', marginBottom:'1%'}} type="button"
                    onClick={onOrderInfo}
                    title="OrderState">OrderState</button>
            <p></p>
            <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Option Type :: </label>
            <select style={{float:"left", marginTop:'1%', marginRight: '1%'}} name="OptionType" id="optionType" defaultValue={optionsType} onChange={(e) => setOptionsType(e.target.value)}>
                <option>CE</option>
                <option>PE</option>
            </select>
            <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Order Type :: </label>
            <select style={{float:"left", marginTop:'1%'}} name="OrderType" id="orderType" defaultValue={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option>R</option>
                <option>RO</option>
                <option>RT</option>
                <option>RL</option>
                <option>COD</option>
            </select>
            <input style={{clear:"both", float:"left", marginTop:'1%', width:'15%'}} type="commandInput" value={ratio}  onChange={(e) => setRatio(e.target.value)}/>
            <input style={{float:"left", marginLeft: '1%', marginTop:'1%', width:'15%'}} type="commandInput" value={stoploss}  onChange={(e) => setStoploss(e.target.value)}/>
            <button style={{clear:"both", float:"left", marginTop:'1%'}} type="button" onClick={onOrderPlaced} title="PlaceOrder">PlaceOrder</button>

            <p></p>
            <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Trade Management Command :: </label>
            <select  style={{float:"left", marginTop:'1%'}} name="ManagementCmd" id="managementCmd" defaultValue={tdMngmtCmd} onChange={(e) => setTdMngmtCmd(e.target.value)}>
                <option>L</option>
                <option>LT</option>
                <option>LTO</option>
                <option>LN</option>
                <option>Q</option>
                <option>QT</option>
                <option>ABS</option>
            </select>
            <input style={{clear:"both", float:"left", marginTop:'1%',  width:'24%'}} type="commandInput" value={cmdInputMngTd}  onChange={(e) => setCmdInputMngTd(e.target.value)}/>
            <button style={{clear:"both", float:"left", marginTop:'1%'}} type="button" onClick={onTdManagementCommandPlaced} title="ManageTrade">ManageTrade</button>
            <p></p>
            <label style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%'}}>Choose Info Command :: </label>
            <select style={{float:"left", marginTop:'1%'}} name="InfoCmd" id="infoCmd" defaultValue={tdInfoCmd} onChange={(e) => setTdInfoCmd(e.target.value)}>
                <option>H</option>
                <option>P</option>
                <option>R</option>
                <option>RS</option>
            </select>
            <button style={{clear:"both", float:"left", marginTop:'1%'}} type="button" onClick={onTdInfoCommandPlaced} title="TradeInfo">TradeInfo</button>
            <textarea style={{clear:"both", float:"left", marginTop:'1%', marginRight: '1%', fontSize:'.5'}} name="tradeInfo" rows={10} cols={40} value={tradeInfo} readOnly={true}>info</textarea>
        </div>
    );
};

export default OrderInput;