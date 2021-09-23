/*************************** VARIABLES **************************/
/*						  										*/
/****************************************************************/

const marketData = [];
const kpiData = [];

const coinPrice = [];
const dates = [];
const volumes = [];
var moving_average_prices = [];
var moving_average_volume = [];

const dataType = {
	VOLUME: "volume",
	PRICE: "price",
	MARKET_CAP: "market cap"
}

const colors = {
	lineColor: "#75586C",
	gridColor: "#3c3c3c",
	fontColor: "#75586C",
	tickColor: "#626262",
	white: "#FFFFFF"
}

/******************* FOR DISPLAYING COIN INFO *******************/
/*						  										*/
/****************************************************************/
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
				create_mrkdata_graph();
				create_volume_graph();
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
				store_coin_kpi(response);
				create_kpi();
			},
			error: function (response) {
				error_msg(response);
			}
		});
	}
}

/************************ DISPLAY COIN KPI **********************/

function create_kpi() {

	// FOR EACH KPI
	$.each(kpiData, function(resIndex, eachData) {

		/***** CREATE KPI CONTAINER *****/
		// CREATE KPI DIV
		var kpi = $("<div></div>");
		kpi.addClass("kpi");

		/***** CREATE KPI ELEMENTS *****/
		// KPI TITLE
		var kpiTitle = $("<p></p>");
		kpiTitle.addClass("kpiTitle");
		// KPI PRICE
		var kpiPrice = $("<p></p>");
		kpiPrice.addClass("kpiPrice");

		// KPI SUBINFO DIV
		var kpiSubinfo = $("<div></div>");
		kpiSubinfo.addClass("kpiSubinfo");

		// KPI PRICE
		var kpiDate = $("<p></p>");
		kpiDate.addClass("kpiDate");
		// KPI PRICE
		var kpiCurrency = $("<p></p>");
		kpiCurrency.addClass("kpiCurrency");

		/***** APPEND KPI ELEMENTS *****/
		kpiSubinfo.append(kpiDate);
		kpiSubinfo.append(kpiCurrency);

		kpi.append(kpiTitle);
		kpi.append(kpiPrice);
		kpi.append(kpiSubinfo);

		/***** CREATE KPIS *****/
		kpiTitle.html(eachData.title);
		kpiPrice.html(eachData.price);
		kpiDate.html(eachData.date);
		kpiCurrency.html(eachData.currency);
		$("#coinKpiContent").append(kpi);
	});
}

/******************** DISPLAY MARKET DATA GRAPH *****************/

