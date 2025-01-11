let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Atualiza a interface do carrinho
function updateCartUI() {
  const cartTable = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const cartCounter = document.getElementById("cart-count"); // Contador de itens fora do modal
  let total = 0;

  // Limpa a tabela de itens no carrinho
  cartTable.innerHTML = "";

  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;

    cartTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>
          <button class="decrease-qty-btn" data-index="${index}">-</button>
          ${item.quantity}
          <button class="increase-qty-btn" data-index="${index}">+</button>
        </td>
        <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
        <td><button class="remove-item-btn" data-index="${index}">Remover</button></td>
      </tr>`;
  });

  totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
  cartCounter.textContent = cartItems.length; // Atualiza o contador fora do modal

  // Adiciona os eventos para os botões "+" e "-"
  document.querySelectorAll(".increase-qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;
      cartItems[itemIndex].quantity += 1; // Incrementa a quantidade
      saveCartToLocalStorage();
      updateCartUI();
    });
  });

  document.querySelectorAll(".decrease-qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1; // Decrementa a quantidade
      } else {
        cartItems.splice(itemIndex, 1); // Remove o item se a quantidade for 0
      }
      saveCartToLocalStorage();
      updateCartUI();
    });
  });

  // Adiciona os eventos para o botão "Remover"
  document.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;
      cartItems.splice(itemIndex, 1); // Remove o item
      saveCartToLocalStorage();
      updateCartUI();
    });
  });
}

function saveCartToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Adiciona itens ao carrinho
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    // Captura os adicionais selecionados
    let adicionais = Array.from(
      document.querySelectorAll(".refri-checkbox:checked")
    );

    const selectedAdicionais =
      adicionais.map((checkbox) => checkbox.dataset.name).join(", ") ||
      "Nenhum";

    const adicionaisPrice = adicionais
      .map((checkbox) => parseFloat(checkbox.dataset.price))
      .reduce((acc, curr) => acc + curr, 0);

    const totalItemPrice = price + adicionaisPrice;
    const itemName = `${name} | Adicionais: ${selectedAdicionais}`;

    const existingItem = cartItems.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ name: itemName, price: totalItemPrice, quantity: 1 });
    }

    saveCartToLocalStorage();
    updateCartUI();
  });
});

// Inicializa a interface do carrinho
updateCartUI();
