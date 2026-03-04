// =============================================================================
// 05 - ARRAYS E STRINGS
// =============================================================================
// Este arquivo cobre:
//   - Criação de arrays
//   - Todos os métodos de array (mais de 30 métodos!)
//   - Arrays tipados (TypedArrays)
//   - Todos os métodos de string (mais de 40 métodos!)
//   - Destructuring em arrays e strings
//   - Padrões comuns com arrays
// =============================================================================

'use strict';


// =============================================================================
// PARTE 1: ARRAYS
// =============================================================================

// -----------------------------------------------------------------------------
// 1. CRIAÇÃO DE ARRAYS
// -----------------------------------------------------------------------------

// Literal (mais comum)
const vazio      = [];
const numeros    = [1, 2, 3, 4, 5];
const misto      = [1, 'dois', true, null, { a: 1 }, [2, 3]]; // Tipos misturados
const comBuracos = [1, , 3, , 5]; // "sparse array" - índices 1 e 3 são undefined

// Construtor Array
const arr1 = new Array(5);         // [empty × 5] - 5 slots vazios
const arr2 = new Array(1, 2, 3);   // [1, 2, 3]
const arr3 = Array(5);             // Sem 'new' funciona igual

// Array.of: cria array com os argumentos (resolve ambiguidade do construtor)
const arr4 = Array.of(5);     // [5] (não confunde com Array(5) que cria 5 slots!)
const arr5 = Array.of(1,2,3); // [1, 2, 3]

// Array.from: cria array a partir de iterável ou array-like
const arr6 = Array.from('hello');              // ['h', 'e', 'l', 'l', 'o']
const arr7 = Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]
const arr8 = Array.from({ length: 5 }, (_, i) => i * 2); // [0, 2, 4, 6, 8]
const arr9 = Array.from(new Set([1, 2, 3, 2, 1])); // [1, 2, 3]
const arr10 = Array.from(new Map([['a', 1], ['b', 2]])); // [['a',1], ['b',2]]

console.log(arr6);  // ['h', 'e', 'l', 'l', 'o']
console.log(arr7);  // [0, 1, 2, 3, 4]

// Spread para criar array
const arr11 = [...'hello'];          // ['h', 'e', 'l', 'l', 'o']
const arr12 = [...new Set([1,2,1])]; // [1, 2]


// -----------------------------------------------------------------------------
// 2. ACESSO E MODIFICAÇÃO
// -----------------------------------------------------------------------------

const frutas = ['maçã', 'banana', 'laranja', 'uva', 'manga'];

// Acesso por índice (0-based)
console.log(frutas[0]);          // 'maçã'
console.log(frutas[4]);          // 'manga'
console.log(frutas[-1]);         // undefined (JS não suporta índice negativo direto)
console.log(frutas[frutas.length - 1]); // 'manga' (último elemento)
console.log(frutas.at(-1));      // 'manga' (ES2022 - índice negativo!)
console.log(frutas.at(-2));      // 'uva'
console.log(frutas.at(0));       // 'maçã'

// Modificar elemento
frutas[1] = 'melancia';
console.log(frutas); // ['maçã', 'melancia', 'laranja', 'uva', 'manga']

// length: tamanho do array
console.log(frutas.length); // 5

// Trucar array modificando length
frutas.length = 3;
console.log(frutas); // ['maçã', 'melancia', 'laranja']

// Esvaziar array
frutas.length = 0;
console.log(frutas); // []


// -----------------------------------------------------------------------------
// 3. MÉTODOS MUTADORES (modificam o array original)
// -----------------------------------------------------------------------------

let arr = [1, 2, 3];

// push: adiciona ao final, retorna novo length
console.log(arr.push(4, 5)); // 5 (novo length)
console.log(arr); // [1, 2, 3, 4, 5]

// pop: remove do final, retorna elemento removido
console.log(arr.pop()); // 5
console.log(arr); // [1, 2, 3, 4]

// unshift: adiciona ao início, retorna novo length
console.log(arr.unshift(0)); // 5 (novo length)
console.log(arr); // [0, 1, 2, 3, 4]

