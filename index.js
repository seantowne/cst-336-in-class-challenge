/* Require external APIs and start our application instance */
var express = require('express');
var app = express();
var request = require('request');

/* Configure our server to read public folder and ejs files */
app.use(express.static('public'));
app.set('view engine', 'ejs');

/* The handler for the DEFAULT route */
app.get('/', function(req, res){
    res.render('home');
});

/* The handler for the /results route */
app.get('/results', function(req, res){
	// https://openlibrary.org/api/books?bibkeys=ISBN:0451526538&format=json&jscmd=data
	var query = req.query.search;
	console.log(query);
	var url = 'https://openlibrary.org/api/books?bibkeys=ISBN:' + query + '&format=json&jscmd=data';
	request(url, function(error, response, dataStream){
		if (!error && response.statusCode == 200){
			var data = JSON.parse(dataStream);
			var firstKey = Object.keys(data)[0]
			console.log(data[firstKey]);
			res.render('results', {data: data[firstKey]});
		}
	});
});

/*
<ul id='movies-list'>
        <% data.Search.forEach(function(movie){%>
	        <li> 
	            <img class='poster' src=<%=movie.Poster%> />
	            <div>
                    <h5><%=movie.Title%></h5>
                    <p><%=movie.Year%></p>
                </div>
	        </li>	
        <% }); %>
    <ul>
*/
/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})