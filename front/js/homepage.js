
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

async function getMovieData(id){
  return fetch(`http://localhost:8000/api/v1/titles/${id}`)
  .then(function(res){
      if(res.ok){
      return res.json();
      };
  })
  .catch(function(error){
      console.log(error);
  });
};

function displayTheMostPopularMovie(movie){
  const image = document.getElementById("firstMovie_img");
  image.setAttribute("src", movie.image_url);
  image.setAttribute("alt", `Poster of ${movie.title}`);
  const title = document.querySelector("h1");
  title.textContent = movie.title;
  const summary = document.getElementById("firstMovie_summary");
  summary.textContent = movie.description;
};

function displayCategorySection(movies, category){
  const parentBloc = document.querySelector("main");
  const section = document.createElement("section");
  section.setAttribute("id", `${category}_section`);
  const title = document.createElement("h2");
  title.textContent = category
  const div = document.createElement("div");
  div.setAttribute("id", `${category}_carousel`);
  for (let i = 0; i <= movies.length - 1; i++) {
    const anchor = document.createElement("a");
    anchor.setAttribute("data-id", movies[i].id);
    const image = document.createElement("img");
    image.setAttribute("src", movies[i].image_url);
    image.setAttribute("alt", `Poster of ${movies[i].title}`);
    anchor.appendChild(image);
    div.appendChild(anchor);
  };
  section.appendChild(title);
  section.appendChild(div);
  parentBloc.appendChild(section);
  return;
}

async function categoriesPagination(categories){
  for (let i = 0; i <= categories.length - 1; i++){
    let categoryMovies = await getMoviesList(null, getBestMoviesOfCategory, categories[i]);
    displayCategorySection(categoryMovies, categories[i]);
  };
};

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

async function main(){
  let chosenCategories = ["Fantasy", "Sci-Fi", "Horror"];
  let sortedMoviesByImdbAndVotes = await getSortedMoviesByImdbAndVotes(1);
  const theMostPopularMovie = await getMovieData(sortedMoviesByImdbAndVotes["results"][0]["id"]);
  const mostPopularMovies = await getMoviesList("popular", getSortedMoviesByImdbAndVotes, null);
  displayTheMostPopularMovie(theMostPopularMovie);
  displayCategorySection(mostPopularMovies, "Top rated movies");
  categoriesPagination(chosenCategories);
};

main();