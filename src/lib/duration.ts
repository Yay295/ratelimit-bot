const symbolToSecondMap = {
    "": 1,
    "ms": 0.001,
    "s" : 1,
    "m" : 60,
    "h" : 60*60,
    "d" : 60*60*24
};

export function parseDurationStr(timeStr: string, outputUnit = "s") {
    const outputScale = symbolToSecondMap[outputUnit];
    if(!outputScale) {
        throw new Error(`unknown output unit: '${outputUnit}'`);
    }

    var total = 0;

    var parsingNum = true;
    var numPart = 0;
    var parsingDec = false;
    var decPlace = 1;
    var decPart = 0;
    var unit = "";
    for(let i = 0; i < timeStr.length; i++) {
        const char = timeStr[i];

        if(parsingDec && (+ char) >= 0 && (+ char) <= 9) {
            decPlace *= 10;
            decPart += (+ char) / decPlace;
        } else if((+ char) >= 0 && (+ char) <= 9) {
            if(!parsingNum) {
                let scale = symbolToSecondMap[unit];

                if(!scale) {
                    throw new Error(`unknown unit: '${unit}'`);
                }

                total += (numPart * scale) + decPart;

                numPart = 0;
                decPlace = 1;
                decPart = 0;
                parsingNum = true;
                unit = "";
            }

            numPart *= 10;
            numPart += (+ char);
        } else if(char === ".") {
            parsingDec = true;
        } else {
            parsingNum = false;
            parsingDec = false;
            unit += char;
        }

    }

    let scale = symbolToSecondMap[unit];

    if(!scale) {
        throw new Error(`unknown unit: '${unit}'`);
    }

    total += (numPart * scale) + decPart;

    return total / outputScale;
}
