
var secrets = require('./secrets');
var request = require('request');
var path = require('path');

function getAuthorizeUrlByScope(scope){
	return 'https://github.com/login/oauth/authorize?' + 
		[
			'scope=' + scope, 
			'client_id=' + secrets.github_client_id, 
			'redirect_uri=' + encodeURIComponent(secrets.github_callback)
		].join('&');
}

module.exports = function(app) {

	// =====================================
    // Debug ===============================
    // =====================================
	app.get('/debug/:name', function(req, res){
		var name = req.params.name;
		res.render(path.resolve(__dirname, '../', 'views/' + name + '.ejs'), { message: "test", token: '62d27e2114cc9ddab085edb073a316878f95bf5d', link: 'https://github.com/KinoLien/gitzip' } );
	});

	// =====================================
    // Web pages ===========================
    // =====================================
    app.get('/', function(req, res){
    	if(process.env.NODE_ENV === 'production') res.status(200).send('<h3>under construction</h3>');
    	else res.sendFile(path.resolve(__dirname, '../', 'views/index.html'));
    });

    app.get('/:htmlname', function(req, res){
    	var name = req.params.htmlname;
    	if(process.env.NODE_ENV === 'production') res.status(200).send('<h3>under construction</h3>');
    	else res.sendFile(path.resolve(__dirname, '../', 'views/' + name));
    });


    // http://introjs.com/  for introduce

	// =====================================
    // Normal Files ========================
    // =====================================
    app.get('/assets/:type(css|js|images|videos)/:name', function(req, res, next) {
        var type = req.params.type;
        var name = req.params.name;
        res.sendFile(path.resolve(__dirname, '../../assets', type, name));
    });


    // =====================================
    // Token getting Process ===============
    // =====================================
	app.get('/gettoken/authorize/:referrer', function(req, res){
		// save the referrer to session
		req.session.backto = decodeURIComponent( req.params.referrer );

		// do actual 
		res.redirect( getAuthorizeUrlByScope('public_repo') );
	});

	app.get('/gettoken/authorize/private/:referrer', function(req, res){
		// save the referrer to session
		req.session.backto = decodeURIComponent( req.params.referrer );

		// do actual 
		res.redirect( getAuthorizeUrlByScope('repo') );
	});
	
	// authorization callback
	app.get('/gettoken/callback', function(req, res){
		if(req.query && req.query.code){
			var code = req.query.code;

			// do post
			// Set the headers
			var headers = { 
				'Accept': 'application/json',
				'Content-Type': 'multipart/form-data'
			};

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
			        // console.log(body);
			        var resJson = JSON.parse(body);
			        if(resJson.access_token){
			        	req.session.apitoken = resJson.access_token;
			        	res.redirect('/gettoken/success');
			        }else{
			        	res.status(500).send( (error || body).toString() );	
			        }
			    }else{
					res.status(500).send( (error || body).toString() );
			    }
			});
		}else{
			res.status(404).send('Not found');
		}
	});

	app.get('/gettoken/success', function(req, res){
		var token = req.session.apitoken;
		var link = req.session.backto;
		if(token && link){
			res.status(200).render(path.resolve(__dirname, '../', 'views/goback.ejs'), { token: token, link: link } );
		}else{
			res.status(404).send('Not found');
		}
	});

};
