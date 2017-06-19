
var secrets = require('./secrets');
var request = require('request');

module.exports = function(app) {

	app.get('/gettoken/authorize/:referrer', function(req, res){
		// save the referrer to session
		var referrer = req.params.referrer;
		req.session.backto = referrer;

		// do actual 
		res.redirect('https://github.com/login/oauth/authorize?' + 
			[
				'scope=repo', 
				'client_id=' + secrets.github_client_id, 
				'redirect_uri=' + encodeURIComponent(secrets.github_callback)
			].join('&')
		);
	});
	
	// authorization callback
	app.get('/gettoken/callback', function(req, res){
		if(req.query && req.query.code){
			var code = req.query.code;
			// do post

			// Set the headers
			var headers = { 'Content-Type': 'multipart/form-data' };

			// Configure the request
			var options = {
			    url: 'https://github.com/login/oauth/access_token',
			    method: 'POST',
			    headers: headers,
			    form: {
			    	"accept" : "json",
			    	"code" : code,
			    	"client_id" : secrets.github_client_id,
			    	"client_secret" : secrets.github_client_secret
			    }
			};

			// Start the request
			request(options, function (error, response, body) {
			    if (!error && response.statusCode == 200) {
			        // Print out the response body
			        console.log(body);
			        res.status(200).send('OK');
			    }
			});
		}else{
			res.status(404).send('Not found');
		}
	});

};
