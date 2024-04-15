const cards = document.querySelectorAll('.card');
const total = document.querySelector('.total');
const confirmButton = document.querySelector('.confirm');

function parseValueToInt(value) {
  return Number.parseInt(value, 10);
}

cards.forEach(card => {
  const incrementButton = card.querySelector('.quantity button:last-child');
  const decrementButton = card.querySelector('.quantity button:first-child');
  const quantityElement = card.querySelector('.quantity-number');
  const priceElement = card.querySelector('.price span');

  incrementButton.addEventListener('click', () => {
    const quantity = parseValueToInt(quantityElement.textContent);
    const totalPrice = Number.parseFloat(
      total.textContent.replace('Preço Total: R$', '').replace(',', '.')
    );
    const price = Number.parseFloat(
      priceElement.textContent.replace('R$', '').replace(',', '.')
    );

    if (quantity < 10) {
      const currentQuantity = quantity + 1;
      quantityElement.textContent = currentQuantity;
      total.textContent = `Preço Total: R$ ${totalPrice + price},00`;

      if (currentQuantity >= 10) {
        incrementButton.classList.add('disabled');
      } else {
        decrementButton.classList.remove('disabled');
        incrementButton.classList.remove('disabled');
      }
    }
  });

  decrementButton.addEventListener('click', () => {
    const quantity = parseValueToInt(quantityElement.textContent);
    const totalPrice = Number.parseFloat(
      total.textContent.replace('Preço Total: R$', '').replace(',', '.')
    );
    const price = Number.parseFloat(
      priceElement.textContent.replace('R$', '').replace(',', '.')
    );

    if (quantity > 0) {
      const currentQuantity = quantity - 1;
      quantityElement.textContent = currentQuantity;
      total.textContent = `Preço Total: R$ ${totalPrice - price},00`;

      if (currentQuantity <= 0) {
        decrementButton.classList.add('disabled');
      } else {
        incrementButton.classList.remove('disabled');
        decrementButton.classList.remove('disabled');
      }
    }
  });
});

function calculatePopcorns() {
  const popcorns = [];

  cards.forEach(card => {
    const name = card.querySelector('p').textContent;
    const quantity = card.querySelector('.quantity-number').textContent;
    const priceElement = card.querySelector('.price span');
    const priceBase = Number.parseFloat(
      priceElement.textContent.replace('R$', '').replace(',', '.')
    );

    const popcorn = {
      name,
      quantity: parseValueToInt(quantity),
      priceBase: priceBase,
      totalPrice: priceBase * parseValueToInt(quantity),
    };

    if (popcorn.totalPrice > 0) popcorns.push(popcorn);
  });

  return popcorns;
}

function onClick() {
  const popcorns = calculatePopcorns();

  sessionStorage.setItem('popcorns', JSON.stringify(popcorns));
}

confirmButton.addEventListener('click', onClick);
