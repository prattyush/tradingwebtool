
export const priceIntervalRangeMap = new Map();
priceIntervalRangeMap.set("ulow", [21,45]);
priceIntervalRangeMap.set("vlow", [30,60]);
priceIntervalRangeMap.set("low", [60,90]);
priceIntervalRangeMap.set("mid", [90,135]);
priceIntervalRangeMap.set("high", [135,195]);
priceIntervalRangeMap.set("vhigh", [174,240]);

export const optionvaluerangeoptions = [
    { value: 'ulow', label: 'ulow' },
    { value: 'vlow', label: 'vlow' },
    { value: 'low', label: 'low' },
    { value: 'mid', label: 'mid' },
    { value: 'high', label: 'high' },
    { value: 'vhigh', label: 'vhigh' }
]

export const orderstrategyoptions = [
    { value: 'breakout', label: 'bo' },
    { value: 'trend-continuation', label: 'tc' },
    { value: 'support', label: 'sup' },
    { value: 'resistance', label: 're' },
    { value: 'towards-yesterday-close', label: 'tyc' },
    { value: 'EMALine', label: 'emln' },
    { value: '2ndLeg', label: '2L' },
    { value: 'opening-tradingrange', label: 'otr' },
    { value: 'tradingrange', label: 'tr' },
    { value: 'double-tb', label: 'dtb' },
    { value: 'opening-reversal', label: 'orv' },
    { value: 'exhaustionbar-reversal', label: 'exbrv' },
    { value: 'surprise-bar-reversal', label: 'spbrv' },
    { value: 'stoploss-hit-reversal', label: 'shtrv' },
    { value: 'wedge-reversal', label: 'wrv' },
];

export const tradestrategyoptions = [
    { value: 'none', label: 'none' },
    { value: 'TR-BO', label: 'TRADING_RANGE_BREAKOUT' },
    { value: 'TRND-BO', label: 'TREND_BREAKOUT' },

    { value: 'TR-BO-2L', label: 'TRADING_RANGE_BREAKOUT_2ND_LEG' },
    { value: 'TRND-BO-2L', label: 'TREND_BREAKOUT_2ND_LEG' },
    { value: 'TR-2L', label: 'TRADING_RANGE_2ND_LEG' },
    { value: 'SB-2L', label: 'SURPRISE_BAR_2ND_LEG' },
    { value: 'TRND-2L', label: 'TREND_2ND_LEG' },
    { value: 'OPN-TR-2L', label: 'OPENING_TRADING_RANGE_2ND_LEG' },
    { value: 'TRND-REV-2L', label: 'TREND_REVERSAL_2ND_LEG' },
    { value: 'TRND-REV-WG', label: 'TREND_REVERSAL_WEDGE' },
    { value: 'TRND-REV-T-DTB', label: 'TREND_REVERSAL_TOWARDS_DOUBLE_TOP_BOTTOM' },
    { value: 'TRND-REV-WG-TRND', label: 'TREND_REVERSAL_WEDGE_RESUME' },
    { value: 'TRND-REV-DTB-TRND', label: 'TREND_REVERSAL_DOUBLE_TOP_BOTTOM_RESUME' },

    { value: 'TR-BO-RV', label: 'TRADING_RANGE_BREAKOUT_REVERSAL' },
    { value: 'TRND-BO-RV', label: 'TREND_BREAKOUT_REVERSAL' },
    { value: 'TR-DTB-RV', label: 'TRADING_RANGE_DOUBLE_TOP_BOTTOM_REVERSAL' },
    { value: 'SB-RV', label: 'SURPRISE_BAR_REVERSAL' },
    { value: 'TRND-EB-RV', label: 'TREND_EXHAUSTION_BAR_REVERSAL' },
    { value: 'TRND-DBT-RV', label: 'TREND_DOUBLE_TOP_BOTTOM_REVERSAL' },
    { value: 'TRND-HS-RV', label: 'TREND_HEAD_SHOULDERS_REVERSAL' },
    { value: 'TRND-WG-RV', label: 'TREND_WEDGE_REVERSAL' },
    { value: 'TRND-50-PB-RV', label: 'TREND_FIFTY_PULLBACK_REVERSAL' },

    { value: 'TR-T-S', label: 'TRADING_RANGE_TOWARDS_SUPPORT' },
    { value: 'TR-T-R', label: 'TRADING_RANGE_TOWARDS_RESISTANCE' },
    { value: 'TR-T-DBT', label: 'TRADING_RANGE_TOWARDS_DOUBLE_TOP_BOTTOM' },
    { value: 'TRND-T-DBT', label: 'TREND_TOWARDS_DOUBLE_TOP_BOTTOM' },
    { value: 'TRND-WG', label: 'TREND_TOWARDS_WEDGE' },
    { value: 'TRND-EM-TRND', label: 'TREND_PULLBACK_EMA_RESUME' },
    { value: 'TRND-EM-PB', label: 'TREND_EMA_PULLBACK' },
    { value: 'TRND-50-PB-TRND', label: 'TREND_FIFTY_PULLBACK_RESUME' },
    { value: 'TRND-PB-TRND', label: 'TREND_PULLBACK_RESUME' },
    { value: 'OPN-TR-S', label: 'OPENING_TRADING_RANGE_SUPPORT' },
    { value: 'OPN-TR-R', label: 'OPENING_TRADING_RANGE_RESISTANCE' },

    { value: 'TWD-YES-CLS', label: 'TOWARDS_YESTERDAYS_CLOSE' },
    { value: 'all', label: 'all' },
]

