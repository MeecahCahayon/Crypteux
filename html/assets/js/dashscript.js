/********************* FOR CREATING COIN LIST *******************/
/*						  										*/
/****************************************************************/
const coins = [];
var searchedCoins = []

function get_allCoins() {

	$.ajax({

		// PUBLIC API
		url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/coins',
		// PRIVATE API
		// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
		
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		type: "GET",
		dataType: "json",
		data: {
		},
		success: function (response) {
			store_allCoins(response);
		},
		error: function (response) {
			error_msg(response);
		}
	});
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

	// // FOR TESTING
	// for (var i = 0; i < 10; i++) {

	// 	let coin = {

	// 		coinGeckoID: coins[i].coinGeckoID,
	// 		coinName: coins[i].coinName,
	// 		Symbol: coins[i].Symbol
	// 	};

	// 	console.log(coin);
	// }

	// for (var i = 900; i < 910; i++) {

	// 	let coin = {

	// 		coinGeckoID: coins[i].coinGeckoID,
	// 		coinName: coins[i].coinName,
	// 		Symbol: coins[i].Symbol
	// 	};

	// 	console.log(coin);
	// }

	// console.log(coins.length);
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

// click search button
$(document).ready(function() {
	$("#coinSearchBtn").click(function() {
		searchCoin();
	});
});

function searchCoin() {
	// clear div and array
	searchedCoins.length = [];

	var userInput = $.trim($("#coinSearchInput").val());

	// CHECK IF THERE'S AN INPUT TO SEARCH
	if (userInput != "") {
		userInput.toLowerCase();
		// check if search matches name or symbol
		$.each(coins, function(_,obj) {
			if (obj.coinName.toLowerCase().indexOf(userInput) != -1) {
				searchedCoins.push(obj);
			}
			else if(obj.Symbol.toLowerCase().indexOf(userInput) != -1) {
				searchedCoins.push(obj);
				console.log(obj);
			}
		});
		// display coin on dashpage
		displayCoin();
	}
}

function displayCoin() {
	// clear div
	$( "#searchList" ).empty();

	// insert each coin into html
	$.each(searchedCoins, function(_, obj) {
		var container = $("<div></div>");
		container.addClass("coins");

		var name = $("<p></p>");
		name.addClass('coinName');
		name.attr('id', obj.coinGeckoID);
		name.html(obj.coinName);

		var all_time_val = obj.all_time_high_dollar + "." + obj.all_time_high_cent.substring(0, 2); 
		var all_time_high = $("<p></p>");
		all_time_high.addClass('all-time-price');
		all_time_high.html('All Time High Price: &#36;'+all_time_val);

		var year_high_val = obj.year_high_dollar + "." + obj.year_high_cent.substring(0, 2); 
		var year_high = $("<p></p>");
		year_high.addClass('year-high-price');
		year_high.html('Year High Price: &#36;'+year_high_val);
		
		container.append(name);
		container.append(all_time_high);
		container.append(year_high);
		$("#searchList").append(container);
	})
	return;
}

/************************ FOR CLICKING COINS ********************/
/*						  										*/
/****************************************************************/
// IF A COIN IS CLICKED
jQuery(document).on('click', '.coins', function() {
    var selectedCoin = this.firstElementChild;
	console.log(selectedCoin);
	goto_coin(selectedCoin.id, selectedCoin.innerHTML);
});

function goto_coin(coinId, coinName) {

	window.location.href = encodeURI("coinpage.html?coinID=" + coinId + "&coinName=" + coinName);
}


/************************ API CALL FUNCTIONS ********************/
/*						  										*/
/****************************************************************/

function error_msg(response) {
	console.log(response);
}





// /*** CREATE EVENTS ***/
// // SEARCH EVERYTIME USER ENTER A CHAR
// _widgetUI.searchInput.addEventListener("keyup", function(event) {

// 	// WHEN ENTER KEY IS PRESSED, TRIGGER BUTTON CLICK
// 	if(event.key === 'Enter') {
// 		_widgetUI.searchBtn.click();
// 	}

// 	// CHANGE THE MORE/LESS BUTTON INNERHTML TO 'MORE'
// 	_widgetUI.moreBtn.innerHTML = _contElemMoreBtn;

// 	// SEARCH THE RECIPE FROM THE DATABASE
// 	_getSearchRecipe(_widgetUI.searchInput.value);
// });

// // WHEN SEARCH BUTTON IS PRESS
// _widgetUI.searchBtn.onclick = function() {
	
// 	// CHANGE THE MORE/LESS BUTTON INNERHTML TO 'MORE'
// 	_widgetUI.moreBtn.innerHTML = _contElemMoreBtn;

// 	// SEARCH THE RECIPE FROM THE DATABASE
// 	_getSearchRecipe(_widgetUI.searchInput.value);
// }