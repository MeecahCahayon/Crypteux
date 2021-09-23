const favecoins = [];

function get_faveCoins() {

	$.ajax({

		// PUBLIC API
		url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
		// PRIVATE API
		// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
		
		headers: {
			//'Content-Type': 'application/x-www-form-urlencoded',\
			'Content-Type': 'application/json',
			authorizationToken: token_id
		},
		type: "GET",
		dataType: "json",
		data: {
		},
		success: function (response) {
			store_faveCoins(response);
		},
		error: function (response) {
			error_msg(response);
		}
	});

    // display coins
    //displayCoin();
}

function store_faveCoins(response) {	

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

		favecoins.push(coin);
	});
}

function displayCoin() {
	// clear div
	$( "#faveList" ).empty();

	// insert each coin into html
	$.each(favecoins, function(_, obj) {
		var container = $("<div></div>");
		container.addClass("favcoin");

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
		$("#faveList").append(container);
	})
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