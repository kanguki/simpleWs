import * as WebSocket from 'ws'
import * as fs from 'fs'

let port = process.env.PORT || 12430;
//if neccessary, simulate message with a wide range of data 
//in an elastic time
let loadMsgFromFile = process.env.USE_FILE === "1" || process.env.FILE !== undefined;
let filePath = process.env.FILE || "file.log";
let timezone = process.env.TZ || "7"
let nonstop =  process.env.NONSTOP === "1"
let timeGap = () => { 
  return loadMsgFromFile 
  ? 100 + getRandomInt(500) + getRandomInt(1000) 
  : 2000 
};

const wss = new WebSocket.Server({
  port: +port,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024
  }
});
wss.on('connection', function connection(ws: WebSocket) {
	console.log("receive a new connection")
	var interval = sendMessage(ws)
	ws.on('close', ()=>{
		clearInterval(interval)
		console.log("connection closed")
	})
});

//there are some durations we don't need to test data, e.g. mid night
//so we don't send message during that time
function sendMessage(ws: WebSocket) : NodeJS.Timer {
  return setInterval(()=>{
    if (shouldSendMessage()) {
      ws.send(getMsg())
    }
	}, timeGap())
}

//here msg stops sending from 19h->8h timezone +7
//specify timezone if you are not on timezone 7
function shouldSendMessage() : boolean {
  if (nonstop) {
    return true
  } 
  let hour = new Date().getHours() + 7 - + timezone;
  if (hour < 8 || hour >= 19) {
    return false
  }
  return true
}

