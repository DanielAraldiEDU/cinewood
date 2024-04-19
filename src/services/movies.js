const banner = document.querySelector('.banner');
const movies = document.querySelector('.movies');
const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');

const url = 'https://api.themoviedb.org/3/movie';
const apiKey =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYWQ5ZjUxZmM4ODc4NmE1MzUxYWNiNGVjNDAwMWY2NSIsInN1YiI6IjVmNWY5ZmNhOGI5NTllMDAzNGIwYTY0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XuNsqVlzAK6Jr1eePXL-QQb5PMJ2V1xjmQDADLW40vg';

let isMakingMoreMovies = false;
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

function renderBanner(allMovies) {
  const isFirstPage = currentPage === 1;
  if (isFirstPage) {
    const backdropUrl = getRandomBackdropMovie(allMovies);

    banner.innerHTML += `
    <img src=${backdropUrl} class='banner-image' alt='Banner image' />

    <p class='banner-text'>Encontre os melhores filmes para você assistir!</p>
  `;
  }
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
  previousIdOfAllMovies = allMovies.map(({ id }) => id);
  allMovies.push(...data.results);

  renderBanner(allMovies);

  allMovies.forEach(
    ({ id, title, overview, vote_average, poster_path, release_date }) => {
      if (!previousIdOfAllMovies.includes(id)) {
        const posterPathUrl = `https://image.tmdb.org/t/p/original${poster_path}`;
        const voteAverageFormatted = vote_average.toFixed(1);
        const dateFormatted = formatDate(release_date);

        movies.innerHTML += `
        <button type='button' class='movie' onclick='handleModal(${id})'>
          <div class='movie-container'>
            <img src=${posterPathUrl} class='movie-image' alt=${title} />
  
            <h3 class='movie-title'>${title}</h3>
  
            ${overview ? `<p class='movie-overview'>${overview}</p>` : ''}
          </div>
  
          <div class='movie-footer'>
            <span>${voteAverageFormatted}</span>
  
            <span>${dateFormatted}</span>
          </div>
        </button>`;
      }
    }
  );
}

function findMovieById(id) {
  const movie = allMovies.find(movie => movie.id === id);
  if (!movie) return null;

  const { title, overview, vote_average, release_date } = movie;

  const voteAverageFormatted = vote_average.toFixed(1);
  const dateFormatted = formatDate(release_date);

  return {
    id: id.toString(),
    title,
    overview,
    voteAverage: voteAverageFormatted,
    date: dateFormatted,
  };
}

function openModal() {
  modalContainer.classList.remove('closed');
  modalContainer.classList.add('opened');
}

function closeModal() {
  modalContainer.classList.remove('opened');
  modalContainer.classList.add('closed');
}

function onChooseMovie(id, type) {
  const movie = findMovieById(id);
  if (!movie) return;

  const periods = {
    afternoon: { ...movie, type: 'Dublado 2D', hour: '14:00', seat: 'Sala 1' },
    evening: { ...movie, type: 'Legendado', hour: '17:00', seat: 'Sala 2' },
    night: { ...movie, type: 'Dublado 3D', hour: '20:00', seat: 'Sala 3' },
  };

  sessionStorage.setItem('movie', JSON.stringify(periods[type]));
}

function handleModal(id) {
  const movie = findMovieById(id);
  if (!movie) return;

  const { title, overview, voteAverage, date } = movie;

  modal.innerHTML = `
    <h3 class='movie-title'>${title}</h3>

    <p>${overview}</p>

    <div class='classes'>
      <button type='button' onclick='onChooseMovie(${id}, "afternoon")'>
        <a href='./../src/pages/seats.html'>
          Dublado 2D às 14:00
        </a>
      </button>

      <button type='button' onclick='onChooseMovie(${id}, "evening")'>
        <a href='./../src/pages/seats.html'>
          Legendado às 17:00
        </a>
      </button>

      <button type='button' onclick='onChooseMovie(${id}, "night")'>
        <a href='./../src/pages/seats.html'>
          Dublado 3D às 20:00
        </a>
      </button>
    </div>

    <div class='movie-footer'>
      <span>${voteAverage}</span>

      <span>${date}</span>
    </div>

    <button type='button' class='movie-button' onclick='closeModal()'>
      Fechar
    </button>
  `;

  const isClose = modalContainer.classList.contains('closed');
  isClose ? openModal() : closeModal();
}

async function onScrollEnd() {
  if (!isMakingMoreMovies) {
    const scrolledTo = window.scrollY + window.innerHeight;
    const isAlmostOnEnd = document.body.scrollHeight - scrolledTo < 500;

    if (isAlmostOnEnd) {
      isMakingMoreMovies = true;
      currentPage += 1;
      await loadMovies();
    }

    isMakingMoreMovies = false;
  }
}

window.addEventListener('scroll', onScrollEnd);

loadMovies();
