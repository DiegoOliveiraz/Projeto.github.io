// =============================================================================
// 02 - CONTROLE DE FLUXO
// =============================================================================
// Este arquivo cobre todas as estruturas de controle de fluxo do JavaScript:
//   - if / else if / else
//   - switch / case
//   - while
//   - do...while
//   - for
//   - for...in
//   - for...of
//   - break e continue
//   - labels
// =============================================================================

'use strict';


// -----------------------------------------------------------------------------
// 1. IF / ELSE IF / ELSE
// -----------------------------------------------------------------------------

// Estrutura básica
let temperatura = 28;

if (temperatura > 35) {
    console.log('Muito quente!');
} else if (temperatura > 25) {
    console.log('Quente');          // Executa este
} else if (temperatura > 15) {
    console.log('Agradável');
} else if (temperatura > 5) {
    console.log('Frio');
} else {
    console.log('Muito frio!');
}

// if sem chaves (apenas para uma linha - use com cuidado!)
let ehMaior = true;
if (ehMaior) console.log('É maior de idade');
else         console.log('Não é maior de idade');

// Verificações comuns
function verificar(valor) {
    // Verificar se é null ou undefined (nullish check)
    if (valor == null) { // == null captura tanto null quanto undefined
        return 'É nulo ou indefinido';
    }

    // Verificar tipo
    if (typeof valor === 'string') {
        return `É uma string: "${valor}"`;
    }

    if (typeof valor === 'number') {
        if (isNaN(valor)) return 'É NaN';
        if (!isFinite(valor)) return 'É Infinito';
        return `É um número: ${valor}`;
    }

    if (Array.isArray(valor)) {
        return `É um array com ${valor.length} elementos`;
    }

    if (typeof valor === 'object') {
        return 'É um objeto';
    }

    return 'Outro tipo';
}

console.log(verificar(null));          // 'É nulo ou indefinido'
console.log(verificar(undefined));     // 'É nulo ou indefinido'
console.log(verificar('hello'));       // 'É uma string: "hello"'
console.log(verificar(42));            // 'É um número: 42'
console.log(verificar(NaN));           // 'É NaN'
console.log(verificar([1, 2, 3]));     // 'É um array com 3 elementos'
console.log(verificar({ a: 1 }));      // 'É um objeto'


// -----------------------------------------------------------------------------
// 2. SWITCH / CASE
// -----------------------------------------------------------------------------
// switch compara com === (igualdade estrita) sem coerção de tipo

let diaSemana = 3;
let nomeDia;

switch (diaSemana) {
    case 1:
        nomeDia = 'Segunda-feira';
        break; // IMPORTANTE: sem break, executa o próximo case (fall-through)!
    case 2:
        nomeDia = 'Terça-feira';
        break;
    case 3:
        nomeDia = 'Quarta-feira';
        break;
    case 4:
        nomeDia = 'Quinta-feira';
        break;
    case 5:
        nomeDia = 'Sexta-feira';
        break;
    case 6:
        nomeDia = 'Sábado';
        break;
    case 7:
        nomeDia = 'Domingo';
        break;
    default: // Executado quando nenhum case corresponde
        nomeDia = 'Dia inválido';
}

console.log(nomeDia); // 'Quarta-feira'

// Fall-through intencional: múltiplos cases com o mesmo comportamento
let mes = 4;
let diasNoMes;

switch (mes) {
    case 1: // Janeiro
    case 3: // Março
    case 5: // Maio
    case 7: // Julho
    case 8: // Agosto
    case 10: // Outubro
    case 12: // Dezembro
        diasNoMes = 31;
        break;
    case 4: // Abril
    case 6: // Junho
    case 9: // Setembro
    case 11: // Novembro
        diasNoMes = 30;
        break;
    case 2: // Fevereiro (simplificado)
        diasNoMes = 28;
        break;
    default:
        diasNoMes = -1; // Mês inválido
}

console.log(`Mês ${mes} tem ${diasNoMes} dias`); // 'Mês 4 tem 30 dias'

// Switch com strings
function obterDesconto(tipoCliente) {
    switch (tipoCliente.toLowerCase()) {
        case 'vip':
            return 0.20;
        case 'regular':
            return 0.10;
        case 'novo':
            return 0.05;
        default:
            return 0;
    }
}

console.log(obterDesconto('VIP'));     // 0.20
console.log(obterDesconto('regular')); // 0.10
console.log(obterDesconto('outro'));   // 0

// Alternativa moderna ao switch: objeto de mapeamento (mais limpo)
const descontos = {
    vip: 0.20,
    regular: 0.10,
    novo: 0.05,
};
function obterDescontoObj(tipo) {
    return descontos[tipo.toLowerCase()] ?? 0;
}
console.log(obterDescontoObj('VIP')); // 0.20


