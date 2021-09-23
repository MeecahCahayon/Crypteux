/**************************** TO KEEP ***************************/
/*						  										*/
/****************************************************************/

function ajax_sample() {

	$.ajax({

		// PUBLIC API
		url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist',
		// PRIVATE API
		// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
		
		headers: {
			// 'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Type': 'application/json',
			authorizationToken: token_id
		},
		type: "GET",
		dataType: "json",
		data: {
		},
		success: function (response) {
			// store_faveCoins(response);
			console.log(response);
		},
		error: function (response) {
			error_msg(response);
		}
	});
}

function other_ajax() {
	
	// // SEND TOKEN TO AJAX
	var token_id = sessionStorage.getItem("user").token;
	 var coin_id = "bitcoin";

	var url = "https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist";

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url);

	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("authorizationToken", token_id);
	xhr.setRequestHeader("Content-Type", "application/json");

	xhr.onreadystatechange = function () {
	if (xhr.readyState === 4) {
		console.log(xhr.status);
		console.log(xhr.responseText);
	}};

	var data = JSON.stringify({'coinID' : coin_id});

	xhr.send(data);
}