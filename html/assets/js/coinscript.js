/******************* FOR DISPLAYING COIN INFO *******************/
/*						  										*/
/****************************************************************/
/*************************** VARIABLES **************************/
const marketData = [];
const coinPrice = [];
const dates = [];

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
	// SORT THE MARKET DATA BY DATE
	marketData.sort((a, b) => {
		return a.date - b.date;
	});

	// GET ALL THE DATE FOR Y AXIS AND COIN PRICE FOR X AXIS
	$.each(marketData, function(resIndex, eachData) {

		dates.push(eachData.date);
		coinPrice.push(eachData.amount);
	});

	// GET THE CHART DIV
	var ctx_mrkdata = $("#marketData");

	// CREATE DATA FOR THE GRAPH
	const graphData = {

		// SET X AXIS
		labels: dates,
		// SET THE DATA
		datasets: [{

			/******************** STYLING LINE ******************/
			/* COLOURS */
			backgroundColor: "#75586C",
			borderColor: "#75586C",
			/* FONTS */

			/* STYLE */
			borderWidth: 1,
			fill: false,
			lineTension: 0,
			pointRadius: 0,
			
			// SET THE Y AXIS
			data: coinPrice
		}]
	}

	// CREATE THE CONFIG FOR OPTION
	const config = {

		/*********************** STYLING ********************/
		plugins: {
			// LEGEN
			legend: {display: false}
		},

		/************************* AXIS *********************/
		scales: {
			// MAKE X AXIS ONLY SHOW THE YEAR
			x: {
				type: 'time',
				time: {
					unit: 'year'
				}

			},
			grid: {
				/****************** STYLING GRAPH ***************/
				/* COLOURS */
				backgroundColor: "#75586C",
				borderColor: "#75586C",
				/* FONTS */

				/* STYLE */
				borderWidth: 1
			}
		}
	}

	/********************** CREATE THE GRAPH ********************/
	var marketDataGraph = new Chart(ctx_mrkdata, {

		type: "line",
		data: graphData,
		options: config
	});
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