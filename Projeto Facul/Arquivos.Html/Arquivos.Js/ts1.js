let listaServicos = [
  {
    nome: "Pedreiro",
    img: "Arquivos.Css/Imagens/pedreiro.jpg",
  },
  {
    nome: "Babá",
    img: "Arquivos.Css/Imagens/Babá.jpeg",
  },
  {
    nome: "Cuidadora",
    img: "Arquivos.Css/Imagens/cudadora.jpg",
  },
  {
    nome: "Faxineira",
    img: "Arquivos.Css/Imagens/faxineira.jpg",
  },
  {
    nome: "Garçom",
    img: "Arquivos.Css/Imagens/Garçom.jpg",
  },
  {
    nome: "Limpador de Piscina",
    img: "/Projeto Facul/Arquivos.Html/Arquivos.Css/Imagens/LDP.jpg",
  },
  {
    nome: "Entregador",
    img: "/Projeto Facul/Arquivos.Html/Arquivos.Css/Imagens/entregadorcria.jpeg",
  },
  {
    nome: "Pintor",
    img: "Arquivos.Css/Imagens/pintor.jpg",
  },
  {
    nome: "Jardineiro",
    img: "Arquivos.Css/Imagens/corrtador de grama.jpg",
  },
  {
    nome: "Marceneiro",
    img: "Arquivos.Css/Imagens/marceneirocria.avif",
  },
];

// Função para criar a galeria de serviços
function criarGaleriaServicos() {
  const servicosContainer = document.querySelector(".servicos-container");

  // Limpa o container antes de adicionar os novos elementos
  servicosContainer.innerHTML = "";

  // Determina quantos serviços mostrar baseado no tamanho da tela
  const larguraTela = window.innerWidth;
  let maxServicos;

  if (larguraTela <= 899) {
    maxServicos = 6;
  } else if (larguraTela >= 899 && larguraTela <= 1119) {
    maxServicos = 8;
  } else {
    maxServicos = 10;
  }

  // Cria apenas a quantidade de serviços necessária
  const servicosParaMostrar = listaServicos.slice(0, maxServicos);

  // Para cada serviço selecionado, cria os elementos necessários
  servicosParaMostrar.forEach((servico) => {
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

// Atualizar a galeria quando a janela for redimensionada
window.addEventListener("resize", criarGaleriaServicos);