function create_mrkdata_graph() {
	
	/******************** CREATE THE VARIABLES ******************/
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
			backgroundColor: colors.lineColor,
			borderColor: colors.lineColor,
			/* FONTS */

			/* STYLE */
			borderWidth: 1,
			fill: false,
			lineTension: 0,
			pointRadius: 0,
			z: -2,
			
			// SET THE Y AXIS
			data: coinPrice
		},
		{
			/******************** STYLING LINE ******************/
			/* COLOURS */
			backgroundColor: colors.white,
			borderColor: colors.white,
			/* FONTS */

			/* STYLE */
			borderWidth: 1,
			fill: false,
			lineTension: 0,
			pointRadius: 0,
			
			// SET THE Y AXIS
			data: moving_average_prices
		}]
	}

	// CREATE THE CONFIG FOR OPTION
	const config = {

		/*********************** STYLING ********************/
		plugins: {
			// REMOVE LEGEND
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: "Price History",

				color: colors.fontColor,
				padding: 50,

				font: {
					family: "'Major Mono Display', monospace",
					size: 20
				}
			}
		},

		/************************* AXIS *********************/
		scales: {
			// MAKE X AXIS ONLY SHOW THE YEAR

			x: {
				title: {
					display: true,
					text: "Price Date",
					color: colors.fontColor,
					padding: 20,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				type: 'time',
				time: {
					unit: 'year'
				},
				ticks: {
					color: colors.tickColor,
					padding: 10,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				grid: {
					borderColor: colors.gridColor,
					color: colors.gridColor,
					z: -1
				},
			},
			y: {
				title: {
					display: true,
					text: "Coin Price",
					color: colors.fontColor,
					padding: 20,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				ticks: {
					color: colors.tickColor,
					padding: 10,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				grid: {
					borderColor: colors.gridColor,
					color: colors.gridColor,
					z: -1
				}
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

/*********************** DISPLAY VOLUME GRAPH *******************/

function create_volume_graph() {

	/******************** CREATE THE VARIABLES ******************/
	// GET THE CHART DIV
	var ctx_mrkdata = $("#volumeData");

	// CREATE DATA FOR THE GRAPH
	const graphData = {

		// SET X AXIS
		labels: dates,
		// SET THE DATA
		datasets: [{

			/******************** STYLING LINE ******************/
			/* COLOURS */
			backgroundColor: colors.lineColor,
			borderColor: colors.lineColor,
			/* FONTS */

			/* STYLE */
			borderWidth: 1,
			fill: true,
			lineTension: 0,
			pointRadius: 0,
			z: -2,
			
			// SET THE Y AXIS
			data: volumes
		},
		{
			/******************** STYLING LINE ******************/
			/* COLOURS */
			backgroundColor: colors.white,
			borderColor: colors.white,
			/* FONTS */

			/* STYLE */
			borderWidth: 1,
			fill: false,
			lineTension: 0,
			pointRadius: 0,
			
			// SET THE Y AXIS
			data: moving_average_volume
		}]
	}

	// CREATE THE CONFIG FOR OPTION
	const config = {

		/*********************** STYLING ********************/
		plugins: {
			// REMOVE LEGEND
			legend: {
				display: false,
			},
			title: {
				display: true,
				text: "Volume History",

				color: colors.fontColor,
				padding: 50,

				font: {
					family: "'Major Mono Display', monospace",
					size: 20
				}
			}
		},

		/************************* AXIS *********************/
		scales: {
			// MAKE X AXIS ONLY SHOW THE YEAR
			x: {
				title: {
					display: true,
					text: "Order Date",

					color: colors.fontColor,
					padding: 20,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				type: 'time',
				time: {
					unit: 'year'
				},
				ticks: {
					color: colors.tickColor,
					padding: 10,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				grid: {
					borderColor: colors.gridColor,
					color: colors.gridColor,
					z: -1
				},
			},
			y: {
				title: {
					display: true,
					text: "Number of Orders",
					color: colors.fontColor,
					padding: 20,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				ticks: {
					color: colors.tickColor,
					padding: 10,

					font: {
						family: "'Cutive Mono', monospace",
						size: 15,
						weight: 500
					}
				},
				grid: {
					borderColor: colors.gridColor,
					color: colors.gridColor,
					z: -1
				}
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

/**************************** Indicators ************************/
/*						  										*/
/****************************************************************/
function simple_moving_average(datatype, range){
	let moving_average = [];
	// FOR EACH MARKET DATA
	for (let i = 0; i < marketData.length; i++) {
		if (i < range - 1){
			moving_average[i] = 0;
		}
		else{
			let sum = 0;
			for (let j = i - range + 1; j <= i; j++){
				if (datatype == dataType.PRICE){
					sum += parseFloat(marketData[j].amount);
				}
				else if (datatype == dataType.VOLUME){
					sum += parseFloat(marketData[j].volume);
				}
			}
			moving_average[i] = sum / range;
		}
	}
	return moving_average;
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

	/******************** CREATE THE VARIABLES ******************/
	// SORT THE MARKET DATA BY DATE
	marketData.sort((a, b) => {
		return a.date - b.date;
	});

	// GET ALL THE VALUE FOR X AND Y AXIS
	$.each(marketData, function(resIndex, eachData) {

		dates.push(eachData.date);
		coinPrice.push(eachData.amount);
		volumes.push(eachData.volume);
	});

	// PROCESS INDICATORS
	moving_average_prices = simple_moving_average(dataType.PRICE, 10);
	moving_average_volume = simple_moving_average(dataType.VOLUME, 50);

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

function store_coin_kpi(response) {

	// GET VARIABLES
	var dollar = "0";
	var cent = "0";
	var date = "";
	var coinCurrency = "";

	if (response[0].all_time_high_dollar != null) {
		dollar = response[0].all_time_high_dollar;
	}

	if (response[0].all_time_high_cent != null) {
		cent = response[0].all_time_high_cent.substring(0,3);
	}

	if (response[0].all_time_high_currency != null) {
		coinCurrency = response[0].all_time_high_currency.toUpperCase();
	}

	// CREATE ALL-TIME-HIGH KPI ELEMENTS
	let alltime_data = {

		title: "All-Time High",
		price: "$"+dollar+"."+cent,
		date: "March 25, 1997",
		currency: coinCurrency
	}

	// GET VARIABLES
	var dollar = "0";
	var cent = "0";
	var date = "";
	var coinCurrency = "";

	if (response[0].year_high_dollar != null) {
		dollar = response[0].year_high_dollar;
	}

	if (response[0].year_high_cent != null) {
		cent = response[0].year_high_cent.substring(0,3);
	}

	if (response[0].year_high_currency != null) {
		coinCurrency = response[0].year_high_currency.toUpperCase();
	}

	// CREATE YEAR-HIGH KPI ELEMENTS
	let yeartime_data = {

		title: "Year High",
		price: "$"+dollar+"."+cent,
		date: "March 25, 1997",
		currency: coinCurrency
	}

	// PUSH TO KPI ARRAY
	kpiData.push(alltime_data);
	kpiData.push(yeartime_data);
}