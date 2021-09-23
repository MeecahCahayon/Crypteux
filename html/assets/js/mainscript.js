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

/************************ FOR LOGGING IN ************************/
/*						  										*/
/****************************************************************/
var onLoad = function() {
	var auth2;
	gapi.load('auth2', function() {
		// load gapi lib
		auth2 = gapi.auth2.init({
			client_id: '331364600378-n4u9qepoebkc5fdib5jvop86fm44ff68.apps.googleusercontent.com'
		});

		auth2.attachClickHandler('customBtn', {}, onSuccess, onFailure);
	})
}

// successful login
var onSuccess = function(user) {
	console.log('Signed in as ' + user.getBasicProfile().getName());
	var profile = user.getBasicProfile();

	// send token to ajax
	var token_id = user.getAuthResponse().id_token;

	$.ajax({

		// PUBLIC API
		url: 'https://mkuvib9bgi.execute-api.ap-southeast-2.amazonaws.com/pumped-backend-api/login',
		
		headers: {
			'Content-Type': 'application/json',
			'authorizationToken' : token_id
		},
		type: "POST",
		dataType: "json",
		data: {
		},
		success: function (response) {
			var user = {}
			user.id = profile.getId();
			user.name = profile.getName();
			user.email = profile.getEmail();
			user.token = token_id;
			//user.picture = profile.getPicture();

			sessionStorage.setItem("user", JSON.stringify(user))
			location.href = 'dashpage.html';
		},
		error: function (response) {
			console.log(response);;
		},
	});
}

// failed login
var onFailure = function(error) {
	console.log(error);
}


/************************ FOR LOGGING OUT ***********************/
/*						  										*/
/****************************************************************/
function logout() {
	//Don't forget to clear sessionStorage when user logs out
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