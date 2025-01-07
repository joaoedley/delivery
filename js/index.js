// Manipulação de FAQ
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  question.addEventListener("click", () => {
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== "0px";

    // Fecha todas as respostas abertas
    faqItems.forEach((otherItem) => {
      const otherAnswer = otherItem.querySelector(".faq-answer");
      otherAnswer.style.maxHeight = "0";
      otherAnswer.style.padding = "0 10px";
    });

    // Abre ou fecha a resposta clicada
    if (!isOpen) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
      answer.style.padding = "10px";
    } else {
      answer.style.maxHeight = "0";
      answer.style.padding = "0 10px";
    }
  });
});

// Manipulação do menu hambúrguer
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".lista-menu");

// Adiciona o evento de clique ao botão hambúrguer
hamburger.addEventListener("click", () => {
  menu.classList.toggle("active"); // Alterna a classe "active" no menu
});
