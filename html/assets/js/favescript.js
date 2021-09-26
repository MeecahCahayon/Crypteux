/*************************** VARIABLES **************************/
/*						  										*/
/****************************************************************/

const favecoins = [];

/************************ FOR GETTING DATA **********************/
/*						  										*/
/****************************************************************/
/********************** GET FAVOURITE COINS *********************/

function get_faveCoins() {

	if (sessionStorage.getItem('watchlist') != null) { display_fave_coins(); } 
	else {
		// SEND TOKEN TO AJAX
		var token_id = JSON.parse(sessionStorage.getItem("user")).token;

		const request = {
			url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
			headers: { 
				'Content-Type': 'application/json',
				authorizationToken: token_id },
			type: "GET",
			dataType: "json",
			data: {}
		};

		get_coin(request, true, store_fave_session);
	}
}

function store_fave_session(response) {


	sessionStorage.setItem("watchlist", JSON.stringify(JSON.parse(response.body)));
	display_fave_coins();
}

function display_fave_coins() {	

	var list_of_fave = JSON.parse(sessionStorage.getItem('watchlist'));

	// FOR EACH COIN
	$.each(list_of_fave, function(_, eachCoin) {

		const request = {
			url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/coin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
			type: "GET",
			dataType: "json",
			data: { coinID: eachCoin.coinID }
		};

		get_coin(request, false, function(response) {

			let coin = {

				coinGeckoID: response[0].coinGeckoID,
				coinName: response[0].coinName,
				Symbol: response[0].Symbol,
				all_time_high_dollar: response[0].all_time_high_dollar,
				all_time_high_cent: response[0].all_time_high_cent,
				year_high_dollar: response[0].year_high_dollar,
				year_high_cent: response[0].year_high_cent
			};

			favecoins.push(coin);
		});
	});

	display_coin("#faveList", favecoins);
}