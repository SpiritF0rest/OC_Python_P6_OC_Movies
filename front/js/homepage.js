
async function getSortedMoviesByImdbAndVotes(){
  return fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score,-votes")
  .then(function(res){
      if(res.ok){
      return res.json();
      };
  })
  .catch(function(error){
      console.log(error);
  });
};

async function getBestMoviesOfCategory(category){
  return fetch(`http://localhost:8000/api/v1/titles/?genre=${category}&sort_by=-imdb_score,-votes`)
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
    let categoryMovies = await getBestMoviesOfCategory(categories[i]);
    displayCategorySection(categoryMovies["results"].slice(1,8), categories[i]);
  };
};

async function main(){
  let chosenCategories = ["Fantasy", "Sci-Fi", "Horror"];
  let sortedMoviesByImdbAndVotes = await getSortedMoviesByImdbAndVotes();
  const theMostPopularMovie = await getMovieData(sortedMoviesByImdbAndVotes["results"][0]["id"]);
  const mostPopularMovies = sortedMoviesByImdbAndVotes["results"].slice(1,8)
  console.log(mostPopularMovies);
  displayTheMostPopularMovie(theMostPopularMovie)
  displayCategorySection(mostPopularMovies, "Top rated movies")
  categoriesPagination(chosenCategories)
};

main();