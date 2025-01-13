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

    const selectedTamanho =
      document.querySelector('input[name="Tamanho"]:checked')?.value ||
      "Não selecionado";

    // Mapeando os preços baseados no tamanho
    const sizePrices = {
      P: 10.0, // Exemplo de preço para tamanho P
      M: 20.0, // Exemplo de preço para tamanho M
      G: 30.0,
      F: 40.0, // Exemplo de preço para tamanho G
    };

    const sizePrice = sizePrices[selectedTamanho] || 0; // Preço do tamanho, se selecionado, caso contrário 0

    // Captura o adicional selecionado do <select>
    const selectedAdicional = document.getElementById("opcoes").value;
    const adicionaisPrice = getAdicionalPrice(selectedAdicional);

    const totalItemPrice = price + adicionaisPrice;

    const itemName = `${name} | Tamanho: ${selectedTamanho} | Adicional: ${selectedAdicional}`;

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
    case "catupiry":
      return 3.0;
    case "azeitonas":
      return 2.0;
    case "tomate":
      return 1.0;
    case "queijo_mussarela":
      return 2.0;
    case "alho_frito":
      return 1.0;
    default:
      return 0;
  }
}

// Funções de alternância para as opções de entrega e retirada
function toggleDeliveryInfo() {
  const deliveryInfo = document.getElementById("delivery-info");
  const retiradaInfo = document.getElementById("retirada-info");

  deliveryInfo.style.display =
    deliveryInfo.style.display === "none" ? "block" : "none";
  retiradaInfo.style.display = "none";
}

function toggleRetiradaInfo() {
  const retiradaInfo = document.getElementById("retirada-info");
  const deliveryInfo = document.getElementById("delivery-info");

  retiradaInfo.style.display =
    retiradaInfo.style.display === "none" ? "block" : "none";
  deliveryInfo.style.display = "none";
}

// Finaliza o pedido
document.getElementById("confirm-order").addEventListener("click", () => {
  const isDelivery =
    document.getElementById("delivery-info").style.display === "block";
  const isRetirada =
    document.getElementById("retirada-info").style.display === "block";
  let mensagem = "Resumo do Pedido:\n";

  // Lista os itens do carrinho
  cartItems.forEach((item) => {
    mensagem += `${item.quantity}x ${item.name} - R$ ${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  mensagem += `Total: ${
    document.getElementById("total-price").textContent
  }\n\n`;

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

    mensagem += `Entrega:\nNome: ${nome}\nTelefone: ${telefone}\nCEP: ${cep}\n`;
    mensagem += `Endereço: ${endereco}, ${bairro}, ${cidade}\nForma de Pagamento: ${formaPagamento}\n`;
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

  const numeroWhatsapp = "5587999927809"; // Substitua pelo número correto
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