var msgArray = [
`{"listingDate":51552000000,"bidOrders":50,"ccassflag":null,"lowerPrice":"1655.50","bonds":{"couponRate":null,"efnflag":null,"accruedInterest":null},"isincode":null,"exchangeID":"HN","high":"1900","warrants":{"conversionRatio":null,"noUnderlyingSecurities":null,"underlyingSecurity":null,"maturityDate":null,"style":null,"callPutFlag":null,"strikePrice":null},"askVol":65,"delistingDate":51552000000,"comboLegDetail":null,"last":"1700","bidVol":65,"poslowerLimit":null,"askOrders":45,"dummySecurityFlag":null,"benefit":null,"reqId":-1,"manualTradeUpperPrice":"1904.70","deals":50,"upperPrice":"1904.70","stampDutyFlag":null,"msgType":"SECURITY_DEFINITION,SECURITY_STATUS,STATISTICS,NOMINAL_PRICE,REFERENCE_PRICE","code":"VN30F2305","manualTradeLowerPrice":"1655.50","isLast":true,"session":null,"seriesDetail":{"market":0,"country":0,"commodity":0,"decimalInPremium":0,"modifier":0,"commodityDetail":null,"instrumentGroup":0,"strikePrice":null,"expirationDate":12392448},"casflag":null,"lastqty":1,"vol":75,"referencePrice":"1780.10","posupperLimit":null,"low":"1700","securityNameGB":"VN30F2305","marketCode":"DER_BRD_01","contractSize":null,"previousClosingPrice":"1780.10","turnover":"13304970000","productType":null,"securityTradingStatus":"Resume","instrumentType":"FuturesOptions","testSecurityFlag":null,"lotSize":1,"shortSellFlag":null,"securityNameGCCS":"VN30F2305","posflag":null,"securityCode":"VN30F2305","securityShortName":"VN30","spreadTableCode":null,"vcmflag":null,"removed":false,"nominalPrice":"1700","freeText":null,"currencyCode":"VND","securityLongName":"VN30","open":"1720"}`,
`{"exchangeID":"HN","code":"VN30F2305","msgType":"AGGREGATE_ORDER_BOOK,BEST_BID_ASK","bestAsk":null,"isLast":true,"asks":[],"bids":[],"bestBid":null,"reqId":-1}`,
`{"listingDate":null,"msgType":"SECURITY_DEFINITION","ccassflag":null,"isLast":false,"seriesDetail":null,"bonds":null,"isincode":null,"exchangeID":"HM","casflag":null,"warrants":{"conversionRatio":"1","noUnderlyingSecurities":1,"underlyingSecurity":[{"code":"        ","weight":null}],"maturityDate":null,"style":null,"callPutFlag":" ","strikePrice":"0.0"},"posupperLimit":null,"securityNameGB":null,"marketCode":"MAIN","contractSize":null,"previousClosingPrice":"13200","productType":null,"instrumentType":"Equities","delistingDate":null,"comboLegDetail":null,"testSecurityFlag":null,"lotSize":100,"shortSellFlag":null,"securityNameGCCS":null,"posflag":null,"poslowerLimit":null,"securityCode":"DBT","securityShortName":"CTCP DUOC PHAM BEN TRE   ","dummySecurityFlag":null,"spreadTableCode":null,"benefit":" ","reqId":0,"vcmflag":null,"removed":null,"freeText":null,"stampDutyFlag":null,"currencyCode":"VND","securityLongName":"CTCP DUOC PHAM BEN TRE   "}`,
`{"listingDate":51552000000,"bidOrders":53,"ccassflag":null,"lowerPrice":"1655.50","bonds":{"couponRate":null,"efnflag":null,"accruedInterest":null},"isincode":null,"exchangeID":"HN","high":"1900","warrants":{"conversionRatio":null,"noUnderlyingSecurities":null,"underlyingSecurity":null,"maturityDate":null,"style":null,"callPutFlag":null,"strikePrice":null},"askVol":81,"delistingDate":51552000000,"comboLegDetail":null,"last":"1700","bidVol":71,"poslowerLimit":null,"askOrders":52,"dummySecurityFlag":null,"benefit":null,"reqId":-1,"manualTradeUpperPrice":"1904.70","deals":53,"upperPrice":"1904.70","stampDutyFlag":null,"msgType":"SECURITY_DEFINITION,SECURITY_STATUS,STATISTICS,NOMINAL_PRICE,CLOSING_PRICE,REFERENCE_PRICE","code":"VN30F2305","numberOfOutstandingTrades":null,"manualTradeLowerPrice":"1655.50","isLast":true,"session":null,"seriesDetail":{"market":0,"country":0,"commodity":0,"decimalInPremium":0,"modifier":0,"commodityDetail":null,"instrumentGroup":0,"strikePrice":null,"expirationDate":12392448},"casflag":null,"lastqty":1,"vol":87,"referencePrice":"1780.10","posupperLimit":null,"low":"1700","securityNameGB":"VN30F2305","marketCode":"DER_BRD_01","contractSize":null,"previousClosingPrice":"1780.10","turnover":"15365970000","productType":null,"securityTradingStatus":"Resume","instrumentType":"FuturesOptions","testSecurityFlag":null,"lotSize":1,"shortSellFlag":null,"securityNameGCCS":"VN30F2305","posflag":null,"securityCode":"VN30F2305","securityShortName":"VN30","spreadTableCode":null,"vcmflag":null,"removed":false,"nominalPrice":"1700","freeText":null,"numberOfTradedTrades":null,"closingPrice":"1700","currencyCode":"VND","securityLongName":"VN30","open":"1720"}`,
`{"trdAmendFlag":null,"trdCancelFlag":false,"quantity":4,"msgType":"TRADE","trdType":"AutoMatchNormal","isLast":true,"securityCode":"VN30F2305","dealType":null,"reqId":-1,"exchangeID":"HN","tradeTime":1630052087000,"tradeDirection":null,"price":"1700.000","id":87}`,
`{"exchangeID":"HN","code":"VN30F2305","msgType":"AGGREGATE_ORDER_BOOK,BEST_BID_ASK","bestAsk":{"price":"1730.0","qty":2},"isLast":true,"asks":[{"price":"1730.0","qty":2},{"price":"1755.4","qty":9}],"bids":[{"price":"1700.0","qty":1}],"bestBid":{"price":"1700.0","qty":1},"reqId":-1}`,
`{"trdAmendFlag":false,"trdCancelFlag":false,"quantity":400,"msgType":"TRADE","trdType":null,"isLast":true,"securityCode":"GMD","dealType":null,"reqId":255,"exchangeID":"HM","tradeTime":1630285725305,"tradeDirection":"Ask","price":"47350","id":2930850894}`,
`{"trdAmendFlag":false,"trdCancelFlag":false,"quantity":3000,"msgType":"TRADE","trdType":null,"isLast":true,"securityCode":"DPM","dealType":null,"reqId":255,"exchangeID":"HM","tradeTime":1630285725803,"tradeDirection":"Ask","price":"29500","id":3270458748}`,
`{"trdAmendFlag":false,"trdCancelFlag":false,"quantity":200,"msgType":"TRADE","trdType":null,"isLast":true,"securityCode":"CTG","dealType":null,"reqId":255,"exchangeID":"HM","tradeTime":1630285725803,"tradeDirection":"Ask","price":"34800","id":2165428834}`,
`{"trdAmendFlag":false,"trdCancelFlag":false,"quantity":400,"msgType":"TRADE","trdType":null,"isLast":true,"securityCode":"MIG","dealType":null,"reqId":255,"exchangeID":"HM","tradeTime":1630285725803,"tradeDirection":"Ask","price":"19000","id":2175490658}`
]

var messages = [];

if (loadMsgFromFile) {
	messages = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/)
} else {
	messages = msgArray
}

var l = messages.length
function getMsg(){
	return messages[getRandomInt(l)]
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

enum Color {
  yellow = '\x1b[33m%s\x1b[0m',
  green = "\x1b[32m%s\x1b[0m",
  blue = "\x1b[36m%s\x1b[0m",
  red = "\x1b[31m%s\x1b[0m",
}

console.log(Color.red, `Ws listening on port ${port}`)
console.log(`To change port, set ` +Color.green, `PORT=customPort`)
console.log(`To load msg from file instead of fixed msg:`)
console.log(`   - Set` + Color.blue, ` USE_FILE=1`,` (default file would be file.log in the same directory)`)
console.log(`   - Or set` + Color.blue, ` FILE=absolute/path/to/existed/file`)
console.log(`Msg stops sending during 19h -> 8h in timezone +7`)
console.log(`  - If you're not in timezone +7, set ` + Color.yellow, `TZ=customTimeZone`)
console.log(`  - Or if you want ws to continously send messages, set ` + Color.yellow, `NONSTOP=1`)