var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("myDB");

// db.serialize(function () {
//   db.run("CREATE TABLE IF NOT EXISTS eMovies (id TEXT, title TEXT)");
//   db.run("DELETE FROM eMovies");
//   englishMovies.forEach((movie) => {
//     db.run(`INSERT INTO eMovies VALUES ("${movie.id}","${movie.title}")`);
//   });

//   db.each("SELECT * FROM eMovies", function (err, row) {
//     console.log("row data: " + row.id + " " + row.title);
//   });
// });

db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS newMovies (id TEXT, title TEXT)");
  db.run("DELETE FROM newMovies");
});

// db.close();

// Get port from environment and -store in Express.
var port = normalizePort(process.env.PORT || "1234");

app.set("port", port);
// Normalize a port into a number, string, or false.

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

// Tell our application to serve all the files under the `public_html` directory
// app.use(express.static("public_html"));

app.use(express.static("client")); // SERVING STATIC WEB PAGE
//SIMILAR TO USING parcel client/index.html

//Here we are configuring express to use body-parser as middle-ware.
// app.use(bodyParser.urlencoded({ extended: false })); // ONLY FOR USING FORM
// bodyParse setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ONE OTHER USE OF REQUEST
// Deakin's Web Course Week8 expressServer.js;
// app.get('/powertable/:base/:maxcnt', function (request, response) {
//     // Add the JS code here to send a message back to the client with the content of the page to be displayed.
//     console.log(request.params);
//     var cntMax = request.params.maxcnt;
//     var baseNum = request.params.base;

//created by Mike
app.post("/added", function (req, res, next) {
  console.log(req.body);
  var stmt = db.run(
    `INSERT INTO newMovies VALUES ("${req.body.id}","${req.body.title}")`
  );
  console.log("Just received POST data for users endpoint!");

  db.each("SELECT * FROM newMovies", function (err, row) {
    console.log("row data: " + row.id + " " + row.title);
  });
  res.status(200).redirect("/");
});

// PROBLEMS WITH .EACH(): the order of each row being sent back - res doesn't exist anymore
// FRONT END:     GET http://localhost:1234/undefined net::ERR_EMPTY_RESPONSE
// BACK END:
//node:events:368
//       // throw er; // Unhandled 'error' event
//       // ^
// // Error [ERR_STREAM_WRITE_AFTER_END]: write after end

// app.get("/show", function (req, res, next) {
//   console.log(req.body);
//   db.each("SELECT * FROM newMovies", function (err, row) {
//     res.json({ movieID: row.id, title: row.title });
//     res.end("success");
//     console.log("row data: " + row.id + " " + row.title);
//   });
// });

app.get("/show", function (req, res, next) {
  console.log(req.body);
  db.all("SELECT * FROM newMovies", function (err, rows) {
    // MUST USE .ALL() TO GET AN ARRAY
    res.json(rows);
    console.log("row data: " + rows.toString());
  });
});

app.listen(port, function () {
  // When the application starts, print to the console that our app is
  // running at http://localhost:8080 (where the port number is 3000 by
  // default). Print another message indicating how to shut the server down.
  console.log(`Web server running at: http://localhost:${port}`);
  console.log("Type Ctrl+C to shut down the web server");
});
