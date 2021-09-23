/************************ FOR LOGGING IN ************************/
/*						  										*/
/****************************************************************/
var onLoad = function() {
	var auth2;
	gapi.load('auth2', function() {
		// LOAD GAPI LIB
		auth2 = gapi.auth2.init({
			client_id: '331364600378-n4u9qepoebkc5fdib5jvop86fm44ff68.apps.googleusercontent.com'
		});

		auth2.attachClickHandler('customBtn', {}, onSuccess, onFailure);
	})
}

// ON SUCCESSFUL LOGIN
var onSuccess = function(user) {
	console.log('Signed in as ' + user.getBasicProfile().getName());
	var profile = user.getBasicProfile();

	// SEND TOKEN TO AJAX
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

// FAILED LOGIN
var onFailure = function(error) {
	console.log(error);
}