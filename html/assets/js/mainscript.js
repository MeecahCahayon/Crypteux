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

		var url = "https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/watchlist";

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url);

		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("authorizationToken", "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMzMTA0YzY4OGMxNWU2YjhlNThlNjdhMzI4NzgwOTUyYjIxNzQwMTciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMzMxMzY0NjAwMzc4LW40dTlxZXBvZWJrYzVmZGliNWp2b3A4NmZtNDRmZjY4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMzMxMzY0NjAwMzc4LW40dTlxZXBvZWJrYzVmZGliNWp2b3A4NmZtNDRmZjY4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE2MDcxNTQ2NjQwODQwMTk1Mzk5IiwiZW1haWwiOiJjb25ub3IuZ2F1dGhlcm5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJPc05maTJDRXpVaG5icXZaU3hrRE9nIiwibmFtZSI6IkNvbm5vciBKb25lcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQVRYQUp5UkZlYjVaYVg4OVNwTG51RjJ4MnMtZmU3cjZ3OGl1Q0tuNG03Mj1zOTYtYyIsImdpdmVuX25hbWUiOiJDb25ub3IiLCJmYW1pbHlfbmFtZSI6IkpvbmVzIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MzI0MDkwMDYsImV4cCI6MTYzMjQxMjYwNiwianRpIjoiMjBkZDk3YzM0YWFhN2FjOTM4NDI5OTY2OTNkMzYxYzA5MGU4ZmQyYSJ9.ZzCMsLgBhLVYnwTiM1ZI-Y0uzg9JasgHIj9VbevLKsMrvYepUGmpoENxQT5fuDJF_nNn5UdG0fUHtEeivmcVB0qAcScGnEj10bs3ripvBVoG91ZS7cLsex1Cq0SBYTfPy1OfTYkp64sXqk7gtpgxYjQHRSRwF_yN_MTkErYpcirwayFIkuoZzxHw8uYeERXRuLXrlZGZG8YozQcTiGHSypSWSgytPU0p9GG1pB-s0cFl5Aq1kd9YEIuGSMKWtSQOr8uzEnAdY9rOcoeMFhC2xml7wJrrDTTgkZWiniu95qomv0_QgVjgUXZIhq7z0UB_gTXSw2t_fmXtpRhh8e7zvA");
		//xhr.setRequestHeader("Authorization", "Bearer .eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMzMxMzY0NjAwMzc4LW40dTlxZXBvZWJrYzVmZGliNWp2b3A4NmZtNDRmZjY4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMzMxMzY0NjAwMzc4LW40dTlxZXBvZWJrYzVmZGliNWp2b3A4NmZtNDRmZjY4LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE2MDcxNTQ2NjQwODQwMTk1Mzk5IiwiZW1haWwiOiJjb25ub3IuZ2F1dGhlcm5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJ4WlA2VnZZUmhCOGZ5NVhwZ25vOWRRIiwibmFtZSI6IkNvbm5vciBKb25lcyIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQVRYQUp5UkZlYjVaYVg4OVNwTG51RjJ4MnMtZmU3cjZ3OGl1Q0tuNG03Mj1zOTYtYyIsImdpdmVuX25hbWUiOiJDb25ub3IiLCJmYW1pbHlfbmFtZSI6IkpvbmVzIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2MzI0MDc2NjEsImV4cCI6MTYzMjQxMTI2MSwianRpIjoiZTVkNjM4NDQyYjA1YmIzM2YzZjkyMjVkMTgxMzE5ZGY4MzIzMDMzMyJ9.VOD0WHyP0OyhJGR9duPrrJQN8tQ4r9pg0r9tV1eRL2dBZb9j1q7JLPrMG9guPTnuq38ispwGvOT5wh8wG1Phltq04YTU4x99OFCSUYZNsNGaGipfJrP4b3uXOYyr7bKtVbcnN5Kgvc87xLD7hL8U46S4aqE-nPf2qbM_DbHJjxkRmC2cmbQ9VeG4hluVjmBy45zLKaa3Ex-MmoWX2macVDtLVkW57igxZB5QVVdB2-AOauLVXe_1_NedJLw0_LNqnsUwyj6eSD38U6wxR-WUyZhwBPfWBeHIIhAml-gPH-7FEDkM9Hgri7ij1NJpoex6iTZu91aLvxpY-4KhYpBXVQ");
		xhr.setRequestHeader("Content-Type", "application/json");

		xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			console.log(xhr.status);
			console.log(xhr.responseText);
		}};

		var data = JSON.stringify({'coinID' : coin_id});

		xhr.send(data);
	});
});

/************************ API CALL FUNCTIONS ********************/
/*						  										*/
/****************************************************************/

function error_msg(response) {
	console.log(response);
}