/********************* FOR CREATING COIN LIST *******************/
/*						  										*/
/****************************************************************/
const coins = [];
var searchedCoins = []

function get_allCoins() {

	const request = {
		url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/coins',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		type: "GET",
		dataType: "json",
		data: {}
	};

	get_coin(request, true, store_allCoins);
}

function store_allCoins(response) {	

	// FOR EACH COIN
	$.each(response, function(resIndex, eachCoin) {

		let coin = {

			coinGeckoID: eachCoin.coinGeckoID,
			coinName: eachCoin.coinName,
			Symbol: eachCoin.Symbol,
			all_time_high_dollar: eachCoin.all_time_high_dollar,
			all_time_high_cent: eachCoin.all_time_high_cent,
			year_high_dollar: eachCoin.year_high_dollar,
			year_high_cent: eachCoin.year_high_cent
		};

		coins.push(coin);
	});
}

/*********************** FOR SEARCHING COINS ********************/
/*						  										*/
/****************************************************************/

// SEARCH EVERYTIME USER ENTER A CHAR 
$(document).ready(function() {
	$("#coinSearchInput").keyup(function() {
		searchCoin();
	});
});

// WHEN SEARCH BUTTON IS CLICKED
$(document).ready(function() {
	$("#coinSearchBtn").click(function() {
		searchCoin();
	});
});

// 
function searchCoin() {

	// CLEAR DIV AND ARRAY
	searchedCoins.length = [];

	var userInput = $.trim($("#coinSearchInput").val());

	// CHECK IF THERE'S AN INPUT TO SEARCH
	if (userInput != "") {

		userInput.toLowerCase();

		// CHECK IF SEARCH MATCHES NAME OR SYMBOL
		$.each(coins, function(_,obj) {

			// IF IT MATCHES PUSH TO SEARCHEDCOINS ARRAY
			if (obj.coinName.toLowerCase().indexOf(userInput) != -1) {
				searchedCoins.push(obj);
			}
			else if(obj.Symbol.toLowerCase().indexOf(userInput) != -1) {
				searchedCoins.push(obj);
			}
		});

		// DISPLAY COINS ON DASHPAGE
		display_coin("#searchList", searchedCoins);
	}
}