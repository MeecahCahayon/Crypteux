/*********************** FOR SEARCHING COINS ********************/
/*						  										*/
/****************************************************************/

// SEARCH EVERYTIME USER ENTER A CHAR
$(document).ready(function() {
	$("#coinSearchInput").keyup(function() {

		// WHEN ENTER KEY IS PRESSED, TRIGGER BUTTON CLICK
		if(event.key === 'Enter') {
			seacrhCoin($("#coinSearchInput").val());
		}
	});
});

$(document).ready(function() {
	$("#coinSearchBtn").click(function() {

		console.log("Button Clicked");

		get_allCoins(displayCoin);
	});
});

function seacrhCoin(coin) {
	
	var userInput = coin.trim();

	// CHECK IF THERE'S AN INPUT TO SEARCH
	if (userInput != "") {

		// $.ajax({
		// 	url: 'https://zi7y07eh2h.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded'
		// 	},
		// 	type: "GET",
		// 	dataType: "json",
		// 	data: {
		// 	},
		// 	success: function (response) {
		// 		console.log(response);
		// 	},
		// 	error: function () {
		// 		console.log("error");
		// 	}
		// });

		get_allCoins(displayCoin);
	}
}

function displayCoin(response) {
	
	console.log(response);
}


/************************ API CALL FUNCTIONS ********************/
/*						  										*/
/****************************************************************/

function get_allCoins(callback) {
	
	$.ajax({
		url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		type: "GET",
		dataType: "json",
		data: {
		},
		success: function (response) {
			callback(response);
		},
		error: function () {
			console.log("error");
		}
	});
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