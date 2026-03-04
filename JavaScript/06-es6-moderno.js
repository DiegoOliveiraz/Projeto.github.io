// =============================================================================
// 06 - ES6+ MODERNO (ECMAScript 2015 e posteriores)
// =============================================================================
// Este arquivo cobre os principais recursos modernos do JavaScript:
//   - Destructuring (desestruturação)
//   - Spread e Rest
//   - Map e Set
//   - WeakMap e WeakSet
//   - Symbol (aprofundado)
//   - Iteradores e Protocolo de Iteração
//   - Generators (aprofundados)
//   - Módulos ES (conceitos)
//   - Recursos ES2016-ES2024
// =============================================================================

'use strict';


// -----------------------------------------------------------------------------
// 1. DESTRUCTURING DE ARRAY
// -----------------------------------------------------------------------------

// Básico
const [a, b, c] = [1, 2, 3];
console.log(a, b, c); // 1 2 3

// Ignorar elementos com vírgula
const [primeiro, , terceiro] = [10, 20, 30];
console.log(primeiro, terceiro); // 10 30

// Valores padrão
const [x = 0, y = 0, z = 99] = [1, 2];
console.log(x, y, z); // 1 2 99 (z usa o padrão)

// Rest parameter em destructuring
const [head, ...tail] = [1, 2, 3, 4, 5];
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]

// Trocar variáveis (clássico!)
let p = 'Diego', q = 'Carlos';
[p, q] = [q, p]; // Sem variável temporária!
console.log(p, q); // 'Carlos' 'Diego'

// Destructuring aninhado
const [[x1, y1], [x2, y2]] = [[1, 2], [3, 4]];
console.log(x1, y1, x2, y2); // 1 2 3 4

// Destructuring com retorno de função
function obterCoordenadas() {
    return [10, 20, 30];
}
const [cx, cy, cz] = obterCoordenadas();
console.log(cx, cy, cz); // 10 20 30

// Destructuring em parâmetros de função
function processarPonto([x, y, z = 0]) {
    return Math.sqrt(x**2 + y**2 + z**2);
}
console.log(processarPonto([3, 4]));      // 5
console.log(processarPonto([1, 2, 3]));   // ~3.74

// Iterando com destructuring
const pares = [[1, 'um'], [2, 'dois'], [3, 'três']];
for (const [num, nome] of pares) {
    console.log(`${num} = ${nome}`);
}


// -----------------------------------------------------------------------------
// 2. DESTRUCTURING DE OBJETO
// -----------------------------------------------------------------------------

const usuario = {
    nome: 'Diego',
    idade: 25,
    email: 'diego@email.com',
    endereco: {
        rua: 'Av. Brasil',
        numero: 100,
        cidade: 'São Paulo',
        estado: 'SP',
    },
    hobbies: ['programar', 'ler', 'jogar']
};

// Básico
const { nome, idade } = usuario;
console.log(nome, idade); // 'Diego' 25

// Renomeando variáveis
const { nome: nomeUsuario, email: emailUsuario } = usuario;
console.log(nomeUsuario, emailUsuario); // 'Diego' 'diego@email.com'

// Valores padrão
const { telefone = 'não informado', nome: nome2 = 'Anônimo' } = usuario;
console.log(telefone); // 'não informado' (propriedade não existe)
console.log(nome2);    // 'Diego' (propriedade existe, padrão ignorado)

// Destructuring aninhado
const { endereco: { cidade, estado } } = usuario;
console.log(cidade, estado); // 'São Paulo' 'SP'

// Destructuring aninhado com renomeação
const { endereco: { rua: nomeRua, numero: numRua } } = usuario;
console.log(nomeRua, numRua); // 'Av. Brasil' 100

// Rest em destructuring de objeto
const { nome: n, idade: i, ...resto } = usuario;
console.log(n, i);     // 'Diego' 25
console.log(Object.keys(resto)); // ['email', 'endereco', 'hobbies']

