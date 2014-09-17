var connect = require('connect');
var login = require('./login');

var app = connect();

app.use(connect.json()); // Parse JSON request body into `request.body`
app.use(connect.urlencoded()); // Parse form in request body into `request.body`
app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
app.use(connect.query()); // Parse query string into `request.query`

app.use('/', main);

function main(request, response, next) {
	switch (request.method) {
		case 'GET': get(request, response); break;
		case 'POST': post(request, response); break;
		case 'DELETE': del(request, response); break;
		case 'PUT': put(request, response); break;
	}
};

function get(request, response) {
	var cookies = request.cookies;
	console.log(cookies);
	if ('session_id' in cookies) {
		var sid = cookies['session_id'];
		if ( login.isLoggedIn(sid) ) {
			response.setHeader('Set-Cookie', 'session_id=' + sid);
			response.end(login.hello(sid));	
		} else {
			response.end("Invalid session_id! Please login again\n");
		}
	} else {
		response.end("Please login via HTTP POST\n");
	}
};

function post(request, response) {
	// TODO: read 'name and email from the request.body'
	// var newSessionId = login.login('xxx', 'xxx@gmail.com');
	// TODO: set new session id to the 'session_id' cookie in the response
	// replace "Logged In" response with response.end(login.hello(newSessionId));

        var name=request.body.name;
	var email=request.body.email;
        var sessionId = login.login(name,email);
            
                response.setHeader('Set-Cookie', 'session_id=' + sessionId);
	        response.end(login.hello(sessionId));
          	response.end("Logged In\n");
};

function del(request, response) {
	console.log("DELETE:: Logout from the server");
 	// TODO: remove session id via login.logout(xxx)
 	// No need to set session id in the response cookies since you just logged out!
                var cookies = request.cookies;
		console.log(cookies);
		if ('session_id' in cookies)
		{
		var newsession_id = cookies['session_id'];
		if ( login.isLoggedIn(newsession_id) )
		{
                            login.logout(newsession_id);
			   response.end('Logged out from the server\n');
		}
		else 
			    response.end("Already logged out session\n");
		}
		else
		response.end("Invalid session\n");
              };

function put(request, response) {
	console.log("PUT:: Re-generate new seesion_id for the same user");
	// TODO: refresh session id; similar to the post() function;
        var cookies = request.cookies;
        console.log(cookies);
        if('session_id' in cookies){
              var sessionid=cookies['session_id'];
              var name=login.isname(sessionid);
              var email=login.isemail(sessionid);
      
         login.logout(sessionid);
        var newsessionid=login.login(name,email);
       response.setHeader('Set-Cookie','session_id=' + newsessionid);
      
            response.end("Re-freshed session id\n");
}
else{
                   response.end("Invalid session!");
}
};

app.listen(8000);

console.log("Node.JS server running at 8000...");
