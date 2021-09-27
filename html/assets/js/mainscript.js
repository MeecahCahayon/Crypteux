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
			if (callback != "") {
				callback(response);
			}
		},
		error: function (response) {
			error_msg(response);
		}
	});
}

function error_msg(response) {
	console.log(response);
}

/********************** FOR PERSONALISATION *********************/
/*						  										*/
/****************************************************************/
/********************** ON DASHBOARD LOAD ***********************/
$(document).ready(function(){
	var user = JSON.parse(sessionStorage.getItem("user", user));

	if(user != null) {
		document.querySelector('#user_name').innerHTML = user.name;
		document.querySelector('#profile_pic').style.backgroundImage = `url(${user.img})`;
		document.querySelector('#profile_pic').style.backgroundSize = '40px';
	}
});

/************************ ON NAME CLICKED ************************/
$(document).ready(function () {
	$(".dropdownCont").click(function(e) {
		var display = $('.dropdown-content').css('display');
		if(display == 'none') {
			$('.dropdown-content').css('display', 'block');
		}
		else {
			$('.dropdown-content').css('display', 'none');
		}
	});
})

$(document).ready(function () {
	// /* IF ANYTHING ELSE IS CLICKED CLOSE DROP DOWN */
	$(document).mouseup(function (e) {
		var container = $(".dropdown-content");

		// if the target of the click isn't the container or a descendant of the container
		if (!container.is(e.target) && container.has(e.target).length === 0) 
		{
			$('.dropdown-content').css('display', 'none');
		}
	});
})

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
/******************* STORE WATCHLIST TO SESSION *****************/
function get_watchlist() {
	
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

	get_coin(request, false, store_watchlist);
}

function store_watchlist(response) {
	
	sessionStorage.setItem("watchlist", JSON.stringify(JSON.parse(response.body)));
}

/*********************** ADDING COIN TO FAVE ********************/
/* VARIABLES */
var watchlistedIcon = "fas fa-bookmark";
var faveBtnClass = "faveCoinBtn";

var notWatchlistedIcon = "far fa-bookmark";
var unfaveBtnClass = "unfaveCoinBtn";

// WHEN UNFAVE BUTTON IS CLICKED - MAKE COIN FAVE
$(document).ready(function() {
	$(document).on('click', '.watchlistBtn', function() {

		var coin_id = $(this).attr("id");
		var coin_class = $(this).attr("class");
		var coin_classes = coin_class.split(" ");

		// SEND TOKEN TO AJAX
		var token_id = JSON.parse(sessionStorage.getItem("user")).token;

		// CHECK WHAT KIND OF BUTTON
		if (coin_classes.length == 2) {

			// IF UNFAVE BUTTON
			if (coin_classes[1] == unfaveBtnClass) {

				// MAKE THE COIN FAVE
				const request = {
					url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
					headers: { 
						'Content-Type': 'application/json',
						authorizationToken: token_id },
					type: "POST",
					dataType: "json",
					data: JSON.stringify({'coinID' : coin_id})
				};

				get_coin(request, false, get_watchlist);

				$(this).removeClass();
				$(this).addClass("watchlistBtn");
				$(this).addClass(faveBtnClass);

				console.log($(this));
				console.log($(this).children().first());
				$(this).children().first().removeClass();
				$(this).children().first().addClass(watchlistedIcon);

			}
			// IF FAVE BUTTON
			else if (coin_classes[1] == faveBtnClass) {

				// REMOVE COIN FROM WATCHLIST
				const request = {
					url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
					headers: { 
						'Content-Type': 'application/json',
						authorizationToken: token_id },
					type: "DELETE",
					dataType: "json",
					data: JSON.stringify({'coinID' : coin_id})
				};

				get_coin(request, false, get_watchlist);

				$(this).removeClass();
				$(this).addClass("watchlistBtn");
				$(this).addClass(unfaveBtnClass);

				$(this).children().first().removeClass();
				$(this).children().first().addClass(notWatchlistedIcon);
			}
		}


	});
});

/************************** DISPLAY COINS ***********************/

function display_coin(div, givencoins) {

	// CLEAR DIV
	$(div).empty();

	// CHECK IF WACTHLISTED IS SAVE
	if (sessionStorage.getItem('watchlist') == null) {
		get_watchlist();
	} 

	// GET WATCHLISTED
	var list_of_fave = JSON.parse(sessionStorage.getItem('watchlist'));

	// INSERT EACH COIN INTO HTML
	$.each(givencoins, function(_, obj) {

		var container = $("<div></div>");
		container.addClass("coinlistCont");

		var coinsCont = $("<div></div>");
		coinsCont.addClass("coins");

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

		var btnCont = $("<div></div>");
		btnCont.addClass("watchlistBtnCont");

		var watchlistBtn = $("<button></button>");
		watchlistBtn.addClass("watchlistBtn");
		watchlistBtn.addClass(unfaveBtnClass);
		watchlistBtn.attr('id', obj.coinGeckoID);

		var watchlistIcon = $("<i></i>");
		watchlistIcon.attr('id', "watchlistedIcon");
		watchlistIcon.addClass(notWatchlistedIcon);

		// FOREACH WACTHLISTED COIN
		$.each(list_of_fave, function(_, eachCoin) {
			
			if (obj.coinGeckoID == eachCoin.coinID) {

				watchlistBtn.removeClass();
				watchlistIcon.removeClass();

				watchlistBtn.addClass("watchlistBtn");
				watchlistBtn.addClass(faveBtnClass);
				watchlistIcon.addClass(watchlistedIcon);
				return;
			}
		});
		
		watchlistBtn.append(watchlistIcon);

		btnCont.append(watchlistBtn);

		coinsCont.append(name);
		coinsCont.append(all_time_high);
		coinsCont.append(year_high);

		$(container).append(coinsCont);
		$(container).append(btnCont);

		$(div).append(container);
	});
}

/************************ FOR CLICKING COINS ********************/

// IF A COIN IS CLICKED
$(document).on('click', '.coins', function() {

	var selectedCoin = this.firstElementChild;
	window.location.href = encodeURI("coinpage.html?coinID=" + selectedCoin.id + "&coinName=" + selectedCoin.innerHTML);
});