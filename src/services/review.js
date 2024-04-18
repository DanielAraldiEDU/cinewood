const movie = document.querySelector('.movie');
const seats = document.querySelector('.seats');
const appetizers = document.querySelector('.appetizers');
const payment = document.querySelector('.payment');
const totalToPay = document.querySelector('.total-to-pay');

let sumPrices = 0;
let movieOfSessionStorage = null;
let seatsOfSessionStorage = null;
let appetizersOfSessionStorage = null;
let paymentOfSessionStorage = null;

function getSessionStorage(key) {
  const data = sessionStorage.getItem(key);
  if (data) return JSON.parse(data);
  else return null;
}

function renderMovie() {
  const data = getSessionStorage('movie');
  if (!data) return null;

  movieOfSessionStorage = data;
  const { date, hour, seat, title, type } = data;

  movie.innerHTML += `
    <div class="movie-content">
      <h3 class="movie-title">Filme: ${title} - ${type}</h3>

      <p class="movie-date">Data e Hora: ${date} - ${hour}</p>

      <p class="movie-seat">Sala: ${seat}</p>
    </div>
  `;
}

function renderSeats() {
  const data = getSessionStorage('reservedLocals');
  if (!data) return null;

  seatsOfSessionStorage = data;

  for (let index = 0; index < data.length; index++) {
    const isFirstLoop = index === 0;
    const bench = data[index].id;
    seats.innerHTML += `
      ${!isFirstLoop ? '' : '<p>Lugares: </p>'}

      ${isFirstLoop ? '' : ' - '}<span class="seat">${bench}</span>
    `;
  }
}

function renderAppetizers() {
  const data = getSessionStorage('popcorns');
  if (!data) return null;

  appetizersOfSessionStorage = data;

  if (data.length === 0) appetizers.style.margin = '0.5rem 0';

  for (let index = 0; index < data.length; index++) {
    const { name, totalPrice, priceBase, quantity } = data[index];
    sumPrices += totalPrice;

    appetizers.innerHTML += `
      <div class="appetizer-content">
        <p class="appetizer-name"><span>${quantity}x</span> - ${name}</p>

        <p class="appetizer-total">
          Preço total do aperitivo: <span>R$ ${totalPrice
            .toFixed(2)
            .replace('.', ',')}</span>
        </p>

        <span class="appetizer-base-price">
          Preço por unidade: <span>R$ ${priceBase
            .toFixed(2)
            .replace('.', ',')}</span>
        </span>
      </div>
    `;
  }

  totalToPay.innerHTML += `
    <p class="total-price">
      Preço Total: R$ ${sumPrices.toFixed(2).replace('.', ',')}
    </p>`;
}

function renderPayment() {
  const data = getSessionStorage('payment');
  if (!data) return null;

  paymentOfSessionStorage = data;

  console.log(data);
}

function onFinish() {
  sessionStorage.removeItem('movie');
  sessionStorage.removeItem('reservedLocals');
  sessionStorage.removeItem('popcorns');
  sessionStorage.removeItem('payment');

  const newMovie = {
    movie: movieOfSessionStorage,
    seats: seatsOfSessionStorage,
    appetizers: appetizersOfSessionStorage,
    payment: paymentOfSessionStorage,
  };

  const allMovies = getSessionStorage('movies');
  const existsMovies = allMovies && allMovies.length > 0;
  sessionStorage.setItem(
    'movies',
    JSON.stringify(existsMovies ? [...allMovies, newMovie] : [newMovie])
  );
}

renderMovie();
renderSeats();
renderAppetizers();
renderPayment();