// shift: remove do início, retorna elemento removido
console.log(arr.shift()); // 0
console.log(arr); // [1, 2, 3, 4]

// splice: adiciona, remove e substitui elementos
let mutArr2 = ['a', 'b', 'c', 'd', 'e'];
// splice(índice, deleteCount, ...elementosParaInserir)
const removidos = mutArr2.splice(1, 2, 'X', 'Y', 'Z'); // Remove 2 a partir do índice 1, insere X, Y, Z
console.log(removidos); // ['b', 'c'] (elementos removidos)
console.log(mutArr2);      // ['a', 'X', 'Y', 'Z', 'd', 'e']

// splice para inserir sem remover
mutArr2.splice(2, 0, 'inserido');
console.log(mutArr2); // ['a', 'X', 'inserido', 'Y', 'Z', 'd', 'e']

// splice para remover sem inserir
mutArr2.splice(3, 2);
console.log(mutArr2); // ['a', 'X', 'inserido', 'd', 'e']

// sort: ordena in-place (modifica o array!)
const letras = ['banana', 'Abacaxi', 'cereja', 'damasco'];
letras.sort(); // Ordem lexicográfica (padrão - converte para string!)
console.log(letras); // ['Abacaxi', 'banana', 'cereja', 'damasco'] (maiúsculas primeiro!)

// sort com função de comparação (a - b retorna negativo se a < b, 0 se igual, positivo se a > b)
const nums = [10, 1, 5, 3, 8, 2];
nums.sort((a, b) => a - b);  // Crescente
console.log(nums); // [1, 2, 3, 5, 8, 10]
nums.sort((a, b) => b - a);  // Decrescente
console.log(nums); // [10, 8, 5, 3, 2, 1]

// sort com localeCompare para strings com acentos/maiúsculas
const nomes = ['Carlos', 'Ana', 'Érica', 'bruno', 'alice'];
nomes.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
console.log(nomes); // ['alice', 'Ana', 'bruno', 'Carlos', 'Érica']

// sort de objetos por propriedade
const pessoas = [
    { nome: 'Carlos', idade: 30 },
    { nome: 'Ana',    idade: 25 },
    { nome: 'Bruno',  idade: 28 },
];
pessoas.sort((a, b) => a.idade - b.idade);
console.log(pessoas.map(p => p.nome)); // ['Ana', 'Bruno', 'Carlos']

// reverse: inverte in-place
const mutArr3 = [1, 2, 3, 4, 5];
mutArr3.reverse();
console.log(mutArr3); // [5, 4, 3, 2, 1]

// fill: preenche com um valor
const mutArr4 = new Array(5).fill(0);    // [0, 0, 0, 0, 0]
const mutArr5 = [1,2,3,4,5];
mutArr5.fill(9, 1, 4);                   // fill(valor, início, fim)
console.log(mutArr5); // [1, 9, 9, 9, 5]

// copyWithin: copia parte do array para outra posição
const mutArr6 = [1, 2, 3, 4, 5];
mutArr6.copyWithin(0, 3);  // Copia do índice 3 ao fim para o índice 0
console.log(mutArr6); // [4, 5, 3, 4, 5]


// -----------------------------------------------------------------------------
// 4. MÉTODOS NÃO-MUTADORES (retornam novo array ou valor)
// -----------------------------------------------------------------------------

const original = [1, 2, 3, 4, 5];

// slice: retorna sub-array (não muta o original)
console.log(original.slice(1, 3));   // [2, 3] (índice 1 até 2, não inclui 3)
console.log(original.slice(2));      // [3, 4, 5] (do índice 2 ao fim)
console.log(original.slice(-2));     // [4, 5] (últimos 2)
console.log(original.slice());       // [1, 2, 3, 4, 5] (cópia completa)
console.log(original); // [1, 2, 3, 4, 5] (não foi modificado!)

// concat: concatena arrays/valores, retorna novo array
const a = [1, 2];
const b = [3, 4];
const c = [5];
console.log(a.concat(b, c, 6, 7)); // [1, 2, 3, 4, 5, 6, 7]
// Spread é mais moderno e flexível
console.log([...a, ...b, ...c, 6, 7]); // [1, 2, 3, 4, 5, 6, 7]

