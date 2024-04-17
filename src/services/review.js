const movie = document.querySelector('.movie');
const seats = document.querySelector('.seats');
const appetizers = document.querySelector('.appetizers');
const payment = document.querySelector('.payment');

let sumPrices = 0;

function getSessionStorage(key) {
  const data = sessionStorage.getItem(key);
  if (data) return JSON.parse(data);
  else return null;
}

function renderMovie() {
  const data = getSessionStorage('movie');
  if (!data) return null;

  const { date, hour, seat, title, type } = data;

  movie.innerHTML += `
    <div class="movie-info">
      <h3 class="movie-title">Filme: ${title} - ${type}</h3>

      <p class="movie-date">Data e Hora: ${date} - ${hour}</p>

      <p class="movie-seat">Sala: ${seat}</p>
    </div>
  `;
}

function renderSeats() {
  const data = getSessionStorage('reservedLocals');
  if (!data) return null;

  for (let index = 0; index < data.length; index++) {
    const bench = data[index].id;
    seats.innerHTML += `
      <div class="movie-bench-info">
        <span class="movie-bench">${bench}</span>
      </div>
    `;
  }
}

function renderAppetizers() {
  const data = getSessionStorage('popcorns');
  if (!data) return null;

  for (let index = 0; index < data.length; index++) {
    const { name, totalPrice, quantity } = data[index];
    sumPrices += totalPrice;

    appetizers.innerHTML += `
      <div class="movie-appetizer-info">
        <p class="appetizer-name">Nome: ${name}</p>

        <span class="appetizer-quantity">
          Quantidade: ${quantity}
        </span>

        <p class="appetizer-total">
          Preço total deste aperitivo: R$ ${totalPrice},00
        </p>
      </div>
    `;
  }

  appetizers.innerHTML += `
    <p class="total">
      Preço Total: R$ ${sumPrices},00
    </p>`;
}

function renderPayment() {
  const data = getSessionStorage('payment');
  if (!data) return null;
  console.log(data);
}

function onFinish() {
  sessionStorage.removeItem('movie');
  sessionStorage.removeItem('reservedLocals');
  sessionStorage.removeItem('popcorns');
  sessionStorage.removeItem('payment');
}

renderMovie();
renderSeats();
renderAppetizers();
renderPayment();
