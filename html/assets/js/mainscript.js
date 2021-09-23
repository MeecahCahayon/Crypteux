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
				handleError(request.statusText);
			}
		}
	}

	request.send(data);	
}

function ajaxJquery(url, callback) {
	$.getJSON(url, callback);
}

function handleError(error) { console.log(error); }

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

/*********************** ADDING COIN TO FAVE ********************/
/*						  										*/
/****************************************************************/

// WHEN ADD TO FAVE BUTTON IS CLICKED
$(document).ready(function() {
	$(".faveCoinBtn").click(function() {
		
		// SEND TOKEN TO AJAX
		var token_id = sessionStorage.getItem("user").token;
		var coin_id = "bitcoin";

		$.ajax({

			// PUBLIC API
			url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/coin',
			// PRIVATE API
			// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
			
			headers: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Type': 'application/json',
				authorizationToken: token_id
			},
			type: "POST",
			dataType: "json",
			data: {
				"coinID" : coin_id
			},
			success: function (response) {
				console.log(response);
			},
			error: function (response) {
				error_msg(response);
			}
		});

		$.ajax({

			// PUBLIC API
			url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
			// PRIVATE API
			// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
			
			headers: {
				// 'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Type': 'application/json'
				// authorizationToken: token_id
			},
			type: "POST",
			dataType: "json",
			data: {
				"coinID" : coin_id
			},
			success: function (response) {
				console.log(response);
			},
			error: function (response) {
				error_msg(response);
			}
		});
	});
});

/************************ API CALL FUNCTIONS ********************/
/*						  										*/
/****************************************************************/

function error_msg(response) {
	console.log(response);
}