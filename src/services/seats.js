const allSeats = document.querySelectorAll('.pointer');
const confirmButton = document.querySelector('.confirm');

let reservedLocals = null;
let reservedLocalsAmount = 0;

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

function verifyIfLocalIsReserved(id) {
  if (reservedLocals) {
    for (let index = 0; index < reservedLocals.length; index++) {
      if (reservedLocals.id === id) return true;
    }
  }
  return false;
}

function handleAvailableButton() {
  const isDisabled = confirmButton.classList.contains('disabled');
  if (isDisabled && reservedLocalsAmount > 0) {
    confirmButton.classList.remove('disabled');
  } else if (reservedLocalsAmount <= 0) {
    confirmButton.classList.add('disabled');
  }
}

function handleReservedLocal(seat) {
  const seatId = seat.dataset.id;

  if (verifyIfLocalIsReserved(seatId)) return;

  const isReserved = seat.classList.contains('reserved');
  if (isReserved) {
    reservedLocalsAmount--;
    seat.classList.remove('reserved');
  } else {
    reservedLocalsAmount++;
    seat.classList.add('reserved');
  }

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

function onReserveLocal(seat) {
  getReservedLocals();
  handleReservedLocal(seat);
  handleAvailableButton();
}

getReservedLocals();

allSeats.forEach(seat => {
  seat.addEventListener('click', () => onReserveLocal(seat));
});
