const banner = document.querySelector('.banner');
const movies = document.querySelector('.movies');
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');

const url = 'https://api.themoviedb.org/3/movie';
const apiKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWQ5ZjUxZmM4ODc4NmE1MzUxYWNiNGVjNDAwMWY2NSIsInN1YiI6IjVmNWY5ZmNhOGI5NTllMDAzNGIwYTY0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XuNsqVlzAK6Jr1eePXL-QQb5PMJ2V1xjmQDADLW40vg';

let currentPage = 1;
let allMovies = [];

function formatDate(date) {
  return `${date.slice(8)}/${date.slice(5, 7)}/${date.slice(0, 4)}`;
}

function getRandomBackdropMovie(movies) {
  const index = Math.floor(Math.random() * (movies.length - 1 - 0 + 1) + 0);
  const backdrop = movies[index].backdrop_path;
  return `https://image.tmdb.org/t/p/original${backdrop}`;
}

async function loadMovies() {
  const listMoviesUrl = `${url}/now_playing?language=pt-BR&page=${currentPage}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const response = await fetch(listMoviesUrl, options);
  const data = await response.json();
  allMovies = data.results;

  const backdropUrl = getRandomBackdropMovie(allMovies);

  banner.innerHTML += `
    <img src=${backdropUrl} class='banner-image' alt='Banner image' />

    <p class='banner-text'>Find the best movies for you watching!</p>
  `;

  allMovies.forEach(
    ({ id, title, overview, vote_average, poster_path, release_date }) => {
      const posterPathUrl = `https://image.tmdb.org/t/p/original${poster_path}`;
      const voteAverageFormatted = vote_average.toFixed(1);
      const dateFormatted = formatDate(release_date);

      movies.innerHTML += `
      <button type='button' class='movie' onclick='handleModal(${id})'>
        <div class='movie-container'>
          <img src=${posterPathUrl} class='movie-image' alt=${title} />

          <h3 class='movie-title'>${title}</h3>

          <p class='movie-overview'>${overview}</p>
        </div>

        <div class='movie-footer'>
          <span>${voteAverageFormatted}</span>

          <span>${dateFormatted}</span>
        </div>
      </button>`;
    }
  );
}

function openModal() {
  modalContainer.classList.remove('closed');
  modalContainer.classList.add('opened');
}

function closeModal() {
  modalContainer.classList.remove('opened');
  modalContainer.classList.add('closed');
}

function handleModal(id) {
  const movie = allMovies.find(movie => movie.id === id);
  if (!movie) return;

  const { title, overview, vote_average, release_date } = movie;

  const voteAverageFormatted = vote_average.toFixed(1);
  const dateFormatted = formatDate(release_date);

  modal.innerHTML = `
    <h3 class='movie-title'>${title}</h3>

    <p>${overview}</p>

    <div class='classes'>
      <button type='button'>Dublado 2D às 14:00</button>
      <button type='button'>Legendado às 17:00</button>
      <button type='button'>Dublado 3D às 20:00</button>
    </div>

    <div class='movie-footer'>
      <span>${voteAverageFormatted}</span>

      <span>${dateFormatted}</span>
    </div>

    <button type='button' class='movie-button' onclick='closeModal()'>Fechar</button>
  `;

  const isClose = modalContainer.classList.contains('closed');
  isClose ? openModal() : closeModal();
}

loadMovies();