// join: une elementos em string
const palavras = ['Hello', 'World', 'JavaScript'];
console.log(palavras.join(' '));   // 'Hello World JavaScript'
console.log(palavras.join(', '));  // 'Hello, World, JavaScript'
console.log(palavras.join(''));    // 'HelloWorldJavaScript'
console.log(palavras.join('-'));   // 'Hello-World-JavaScript'

// indexOf / lastIndexOf: encontra índice de elemento
const mutArr7 = [1, 2, 3, 2, 1];
console.log(mutArr7.indexOf(2));        // 1 (primeira ocorrência)
console.log(mutArr7.lastIndexOf(2));    // 3 (última ocorrência)
console.log(mutArr7.indexOf(99));       // -1 (não encontrado)
console.log(mutArr7.indexOf(2, 2));     // 3 (busca a partir do índice 2)

// includes: verifica se contém o elemento (ES2016)
console.log(mutArr7.includes(3));       // true
console.log(mutArr7.includes(99));      // false
console.log([1, NaN].includes(NaN)); // true (diferente de indexOf que não encontra NaN)

// flat: achata array aninhado
const aninhado = [1, [2, [3, [4]]]];
console.log(aninhado.flat());       // [1, 2, [3, [4]]] (1 nível)
console.log(aninhado.flat(2));      // [1, 2, 3, [4]]   (2 níveis)
console.log(aninhado.flat(Infinity)); // [1, 2, 3, 4]    (todos os níveis)

// toString / toLocaleString
console.log([1, 2, 3].toString()); // '1,2,3'

// toReversed (ES2023): como reverse mas não muta
const mutArr8 = [1, 2, 3];
const revertido = mutArr8.toReversed();
console.log(mutArr8);       // [1, 2, 3] (original não mudou!)
console.log(revertido);  // [3, 2, 1]

// toSorted (ES2023): como sort mas não muta
const mutArr9 = [3, 1, 2];
const ordenado = mutArr9.toSorted((a, b) => a - b);
console.log(mutArr9);     // [3, 1, 2] (original não mudou!)
console.log(ordenado); // [1, 2, 3]

// toSpliced (ES2023): como splice mas não muta
const mutArr10 = ['a', 'b', 'c', 'd'];
const spliced = mutArr10.toSpliced(1, 2, 'X');
console.log(mutArr10);   // ['a', 'b', 'c', 'd'] (original não mudou!)
console.log(spliced); // ['a', 'X', 'd']

// with (ES2023): substitui elemento por índice sem mutar
const mutArr11 = [1, 2, 3, 4, 5];
const comNovo = mutArr11.with(2, 99);
console.log(mutArr11);   // [1, 2, 3, 4, 5]
console.log(comNovo); // [1, 2, 99, 4, 5]


// -----------------------------------------------------------------------------
// 5. MÉTODOS DE ITERAÇÃO E TRANSFORMAÇÃO
// -----------------------------------------------------------------------------

const numeros2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// forEach: executa função para cada elemento (sem retorno)
numeros2.forEach((num, index, arr) => {
    // num = valor, index = índice, arr = array original
    // Não retorna nada útil, use para efeitos colaterais
    process.stdout.write(num + ' ');
});
console.log();

// map: transforma cada elemento, retorna novo array
const quadrados = numeros2.map(n => n ** 2);
console.log(quadrados); // [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

// map com índice
const comIndice = numeros2.map((n, i) => `${i}:${n}`);
console.log(comIndice); // ['0:1', '1:2', ...]

// filter: filtra elementos que passam no teste
const pares   = numeros2.filter(n => n % 2 === 0);
const maiores = numeros2.filter(n => n > 5);
console.log(pares);    // [2, 4, 6, 8, 10]
console.log(maiores);  // [6, 7, 8, 9, 10]

// reduce: acumula valores em um único resultado
const soma   = numeros2.reduce((acc, n) => acc + n, 0);
const produto = numeros2.reduce((acc, n) => acc * n, 1);
console.log(soma);     // 55
console.log(produto);  // 3628800

