/************************** FOR AJAX  ***************************/
/*						JS AJAX OR JQUERY AJAX					*/
/****************************************************************/

// CREATING ASYNCHRONOUS AJAX REQUEST
function ajaxRequest(url, method, data, callback, json) {

	let request = new XMLHttpRequest();
	request.open(method, url, true);

	request.setRequestHeader("Access-Control-Allow-Origin", "*");
	
	if (method == "POST") {
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}

	request.onreadystatechange = function() {
		// IF REQUEST IS READY TO BE PROCCESS
		if (request.readyState === 4) {
			// IF REQUEST WAS SUCCESSFUL
			if (request.status === 200) {
				// GET RESPONSE AND CALLBACK
				if (json){
					response = JSON.parse(request.responseText);
				}
				else{
					response = request.responseText;
				}

				callback(response);
			} else {
				handleError(response);
			}
		}
	}

	request.send(data);	
}

function ajaxJquery(url, callback) {
	$.getJSON(url, callback);
}

function handleError(error) { 
	console.log(error); 
	if (error.status == 403){
		alert("Your session has expired please log back in");
		logout();
	}
}

/************************ API CALL FUNCTIONS ********************/
/*						  										*/
/****************************************************************/

function get_coin(request, isAsync, callback) {

	$.ajax({

		// PUBLIC API
		// url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
		// PRIVATE API
		// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
		
		url: request.url,
		headers: request.headers,
		async: isAsync,
		type: request.type,
		dataType: request.dataType,
		data: request.data,
		success: function (response) {
			callback(response);
		},
		error: function (response) {
			error_msg(response);
		}
	});
}

function error_msg(response) {
	console.log(response);
}

/************************ FOR LOGGING OUT ***********************/
/*						  										*/
/****************************************************************/
function logout() {

	// DONT FORGET TO CLEAR SESSION STORAGE WHEN USER LOGS OUT
	sessionStorage.clear()
	var auth2 = gapi.auth2.getAuthInstance();
		auth2.signOut().then(function () {
		console.log('User signed out.');
	});
}

/************************ FOR ACTIVE MENU ***********************/
/*						  										*/
/****************************************************************/

// DIRECT USER TO THE PAGE AND MAKE IT THE ACTIVE PAGE
function gotopage(pageID) {

	// REDIRECT USER TO PAGE
	switch(pageID) {
		case "dashpage":
			window.location.replace("dashpage.html");
			break;
		case "favpage":
			window.location.replace("favpage.html");
			break;
	}
}

/***************************** FUNCTIONS ************************/
/*						  										*/
/****************************************************************/
/*********************** ADDING COIN TO FAVE ********************/

// WHEN ADD TO FAVE BUTTON IS CLICKED
$(document).ready(function() {
	$(".faveCoinBtn").click(function() {
		
		var coin_id = $(this).attr("id");

		// SEND TOKEN TO AJAX
		var token_id = JSON.parse(sessionStorage.getItem("user")).token;

		$.ajax({

			// PUBLIC API
			url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
			
			headers: {
				'Content-Type': 'application/json',
				authorizationToken: token_id
			},
			type: "POST",
			dataType: "json",
			data: JSON.stringify({'coinID' : coin_id}),
			success: function (response) {
				//console.log(response);
			},
			error: function (response) {
				error_msg(response);
			}
		});
	});
});

/************************** DISPLAY COINS ***********************/

function display_coin(div, givencoins) {

	// CLEAR DIV
	$(div).empty();

	// INSERT EACH COIN INTO HTML
	$.each(givencoins, function(_, obj) {

		var container = $("<div></div>");
		container.addClass("coins");

		var name = $("<p></p>");
		name.addClass('coinName');
		name.attr('id', obj.coinGeckoID);
		name.html(obj.coinName);

		var all_time_val = obj.all_time_high_dollar + "." + obj.all_time_high_cent.substring(0,3);
		var all_time_high = $("<p></p>");
		all_time_high.addClass('all-time-price');
		all_time_high.html('All Time High Price: &#36;'+all_time_val);

		var year_high_val = obj.year_high_dollar + "." + obj.year_high_cent.substring(0,3);
		var year_high = $("<p></p>");
		year_high.addClass('year-high-price');
		year_high.html('Year High Price: &#36;'+year_high_val);
		
		container.append(name);
		container.append(all_time_high);
		container.append(year_high);
		$(div).append(container);
	});
}

/************************ FOR CLICKING COINS ********************/

// IF A COIN IS CLICKED
$(document).on('click', '.coins', function() {

	var selectedCoin = this.firstElementChild;
	window.location.href = encodeURI("coinpage.html?coinID=" + selectedCoin.id + "&coinName=" + selectedCoin.innerHTML);
});