// Destructuring em parâmetros de função
function exibirUsuario({ nome, idade, email = 'não informado' }) {
    console.log(`${nome} (${idade}) - ${email}`);
}
exibirUsuario(usuario); // 'Diego (25) - diego@email.com'
exibirUsuario({ nome: 'Ana', idade: 30 }); // 'Ana (30) - não informado'

// Destructuring com renomeação e padrão ao mesmo tempo
const { nome: apelido = 'Desconhecido' } = {};
console.log(apelido); // 'Desconhecido'

// Destructuring em loop
const pessoas = [
    { nome: 'Ana', nota: 9 },
    { nome: 'Bruno', nota: 7 },
    { nome: 'Carlos', nota: 8 },
];
for (const { nome: n2, nota } of pessoas) {
    console.log(`${n2}: ${nota}`);
}

// Destructuring de Object.entries
const config = { host: 'localhost', porta: 3000, debug: true };
for (const [chave, valor] of Object.entries(config)) {
    console.log(`${chave} = ${valor}`);
}


// -----------------------------------------------------------------------------
// 3. SPREAD OPERATOR
// -----------------------------------------------------------------------------

// Spread em arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinado = [...arr1, ...arr2];          // [1, 2, 3, 4, 5, 6]
const comElemento = [0, ...arr1, 3.5, ...arr2]; // [0, 1, 2, 3, 3.5, 4, 5, 6]
console.log(combinado);

// Clonar array (shallow)
const original = [1, 2, [3, 4]];
const clone = [...original];
clone[0] = 99;
console.log(original[0]); // 1 (não afetado)
clone[2][0] = 99;
console.log(original[2][0]); // 99 (afetado! shallow copy)

// Spread com Math.max/min
const numeros = [5, 3, 8, 1, 9, 2];
console.log(Math.max(...numeros)); // 9
console.log(Math.min(...numeros)); // 1

// Spread em chamada de função
function somar3(a, b, c) { return a + b + c; }
const args = [1, 2, 3];
console.log(somar3(...args)); // 6

// Spread em objetos
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 }; // b vai sobrescrever obj1.b
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 3, c: 4 }

// Clonar objeto com modificação
const pessoaOriginal = { nome: 'Diego', idade: 25, cidade: 'SP' };
const pessoaAtualizada = { ...pessoaOriginal, idade: 26, email: 'novo@email.com' };
console.log(pessoaOriginal);   // { nome: 'Diego', idade: 25, cidade: 'SP' }
console.log(pessoaAtualizada); // { nome: 'Diego', idade: 26, cidade: 'SP', email: 'novo@email.com' }

// Remover propriedade com spread + destructuring
const { cidade: _, ...semCidade } = pessoaOriginal;
console.log(semCidade); // { nome: 'Diego', idade: 25 }

// Spread de string em array
const chars = [...'Hello'];
console.log(chars); // ['H', 'e', 'l', 'l', 'o']

// Spread de Set
const conjunto = new Set([1, 2, 3]);
console.log([...conjunto]); // [1, 2, 3]

// Spread de Map
const mapa = new Map([['a', 1], ['b', 2]]);
console.log([...mapa]); // [['a', 1], ['b', 2]]


// -----------------------------------------------------------------------------
// 4. MAP
// -----------------------------------------------------------------------------
// Map: coleção de pares chave-valor onde a chave pode ser QUALQUER tipo

const map = new Map();

// set: adiciona par chave-valor
map.set('nome', 'Diego');
map.set(42, 'número como chave');
map.set(true, 'booleano como chave');
const objChave = { id: 1 };
map.set(objChave, 'objeto como chave!'); // Chave pode ser objeto!

// get: obtém valor pela chave
console.log(map.get('nome'));     // 'Diego'
console.log(map.get(42));         // 'número como chave'
console.log(map.get(objChave));   // 'objeto como chave!'
console.log(map.get('inexistente')); // undefined

// has: verifica se chave existe
console.log(map.has('nome')); // true
console.log(map.has('xyz'));  // false

// size: número de entradas
console.log(map.size); // 4

// delete: remove entrada
map.delete(42);
console.log(map.size); // 3

// Inicializar Map com array de pares
const mapa2 = new Map([
    ['nome', 'Ana'],
    ['idade', 30],
    ['email', 'ana@email.com'],
]);

