var express = require("express");
var bodyParser = require("body-parser");
var app = express();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("myDB");
db.serialize(function () {
  db.run("CREATE TABLE IF NOT EXISTS newMovies (id TEXT, title TEXT)");
  db.run("DELETE FROM newMovies");
});

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

// Tell our application to serve all the files under the `client` directory
app.use(express.static("client")); // SERVING STATIC WEB PAGE
//SIMILAR TO USING parcel client/index.html

//Here we are configuring express to use body-parser as middle-ware.
// bodyParse setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
