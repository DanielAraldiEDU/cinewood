const allSeats = document.querySelectorAll('.pointer');
const confirmButton = document.querySelector('.confirm');

let reversesDone = [];
let reservedLocals = null;
let reservedLocalsAmount = 0;

function getSessionStorage(key) {
  const data = sessionStorage.getItem(key);
  if (data) return JSON.parse(data);
  else return null;
}

function getReservesThisMovie() {
  const movies = getSessionStorage('movies');
  const movie = getSessionStorage('movie');

  if (!movies || !movie) return;

  for (let index = 0; index < movies.length; index++) {
    const currentMovie = movies[index];
    const isSameMovie = currentMovie.movie.id === movie.id;
    const isSamePeriod = currentMovie.movie.type === movie.type;

    if (isSameMovie && isSamePeriod) {
      for (let j = 0; j < currentMovie.seats.length; j++) {
        const currentSeatId = currentMovie.seats[j].id;
        allSeats.forEach(seat => {
          const reservedSeatId = seat.dataset.id;
          if (currentSeatId === reservedSeatId) {
            const reserves = reservedLocals
              ? [...reservedLocals, { id: currentSeatId }]
              : [{ id: currentSeatId }];
            reservedLocals = reserves;

            seat.classList.add('disabled');
          }
        });
      }
    }
  }
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
  const isDisabled = seat.classList.contains('disabled');
  if (isDisabled) return;

  const seatId = seat.dataset.id;

  const isReserved = seat.classList.contains('reserved');
  if (isReserved) {
    reservedLocalsAmount--;
    seat.classList.remove('reserved');
  } else {
    reservedLocalsAmount++;
    seat.classList.add('reserved');
  }

  if (isReserved) {
    reservedLocals = reservedLocals.filter(({ id }) => id !== seatId);
    reversesDone = reversesDone.filter(({ id }) => id !== seatId);
  } else {
    const reserves = reservedLocals
      ? [...reservedLocals, { id: seatId }]
      : [{ id: seatId }];

    reversesDone.push({ id: seatId });
    reservedLocals = reserves;
  }
}

function onReserveLocal(seat) {
  handleReservedLocal(seat);
  handleAvailableButton();
}

allSeats.forEach(seat => {
  seat.addEventListener('click', () => onReserveLocal(seat));
});

confirmButton.addEventListener('click', () =>
  sessionStorage.setItem('reservedLocals', JSON.stringify(reversesDone))
);

getReservesThisMovie();
