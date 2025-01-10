// Exemplo básico para gerenciar o carrinho e integração com WhatsApp
const cartItems = [];

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);
    cartItems.push({ name, price, quantity: 1 });
    updateCartUI();
  });
});

function updateCartUI() {
  const cartTable = document.getElementById("cart-items");
  const totalPriceEl = document.getElementById("total-price");
  let total = 0;
  cartTable.innerHTML = "";

  cartItems.forEach((item) => {
    total += item.price * item.quantity;
    cartTable.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>R$ ${item.price.toFixed(2)}</td>
      </tr>`;
  });

  totalPriceEl.textContent = `R$ ${total.toFixed(2)}`;
}

document.getElementById("confirm-order").addEventListener("click", () => {
  const form = document.getElementById("delivery-form");
  if (!form.checkValidity()) {
    alert("Por favor, preencha todas as informações necessárias.");
    return;
  }

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;
  const pagamento = document.getElementById("forma-pagamento").value;

  const mensagem = `Olá, gostaria de fazer um pedido:
${cartItems
  .map((item) => `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}`)
  .join("\n")}
Total: R$ ${document.getElementById("total-price").textContent}

Nome: ${nome}
Telefone: ${telefone}
Endereço: ${endereco}
Pagamento: ${pagamento}`;

  const whatsappUrl = `https://wa.me/SEU_NUMERO_DE_TELEFONE?text=${encodeURIComponent(
    mensagem
  )}`;
  window.open(whatsappUrl, "_blank");
});