// reduce para agrupar
const animais = [
    { nome: 'Rex',    tipo: 'cachorro' },
    { nome: 'Mimi',   tipo: 'gato' },
    { nome: 'Bolinha', tipo: 'cachorro' },
    { nome: 'Fifi',   tipo: 'gato' },
    { nome: 'Thor',   tipo: 'cachorro' },
];
const agrupado = animais.reduce((grupos, animal) => {
    const tipo = animal.tipo;
    if (!grupos[tipo]) grupos[tipo] = [];
    grupos[tipo].push(animal.nome);
    return grupos;
}, {});
console.log(agrupado);
// { cachorro: ['Rex', 'Bolinha', 'Thor'], gato: ['Mimi', 'Fifi'] }

// reduceRight: reduce da direita para esquerda
const mutArr12 = [[1, 2], [3, 4], [5, 6]];
const flat = mutArr12.reduceRight((acc, item) => acc.concat(item), []);
console.log(flat); // [5, 6, 3, 4, 1, 2]

// find: retorna o primeiro elemento que satisfaz a condição
const primeiro = numeros2.find(n => n > 5);
console.log(primeiro); // 6

// findIndex: retorna o índice do primeiro elemento que satisfaz
const primeiroIdx = numeros2.findIndex(n => n > 5);
console.log(primeiroIdx); // 5

// findLast (ES2023): como find mas de trás para frente
const ultimo = numeros2.findLast(n => n < 5);
console.log(ultimo); // 4

// findLastIndex (ES2023): como findIndex mas de trás para frente
const ultimoIdx = numeros2.findLastIndex(n => n < 5);
console.log(ultimoIdx); // 3

// some: retorna true se ALGUM elemento satisfaz a condição
console.log(numeros2.some(n => n > 9));   // true
console.log(numeros2.some(n => n > 100)); // false

// every: retorna true se TODOS os elementos satisfazem a condição
console.log(numeros2.every(n => n > 0));  // true
console.log(numeros2.every(n => n > 5));  // false

// flatMap: map + flat de 1 nível (mais eficiente que map().flat())
const frases = ['Olá mundo', 'JavaScript é incrível'];
const palavrasFlatMap = frases.flatMap(frase => frase.split(' '));
console.log(palavrasFlatMap); // ['Olá', 'mundo', 'JavaScript', 'é', 'incrível']

// Outra aplicação: expandir cada elemento em múltiplos
const nums2 = [1, 2, 3];
console.log(nums2.flatMap(n => [n, n * 2])); // [1, 2, 2, 4, 3, 6]

// keys, values, entries: iteradores
const arr13 = ['a', 'b', 'c'];
console.log([...arr13.keys()]);    // [0, 1, 2]
console.log([...arr13.values()]);  // ['a', 'b', 'c']
console.log([...arr13.entries()]); // [[0,'a'], [1,'b'], [2,'c']]

// Array.from com iteradores
for (const [i, v] of arr13.entries()) {
    console.log(`${i}: ${v}`);
}


// -----------------------------------------------------------------------------
// 6. PADRÕES COMUNS COM ARRAYS
// -----------------------------------------------------------------------------

// Deduplicar array
const repetidos = [1, 2, 3, 2, 1, 4, 3, 5];
const unicos = [...new Set(repetidos)];
console.log(unicos); // [1, 2, 3, 4, 5]

// Interseção de dois arrays
const arr14 = [1, 2, 3, 4, 5];
const arr15 = [3, 4, 5, 6, 7];
const intersecao = arr14.filter(n => arr15.includes(n));
console.log(intersecao); // [3, 4, 5]

// Diferença de dois arrays (elementos em arr14 mas não em arr15)
const diferenca = arr14.filter(n => !arr15.includes(n));
console.log(diferenca); // [1, 2]

// União de dois arrays (sem duplicatas)
const uniao = [...new Set([...arr14, ...arr15])];
console.log(uniao); // [1, 2, 3, 4, 5, 6, 7]

