const radios = document.querySelectorAll('input[type="radio"][name="payment"]');
const creditCardDetails = document.querySelector('.credit-card-details');
const pixDetails = document.querySelector('.pix-details');
const cardInputs = creditCardDetails.querySelectorAll('input');
const realizeButton = document.querySelector('.realize-button');
const realizeLink = document.querySelector('.realize-button a');
const cardNumber = document.getElementById('card-number');
const cvv = document.getElementById('cvv');
const expiryDate = document.getElementById('expiry-date');
const totalPriceElement = document.getElementById('total-price');
const cardholderInput = document.getElementById('card-name');
const orderDetails = document.querySelector('.order-details');
const reservedLocals =
  JSON.parse(sessionStorage.getItem('reservedLocals')) || [];
const popcorns = JSON.parse(sessionStorage.getItem('popcorns')) || [];

function formatExpiryDate(event) {
  let value = event.target.value.replace(/\D/g, '').substring(0, 4);
  value = value
    .replace(/(\d{2})/g, '$1/')
    .trim()
    .slice(0, 5);
  event.target.value = value;
}

function formatCardNumber(event) {
  let value = event.target.value.replace(/\D/g, '').substring(0, 16);
  value = value.replace(/(\d{4})/g, '$1 ').trim();
  event.target.value = value;
}

function limitCVV(event) {
  event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 3);
}

function checkCardInputs() {
  if (document.getElementById('credit-card').checked) {
    for (let input of cardInputs) {
      if (!input.value) return disableButton();
    }

    const month = Number.parseInt(expiryDate.value.slice(0, 2), 10);
    const year = Number.parseInt(expiryDate.value.slice(3), 10);
    const currentYear = new Date().getFullYear() % 100;

    if (month < 1 || month > 12 || year < currentYear) return disableButton();

    if (
      cvv.value.length !== 3 ||
      cardNumber.value.replace(/\s/g, '').length !== 16
    )
      return disableButton();
  }

  enableButton();
}

function updatePaymentDetails() {
  if (document.getElementById('credit-card').checked) {
    creditCardDetails.classList.remove('not-selected');
    pixDetails.classList.add('not-selected');
  } else if (document.getElementById('pix').checked) {
    creditCardDetails.classList.add('not-selected');
    pixDetails.classList.remove('not-selected');
  }
  checkCardInputs();
}

function disableButton() {
  realizeButton.disabled = true;
  realizeLink.removeAttribute('href');
}

function enableButton() {
  realizeButton.disabled = false;
  realizeLink.href = './review.html';
}

function updatePaymentData() {
  const ticketsPrice = reservedLocals.length * 20;
  const appetizersPrice = popcorns.reduce(
    (total, popcorn) => total + popcorn.totalPrice,
    0
  );
  const price = ticketsPrice + appetizersPrice;

  const paymentData = {
    ticketsPrice,
    appetizersPrice,
    price,
  };

  sessionStorage.setItem('payment', JSON.stringify(paymentData));
}

function updateTotalPriceDisplay() {
  const ticketsPrice = reservedLocals.length * 20;
  const appetizersPrice = popcorns.reduce(
    (total, popcorn) => total + popcorn.totalPrice,
    0
  );

  const price = ticketsPrice + appetizersPrice;

  totalPriceElement.textContent = `R$ ${price.toFixed(2).replace('.', ',')}`;
}

expiryDate.addEventListener('input', formatExpiryDate);
cardNumber.addEventListener('input', formatCardNumber);
cvv.addEventListener('input', limitCVV);
cardholderInput.addEventListener('input', updatePaymentData);

radios.forEach(radio => {
  radio.addEventListener('change', updatePaymentDetails);
});

cardInputs.forEach(input => {
  input.addEventListener('input', checkCardInputs);
});

reservedLocals.forEach(local => {
  const orderItem = document.createElement('div');
  orderItem.classList.add('order-item');

  const itemName = document.createElement('span');
  itemName.classList.add('item-name');
  itemName.textContent = `Ingresso - ${local.id}`;

  const itemPrice = document.createElement('span');
  itemPrice.classList.add('item-price');
  itemPrice.textContent = 'R$ 20.00';

  orderItem.appendChild(itemName);
  orderItem.appendChild(itemPrice);

  orderDetails.appendChild(orderItem);
});

popcorns.forEach(popcorn => {
  const orderItem = document.createElement('div');
  orderItem.classList.add('order-item');

  const itemName = document.createElement('span');
  itemName.classList.add('item-name');
  itemName.textContent = `${popcorn.name} - ${popcorn.quantity}`;

  const itemPrice = document.createElement('span');
  itemPrice.classList.add('item-price');
  itemPrice.textContent = `R$ ${popcorn.totalPrice
    .toFixed(2)
    .replace('.', ',')}`;

  orderItem.appendChild(itemName);
  orderItem.appendChild(itemPrice);

  orderDetails.appendChild(orderItem);
});

updatePaymentDetails();
updatePaymentData();
updateTotalPriceDisplay();
