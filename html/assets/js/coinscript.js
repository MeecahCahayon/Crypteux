/******************* FOR DISPLAYING COIN INFO *******************/
/*						  										*/
/****************************************************************/
/*************************** VARIABLES **************************/
const marketData = [];
const coinAmount = [];
const yearsSet = new Set();
const years = [];


/*********************** DISPLAY COIN NAME **********************/

function get_coininfo() {
	
	// DISPLAY THE COIN NAME AS A SUBHEADER
	var coinName = getQueryVariable("coinName");
	if (coinName != false) { document.getElementById("coinName").innerHTML = coinName; }

	// GET THE COIN ID
	var coinid = getQueryVariable("coinID");
	if (coinid != false) {

		// GET MARKET DATA OF THE COIN AND STORE IT IN AN ARRAY
		$.ajax({

			// PUBLIC API
			url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/market-data',
			// PRIVATE API
			// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
			
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			type: "GET",
			dataType: "json",
			data: {
				coinID: coinid
			},
			success: function (response) {
				store_coin_marketdata(response);
				create_graph();
			},
			error: function (response) {
				error_msg(response);
			}
		});

		// GET COIN OVERALL INFO
		$.ajax({

			// PUBLIC API
			url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/coin',
			// PRIVATE API
			// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
			
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			type: "GET",
			dataType: "json",
			data: {
				coinID: coinid
			},
			success: function (response) {
				console.log(response);
			},
			error: function (response) {
				error_msg(response);
			}
		});
	}
}

/************************ DISPLAY COIN KPI **********************/

/*********************** DISPLAY COIN GRAPH *********************/

function create_graph() {
	
	/******************** CREATE THE VARIABLES ******************/

	// CREATE THE YEAR VARIABLE FOR X AXIS
	$.each(marketData, function(resIndex, eachData) {

		yearsSet.add(eachData.date.getFullYear());
	});

	yearsSet.forEach(function(year) {

		years.push(year);
	});

	// // FOR TESTING
	// for (var i = 0; i < years.length; i++) {

	// 	console.log(years[i]);
	// }

	// console.log(years.length);

	// CREATE THE COIN AMOUNT VARIABLE FOR Y AXIS
	marketData.sort((a, b) => {
		return a.date - b.date;
	});

	$.each(marketData, function(resIndex, eachData) {

		coinAmount.push(eachData.amount);
	});

	// GET THE CHART DIV
	var ctx_mrkdata = document.getElementById("marketData");
	var marketDataGraph = new Chart(ctx_mrkdata,  )

	/********************** CREATE THE GRAPH ********************/

}

/**************************** FUNCTIONS *************************/
/*						  										*/
/****************************************************************/

// GET DATA FROM WINDOW.LOCATION
function getQueryVariable(variable) {
	
	// GET ALL THE DATA IN THE WINDOW.LOCATION
	var query = window.location.search.substring(1);
	var variables = query.split("&");

	// CHECK IF ITS THE VARIABLE
	for (var i = 0; i < variables.length; i++) {

		var pair = variables[i].split("=");

		if (pair[0] == variable) { return decodeURI(pair[1]); }
	}

	return false;
}

function store_coin_marketdata(response) {

	// FOR EACH MARKET DATA
	$.each(response, function(resIndex, eachData) {

		let data = {

			amount: eachData.dollar_price + "." + eachData.cent_price,
			date: new Date(eachData.data_date),
			marketCap: eachData.marketcap,
			volume: eachData.volume
		};

		marketData.push(data);
	});


	// // FOR TESTING
	// let data = {

	// 	amount: "123.45",
	// 	date: new Date(1095684732),
	// 	marketCap: 123456789,
	// 	volume: 0
	// };

	// marketData.push(data);

	// for (var i = 0; i < 10; i++) {

	// 	let data = {

	// 		amount: marketData[i].amount,
	// 		date: marketData[i].date,
	// 		marketCap: marketData[i].marketCap
	// 	};

	// 	console.log(data);
	// }

	// for (var i = 900; i < 910; i++) {

	// 	let data = {

	// 		amount: marketData[i].amount,
	// 		date: marketData[i].date,
	// 		marketCap: marketData[i].marketCap,
	// 		volume: marketData[i].volume
	// 	};

	// 	console.log(data);
	// }

	// console.log(marketData.length);
}

function error_msg(response) {
	console.log(response);
}