// Achatar e deduplicar
const multiDim = [[1, 2], [2, 3], [3, 4]];
const achatadoUnico = [...new Set(multiDim.flat())];
console.log(achatadoUnico); // [1, 2, 3, 4]

// Agrupar por chave (sem reduce)
function agruparPor(arr, chave) {
    return arr.reduce((grupos, item) => {
        const grupo = typeof chave === 'function' ? chave(item) : item[chave];
        return { ...grupos, [grupo]: [...(grupos[grupo] || []), item] };
    }, {});
}

const produtos = [
    { nome: 'Camiseta', categoria: 'Roupa', preco: 50 },
    { nome: 'Calça',    categoria: 'Roupa', preco: 100 },
    { nome: 'Livro',    categoria: 'Educação', preco: 40 },
    { nome: 'Notebook', categoria: 'Tecnologia', preco: 2500 },
    { nome: 'Curso',    categoria: 'Educação', preco: 200 },
];

const porCategoria = agruparPor(produtos, 'categoria');
console.log(Object.keys(porCategoria)); // ['Roupa', 'Educação', 'Tecnologia']

// Chunk: dividir array em grupos de N elementos
function chunk(arr, tamanho) {
    const resultado = [];
    for (let i = 0; i < arr.length; i += tamanho) {
        resultado.push(arr.slice(i, i + tamanho));
    }
    return resultado;
}
console.log(chunk([1,2,3,4,5,6,7,8,9], 3)); // [[1,2,3], [4,5,6], [7,8,9]]

// Zipar dois arrays
function zipar(arr1, mutArr2) {
    return arr1.map((item, i) => [item, mutArr2[i]]);
}
console.log(zipar([1,2,3], ['a','b','c'])); // [[1,'a'], [2,'b'], [3,'c']]

// Pipeline com arrays (encadeamento de operações)
const resultado = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .filter(n => n % 2 === 0)        // [2, 4, 6, 8, 10]
    .map(n => n ** 2)                  // [4, 16, 36, 64, 100]
    .reduce((acc, n) => acc + n, 0);  // 220
console.log(resultado); // 220

// Ordenar array de objetos por múltiplos critérios
const estudantes2 = [
    { nome: 'Carlos', nota: 8, turma: 'A' },
    { nome: 'Ana',    nota: 9, turma: 'B' },
    { nome: 'Bruno',  nota: 8, turma: 'A' },
    { nome: 'Diana',  nota: 9, turma: 'A' },
];

estudantes2.sort((a, b) => {
    // Primeiro por nota (decrescente), depois por nome (crescente)
    if (b.nota !== a.nota) return b.nota - a.nota;
    return a.nome.localeCompare(b.nome);
});
console.log(estudantes2.map(e => `${e.nome}:${e.nota}`));
// ['Ana:9', 'Diana:9', 'Bruno:8', 'Carlos:8']


// =============================================================================
// PARTE 2: STRINGS
// =============================================================================

// -----------------------------------------------------------------------------
// 7. CRIAÇÃO E PROPRIEDADES BÁSICAS
// -----------------------------------------------------------------------------

// Strings são imutáveis! Métodos sempre retornam nova string
let str = 'Hello, JavaScript World!';

console.log(str.length);  // 24
console.log(str[0]);      // 'H'
console.log(str.at(-1));  // '!' (ES2022)
console.log(str.charAt(0)); // 'H' (equivalente a str[0])

// Código do caractere
console.log(str.charCodeAt(0));        // 72 (código UTF-16 de 'H')
console.log(String.fromCharCode(72));  // 'H'

// Unicode completo (para emojis e caracteres além de U+FFFF)
console.log(str.codePointAt(0));       // 72
console.log(String.fromCodePoint(128512)); // '😀'
console.log('😀'.length); // 2 (emojis ocupam 2 code units!)


// -----------------------------------------------------------------------------
// 8. BUSCA E VERIFICAÇÃO
// -----------------------------------------------------------------------------

const texto = 'O JavaScript é uma linguagem de programação poderosa';