// Iteração sobre Map
for (const [chave, valor] of mapa2) {
    console.log(`${chave}: ${valor}`);
}

// Métodos de iteração
console.log([...mapa2.keys()]);    // ['nome', 'idade', 'email']
console.log([...mapa2.values()]);  // ['Ana', 30, 'ana@email.com']
console.log([...mapa2.entries()]); // [['nome','Ana'], ['idade',30], ...]

// forEach em Map
mapa2.forEach((valor, chave) => { // Ordem: valor, chave (diferente de objeto!)
    console.log(`${chave} => ${valor}`);
});

// Converter Map para objeto
const obj = Object.fromEntries(mapa2);
console.log(obj); // { nome: 'Ana', idade: 30, email: 'ana@email.com' }

// Converter objeto para Map
const pessoaObj = { nome: 'Diego', idade: 25 };
const pessoaMap = new Map(Object.entries(pessoaObj));
console.log(pessoaMap.get('nome')); // 'Diego'

// Map vs Objeto: quando usar Map
// Use Map quando:
// 1. Chaves não são strings (objects, numbers, etc.)
// 2. Precisa da ordem de inserção garantida
// 3. Frequente adição/remoção de pares
// 4. Precisa de size fácil
// 5. Itera sobre todos os pares

// Map como contador de frequência
function contarFrequencia(arr) {
    const freq = new Map();
    for (const item of arr) {
        freq.set(item, (freq.get(item) || 0) + 1);
    }
    return freq;
}
const letras = ['a', 'b', 'a', 'c', 'b', 'a'];
const freq = contarFrequencia(letras);
console.log(freq.get('a')); // 3
console.log(freq.get('b')); // 2


// -----------------------------------------------------------------------------
// 5. SET
// -----------------------------------------------------------------------------
// Set: coleção de valores ÚNICOS (sem duplicatas)

const set = new Set([1, 2, 3, 2, 1, 4]);
console.log(set);       // Set(4) { 1, 2, 3, 4 }
console.log(set.size);  // 4

// add: adiciona valor (ignorado se já existir)
set.add(5);
set.add(3); // Já existe, ignorado
console.log(set.size); // 5

// has: verifica existência
console.log(set.has(3)); // true
console.log(set.has(99)); // false

// delete: remove valor
set.delete(3);
console.log(set.has(3)); // false

// Iteração
for (const valor of set) {
    console.log(valor);
}

// Converter para array
const arr = [...set];
console.log(arr); // [1, 2, 4, 5]
const arrFromSet = Array.from(set);

// Set de objetos
const set2 = new Set();
const setObj1 = { id: 1 };
const setObj2 = { id: 1 }; // Mesmo conteúdo, mas referência diferente
set2.add(setObj1);
set2.add(setObj2); // Adicionado! (referências diferentes)
set2.add(setObj1); // Ignorado! (mesma referência)
console.log(set2.size); // 2

// Operações de conjunto
const setA = new Set([1, 2, 3, 4, 5]);
const setB = new Set([3, 4, 5, 6, 7]);

// União
const uniao = new Set([...setA, ...setB]);
console.log([...uniao]); // [1, 2, 3, 4, 5, 6, 7]

// Interseção
const intersecao = new Set([...setA].filter(x => setB.has(x)));
console.log([...intersecao]); // [3, 4, 5]

// Diferença (A - B)
const diferenca = new Set([...setA].filter(x => !setB.has(x)));
console.log([...diferenca]); // [1, 2]

// Subconjunto
const isSubset = (a, b) => [...a].every(x => b.has(x));
console.log(isSubset(intersecao, setA)); // true


// -----------------------------------------------------------------------------
// 6. WEAKMAP E WEAKSET
// -----------------------------------------------------------------------------
// WeakMap/WeakSet: como Map/Set, mas chaves devem ser objetos
// e referências são "fracas" (não impedem garbage collection)

// WeakMap: útil para dados privados associados a objetos
const dadosPrivados = new WeakMap();

class MinhaClasse {
    constructor(valor) {
        dadosPrivados.set(this, { valor, historico: [] });
    }

