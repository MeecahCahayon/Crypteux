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

function seacrhCoin(coin) {
	
	var userInput = coin.trim();

	// CHECK IF THERE'S AN INPUT TO SEARCH
	if (userInput != "") {
		ajaxJquery("arn:aws:execute-api:ap-southeast-2:586361278274:mkuvib9bgi/*/GET/coin", displayCoin);
	}
}

function displayCoin(response) {
	
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