class Movie {
  constructor(id, title, image, genres, date, rated, imdb_score, directors, actors, duration, countries, avg_vote, description){
    this.id = id;
    this.title = title;
    this.image = image;
    this.genres = genres;
    this.date = date;
    this.rated = rated;
    this.imdb_score = imdb_score;
    this.directors = directors;
    this.actors = actors;
    this.duration = duration;
    this.countries = countries;
    this.avg_vote = avg_vote;
    this.description = description;
  };
};

let moviesDataList = [];

async function getSortedMoviesByImdbAndVotes(index){
  return fetch(`http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes&page=${index}`)
  .then(function(res){
    if(res.ok){
      return res.json();
    };
  })
  .catch(function(error){
    console.log(error);
  });
};

async function getBestMoviesOfCategory(category, index){
  return fetch(`http://localhost:8000/api/v1/titles/?genre=${category}&sort_by=-imdb_score,-votes&page=${index}`)
  .then(function(res){
    if(res.ok){
      return res.json();
    };
  })
  .catch(function(error){
    console.log(error);
  });
};

async function fetchMovieData(id){
  return fetch(`http://localhost:8000/api/v1/titles/${id}`)
  .then(function(res){
    if(res.ok){
      return res.json();
    };
  })
  .then(function(movieData){
    let newMovie = new Movie(
      movieData.id,
      movieData.title,
      movieData.image_url,
      movieData.genres,
      movieData.date_published,
      movieData.rated,
      movieData.imdb_score,
      movieData.directors,
      movieData.actors,
      movieData.duration,
      movieData.countries,
      movieData.avg_vote,
      movieData.description
    );
    moviesDataList.push(newMovie);
    return newMovie;
  })
  .catch(function(error){
    console.log(error);
  });
};

function displayTheMostPopularMovie(movie){
  const image = document.getElementById("firstMovie_img");
  image.setAttribute("src", movie.image);
  image.setAttribute("alt", `Poster of ${movie.title}`);
  const title = document.querySelector("h1");
  title.textContent = movie.title;
  const summary = document.getElementById("firstMovie_summary");
  summary.textContent = movie.description;
  const button = document.getElementById("firstMovie_button");
  button.setAttribute("data-id", movie.id)
};

function displayCategorySection(movies, category){
  const parentBloc = document.getElementById("categories");
  const section = document.createElement("section");
  section.setAttribute("class", "category_section")
  const title = document.createElement("h2");
  title.textContent = category;
  const div = document.createElement("div");
  div.className = "category_carousel";
  const previousButton = document.createElement("button");
  previousButton.textContent = "\u2039"
  previousButton.setAttribute("type", "button");
  previousButton.className = "carousel_arrow previous_arrow";
  div.appendChild(previousButton);
  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides_container"
  for (let i = 0; i <= movies.length - 1; i++) {
    const anchor = document.createElement("a");
    anchor.setAttribute("data-id", movies[i].id);
    anchor.className = "selectedMovie";
    const image = document.createElement("img");
    image.setAttribute("src", movies[i].image_url);
    image.setAttribute("alt", `Poster of ${movies[i].title} movie`);
    anchor.appendChild(image);
    slidesContainer.appendChild(anchor);
  };
  div.appendChild(slidesContainer)
  const nextButton = document.createElement("button");
  nextButton.textContent = "\u203A"
  nextButton.setAttribute("type", "button");
  nextButton.className = "carousel_arrow next_arrow";
  div.appendChild(nextButton);
  section.appendChild(title);
  section.appendChild(div);
  parentBloc.appendChild(section);
  return;
}

/**
 * Get data of categories movies list and do display
 * @param {string} categories 
 */
async function categoriesPagination(categories){
  for (let i = 0; i <= categories.length - 1; i++){
    let categoryMovies = await getMoviesList(null, getBestMoviesOfCategory, categories[i]);
    displayCategorySection(categoryMovies, categories[i]);
  };
};

/**
 * Get all data of a movie to display modal
 * @param {string} movieId 
 * @returns data of selected movie
 */
async function getMovieData(movieId){
  let selectedMovie = moviesDataList.filter(movie => movie.id == movieId);
  if (selectedMovie.length > 0){
    return selectedMovie[0];
  } else {
    await fetchMovieData(movieId)
    selectedMovie = moviesDataList.filter(movie => movie.id == movieId);
    return selectedMovie[0];
  };
};

/**
 * Get the 7 movies of a category
 * @param {string} type 
 * @param {function} fetchFunction 
 * @param {string} category 
 * @returns a list with the first 7 movies of a category
 */