    obterValor() {
        return dadosPrivados.get(this).valor;
    }

    atualizarValor(novoValor) {
        const dados = dadosPrivados.get(this);
        dados.historico.push(dados.valor);
        dados.valor = novoValor;
    }

    obterHistorico() {
        return [...dadosPrivados.get(this).historico];
    }
}

const instancia = new MinhaClasse(42);
instancia.atualizarValor(100);
instancia.atualizarValor(200);
console.log(instancia.obterValor());    // 200
console.log(instancia.obterHistorico()); // [42, 100]
// Os dados privados serão coletados pelo GC quando 'instancia' for descartada

// WeakSet: rastrear objetos sem impedir coleta de lixo
const processados = new WeakSet();

function processar(item) {
    if (processados.has(item)) {
        console.log('Já processado');
        return;
    }
    processados.add(item);
    console.log('Processando:', item.nome);
}

const item1 = { nome: 'Item A' };
processar(item1); // 'Processando: Item A'
processar(item1); // 'Já processado'

// WeakRef (ES2021): referência fraca a um objeto
const objetoGrande = { dados: new Array(1000).fill(0) };
const refFraca = new WeakRef(objetoGrande);

// O objeto pode ser coletado pelo GC a qualquer momento
const deref = refFraca.deref();
if (deref) {
    console.log('Objeto ainda existe:', deref.dados.length); // 1000
}

// FinalizationRegistry (ES2021): callback quando objeto é coletado
const registro = new FinalizationRegistry((info) => {
    console.log(`Objeto foi coletado: ${info}`);
});
// registro.register(objetoParaRastrear, 'informação');


// -----------------------------------------------------------------------------
// 7. SYMBOL (Aprofundado)
// -----------------------------------------------------------------------------

// Symbols conhecidos (well-known symbols): personalizam comportamento de objetos

// Symbol.iterator: define como objeto é iterável
class Range {
    constructor(inicio, fim, passo = 1) {
        this.inicio = inicio;
        this.fim    = fim;
        this.passo  = passo;
    }