// indexOf / lastIndexOf
console.log(texto.indexOf('a'));           // 3 (primeira ocorrência)
console.log(texto.lastIndexOf('a'));       // 45 (última ocorrência)
console.log(texto.indexOf('Python'));      // -1 (não encontrado)
console.log(texto.indexOf('a', 10));       // busca a partir do índice 10

// includes
console.log(texto.includes('JavaScript')); // true
console.log(texto.includes('Python'));     // false

// startsWith / endsWith
console.log(texto.startsWith('O Java'));   // true
console.log(texto.startsWith('Java'));     // false (começa com 'O')
console.log(texto.endsWith('poderosa'));   // true
console.log(texto.startsWith('Java', 2)); // true (começa em índice 2)
console.log(texto.endsWith('poderosa', texto.length)); // true

// search: busca regex, retorna índice
console.log(texto.search(/java/i)); // 3 (case insensitive)
console.log(texto.search(/Python/)); // -1

// match: encontra correspondências de regex
const str2 = 'Meu email é joao@email.com e também pedro@teste.org';
const emails = str2.match(/[a-z]+@[a-z]+\.[a-z]+/g);
console.log(emails); // ['joao@email.com', 'pedro@teste.org']

// matchAll: retorna todos os matches com grupos de captura (ES2020)
const regex = /(\w+)@(\w+)\.(\w+)/g;
for (const match of str2.matchAll(regex)) {
    console.log(`Email: ${match[0]}, usuário: ${match[1]}, domínio: ${match[2]}`);
}


// -----------------------------------------------------------------------------
// 9. EXTRAÇÃO E TRANSFORMAÇÃO
// -----------------------------------------------------------------------------

const base = 'Hello, World!';

// slice(início, fim): extrai substring
console.log(base.slice(0, 5));    // 'Hello'
console.log(base.slice(7));       // 'World!'
console.log(base.slice(-6));      // 'World!'
console.log(base.slice(7, 12));   // 'World'
console.log(base.slice(-6, -1));  // 'World'

// substring(início, fim): similar ao slice, mas não suporta negativos
console.log(base.substring(0, 5));  // 'Hello'
console.log(base.substring(7));     // 'World!'
// Diferença: substring(5, 0) é o mesmo que substring(0, 5)
console.log(base.substring(5, 0)); // 'Hello' (inverte automaticamente)
console.log(base.slice(5, 0));     // '' (retorna vazio com slice)

// toUpperCase / toLowerCase
console.log(base.toUpperCase()); // 'HELLO, WORLD!'
console.log(base.toLowerCase()); // 'hello, world!'
console.log('İstanbul'.toLocaleLowerCase('tr')); // Versão localizada (Turco)

// trim / trimStart / trimEnd
const comEspacos = '   Hello World   ';
console.log(comEspacos.trim());      // 'Hello World'
console.log(comEspacos.trimStart()); // 'Hello World   '
console.log(comEspacos.trimEnd());   // '   Hello World'

// padStart / padEnd: preenche até atingir o tamanho desejado
console.log('5'.padStart(3, '0'));    // '005'
console.log('hi'.padEnd(10, '.'));    // 'hi........'
console.log('42'.padStart(6));        // '    42' (espaços por padrão)

// repeat: repete a string
console.log('abc'.repeat(3));  // 'abcabcabc'
console.log('-'.repeat(20));   // '--------------------'

// replace / replaceAll
const str3 = 'banana';
console.log(str3.replace('a', 'o'));    // 'bonana' (só a primeira!)
console.log(str3.replaceAll('a', 'o')); // 'bonono' (todas)
console.log(str3.replace(/a/g, 'o'));   // 'bonono' (regex com flag g)

// replace com função
const resultado2 = 'hello world'.replace(/(\w+)/g, (match) => match.toUpperCase());
console.log(resultado2); // 'HELLO WORLD'

// replace com grupos de captura
const data = '2023-12-25';
const dataFormatada = data.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1');
console.log(dataFormatada); // '25/12/2023'

// split: divide string em array
console.log('a,b,c,d'.split(','));     // ['a', 'b', 'c', 'd']
console.log('hello'.split(''));         // ['h', 'e', 'l', 'l', 'o']
console.log('a,b,c'.split(',', 2));     // ['a', 'b'] (limita a 2)
console.log('abc'.split());             // ['abc'] (sem separador)

