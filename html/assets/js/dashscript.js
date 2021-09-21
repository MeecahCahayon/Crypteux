/********************* FOR CREATING COIN LIST *******************/
/*						  										*/
/****************************************************************/
const coins = [];

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
			Symbol: eachCoin.Symbol
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

		// WHEN ENTER KEY IS PRESSED, TRIGGER BUTTON CLICK
		if(event.key === 'Enter') {
			searchCoin($("#coinSearchInput").val());
		}
	});
});

$(document).ready(function() {
	$("#coinSearchBtn").click(function() {

		console.log("Button Clicked");
		get_allCoins(displayCoin);
	});
});

function searchCoin(coin) {
	
	var userInput = coin.trim();

	// CHECK IF THERE'S AN INPUT TO SEARCH
	if (userInput != "") {

		// for each coin in coins
			//match regex
				//save in a diff array
					//display

		console.log("Enter Pressed");
		console.log($("#searchList"));
		get_allCoins(displayCoin);
	}
}

function displayCoin(response) {
	
	console.log(response);
}

/************************ FOR CLICKING COINS ********************/
/*						  										*/
/****************************************************************/
// IF A COIN IS CLICKED
$(document).ready(function() {
	$(".coins").click(function() {

		var selectedCoin = this.firstElementChild;
		goto_coin(selectedCoin.id, selectedCoin.innerHTML);
	});
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