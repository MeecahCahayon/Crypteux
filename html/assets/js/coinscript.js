/******************* FOR DISPLAYING COIN INFO *******************/
/*						  										*/
/****************************************************************/
/*********************** DISPLAY COIN NAME **********************/

function get_coininfo() {
	
	// DISPLAY THE COIN NAME AS A SUBHEADER
	var coinName = getQueryVariable("coinName");
	if (coinName != false) { document.getElementById("coinName").innerHTML = coinName; }

	$.ajax({

		// PUBLIC API
		url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/coin',
		// PRIVATE API
		// url: 'https://zi7y07eh2h-vpc-3c41bf5a.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api-private/coins',
		
		headers: {
			'Content-Type': 'application/json'
		},
		type: "GET",
		dataType: "json",
		data: JSON.stringify({'coinID': coinId}),
		success: function (response) {
			console.log(response);
		},
		error: function (response) {
			error_msg(response);
		}
	});
}

/**************************** FUNCTIONS *************************/
/*						  										*/
/****************************************************************/

// GET DATA FROM WINDOW.LOCATION
function getQueryVariable(variable) {
	
	// GET ALL THE DATA IN THE WINDOW.LOCATION
	var query = window.location.search.substring(1);
	var variables = query.split("&");

	// CHECK IF ITS THE VARIABLE
	for (var i = 0; i < variables.length; i++) {

		var pair = variables[i].split("=");

		if (pair[0] == variable) { return decodeURI(pair[1]); }
	}

	return false;
}