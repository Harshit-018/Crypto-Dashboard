// fetch the crytocurrency data and store it inside the variable called data
var xhReq = new XMLHttpRequest();
xhReq.open("GET","https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd", false);
xhReq.send(null);
var data = JSON.parse(xhReq.responseText);

console.log(data);

//initialization
var cryptocurrencies;
var timerId;
var updateInterval = 30000;

function descending(a,b){ return a.percentage_change_24h < b.percentage_change_24h? 1 : -1; }
function ascending(a,b){ return a.percentage_change_24h > b.percentage_change_24h? 1 : -1; }

function reposition(){
    var height = $("#cryptocurrencies .cryptocurrency").height();
    var y = height;
    for(var i = 0; i< cryptocurrencies.length; i++){
        cryptocurrencies[i].$item.css("top", y + "px");
        y += height;
    }

}

function updateRanks(cryptocurrencies){
    for(var i = 0; i< cryptocurrencies.length; i++){
        cryptocurrencies[i].$item.find(".rank").text(i + 1);
    }
}

function fetchNewData(data,attributeName,name){
    for(var x in data){
        if((data[x].name == name) == true){
            return data[x][attributeName];
        }
    }
    return null;
}

function updateBoard() {
    var cryptocurrency = getRandomCoin();	
    cryptocurrency.percent_change_24h += getRandomScoreIncrease();
    cryptocurrency.$item.find(".percent_change_24h").text(cryptocurrency.percent_change_24h);
    cryptocurrencies.sort(descending);
    updateRanks(cryptocurrencies);
    reposition();
}

function getNewData(){
    // get the new data for each coin and change to their new values
    var newReq = new XMLHttpRequest();
    newReq.open("GET", "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd", false);
    newReq.send(null);
    var newData = JSON.parse(newReq.responseText); 

    for(var i = 0; i < cryptocurrencies.length; i++) {
        var cryptocurrency = cryptocurrencies[i];
        cryptocurrency.price = fetchNewData(newData,'current_price',cryptocurrency.name);
        cryptocurrency.$item.find(".price").text(cryptocurrency.price);
        cryptocurrency.volume_24h = fetchNewData(newData,'total_volume',cryptocurrency.name);
        cryptocurrency.$item.find(".volume_24h").text(cryptocurrency.volume_24h);
        cryptocurrency.percent_change_24h = fetchNewData(newData,'market_cap_change_percentage_24h',cryptocurrency.name);
        cryptocurrency.$item.find(".percent_change_24h").text(cryptocurrency.percent_change_24h);
    }
    cryptocurrencies.sort(descending);
    updateRanks(cryptocurrencies);
    reposition();
    console.log('Finished retrieving new data');
    
}

function resetBoard(){
    var $list = $("#cryptocurrencies");
    $list.find(".cryptocurrency").remove();

    if(timerId !== undefined){
        clearInterval(timerId);
    }

    cryptocurrencies = [];
    for(let i=0; i < 50; i++){
        cryptocurrencies.push(
            {
                image: data[i].image,
                name: data[i].name,
                symbol: data[i].symbol,
                price: data[i].current_price,
                market_cap: data[i].market_cap,
                circulating_supply: Math.round(data[i].circulating_supply),
                volume_24h: data[i].total_volume,
                percentage_change_24h: data[i].market_cap_change_percentage_24h,
            }
        )
    }
    
    for( var i=0; i < cryptocurrencies.length; i++){
        //$ is signaling that it is jquery
        var $item = $(
            "<tr class='cryptocurrency'>" +
                "<th class='rank'>" + (i + 1) + "</th>" + 
                "<td class='image'>" + "<img src=" + cryptocurrencies[i].image + "/>" + "</td>" +  
                "<td class='name'>"+"  "+ cryptocurrencies[i].name + "</td>" +
                "<td class='symbol'>" + cryptocurrencies[i].symbol + "</td>" +
                "<td class='price'>" + cryptocurrencies[i].price + "</td>" +
                "<td class='market_cap'>" + cryptocurrencies[i].market_cap + "</td>" +
                "<td class='circulating_supply'>" + cryptocurrencies[i].circulating_supply + "</td>" +
                "<td class='volume_24h'>" + cryptocurrencies[i].volume_24h + "</td>" +
                "<td class='percentage_change_24h'>" + cryptocurrencies[i].percentage_change_24h + "</td>" +
            "</tr>"
        );
        cryptocurrencies[i].$item = $item;
        $list.append($item);
    }
    cryptocurrencies.sort(descending);
    updateRanks(cryptocurrencies);
    reposition();
    //fetch new data for every interval
    timerId = setInterval("getNewData();", updateInterval);
}
resetBoard();