let count = 0;
let newMovie = {};
const url = "http://www.omdbapi.com/";
const apiKey = "620a6446";
const plot = "full";
const outputDiv = document.querySelector("#output");

function waitForJSON(res) {
  return res.json();
}

function handleUserSearch(data) {
  const rating = data.imdbRating;
  const id = data.imdbID;
  const country = data.Country;
  const title = data.Title;
  const plot = data.Plot;
  const posterImage = data.Poster;
  const type = data.Type;
  const year = data.Year;
  const rated = data.Rated;
  const runtime = data.Runtime;
  const genre = data.Genre;

  const html = `
    <h2>${title}</h2>
    <p>Type: ${type} &nbsp&nbsp&nbsp Year: ${year}  &nbsp&nbsp&nbsp Rated: ${rated} &nbsp&nbsp&nbsp Runtime: ${runtime}</p>
    <p>Genre: ${genre} &nbsp&nbsp&nbsp&nbsp Rating: ${rating} &nbsp&nbsp&nbsp Country: ${country}</p>
    <p></p>
    <img src="${posterImage}">
    <p>${plot}</p>
    `;
  outputDiv.innerHTML = html;

  // database needed to store
  // newMovies.push({
  //   id: id,
  //   title: title,
  // });
  // console.log(newMovies);
  newMovie = { id: id, title: title };
}

function display(data, where) {
  const title = data.Title;
  const posterImage = data.Poster;
  const plot = data.Plot;
  const html = `
    <div class="col-md-2">
        <div id="accordion">
        <div class="card"> 
            <img src="${posterImage}" width="150" height="100" alt="movie poster" class="img-fluid rounded-lg">
            <div class="card-header" id="headingOne">
                <h6 class="mb-0">
                    <button class="btn btn-link  collapsed" data-toggle="collapse"
                        data-target="#collapse${count}" aria-expanded="true" aria-controls="collapse${count}">
                        ${title}
                    </button>
                </h6>
            </div>
            <div id="collapse${count}" class="collapse" aria-labelledby="headingOne"
                data-parent="#accordion">
                <div class="card-body">
                   <small> ${plot}</small>
                </div>
            </div>
        </div>            
    </div>
    `;
  count++;
  where.innerHTML += html;
}

// const queryString = `?apikey=${apiKey}&t=${searchTerm}&plot=${plot}`;
// const endpoint = url + queryString;
// function getMovieData(searchTerm, displayFormat) {
//   outputDiv.innerHTML = "<p>Loading...</p>";
//   if (displayFormat === 3) {
//     fetch(endpoint).then(waitForJSON).then(display);
//   }
//   if (displayFormat === 11) {
//     fetch(endpoint).then(waitForJSON).then(handleUserSearch);
//   }
// }

function getMovieData(searchTerm, displayFormat, where) {
  let queryString = "";
  outputDiv.innerHTML = "<p>Loading...</p>";
  if (
    (searchTerm.length == 9 || searchTerm.length == 10) &&
    searchTerm.includes("tt")
  ) {
    queryString = `?apikey=${apiKey}&i=${searchTerm}&plot=${plot}`;
  } else {
    queryString = `?apikey=${apiKey}&t=${searchTerm}&plot=${plot}`;
  }
  const endpoint = url + queryString;
  if (displayFormat === 3) {
    fetch(endpoint)
      .then(waitForJSON)
      .then((data) => {
        display(data, where);
      });
  }
  if (displayFormat === 11) {
    fetch(endpoint).then(waitForJSON).then(handleUserSearch);
  }
}

let searchTitle = "";
const form = document.querySelector("form");
function onFormSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("input");
  const title = input.value;
  getMovieData(title, 11);
  console.log(title);
}
form.addEventListener("submit", onFormSubmit); //enter in the last input in the form

const button_en = document.querySelector("#show_en");
// function showAll() {
//     console.log("clicked")
//     englishMovies.forEach(movie => {
//         getMovieData(movie.id)
//     })
// }
// button_en.addEventListener("click", showAll)

function showAll(list, where) {
  list.forEach((movie) => {
    getMovieData(movie.id, 3, where);
  });
}
// button_en.addEventListener("click", showAll(englishMovies)) // DOESN'T WORK!!!
const div_en = document.querySelector("#english");
button_en.addEventListener("click", (event) => {
  div_en.innerHTML = "";
  showAll(englishMovies, div_en);
});

const button_ch = document.querySelector("#show_ch");
const div_ch = document.querySelector("#chinese");
button_ch.addEventListener("click", () => {
  div_ch.innerHTML = "";
  showAll(chineseMovies, div_ch);
});

// code by Mike
// button_add.addEventListener("click", () => {
//   let xhr = new XMLHttpRequest();
//   xhr.open("POST", "added");

//   xhr.setRequestHeader("Accept", "application/json");
//   xhr.setRequestHeader("Content-Type", "application/json");

//   xhr.onload = () => {
//     console.log(xhr.responseText);
//   };
// });

// https://www.geeksforgeeks.org/get-and-post-method-using-fetch-api/
// The difference between XMLHttpRequest and fetch is that fetch uses Promises which are easy to
// manage when dealing with multiple asynchronous operations where callbacks can create callback
// hell leading to unmanageable code.

const button_add = document.querySelector("#add");
button_add.addEventListener("click", () => {
  // POST request using fetch()
  fetch("/added", {
    // Adding method type
    method: "POST",
    // Adding body or contents to send
    body: JSON.stringify({
      id: newMovie.id,
      title: newMovie.title,
    }),
    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((json) => console.log(json));
  //   // Converting to JSON
  //   .then((response) => response.json())   //ERROR:
  //   // Displaying results to console
  //   .then((json) => console.log(json));
});

const button_show = document.querySelector("#show");
const div_fave = document.querySelector("#fave");
button_show.addEventListener("click", () => {
  fetch("/show")
    .then((res) => res.json()) // SAME AS waitForJSON()
    // .then((json) => console.log(json));
    .then((json) => showAll(json, div_fave));
  // anything after fetch happens at the same time as fetch, before  .then()
});
