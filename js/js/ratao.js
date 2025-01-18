let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let isDelivery = false; // Corrigido: Inicializa a variável

// Atualiza a interface do carrinho
function updateCartUI() {
  const cartTable = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  const cartCounter = document.getElementById("cart-count");
  let total = 0;

  // Limpa a tabela de itens no carrinho
  cartTable.innerHTML = "";

  cartItems.forEach((item, index) => {
    total += item.price * item.quantity;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>
        <button class="decrease-qty-btn" data-index="${index}">-</button>
        ${item.quantity}
        <button class="increase-qty-btn" data-index="${index}">+</button>
      </td>
      <td>R$ ${(item.price * item.quantity).toFixed(2)}</td>
      <td><button class="remove-item-btn" data-index="${index}">Remover</button></td>
    `;
    cartTable.appendChild(row);
  });

  // Adiciona a taxa de entrega se for delivery
  if (isDelivery) {
    const deliveryFee = 3; // Taxa de entrega de R$3,00
    total += deliveryFee;
  }

  totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
  cartCounter.textContent = cartItems.length;

  // Adiciona os eventos para os botões "+" e "-"
  document.querySelectorAll(".increase-qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;
      cartItems[itemIndex].quantity += 1;
      saveCartToLocalStorage();
      updateCartUI();
    });
  });

  document.querySelectorAll(".decrease-qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;
      if (cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
      } else {
        cartItems.splice(itemIndex, 1);
      }
      saveCartToLocalStorage();
      updateCartUI();
    });
  });

  // Adiciona os eventos para o botão "Remover"
  document.querySelectorAll(".remove-item-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const itemIndex = e.target.dataset.index;
      cartItems.splice(itemIndex, 1);
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

    const selectedPao =
      document.querySelector('input[name="retirar"]:checked')?.value ||
      "Não selecionado";
    const selectedPontoCarne =
      document.querySelector('input[name="ponto_carne"]:checked')?.value ||
      "Não selecionado";

    const adicionais = Array.from(
      document.querySelectorAll(".adicional-checkbox:checked")
    );

    const selectedAdicionais =
      adicionais.map((checkbox) => checkbox.dataset.name).join(", ") ||
      "Nenhum adicional";

    const adicionaisPrice = adicionais
      .map((checkbox) => parseFloat(checkbox.dataset.price))
      .reduce((acc, curr) => acc + curr, 0);

    const totalItemPrice = price + adicionaisPrice;

    const itemName = `${name} | retirada: ${selectedPao} | Ponto da Carne: ${selectedPontoCarne} | Adicionais: ${selectedAdicionais}`;

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

// Função para pegar o preço do adicional
function getAdicionalPrice(adicional) {
  switch (adicional) {
    case "nada":
      return 0.0;
    case "coca-lata":
      return 6.0;
    case "Guarana-lata":
      return 6.0;
    case "soda-lata":
      return 6.0;
    case "sukita-lata":
      return 6.0;
    case "coca-juninho":
      return 3.0;
    case "Guarana-juninho":
      return 3.0;
    case "soda-juninho":
      return 3.0;
    case "sukita-juninho":
      return 3.0;
    case "pepsi-juninho":
      return 3.0;
    case "coca-1L":
      return 9.0;
    case "Guarana-1L":
      return 9.0;
    case "soda-1L":
      return 9.0;
    case "sukita-1L":
      return 9.0;
    default:
      return 0;
  }
}

// Alternância de opções de entrega e retirada
function toggleDeliveryInfo() {
  const deliveryInfo = document.getElementById("delivery-info");
  const retiradaInfo = document.getElementById("retirada-info");

  isDelivery = deliveryInfo.style.display === "none";
  deliveryInfo.style.display = isDelivery ? "block" : "none";
  retiradaInfo.style.display = "none";
}

function toggleRetiradaInfo() {
  const retiradaInfo = document.getElementById("retirada-info");
  const deliveryInfo = document.getElementById("delivery-info");

  isDelivery = false;
  retiradaInfo.style.display =
    retiradaInfo.style.display === "none" ? "block" : "none";
  deliveryInfo.style.display = "none";
}

// Finaliza o pedido
document.getElementById("confirm-order").addEventListener("click", () => {
  const isRetirada =
    document.getElementById("retirada-info").style.display === "block";
  let mensagem = "Resumo do Pedido:\n";
  let total = 0; // Variável para calcular o total com a taxa de entrega

  // Lista os itens do carrinho e soma o total
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
    mensagem += `${item.quantity}x ${item.name} - R$ ${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  // Adiciona a taxa de entrega se for delivery
  if (isDelivery) {
    const deliveryFee = 3; // Taxa de entrega de R$3,00
    total += deliveryFee;
    mensagem += `Taxa de entrega: R$ ${deliveryFee.toFixed(2)}\n`;
  }

  // Agora inclui o total com a entrega no final da mensagem
  mensagem += `Total: R$ ${total.toFixed(2)}\n\n`;

  // Verifica se é delivery ou retirada
  if (isDelivery) {
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const cep = document.getElementById("cep").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const bairro = document.getElementById("bairro").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const formaPagamento = document
      .getElementById("forma-pagamento")
      .value.trim();

    if (
      !nome ||
      !telefone ||
      !cep ||
      !endereco ||
      !bairro ||
      !cidade ||
      !formaPagamento
    ) {
      alert("Por favor, preencha todos os campos para Delivery.");
      return;
    }

    mensagem += `Entrega:\nNome: ${nome}\nTelefone: ${telefone}\nCEP: ${cep}\nEndereço: ${endereco}, ${bairro}, ${cidade}\nForma de Pagamento: ${formaPagamento}\n`;
  } else if (isRetirada) {
    const nomeRetirada = document.getElementById("nome-retirada").value.trim();
    const telefoneRetirada = document
      .getElementById("telefone-retirada")
      .value.trim();

    if (!nomeRetirada || !telefoneRetirada) {
      alert("Preencha todos os campos para retirada.");
      return;
    }

    mensagem += `Retirada:\nNome: ${nomeRetirada}\nTelefone: ${telefoneRetirada}\n`;
  } else {
    alert("Selecione uma opção de entrega ou retirada.");
    return;
  }

  const numeroWhatsapp = "5587996368157";
  const whatsappUrl = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(
    mensagem
  )}`;

  window.open(whatsappUrl, "_blank");

  cartItems = [];
  saveCartToLocalStorage();
  updateCartUI();

  document.querySelector(".btn-close").click();
});

// Inicializa a interface do carrinho
updateCartUI();
