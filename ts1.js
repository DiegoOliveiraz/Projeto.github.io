let listaServicos = [
  {
    nome: "Pedreiro",
    img: "Imagens/pedreiro.jpg",
  },
  {
    nome: "Babá",
    img: "Imagens/Babá.jpeg",
  },
  {
    nome: "Cuidadora",
    img: "Imagens/cudadora.jpg",
  },
  {
    nome: "Faxineira",
    img: "Imagens/faxineira.jpg",
  },
  {
    nome: "Garçom",
    img: "Imagens/Garçom.jpg",
  },
  {
    nome: "Limpador de Piscina",
    img: "Imagens/Limpador de piscina.jpg",
  },
  {
    nome: "Entregador",
    img: "Imagens/entregadorcria.jpeg",
  },
  {
    nome: "Pintor",
    img: "Imagens/pintor.jpg",
  },
  {
    nome: "Jardineiro",
    img: "Imagens/corrtador de grama.jpg",
  },
  {
    nome: "Marceneiro",
    img: "Imagens/marceneirocria.avif",
  },
];

// Função para criar a galeria de serviços
function criarGaleriaServicos() {
  const servicosContainer = document.querySelector(".servicos-container");

  // Limpa o container antes de adicionar os novos elementos
  servicosContainer.innerHTML = "";

  // Para cada serviço no array, cria os elementos necessários
  listaServicos.forEach((servico) => {
    // Criar elementos
    const servicoDiv = document.createElement("div");
    const link = document.createElement("a");
    const img = document.createElement("img");
    const p = document.createElement("p");
    const strong = document.createElement("strong");

    // Adicionar classes e atributos
    servicoDiv.className = "servico";
    link.href = "contrato.html";
    link.target = "_blank";
    img.src = servico.img;
    img.alt = servico.nome;
    strong.textContent = servico.nome;

    // Montar a estrutura
    p.appendChild(strong);
    link.appendChild(img);
    servicoDiv.appendChild(link);
    servicoDiv.appendChild(p);

    // Adicionar ao container
    servicosContainer.appendChild(servicoDiv);
  });
}

// Executar a função quando o documento estiver carregado
document.addEventListener("DOMContentLoaded", criarGaleriaServicos);