async function getMoviesList(type, fetchFunction, category){
  let moviesList = [];
  let i = 1;
  while(moviesList.length < 7){
    let sortedMoviesByImdbAndVotes = category != null ? await fetchFunction(category, i) : await fetchFunction(i);
    if (i == 1 && type == "popular"){
      for (let j = 1; j <= 4; j++){
        moviesList.push(sortedMoviesByImdbAndVotes["results"][j]);
      };
    } else {
      for (let j = 0; j <= 4; j++){
        moviesList.push(sortedMoviesByImdbAndVotes["results"][j]);
      };
    };
    i++
  };
  return moviesList.slice(0,7);
};

/**
 * To empty the html lists (ul) of the modal
 * @param {*} parent 
 */
function removeAllChildrenDOM(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  };
};

function displayModal(movie) {
  let title = document.getElementById("modal_title");
  title.textContent = movie.title;
  let image = document.getElementById("modal_image");
  image.setAttribute("src", movie.image);
  image.setAttribute("alt", `Poster of ${movie.title}`);
  let genres = document.getElementById("modal_genres");
  removeAllChildrenDOM(genres);
  for (let i = 0; i <= movie.genres.length - 1; i++) {
    const genre = document.createElement("li");
    genre.textContent = movie.genres[i];
    genres.appendChild(genre);
  };
  let date = document.getElementById("modal_date");
  date.textContent = movie.date;
  let rated = document.getElementById("modal_rated");
  rated.textContent = movie.rated;
  let imdb_score = document.getElementById("modal_imdbScore");
  imdb_score.textContent = `Imdb score: ${movie.imdb_score}`;
  let directors = document.getElementById("modal_directors");
  removeAllChildrenDOM(directors);
  for (let i = 0; i <= movie.directors.length - 1; i++) {
    const director = document.createElement("li");
    director.textContent = movie.directors[i];
    directors.appendChild(director);
  };
  let actors = document.getElementById("modal_actors");
  removeAllChildrenDOM(actors);
  for (let i = 0; i <= movie.actors.slice(0, 5).length - 1; i++) {
    if (i == 4) {
      const more = document.createElement("li");
      more.textContent = "more";
      more.setAttribute("id", "more_actors")
      actors.appendChild(more);
    } else {
      const actor = document.createElement("li");
      actor.textContent = `- ${movie.actors[i]}`;
      actors.appendChild(actor);
    }
  };
  let duration = document.getElementById("modal_duration");
  duration.textContent = `${movie.duration} min`;
  let countries = document.getElementById("modal_countries");
  removeAllChildrenDOM(countries);
  for (let i = 0; i <= movie.countries.length - 1; i++) {
    const country = document.createElement("li");
    country.textContent = movie.countries[i];
    countries.appendChild(country);
  };
  let avg_vote = document.getElementById("modal_avgVote");
  avg_vote.textContent = `Avg vote: ${movie.avg_vote}`;
  let description = document.getElementById("modal_description");
  description.textContent = movie.description;
};

function selectedMovie() {
  let allMoviesTarget = document.getElementsByClassName("selectedMovie");
  let modal = document.getElementById("modal");
  const headerTag = document.querySelector("header");
  const mainTag = document.querySelector("main");
  for (let target of allMoviesTarget) {
    let targetId = target.getAttribute("data-id");
    target.addEventListener("click", async function (e) {
      let targetMovie = await getMovieData(targetId);
      displayModal(targetMovie);
      headerTag.className = "open_modal";
      mainTag.className = "open_modal";
      modal.className = "open";
    });
  };
};

function closeModal() {
  const headerTag = document.querySelector("header");
  const mainTag = document.querySelector("main");
  let modalCloseButton = document.getElementById("close_modal");
  modalCloseButton.addEventListener("click", function (e) {
    let modal = document.getElementById("modal");
    modal.className = "close";
    headerTag.removeAttribute("class");
    mainTag.removeAttribute("class")
    });
};

function carouselButtonAction(){
  let allButtons = document.getElementsByClassName("carousel_arrow");
  for (let button of allButtons) {
    let buttonDirection = button.getAttribute("class");
    let container = button.closest("div");
    const slide = document.querySelector(".slides_container > a");
    button.addEventListener("click", function (e) {
      const slideWidth =  slide.clientWidth;
      buttonDirection == "carousel_arrow previous_arrow" ? container.scrollLeft -= slideWidth : container.scrollLeft += slideWidth;
    });
  };
};

async function main(){
  let chosenCategories = ["Fantasy", "Sci-Fi", "Horror"];
  let sortedMoviesByImdbAndVotes = await getSortedMoviesByImdbAndVotes(1);
  const theMostPopularMovie = await getMovieData(sortedMoviesByImdbAndVotes["results"][0]["id"]);
  const mostPopularMovies = await getMoviesList("popular", getSortedMoviesByImdbAndVotes, null);
  displayTheMostPopularMovie(theMostPopularMovie);
  displayCategorySection(mostPopularMovies, "Top rated movies");
  await categoriesPagination(chosenCategories);
  selectedMovie();
  closeModal();
  carouselButtonAction();
};

main();
