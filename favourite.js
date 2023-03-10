const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = JSON.parse(localStorage.getItem("favouriteMovies")) || [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const emptyMessage = document.querySelector("#if-list-empty");

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
                                class="btn btn-danger btn-remove-favorite" 
                                data-id="${item.id}"
                            >
                            x
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  dataPanel.innerHTML = HTMLContent;

  if (data.length === 0) {
    return emptyMessage.classList.remove("d-none");
  }
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

function removeFromFavourite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) return;

  console.log(movieIndex);

  //remove the item from the list
  movies.splice(movieIndex, 1);
  //update the list in local storage
  localStorage.setItem("favouriteMovies", JSON.stringify(movies));
  //re-render movie item display
  renderMovieList(movies);

  if (!movies || !movies.length) {
    return emptyMessage.classList.remove("d-none");
  }
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    displayMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavourite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies);