// -----------------------------------------------------------------------------
// 3. WHILE
// -----------------------------------------------------------------------------
// Executa o bloco ENQUANTO a condição for verdadeira
// A condição é verificada ANTES de executar o bloco

let contador = 0;
while (contador < 5) {
    console.log(`contador = ${contador}`);
    contador++; // IMPORTANTE: sempre modifique o contador para evitar loop infinito
}
// Saída: 0, 1, 2, 3, 4

// Exemplo: encontrar o menor número de bits para representar N
function contarBits(n) {
    let bits = 0;
    while (n > 0) {
        bits++;
        n = Math.floor(n / 2);
    }
    return bits || 1; // pelo menos 1 bit
}
console.log(contarBits(8));  // 4 (1000 em binário)
console.log(contarBits(15)); // 4 (1111 em binário)
console.log(contarBits(16)); // 5 (10000 em binário)

// While com condição complexa
let saldo = 1000;
let taxa  = 0.10;
let anos  = 0;
while (saldo < 2000 && anos < 100) { // limite de segurança
    saldo += saldo * taxa;
    anos++;
}
console.log(`Levou ${anos} anos para dobrar o saldo`); // ~8 anos (regra dos 72)


// -----------------------------------------------------------------------------
// 4. DO...WHILE
// -----------------------------------------------------------------------------
// Executa o bloco pelo menos UMA VEZ, depois verifica a condição

let numero;
let tentativas = 0;
do {
    numero = Math.floor(Math.random() * 10) + 1; // Número aleatório 1-10
    tentativas++;
    console.log(`Tentativa ${tentativas}: gerou ${numero}`);
} while (numero !== 5 && tentativas < 20); // Para quando gerar 5 ou após 20 tentativas

console.log(`Resultado final: ${numero} após ${tentativas} tentativas`);

// do...while executa ao menos uma vez, mesmo com condição falsa
let x = 10;
do {
    console.log('Isso executa uma vez mesmo com condição falsa');
    x++;
} while (x < 5); // false desde o início, mas o bloco já executou
console.log(x); // 11


// -----------------------------------------------------------------------------
// 5. FOR
// -----------------------------------------------------------------------------
// Sintaxe: for (inicialização; condição; atualização) { ... }

// Loop básico
for (let i = 0; i < 5; i++) {
    console.log(`i = ${i}`);
} // i = 0, 1, 2, 3, 4

// Loop decrescente
for (let i = 5; i > 0; i--) {
    console.log(`i = ${i}`);
} // i = 5, 4, 3, 2, 1

// Loop com passo diferente de 1
for (let i = 0; i <= 20; i += 5) {
    console.log(`i = ${i}`);
} // i = 0, 5, 10, 15, 20

// Iterando sobre array
const frutas = ['maçã', 'banana', 'laranja', 'uva'];
for (let i = 0; i < frutas.length; i++) {
    console.log(`frutas[${i}] = ${frutas[i]}`);
}

// Iterando ao contrário
for (let i = frutas.length - 1; i >= 0; i--) {
    console.log(frutas[i]);
}

// Loop aninhado (tabela de multiplicação)
console.log('Tabuada do 1 ao 5:');
for (let i = 1; i <= 5; i++) {
    let linha = '';
    for (let j = 1; j <= 5; j++) {
        linha += `${i * j}`.padStart(4); // padStart para alinhar
    }
    console.log(linha);
}

// Partes opcionais do for (todas as partes são opcionais!)
let k = 0;
for (;;) { // Loop infinito (equivalente a while(true))
    if (k >= 3) break; // sair com break
    console.log(k);
    k++;
}

// Múltiplas variáveis no for
for (let i = 0, j = 10; i < j; i++, j--) {
    console.log(`i=${i}, j=${j}`);
}


// -----------------------------------------------------------------------------
// 6. FOR...IN
// -----------------------------------------------------------------------------
// Itera sobre as propriedades ENUMERÁVEIS de um objeto (chaves)
// CUIDADO: também itera propriedades herdadas do prototype!

const carro = {
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2023,
    cor: 'Prata'
};

for (const chave in carro) {
    // hasOwnProperty garante que só iteramos propriedades próprias, não herdadas
    if (Object.prototype.hasOwnProperty.call(carro, chave)) {
        console.log(`${chave}: ${carro[chave]}`);
    }
}
// marca: Toyota
// modelo: Corolla
// ano: 2023
// cor: Prata

// for...in com array (NÃO recomendado para arrays!)
const numeros = [10, 20, 30];
for (const index in numeros) {
    console.log(`índice ${index}: valor ${numeros[index]}`);
    // índice é string! '0', '1', '2' - não number!
}

