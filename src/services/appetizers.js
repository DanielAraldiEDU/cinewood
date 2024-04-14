const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  const incrementButton = card.querySelector('.quantity button:last-child');
  const decrementButton = card.querySelector('.quantity button:first-child');
  const quantityElement = card.querySelector('.quantity-number');

  incrementButton.addEventListener('click', () => {
    let quantity = parseInt(quantityElement.textContent, 10);
    if (quantity < 10) {
      quantityElement.textContent = quantity + 1;
      decrementButton.classList.remove('disabled');
    }
  });

  decrementButton.addEventListener('click', () => {
    let quantity = parseInt(quantityElement.textContent, 10);
    if (quantity > 0) {
      quantityElement.textContent = quantity - 1;
      if (quantity - 1 <= 0) {
        decrementButton.classList.add('disabled');
      }
    }
  });
});

const confirmButton = document.querySelector('#confirm');

confirmButton.addEventListener('click', () => {
  const popcornArray = [];

  cards.forEach(card => {
    const popcornName = card.querySelector('p').textContent;
    const quantity = card.querySelector('.quantity-number').textContent;
    const priceElement = card.querySelector('.price span');
    const priceBase = parseFloat(
      priceElement.textContent.replace('R$', '').replace(',', '.')
    );

    const popcornObject = {
      name: popcornName,
      quantity: parseInt(quantity, 10),
      priceBase: priceBase,
      totalPrice: priceBase * parseInt(quantity, 10),
    };

    if (popcornObject.totalPrice > 0) popcornArray.push(popcornObject);
  });
});
