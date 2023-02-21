const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIE_PER_PAGE = 12;

const movies = [];
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");

//display movie list
function renderMovieList(data) {
  let HTMLContent = "";

  data.forEach((item) => {
    HTMLContent += `
            <div class="col-sm-3">
                <div class="mb-2">
                    <div class="card">
                        <img
                        src="${POSTER_URL + item.image}"
                        class="card-img-top"
                        alt="Movie Poster"
                        />
                        <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        </div>
                        <div class="card-footer">
                            <button 
                                class="btn btn-primary btn-show-movie" 
                                data-bs-toggle="modal" 
                                data-bs-target="#movie-modal" 
                                data-id="${item.id}"
                            >
                            More
                            </button>
                            <button 
                                class="btn btn-info btn-add-favorite" 
                                data-id="${item.id}"
                            >
                            +
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  dataPanel.innerHTML = HTMLContent;
}

function displayMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${
      POSTER_URL + data.image
    }" alt="movie-poster" class="img-fluid">`;
  });
}

function addToFavourite(id) {
  const list = JSON.parse(localStorage.getItem("favouriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("The selected movie is already in favourite list");
  }

  list.push(movie);
  console.log(list);
  localStorage.setItem("favouriteMovies", JSON.stringify(list));
}

function getMovieByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;
  const startingIndex = (page - 1) * MOVIE_PER_PAGE;
  return data.slice(startingIndex, startingIndex + MOVIE_PER_PAGE);
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    displayMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavourite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const input = searchInput.value.trim().toLowerCase();

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(input)
  );

  if (filteredMovies.length === 0) {
    alert(`No results match your input ${input}`);
  }

  renderPaginator(filteredMovies.length);
  renderMovieList(getMovieByPage(1));
});

function renderPaginator(amount) {
  const numOfPages = Math.ceil(amount / MOVIE_PER_PAGE);
  let HTMLContent = "";
  for (let page = 1; page <= numOfPages; page++) {
    HTMLContent += `<li class="page-item"><a class="page-link" href="#" data-id="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = HTMLContent;
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;

  const page = Number(event.target.dataset.id);
  renderMovieList(getMovieByPage(page));
});

//get movie data
axios
  .get(INDEX_URL)
  .then(function (response) {
    movies.push(...response.data.results);
    renderMovieList(getMovieByPage(1));
    renderPaginator(movies.length);
  })
  .catch(function (error) {
    console.log(error);
  });