// PROBLEMAS com for...in em arrays:
// 1. Itera índices como strings ('0', '1', '2')
// 2. Itera propriedades adicionadas ao array
// 3. Pode iterar propriedades do Array.prototype
// USE for...of ou forEach para arrays!

// for...in para copiar propriedades (padrão)
function copiarPropriedades(origem, destino) {
    for (const chave in origem) {
        if (Object.prototype.hasOwnProperty.call(origem, chave)) {
            destino[chave] = origem[chave];
        }
    }
    return destino;
}
const copia = copiarPropriedades(carro, {});
console.log(copia);


// -----------------------------------------------------------------------------
// 7. FOR...OF
// -----------------------------------------------------------------------------
// Itera sobre valores de objetos ITERÁVEIS (arrays, strings, Map, Set, generators)
// É o loop recomendado para arrays!

// Iterando array
const cores = ['vermelho', 'verde', 'azul'];
for (const cor of cores) {
    console.log(cor);
}
// vermelho, verde, azul

// Iterando com índice (usando entries())
for (const [index, cor] of cores.entries()) {
    console.log(`${index}: ${cor}`);
}
// 0: vermelho, 1: verde, 2: azul

// Iterando string (caractere por caractere)
const palavra = 'JavaScript';
for (const char of palavra) {
    process.stdout.write(char + ' ');
}
console.log(); // nova linha

// Iterando Map
const mapa = new Map([
    ['nome', 'Diego'],
    ['idade', 25],
    ['cidade', 'SP']
]);
for (const [chave, valor] of mapa) {
    console.log(`${chave} => ${valor}`);
}

// Iterando Set
const conjunto = new Set([1, 2, 3, 2, 1]); // {1, 2, 3} - sem duplicatas
for (const valor of conjunto) {
    console.log(valor);
}
// 1, 2, 3

// Iterando NodeList (em ambiente browser - listado como exemplo)
// for (const elemento of document.querySelectorAll('p')) {
//     console.log(elemento.textContent);
// }

// Iterando argumentos de função com for...of
function somarTudo() {
    let total = 0;
    for (const num of arguments) { // arguments é array-like, mas iterável
        total += num;
    }
    return total;
}
console.log(somarTudo(1, 2, 3, 4, 5)); // 15

// Iterando generator (detalhado no arquivo 03)
function* gerador() {
    yield 1;
    yield 2;
    yield 3;
}
for (const val of gerador()) {
    console.log(val);
}
// 1, 2, 3


// -----------------------------------------------------------------------------
// 8. BREAK E CONTINUE
// -----------------------------------------------------------------------------

// BREAK: sai completamente do loop
console.log('Procurando o número 5:');
for (let i = 1; i <= 10; i++) {
    if (i === 5) {
        console.log(`Encontrado: ${i}`);
        break; // Sai do loop imediatamente
    }
    console.log(`Verificando: ${i}`);
}
// Verificando: 1, 2, 3, 4 | Encontrado: 5

// CONTINUE: pula para a próxima iteração
console.log('Números ímpares de 1 a 10:');
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        continue; // Pula os pares, vai para a próxima iteração
    }
    console.log(i);
}
// 1, 3, 5, 7, 9

// break e continue em while
let i = 0;
while (true) { // loop infinito
    i++;
    if (i % 2 === 0) continue; // pula pares
    if (i > 10) break;          // sai quando > 10
    console.log(i);
}
// 1, 3, 5, 7, 9


// -----------------------------------------------------------------------------
// 9. LABELS (rótulos)
// -----------------------------------------------------------------------------
// Labels permitem usar break e continue com loops aninhados

// Sem label: break sai apenas do loop interno
console.log('Sem label:');
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) break; // sai só do loop j
        console.log(`i=${i}, j=${j}`);
    }
}
// i=0,j=0 | i=1,j=0 | i=2,j=0

// Com label: break sai do loop especificado
console.log('Com label:');
externo: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) break externo; // sai do loop EXTERNO
        console.log(`i=${i}, j=${j}`);
    }
}
// i=0,j=0 (apenas!)

// Continue com label
console.log('Continue com label:');
externo2: for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        if (j === 1) continue externo2; // pula para próxima iteração do loop externo
        console.log(`i=${i}, j=${j}`);
    }
}
// i=0,j=0 | i=1,j=0 | i=2,j=0


// -----------------------------------------------------------------------------
// 10. EXEMPLOS PRÁTICOS DE CONTROLE DE FLUXO
// -----------------------------------------------------------------------------