export const strategyoptions = [
    { value: 'none', label: 'none' },
    { value: 'breakout', label: 'breakout' },
    { value: 'support', label: 'support' },
    { value: 'double-tb', label: 'double-tb' },
    { value: 'opening-tradingrange', label: 'open-tradingrange' },
    { value: 'tradingrange', label: 'tradingrange' },
    { value: 'opening-reversal', label: 'opening-reversal' },
    { value: 'resistance', label: 'resistance' },
    { value: 'trend-continuation', label: 'trend-continuation' },
    { value: 'exhaustionbar-reversal', label: 'exhaustionbar-reversal' },
    { value: 'surprise-bar-reversal', label: 'surprise-bar-reversal' },
    { value: 'towards-yesterday-close', label: 'towards-yesterday-close' },
    { value: 'stoploss-hit-reversal', label: 'stoploss-hit-reversal' },
    { value: 'wedge-reversal', label: 'wedge-reversal' },
    { value: 'EMALine', label: 'EMALine' },
    { value: '2ndLeg', label: '2ndLeg' },
    { value: 'all', label: 'all' },
];

export const baroptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
];

export const windowtimeoptions = [
    { value: '1', label: '09:30' },
    { value: '2', label: '09:45' },
    { value: '3', label: '10:00' },
    { value: '4', label: '10:15' },
    { value: '5', label: '10:30' },
    { value: '6', label: '10:45' },
    { value: '7', label: '11:00' },
    { value: 'any', label: 'any' },
];

export const optionstype = [
    { value: 'Call', label: 'Call' },
    { value: 'Put', label: 'Put' },
];

export const orderTypeOptions = [
    { value: 'R', label: 'R' },
    { value: 'RT', label: 'RT' },
    { value: 'RL', label: 'RL' },
    { value: 'RO', label: 'RO' },
    { value: 'RLB', label: 'RLB' },
    { value: 'RLBL', label: 'RLBL' },
    { value: 'RTB', label: 'RTB' },
    { value: 'COD', label: 'COD' },
];

export const getBarEndTimeOption = () => {
    const barEndTimeOption = []
    const chartTime = new Date(); // Gets current date and time
    chartTime.setHours(9); // Sets hour to 9 AM
    chartTime.setMinutes(15); // Sets minutes to 30
    chartTime.setSeconds(0); // Sets seconds to 0
    chartTime.setMilliseconds(0);

    for (let i = 0; i < 90; i++) {
        const entryMap = new Map();
        let hours = chartTime.getHours().toString();
        let minutes = chartTime.getMinutes().toString();
        if (chartTime.getHours() < 10) {
            hours = "0" + hours;
        }
        if (chartTime.getMinutes() < 10) {
            minutes = "0" + minutes;
        }

        entryMap['value'] = hours + ":" + minutes;
        entryMap['label'] = hours + ":" + minutes;

        chartTime.setMinutes(chartTime.getMinutes() + 3)
        barEndTimeOption.push(entryMap);
    }
    return barEndTimeOption;
}

export const barendimeoptions = [
    { value: '1', label: '09:30' },
    { value: '2', label: '09:45' },
    { value: '3', label: '10:00' },
    { value: '4', label: '10:15' },
    { value: '5', label: '10:30' },
    { value: '6', label: '10:45' },
    { value: '7', label: '11:00' },
    { value: 'any', label: 'any' },
];

export const tradeTypeOptions = [
    { value: 'none', label: 'none' },
    { value: 'buy', label: 'buy' },
    { value: 'sell', label: 'sell' }
];

export const previousDayOptions = [
    { value: 'any', label: 'any' },
    { value: 'tradingrange', label: 'tradingrange' },
    { value: 'strong-bull-trend', label: 'strong-bull-trend' },
    { value: 'strong-bear-trend', label: 'strong-bear-trend' },
    { value: 'weak-bull-trend', label: 'weak-bull-trend' },
    { value: 'weak-bear-trend', label: 'weak-bear-trend' },
    { value: 'gap-down-trend', label: 'gap-down-trend' },
    { value: 'gap-up-trend', label: 'gap-up-trend' },
    { value: 'gap-down-tradingrange', label: 'gap-down-tradingrange' },
    { value: 'gap-up-tradingrange', label: 'gap-up-tradingrange' },
    { value: 'bull-trend-tradingrange', label: 'bull-trend-tradingrange' },
    { value: 'bear-trend-tradingrange', label: 'bear-trend-tradingrange' },
    { value: 'tradingrange-bull-breakout', label: 'tradingrange-bull-breakout' },
    { value: 'tradingrange-bear-breakout', label: 'tradingrange-bear-breakout' }
];

export const todayStartOptions = [
    { value: 'any', label: 'any' },
    { value: 'big-gap-down', label: 'big-gap-down' },
    { value: 'big-gap-up', label: 'big-gap-up' },
    { value: 'minor-gap-down', label: 'minor-gap-down' },
    { value: 'minor-gap-up', label: 'minor-gap-up' },
    { value: 'within-prevday-range', label: 'within-prevday-range' },
    { value: 'normal', label: 'normal' }
];