    [Symbol.iterator]() {
        let atual = this.inicio;
        const { fim, passo } = this;

        return {
            next() {
                if (atual <= fim) {
                    const valor = atual;
                    atual += passo;
                    return { value: valor, done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
}

const range = new Range(1, 10, 2);
console.log([...range]);       // [1, 3, 5, 7, 9]
for (const n of range) {
    process.stdout.write(n + ' ');
}
console.log();

// Symbol.toPrimitive: define conversão para primitivo
class Dinheiro {
    constructor(valor, moeda = 'BRL') {
        this.valor  = valor;
        this.moeda  = moeda;
    }

    [Symbol.toPrimitive](hint) {
        if (hint === 'number') return this.valor;
        if (hint === 'string') return `${this.moeda} ${this.valor.toFixed(2)}`;
        return this.valor; // 'default'
    }
}

const preco = new Dinheiro(29.99);
console.log(+preco);           // 29.99 (hint: 'number')
console.log(`${preco}`);       // 'BRL 29.99' (hint: 'string')
console.log(preco + 10);       // 39.99 (hint: 'default')
console.log(preco > 20);       // true (hint: 'number')

// Symbol.hasInstance: personaliza instanceof
class TipoArray {
    static [Symbol.hasInstance](instancia) {
        return Array.isArray(instancia);
    }
}
console.log([] instanceof TipoArray);   // true
console.log({} instanceof TipoArray);   // false

// Symbol.toStringTag: personaliza Object.prototype.toString
class MeuTipo {
    get [Symbol.toStringTag]() {
        return 'MeuTipo';
    }
}
const mt = new MeuTipo();
console.log(Object.prototype.toString.call(mt)); // '[object MeuTipo]'
console.log(mt.toString()); // '[object MeuTipo]'

// Symbol.species: define qual construtor usar para métodos que retornam instâncias
class MeuArray extends Array {
    static get [Symbol.species]() {
        return Array; // map/filter retornam Array, não MeuArray
    }
}
const ma = new MeuArray(1, 2, 3);
const mapped = ma.map(x => x * 2);
console.log(mapped instanceof MeuArray); // false (por causa de Symbol.species)
console.log(mapped instanceof Array);    // true


// -----------------------------------------------------------------------------
// 8. PROTOCOLO DE ITERAÇÃO
// -----------------------------------------------------------------------------
// Um objeto é iterável se implementa o método [Symbol.iterator]
// que retorna um objeto com o método next()

// Criando objeto iterável manualmente
const intervalo = {
    de: 1,
    ate: 5,

    [Symbol.iterator]() {
        let atual = this.de;
        const ate = this.ate;
        return {
            next() {
                if (atual <= ate) {
                    return { value: atual++, done: false };
                }
                return { value: undefined, done: true };
            },
            // Método return chamado quando iteração é interrompida (break, return, throw)
            return(valor) {
                console.log('Iteração interrompida!');
                return { value: valor, done: true };
            }
        };
    }
};

// Usando o iterável
for (const n of intervalo) {
    if (n > 3) break; // Chama o método return()
    console.log(n);
}
// 1, 2, 3 | 'Iteração interrompida!'

// Usando o protocolo manualmente
const iterador = intervalo[Symbol.iterator]();
console.log(iterador.next()); // { value: 1, done: false }
console.log(iterador.next()); // { value: 2, done: false }
console.log(iterador.next()); // { value: 3, done: false }
console.log(iterador.next()); // { value: 4, done: false }
console.log(iterador.next()); // { value: 5, done: false }
console.log(iterador.next()); // { value: undefined, done: true }

// Iterador infinito reutilizável
const naturais = {
    [Symbol.iterator]() {
        let n = 1;
        return {
            next() { return { value: n++, done: false }; }
        };
    }
};

// Pegar primeiros 5 números naturais
const primeiros5 = [];
for (const n of naturais) {
    primeiros5.push(n);
    if (n >= 5) break;
}
console.log(primeiros5); // [1, 2, 3, 4, 5]


// -----------------------------------------------------------------------------
// 9. RECURSOS ES2016-ES2024
// -----------------------------------------------------------------------------

// ES2016: ** (exponenciação) e Array.prototype.includes
console.log(2 ** 10);                   // 1024
console.log([1, 2, NaN].includes(NaN)); // true

// ES2017: async/await, Object.values/entries, String padding
// async/await: arquivo 07
console.log(Object.values({ a: 1, b: 2 })); // [1, 2]
console.log('5'.padStart(3, '0'));            // '005'

// ES2018: rest/spread em objetos, Promise.finally, for-await-of
const { x: rx, ...semX } = { x: 1, y: 2, z: 3 };
console.log(rx, semX); // 1 { y: 2, z: 3 }

// ES2019: Array.flat, Array.flatMap, Object.fromEntries, String.trimStart/trimEnd, try {} catch {}
const aninhado2 = [1, [2, [3]]];
console.log(aninhado2.flat(Infinity)); // [1, 2, 3]
// try {} catch {} sem variável de binding:
try {
    JSON.parse('{invalid}');
} catch { // ES2019: não precisa de catch(e)
    console.log('JSON inválido');
}

// ES2020: BigInt, nullish coalescing ??, optional chaining ?., Promise.allSettled,
//         globalThis, String.matchAll, Dynamic import
console.log(null ?? 'padrão');   // 'padrão'
console.log(0 ?? 'padrão');      // 0 (0 não é null/undefined)
const obj3 = { a: { b: 42 } };
console.log(obj3?.a?.b);         // 42
console.log(obj3?.x?.y);         // undefined (sem erro!)

// ES2021: String.replaceAll, Promise.any, WeakRef, FinalizationRegistry,
//         Logical assignment (&&=, ||=, ??=), Numeric separators
const valorGrande = 1_000_000; // Separador numérico para legibilidade
const hex = 0xFF_FF_FF;        // Também funciona em hex
const bin = 0b1111_0000;       // E binário
console.log(valorGrande); // 1000000
console.log(hex);         // 16777215

let a2 = null;
a2 ??= 'valor'; // a2 = a2 ?? 'valor'
console.log(a2); // 'valor'

// ES2022: Class fields privados, Array.at, Object.hasOwn, Error cause,
//         Top-level await (em módulos), at() string
console.log('hello'.at(-1)); // 'o'
console.log([1,2,3].at(-1)); // 3
console.log(Object.hasOwn({ a: 1 }, 'a')); // true

// Error cause (ES2022): passar causa do erro
try {
    try {
        JSON.parse('{invalid}');
    } catch (causaOriginal) {
        throw new Error('Falha ao processar config', { cause: causaOriginal });
    }
} catch (e) {
    console.log(e.message);  // 'Falha ao processar config'
    console.log(e.cause);    // SyntaxError original
}

// ES2023: Array.findLast, Array.findLastIndex, Array.toReversed, Array.toSorted,
//         Array.toSpliced, Array.with, Hashbang grammar
const arr13 = [1, 2, 3, 4, 5];
console.log(arr13.findLast(n => n < 4));      // 3
console.log(arr13.findLastIndex(n => n < 4)); // 2
console.log(arr13.toReversed());              // [5, 4, 3, 2, 1]
console.log(arr13.toSorted((a, b) => b - a)); // [5, 4, 3, 2, 1]
console.log(arr13.toSpliced(1, 2, 'x'));      // [1, 'x', 4, 5]
console.log(arr13.with(2, 99));               // [1, 2, 99, 4, 5]
console.log(arr13); // [1, 2, 3, 4, 5] (original inalterado em todos!)

// Promise.any (ES2021): resolve quando qualquer uma resolve, rejeita se todas rejeitam
Promise.any([
    Promise.reject('erro 1'),
    Promise.resolve('sucesso'),
    Promise.reject('erro 2'),
]).then(valor => console.log(valor)); // 'sucesso'

// Promise.allSettled (ES2020): espera todas (sucesso ou falha)
Promise.allSettled([
    Promise.resolve(1),
    Promise.reject('erro'),
    Promise.resolve(3),
]).then(resultados => {
    resultados.forEach(r => {
        if (r.status === 'fulfilled') console.log('Ok:', r.value);
        else console.log('Erro:', r.reason);
    });
});


// -----------------------------------------------------------------------------
// 10. DESESTRUTURAÇÃO AVANÇADA
// -----------------------------------------------------------------------------

// Desestruturação profunda
const empresa = {
    nome: 'TechCorp',
    ceo: {
        nome: 'Alice',
        contato: {
            email: 'alice@techcorp.com',
            telefones: ['(11) 1111-1111', '(11) 2222-2222']
        }
    },
    departamentos: ['TI', 'RH', 'Financeiro']
};

const {
    nome: nomeEmpresa,
    ceo: {
        nome: nomeCEO,
        contato: {
            email: emailCEO,
            telefones: [telefone1, telefone2]
        }
    },
    departamentos: [primeiroDept, ...outrosDepts]
} = empresa;

console.log(nomeEmpresa);   // 'TechCorp'
console.log(nomeCEO);       // 'Alice'
console.log(emailCEO);      // 'alice@techcorp.com'
console.log(telefone1);     // '(11) 1111-1111'
console.log(primeiroDept);  // 'TI'
console.log(outrosDepts);   // ['RH', 'Financeiro']

// Desestruturação em imports (padrão de módulos ES)
// import { useState, useEffect } from 'react'; // Destructuring!
// import { createStore, combineReducers } from 'redux';

// Desestruturação com computed properties
const chavesDinamicas = ['nome', 'idade'];
const dadosDinamicos = { nome: 'Diego', idade: 25, cidade: 'SP' };

// Não funciona diretamente com destructuring - use uma abordagem alternativa:
const extrair = (obj, chaves) => chaves.reduce((acc, k) => ({ ...acc, [k]: obj[k] }), {});
const extraido = extrair(dadosDinamicos, chavesDinamicas);
console.log(extraido); // { nome: 'Diego', idade: 25 }


// =============================================================================
// FIM DO ARQUIVO 06 - ES6+ MODERNO
// =============================================================================
