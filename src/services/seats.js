const allSeats = document.querySelectorAll('.pointer');

let reservedLocals = null;
let userSelectedLocal = false;

function getMovie() {
  const movie = sessionStorage.getItem('movie');
  if (movie) return JSON.parse(movie);
  else return null;
}

function getReservedLocals() {
  const reserves = sessionStorage.getItem('reservedLocals');
  if (reserves) reservedLocals = JSON.parse(reserves);
  else reservedLocals = null;
}

function handleReservedLocal(seat) {
  const seatId = seat.dataset.id;

  if (reservedLocals) {
    for (let index = 0; index < reservedLocals.length; index++) {
      if (reservedLocals.id === seatId) return;
    }
  }

  const isReserved = seat.classList.contains('reserved');
  if (isReserved) seat.classList.remove('reserved');
  else seat.classList.add('reserved');

  if (isReserved) {
    const reserves = sessionStorage.getItem('reservedLocals');
    const reservesAsJson = JSON.parse(reserves);
    const onlyReserved = reservesAsJson.filter(({ id }) => id !== seatId);
    sessionStorage.setItem('reservedLocals', JSON.stringify(onlyReserved));
  } else {
    const reserves = reservedLocals
      ? [...reservedLocals, { id: seatId }]
      : [{ id: seatId }];

    sessionStorage.setItem('reservedLocals', JSON.stringify(reserves));
  }
}

getReservedLocals();

allSeats.forEach(seat => {
  seat.addEventListener('click', () => {
    getReservedLocals();

    handleReservedLocal(seat);
  });
});
