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
        <td>${item.quantity}</td>
        <td>R$ ${item.price.toFixed(2)}</td>
        <td><button class="remove-item-btn" data-index="${index}">Remover</button></td>
      </tr>`;
  });

  totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
  cartCounter.textContent = cartItems.length; // Atualiza o contador fora do modal

  document.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;
      cartItems.splice(itemIndex, 1); // Remove o item
      saveCartToLocalStorage(); // Salva a alteração no localStorage
      updateCartUI(); // Atualiza a interface
    });
  });
}

function saveCartToLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);

    const selectedPao =
      document.querySelector('input[name="pao"]:checked')?.value ||
      "Não selecionado";
    const selectedPontoCarne =
      document.querySelector('input[name="ponto_carne"]:checked')?.value ||
      "Não selecionado";
    const selectedAdicionais =
      Array.from(document.querySelectorAll(".adicional-checkbox:checked"))
        .map((checkbox) => checkbox.dataset.name)
        .join(", ") || "Nenhum adicional";

    const itemName = `${name} | Pão: ${selectedPao} | Ponto da Carne: ${selectedPontoCarne} | Adicionais: ${selectedAdicionais}`;

    const existingItem = cartItems.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.quantity += 1; // Incrementa a quantidade
    } else {
      cartItems.push({ name: itemName, price, quantity: 1 });
    }

    saveCartToLocalStorage(); // Atualiza o localStorage
    updateCartUI(); // Atualiza a interface
  });
});

function toggleDeliveryInfo() {
  const deliveryInfo = document.getElementById("delivery-info");
  const retiradaInfo = document.getElementById("retirada-info");

  deliveryInfo.style.display =
    deliveryInfo.style.display === "none" ? "block" : "none";
  retiradaInfo.style.display = "none"; // Garante que a retirada no local seja ocultada
}

function toggleRetiradaInfo() {
  const retiradaInfo = document.getElementById("retirada-info");
  const deliveryInfo = document.getElementById("delivery-info");

  retiradaInfo.style.display =
    retiradaInfo.style.display === "none" ? "block" : "none";
  deliveryInfo.style.display = "none"; // Garante que o delivery seja ocultado
}

// Finaliza o pedido
document.getElementById("confirm-order").addEventListener("click", () => {
  const formDelivery = document.getElementById("delivery-form");
  const formRetirada = document.getElementById("retirada-form");

  let isFormValid = false;
  let formData = "";
  let formType = "";

  if (document.getElementById("delivery-info").style.display === "block") {
    isFormValid = formDelivery.checkValidity();
    formData = {
      nome: document.getElementById("nome").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      endereco: document.getElementById("endereco").value.trim(),
      pagamento: document.getElementById("forma-pagamento").value,
    };
    formType = "entrega";
  } else if (
    document.getElementById("retirada-info").style.display === "block"
  ) {
    isFormValid = formRetirada.checkValidity();
    formData = {
      nome: document.getElementById("nome-retirada").value.trim(),
      telefone: document.getElementById("telefone-retirada").value.trim(),
    };
    formType = "retirada";
  }

  if (!isFormValid) {
    alert("Por favor, preencha todas as informações.");
    return;
  }

  if (cartItems.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let mensagem = `Olá, gostaria de fazer um pedido:\n${cartItems
    .map(
      (item) => `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}`
    )
    .join("\n")}\nTotal: R$ ${
    document.getElementById("total-price").textContent
  }`;

  if (formType === "entrega") {
    mensagem += `
Nome: ${formData.nome}
Telefone: ${formData.telefone}
Endereço: ${formData.endereco}
Pagamento: ${formData.pagamento}`;
  } else if (formType === "retirada") {
    mensagem += `
Nome: ${formData.nome}
Telefone: ${formData.telefone}
Retirada no local`;
  }

  const whatsappUrl = `https://wa.me/5587999927809${encodeURIComponent(
    mensagem
  )}`;

  window.open(whatsappUrl, "_blank");

  cartItems = [];
  saveCartToLocalStorage();
  updateCartUI();
});

updateCartUI();