// Algoritmo de busca binária (usando loops)
function buscaBinaria(arr, alvo) {
    let inicio = 0;
    let fim = arr.length - 1;

    while (inicio <= fim) {
        const meio = Math.floor((inicio + fim) / 2);

        if (arr[meio] === alvo) {
            return meio; // Encontrado, retorna índice
        } else if (arr[meio] < alvo) {
            inicio = meio + 1; // Busca na metade direita
        } else {
            fim = meio - 1; // Busca na metade esquerda
        }
    }

    return -1; // Não encontrado
}

const arrayOrdenado = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
console.log(buscaBinaria(arrayOrdenado, 7));  // 3 (índice)
console.log(buscaBinaria(arrayOrdenado, 6));  // -1 (não existe)
console.log(buscaBinaria(arrayOrdenado, 19)); // 9 (último)

// Verificador de número primo com break
function ehPrimo(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;

    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false; // Não é primo, sai da função
    }
    return true;
}

// Listar primos até 50
let primos = [];
for (let n = 2; n <= 50; n++) {
    if (ehPrimo(n)) primos.push(n);
}
console.log('Primos até 50:', primos);
// [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

// FizzBuzz clássico
console.log('FizzBuzz (1-20):');
for (let n = 1; n <= 20; n++) {
    if (n % 15 === 0)      console.log('FizzBuzz');
    else if (n % 3 === 0)  console.log('Fizz');
    else if (n % 5 === 0)  console.log('Buzz');
    else                   console.log(n);
}

// Calculadora de fatorial (com loop)
function fatorial(n) {
    if (n < 0) throw new Error('Fatorial não definido para negativos');
    if (n === 0 || n === 1) return 1;
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
        resultado *= i;
    }
    return resultado;
}
console.log(fatorial(5));  // 120
console.log(fatorial(10)); // 3628800
console.log(fatorial(0));  // 1

// Pirâmide de asteriscos
function pirâmide(linhas) {
    for (let i = 1; i <= linhas; i++) {
        const espacos   = ' '.repeat(linhas - i);
        const asteriscos = '*'.repeat(2 * i - 1);
        console.log(espacos + asteriscos);
    }
}
pirâmide(5);
//     *
//    ***
//   *****
//  *******
// *********

// Padrão xadrez (duplo for com continue)
function xadrez(tamanho) {
    for (let i = 0; i < tamanho; i++) {
        let linha = '';
        for (let j = 0; j < tamanho; j++) {
            linha += (i + j) % 2 === 0 ? '#' : ' ';
        }
        console.log(linha);
    }
}
xadrez(6);

// Iteração com for...of e desestruturação
const estudantes = [
    { nome: 'Ana', nota: 9.5 },
    { nome: 'Bruno', nota: 7.8 },
    { nome: 'Carlos', nota: 5.2 },
    { nome: 'Diana', nota: 8.9 },
];

for (const { nome, nota } of estudantes) {
    const situacao = nota >= 7 ? 'Aprovado' : 'Reprovado';
    console.log(`${nome}: ${nota.toFixed(1)} - ${situacao}`);
}

// Loop com Promise/async (conceito - detalhado no arquivo 07)
// for...of funciona com await (ao contrário de forEach)
async function processarSequencial(items) {
    for (const item of items) {
        // await funciona aqui! (forEach NÃO suporta await corretamente)
        await new Promise(resolve => setTimeout(resolve, 10));
        console.log(`Processado: ${item}`);
    }
}


// -----------------------------------------------------------------------------
// 11. GUARD CLAUSES (cláusulas de guarda)
// -----------------------------------------------------------------------------
// Padrão para reduzir aninhamento usando retorno antecipado

// Sem guard clauses (aninhamento profundo - difícil de ler)
function calcularFrete_Ruim(peso, distancia, tipoCliente) {
    if (peso > 0) {
        if (distancia > 0) {
            if (tipoCliente === 'vip') {
                return peso * distancia * 0.05;
            } else {
                return peso * distancia * 0.10;
            }
        } else {
            return 'Distância inválida';
        }
    } else {
        return 'Peso inválido';
    }
}

// Com guard clauses (mais limpo e legível)
function calcularFrete(peso, distancia, tipoCliente) {
    if (peso <= 0)     return 'Peso inválido';
    if (distancia <= 0) return 'Distância inválida';

    const taxa = tipoCliente === 'vip' ? 0.05 : 0.10;
    return peso * distancia * taxa;
}

console.log(calcularFrete(10, 100, 'vip'));     // 50
console.log(calcularFrete(10, 100, 'regular')); // 100
console.log(calcularFrete(-1, 100, 'vip'));     // 'Peso inválido'
console.log(calcularFrete(10, 0, 'vip'));       // 'Distância inválida'


// =============================================================================
// FIM DO ARQUIVO 02 - CONTROLE DE FLUXO
// =============================================================================