// split com regex
console.log('one  two\tthree'.split(/\s+/)); // ['one', 'two', 'three']

// concat: concatena strings (prefer template literals ou +)
console.log('Hello'.concat(', ', 'World', '!')); // 'Hello, World!'

// normalize: normalização Unicode (útil para caracteres acentuados)
const cafe = 'caf\u00E9'; // 'café' (NFC - um code point)
const cafeDecomposed = 'cafe\u0301'; // 'café' (NFD - 'e' + combining accent)
console.log(cafe === cafeDecomposed);              // false (diferentes representações!)
console.log(cafe.normalize() === cafeDecomposed.normalize()); // true (ambos NFC)


// -----------------------------------------------------------------------------
// 10. TEMPLATE LITERALS AVANÇADOS
// -----------------------------------------------------------------------------

// Tagged template literals: função como "tag" do template
function destacar(strings, ...valores) {
    // strings: array de strings literais
    // valores: array de expressões interpoladas
    return strings.reduce((resultado, str, i) => {
        const valor = valores[i - 1];
        return resultado + (valor ? `**${valor}**` : '') + str;
    });
}

const nome = 'Diego';
const linguagem = 'JavaScript';
const resultado3 = destacar`Olá, ${nome}! Você está aprendendo ${linguagem}.`;
console.log(resultado3); // 'Olá, **Diego**! Você está aprendendo **JavaScript**.'

// css tag (exemplo conceitual - similar ao styled-components)
function css(strings, ...valores) {
    return strings.reduce((acc, str, i) => {
        return acc + (valores[i - 1] || '') + str;
    });
}

// String.raw: retorna string com escapes literais (sem interpretar)
console.log(String.raw`Linha1\nLinha2\tTab`); // 'Linha1\nLinha2\tTab' (sem interpretar \n)
console.log(`Linha1\nLinha2\tTab`);           // Interpreta \n e \t

// Template literals multilinha
const html = `
<div class="card">
    <h2>${'Título'}</h2>
    <p>${'Conteúdo'}</p>
</div>
`.trim();
console.log(html);


// -----------------------------------------------------------------------------
// 11. MÉTODOS ADICIONAIS DE STRING
// -----------------------------------------------------------------------------

// localeCompare: comparação respeitando idioma
const palavras2 = ['São Paulo', 'são paulo', 'sao paulo', 'SAO PAULO'];
palavras2.sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
console.log(palavras2); // Todas agrupadas independente de caixa/acentos

// Convertendo número para diferentes bases
console.log((255).toString(16));  // 'ff' (hexadecimal)
console.log((255).toString(2));   // '11111111' (binário)
console.log((255).toString(8));   // '377' (octal)
console.log((10).toString());     // '10' (decimal - padrão)

// Formatando números com strings
const preco = 1234.56789;
console.log(preco.toFixed(2));           // '1234.57'
console.log(preco.toPrecision(6));       // '1234.57'
console.log(preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
// 'R$ 1.234,57'

// Verificações de string
console.log('  '.trim().length === 0);    // true (string só com espaços é "vazia" funcionalmente)
console.log(Number.isInteger(parseInt('42'))); // true

// Converter string para array de caracteres Unicode corretos
const comEmoji = '😀🎉👋';
// Usando spread: funciona com emoji (caracteres de 4 bytes)
const chars = [...comEmoji];
console.log(chars.length);  // 3 (correto!)
console.log(comEmoji.length); // 6 (errado! cada emoji ocupa 2 code units)

// Reverter string corretamente (incluindo emojis)
const reverter = (str) => [...str].reverse().join('');
console.log(reverter('hello'));  // 'olleh'
console.log(reverter('😀🎉'));   // '🎉😀' (correto!)
// Sem spread: 'abc'.split('').reverse().join('') NÃO funciona com emojis


// =============================================================================
// FIM DO ARQUIVO 05 - ARRAYS E STRINGS
// =============================================================================
