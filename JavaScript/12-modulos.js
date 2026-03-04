// =============================================================================
// 12 - MÓDULOS E PADRÕES DE ORGANIZAÇÃO DE CÓDIGO
// =============================================================================
// Este arquivo cobre:
//   - ES Modules (import/export)
//   - CommonJS (require/module.exports)
//   - Dynamic import
//   - Namespaces
//   - Padrão Module (IIFE)
//   - Fetch API e comunicação com servidor
//   - Web Workers
//   - Service Workers (conceitos)
//   - Performance: profiling, otimizações
//   - Boas práticas de JavaScript
// =============================================================================

'use strict';


// =============================================================================
// PARTE 1: MÓDULOS
// =============================================================================

// -----------------------------------------------------------------------------
// 1. ES MODULES - EXPORT
// -----------------------------------------------------------------------------
// ES Modules são a forma padrão moderna de organizar código JavaScript

// EXPORT NOMEADO: pode ter múltiplos por arquivo
// Cada export tem seu próprio nome e deve ser importado pelo mesmo nome

// Constante exportada
export const VERSAO = '1.0.0';
export const NOME_APP = 'MeuApp';

// Função exportada
export function somar(a, b) {
    return a + b;
}

export function subtrair(a, b) {
    return a - b;
}

// Classe exportada
export class Usuario {
    #nome;
    #email;

    constructor(nome, email) {
        this.#nome  = nome;
        this.#email = email;
    }

    get nome() { return this.#nome; }
    get email() { return this.#email; }

    toString() {
        return `Usuario(${this.#nome}, ${this.#email})`;
    }
}

// Exportar depois de declarar
const PI = Math.PI;
const E  = Math.E;
export { PI, E };

// Renomear ao exportar
const valorInterno = 42;
export { valorInterno as valorPublico };

// EXPORT DEFAULT: apenas um por arquivo
// export default function logarErro(erro) { ... }
// export default class AppError { ... }
// export default { somar, subtrair }; // Exportar objeto

// NOTA: Este arquivo tenta demonstrar a sintaxe, mas ao executar no Node.js
// sem extensão .mjs ou package.json "type": "module", use CommonJS abaixo.


// -----------------------------------------------------------------------------
// 2. ES MODULES - IMPORT (conceitual, demonstrado como comentários)
// -----------------------------------------------------------------------------
/*
// Importar exports nomeados
import { somar, subtrair } from './matematica.js';
console.log(somar(2, 3)); // 5

// Importar com alias
import { somar as adicionar, subtrair as diminuir } from './matematica.js';
console.log(adicionar(2, 3)); // 5

// Importar tudo como namespace
import * as Math2 from './matematica.js';
console.log(Math2.somar(2, 3)); // 5
console.log(Math2.PI);          // 3.14...

// Importar export default
import ErroApp from './erros.js';          // Nome pode ser qualquer coisa
import logarErro from './log.js';

// Importar default + nomeados juntos
import MinhaClasse, { VERSAO, helper } from './modulo.js';

// Importar sem binding (para efeitos colaterais)
import './polyfills.js'; // Executa o arquivo mas não importa nada

// Reexportar (barrel exports)
export { somar, subtrair } from './matematica.js';
export { default as Logger } from './logger.js';
export * from './utilidades.js';
export * as Validadores from './validacao.js';
*/


// -----------------------------------------------------------------------------
// 3. DYNAMIC IMPORT
// -----------------------------------------------------------------------------
// Importação assíncrona sob demanda (lazy loading)

async function carregarModuloSobDemanda() {
    try {
        // Importar apenas quando necessário (code splitting)
        const modulo = await import('./modulo-pesado.js');
        modulo.executar();

        // Com default export
        const { default: MinhaClasse } = await import('./minha-classe.js');
        const instancia = new MinhaClasse();

        // Import dinâmico baseado em condição
        const idioma = 'pt-BR';
        const traducoes = await import(`./locales/${idioma}.js`);
        console.log(traducoes.saudacao);

    } catch (erro) {
        if (erro instanceof SyntaxError) {
            console.error('Módulo inválido');
        } else {
            console.error('Módulo não encontrado:', erro.message);
        }
    }
}

// Import dinâmico em event handlers (load on demand)
const botaoFerramentaAdv = typeof document !== 'undefined'
    ? document.querySelector('#ferramenta-avancada')
    : null;

botaoFerramentaAdv?.addEventListener('click', async () => {
    const { FeramentaAvancada } = await import('./ferramentas-avancadas.js');
    const ferramenta = new FeramentaAvancada();
    ferramenta.executar();
});


// -----------------------------------------------------------------------------
// 4. COMMONJS (Node.js)
// -----------------------------------------------------------------------------
// CommonJS: sistema de módulos do Node.js (anterior aos ES Modules)

// module.exports: exportar
/*
// matematica.js
const PI = Math.PI;

function somar(a, b) { return a + b; }
function subtrair(a, b) { return a - b; }

module.exports = {
    PI,
    somar,
    subtrair,
};

// Ou export default-like:
module.exports = function MinhaClasse() { ... };
module.exports = class MinhaClasse { ... };
*/

// require: importar
/*
// app.js
const { somar, subtrair } = require('./matematica');
const path = require('path'); // Módulo nativo do Node.js
const fs   = require('fs');   // Sistema de arquivos

// require é síncrono (diferente de import dinâmico)
// Cacheia após o primeiro require
const lodash = require('lodash');
console.log(require.cache); // Módulos em cache
console.log(module.paths);  // Caminhos onde Node.js procura módulos
*/


// -----------------------------------------------------------------------------
// 5. PADRÃO NAMESPACE
// -----------------------------------------------------------------------------
// Agrupa funcionalidades relacionadas sob um único identificador

const MeuApp = (function() {
    // Área privada
    const _versao  = '1.0.0';
    const _usuarios = new Map();

    // Módulo Utilitários
    const Utils = {
        formatar: {
            moeda: (v) => `R$ ${v.toFixed(2)}`,
            data:  (d) => d.toLocaleDateString('pt-BR'),
            cpf:   (s) => s.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
        },
        validar: {
            email: (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),
            cpf:   (s) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(s),
            naoVazio: (s) => s && s.trim().length > 0,
        },
        arrays: {
            agruparPor: (arr, chave) => arr.reduce((acc, item) => ({
                ...acc,
                [item[chave]]: [...(acc[item[chave]] || []), item]
            }), {}),
        }
    };

    // Módulo de Usuários
    const Usuarios = {
        adicionar(usuario) {
            _usuarios.set(usuario.id, usuario);
        },
        obter(id) {
            return _usuarios.get(id);
        },
        listar() {
            return [..._usuarios.values()];
        },
        remover(id) {
            return _usuarios.delete(id);
        },
    };

    // API Pública
    return {
        versao: _versao,
        Utils,
        Usuarios,
        inicializar() {
            console.log(`${this.constructor.name || 'MeuApp'} v${_versao} inicializado`);
        },
    };
})();

MeuApp.inicializar();
MeuApp.Usuarios.adicionar({ id: 1, nome: 'Diego' });
console.log(MeuApp.Utils.formatar.moeda(29.9)); // 'R$ 29.90'
console.log(MeuApp.Utils.validar.email('test@test.com')); // true


// =============================================================================
// PARTE 2: FETCH API
// =============================================================================

// -----------------------------------------------------------------------------
// 6. FETCH API
// -----------------------------------------------------------------------------

// Fetch básico
async function buscarPost(id) {
    const resposta = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

    if (!resposta.ok) {
        throw new Error(`HTTP ${resposta.status}: ${resposta.statusText}`);
    }

    const dados = await resposta.json();
    return dados;
}

// Fetch com opções (POST, headers, body)
async function criarPost(dados) {
    const resposta = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer meu-token',
        },
        body: JSON.stringify(dados),
    });

    const json = await resposta.json();
    return json;
}

// Fetch com AbortController (cancelamento)
async function buscarComTimeout(url, timeoutMs = 5000) {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const resposta = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return await resposta.json();
    } catch (erro) {
        clearTimeout(timeoutId);
        if (erro.name === 'AbortError') {
            throw new Error(`Timeout após ${timeoutMs}ms`);
        }
        throw erro;
    }
}

// Wrapper de Fetch com tratamento de erros
class HttpClient {
    #baseURL;
    #defaultHeaders;

    constructor(baseURL, headers = {}) {
        this.#baseURL = baseURL;
        this.#defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers,
        };
    }

    async #request(endpoint, options = {}) {
        const url = `${this.#baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.#defaultHeaders,
                ...options.headers,
            },
        };

        const resposta = await fetch(url, config);

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));
            throw new Error(erro.message || `HTTP ${resposta.status}`);
        }

        const contentType = resposta.headers.get('Content-Type');
        if (contentType?.includes('application/json')) {
            return resposta.json();
        }
        return resposta.text();
    }

    get(endpoint)           { return this.#request(endpoint); }
    post(endpoint, dados)   { return this.#request(endpoint, { method: 'POST',   body: JSON.stringify(dados) }); }
    put(endpoint, dados)    { return this.#request(endpoint, { method: 'PUT',    body: JSON.stringify(dados) }); }
    patch(endpoint, dados)  { return this.#request(endpoint, { method: 'PATCH',  body: JSON.stringify(dados) }); }
    delete(endpoint)        { return this.#request(endpoint, { method: 'DELETE' }); }
}

// Usando o cliente HTTP
const api = new HttpClient('https://jsonplaceholder.typicode.com');

async function exemplosAPI() {
    try {
        const post = await api.get('/posts/1');
        console.log('Post:', post.title);

        const novoPosts = await api.post('/posts', {
            title: 'Novo Post',
            body: 'Conteúdo',
            userId: 1,
        });
        console.log('Criado:', novoPosts.id);
    } catch (e) {
        console.error('Erro na API:', e.message);
    }
}


// =============================================================================
// PARTE 3: PERFORMANCE E BOAS PRÁTICAS
// =============================================================================

// -----------------------------------------------------------------------------
// 7. OTIMIZAÇÕES DE PERFORMANCE
// -----------------------------------------------------------------------------

// Debounce: adia execução até parar de chamar
function debounce(fn, delay) {
    let id = null;
    return function(...args) {
        clearTimeout(id);
        id = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Throttle: limita frequência de execução
function throttle(fn, limite) {
    let ultima = 0;
    return function(...args) {
        const agora = Date.now();
        if (agora - ultima >= limite) {
            ultima = agora;
            return fn.apply(this, args);
        }
    };
}

// Lazy initialization: inicializar somente quando necessário
function criarLazy(inicializador) {
    let instancia = null;
    return {
        get() {
            if (!instancia) {
                instancia = inicializador();
            }
            return instancia;
        },
        resetar() {
            instancia = null;
        }
    };
}

const bancoDados = criarLazy(() => {
    console.log('Inicializando banco de dados...');
    return { conectado: true };
});

// Banco só é criado quando chamado pela primeira vez
bancoDados.get(); // 'Inicializando banco de dados...'
bancoDados.get(); // Retorna instância existente (sem re-inicializar)

// Memoização (coberta em arquivo 03, incluída aqui para completude)
function memoizar(fn, serializador = JSON.stringify) {
    const cache = new Map();
    const wrapped = function(...args) {
        const chave = serializador(args);
        if (cache.has(chave)) return cache.get(chave);
        const resultado = fn.apply(this, args);
        cache.set(chave, resultado);
        return resultado;
    };
    wrapped.limparCache = () => cache.clear();
    return wrapped;
}

// Pool de objetos: reutiliza objetos em vez de criar/destruir
class PoolObjetos {
    #pool = [];
    #criar;
    #resetar;

    constructor(criar, resetar = (obj) => obj, tamanhoInicial = 10) {
        this.#criar  = criar;
        this.#resetar = resetar;
        // Pré-alocar objetos
        for (let i = 0; i < tamanhoInicial; i++) {
            this.#pool.push(criar());
        }
    }

    obter() {
        return this.#pool.pop() || this.#criar();
    }

    devolver(obj) {
        this.#pool.push(this.#resetar(obj));
    }

    get tamanho() { return this.#pool.length; }
}

// Exemplo: pool de vetores 3D
const poolVetores = new PoolObjetos(
    () => ({ x: 0, y: 0, z: 0 }),          // criar
    (v) => { v.x = v.y = v.z = 0; return v; } // resetar
);

const v1 = poolVetores.obter();
v1.x = 1; v1.y = 2; v1.z = 3;
// ... usar v1 ...
poolVetores.devolver(v1); // Devolve ao pool para reutilização


// -----------------------------------------------------------------------------
// 8. BOAS PRÁTICAS
// -----------------------------------------------------------------------------

// 1. USE NOMES SIGNIFICATIVOS
// RUIM:
function proc(a, b) { return a.filter(x => x.s === b); }
// BOM:
function filtrarPorStatus(usuarios, status) {
    return usuarios.filter(u => u.status === status);
}

// 2. FUNÇÕES PEQUENAS E COM UM PROPÓSITO
// RUIM: função que faz muitas coisas
function processarPedido(pedido) {
    // Valida + calcula + envia email + salva no banco em uma função!
}

// BOM: separar responsabilidades
function validarPedido(pedido) { /* ... */ }
function calcularTotal(pedido) { /* ... */ }
function enviarConfirmacao(pedido) { /* ... */ }
function salvarPedido(pedido)  { /* ... */ }
async function processarPedidoCorreto(pedido) {
    validarPedido(pedido);
    const total = calcularTotal(pedido);
    await salvarPedido({ ...pedido, total });
    await enviarConfirmacao(pedido);
    return { total };
}

// 3. EVITAR MUTAÇÃO DESNECESSÁRIA
// RUIM:
function adicionarAtivo_Ruim(usuarios) {
    usuarios.forEach(u => u.ativo = true); // Muta o array original!
}

// BOM:
function adicionarAtivo_Bom(usuarios) {
    return usuarios.map(u => ({ ...u, ativo: true })); // Retorna novo array
}

// 4. EARLY RETURN (cláusulas de guarda)
// RUIM:
function calcularDesconto_Ruim(valor, cliente) {
    if (valor > 0) {
        if (cliente) {
            if (cliente.tipo === 'vip') {
                return valor * 0.2;
            } else {
                return valor * 0.1;
            }
        }
    }
    return 0;
}

// BOM:
function calcularDesconto_Bom(valor, cliente) {
    if (!valor || valor <= 0) return 0;
    if (!cliente) return 0;
    return valor * (cliente.tipo === 'vip' ? 0.2 : 0.1);
}

// 5. USAR DEFAULTS E VALORES OPCIONAIS DE FORMA CLARA
function criarUsuario_Bom({
    nome,
    email,
    papel   = 'usuario',
    ativo   = true,
    criadoEm = new Date(),
} = {}) {
    return { nome, email, papel, ativo, criadoEm };
}

// 6. CONSISTÊNCIA NO TRATAMENTO DE ERROS
async function operacaoSegura(id) {
    if (!id) throw new Error('ID é obrigatório');
    // ... resto da lógica
}

// 7. DOCUMENTAR COM JSDoc
/**
 * Calcula o desconto para um cliente.
 * @param {number} valorOriginal - O valor original do produto.
 * @param {'regular'|'vip'|'premium'} tipoCliente - Tipo do cliente.
 * @returns {number} O valor do desconto (entre 0 e valorOriginal).
 * @throws {TypeError} Se valorOriginal não for um número positivo.
 */
function calcularDescontoDoc(valorOriginal, tipoCliente) {
    if (typeof valorOriginal !== 'number' || valorOriginal < 0) {
        throw new TypeError('valorOriginal deve ser um número positivo');
    }
    const taxas = { regular: 0.10, vip: 0.20, premium: 0.30 };
    return valorOriginal * (taxas[tipoCliente] || 0);
}

// 8. CONSTANTES NOMEADAS (evitar números mágicos)
// RUIM:
function verificarIdade(idade) {
    return idade >= 18 && idade <= 65; // O que são 18 e 65?
}

// BOM:
const IDADE_MINIMA_ADULTO = 18;
const IDADE_MAXIMA_TRABALHO = 65;

function verificarIdadeBom(idade) {
    return idade >= IDADE_MINIMA_ADULTO && idade <= IDADE_MAXIMA_TRABALHO;
}

// 9. USAR MÉTODOS FUNCIONAIS EM VEZ DE LOOPS IMPERATIVOS
const pedidos = [
    { id: 1, valor: 50, status: 'pago' },
    { id: 2, valor: 100, status: 'pendente' },
    { id: 3, valor: 75, status: 'pago' },
    { id: 4, valor: 200, status: 'pago' },
];

// RUIM (imperativo):
let totalPagoRuim = 0;
for (let i = 0; i < pedidos.length; i++) {
    if (pedidos[i].status === 'pago') {
        totalPagoRuim += pedidos[i].valor;
    }
}

// BOM (declarativo/funcional):
const totalPagoBom = pedidos
    .filter(p => p.status === 'pago')
    .reduce((acc, p) => acc + p.valor, 0);

console.log(totalPagoRuim === totalPagoBom); // true, mas o segundo é mais legível


// -----------------------------------------------------------------------------
// 9. DEBUGGING E FERRAMENTAS
// -----------------------------------------------------------------------------

// console: métodos além do console.log
console.log('Log normal');
console.error('Erro (vermelho no console)');
console.warn('Aviso (amarelo no console)');
console.info('Info');
console.debug('Debug (pode ser filtrado)');
console.dir({ a: 1, b: [2, 3] }); // Mostra estrutura do objeto
console.table([{ nome: 'Ana', idade: 25 }, { nome: 'Bruno', idade: 30 }]);
// Tabela formatada

// Agrupar logs
console.group('Grupo de logs');
console.log('Item 1');
console.log('Item 2');
console.groupEnd();

console.groupCollapsed('Grupo recolhido'); // Inicia fechado
console.log('Detalhes...');
console.groupEnd();

// Medir tempo
console.time('operação');
let soma = 0;
for (let i = 0; i < 1000000; i++) soma += i;
console.timeEnd('operação'); // 'operação: Xms'
console.timeLog('operação'); // Mostra tempo sem parar

// Contadores
console.count('chamada'); // 'chamada: 1'
console.count('chamada'); // 'chamada: 2'
console.count('outra');   // 'outra: 1'
console.countReset('chamada');

// Stack trace
console.trace('Rastreamento');

// Assert: lança no console se condição for falsa
console.assert(1 + 1 === 2, 'Matemática básica falhou!'); // Não mostra nada
console.assert(1 + 1 === 3, 'Matemática básica falhou!'); // Mostra o erro!

// Limpar console
// console.clear();


// =============================================================================
// RESUMO: TODOS OS TÓPICOS COBERTOS NO REPOSITÓRIO
// =============================================================================
/*
01-fundamentos.js:
  ✅ var, let, const e escopos
  ✅ Tipos primitivos: number, string, boolean, null, undefined, symbol, bigint
  ✅ typeof, instanceof
  ✅ Operadores aritméticos, comparação, lógicos, bitwise
  ✅ Operador ternário, spread, rest
  ✅ Coerção de tipos (implícita e explícita)
  ✅ Hoisting
  ✅ Valores truthy e falsy
  ✅ Nullish coalescing (??) e optional chaining (?.)

02-controle-de-fluxo.js:
  ✅ if / else if / else
  ✅ switch / case / default / fall-through
  ✅ while
  ✅ do...while
  ✅ for (básico, variantes)
  ✅ for...in (objetos)
  ✅ for...of (iteráveis)
  ✅ break, continue
  ✅ Labels
  ✅ Guard clauses

03-funcoes.js:
  ✅ Function declarations (hoisting)
  ✅ Function expressions
  ✅ Arrow functions (this léxico, sem arguments)
  ✅ Parâmetros padrão
  ✅ Rest parameters
  ✅ Destructuring em parâmetros
  ✅ Closures (e o problema com var)
  ✅ IIFE
  ✅ Higher-order functions
  ✅ Composição e curry
  ✅ Recursão e tail call
  ✅ Generators (function*)
  ✅ call, apply, bind
  ✅ this e contexto
  ✅ Funções puras vs impuras
  ✅ Trampolim (trampoline)
  ✅ Debounce, throttle, once

04-objetos.js:
  ✅ Objetos literais (shorthand, computed props)
  ✅ Getters e setters
  ✅ Descritores de propriedade (defineProperty, defineProperties)
  ✅ Object.freeze, Object.seal
  ✅ Todos os métodos estáticos do Object
  ✅ Prototype e cadeia prototípal
  ✅ Funções construtoras
  ✅ Classes ES6 (campos, métodos, estáticos)
  ✅ Herança de classes (extends, super)
  ✅ Campos e métodos privados (#)
  ✅ Classe abstrata (padrão)
  ✅ Mixins
  ✅ Proxy e Reflect

05-arrays-e-strings.js:
  ✅ Criação de arrays (literal, Array.from, Array.of)
  ✅ Acesso, modificação, length
  ✅ Métodos mutadores: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin
  ✅ Métodos não-mutadores: slice, concat, join, indexOf, lastIndexOf, includes, flat
  ✅ ES2023: toReversed, toSorted, toSpliced, with, at
  ✅ Iteração: forEach, map, filter, reduce, reduceRight, find, findIndex, findLast, findLastIndex
  ✅ some, every, flatMap, keys, values, entries
  ✅ Padrões: deduplicar, interseção, diferença, zip, chunk, agrupar
  ✅ Strings: criação, propriedades, métodos de busca e extração
  ✅ Template literals e tagged templates
  ✅ Todos os métodos de string

06-es6-moderno.js:
  ✅ Destructuring de array (com defaults, rest, aninhado)
  ✅ Destructuring de objeto (com renomeação, defaults, aninhado)
  ✅ Spread operator (arrays, objetos, strings)
  ✅ Map (criação, métodos, iteração, conversão)
  ✅ Set (criação, métodos, operações de conjunto)
  ✅ WeakMap e WeakSet
  ✅ WeakRef e FinalizationRegistry
  ✅ Symbol (well-known symbols: iterator, toPrimitive, hasInstance, toStringTag, species)
  ✅ Protocolo de iteração (Symbol.iterator, next, return)
  ✅ ES2016 a ES2023 (novos recursos por versão)

07-assincrono.js:
  ✅ Event loop (microtasks vs macrotasks)
  ✅ Callbacks e callback hell
  ✅ Promisificação
  ✅ Promises (criação, then, catch, finally, chaining)
  ✅ Promise.all, Promise.race, Promise.allSettled, Promise.any
  ✅ Async/await
  ✅ Async generators e for-await-of
  ✅ setTimeout e setInterval
  ✅ queueMicrotask
  ✅ AbortController
  ✅ Padrões: retry, timeout, semáforo, cache de promises, debounce assíncrono

08-erros.js:
  ✅ try/catch/finally
  ✅ Relançar erros (re-throw)
  ✅ Tipos nativos: Error, SyntaxError, ReferenceError, TypeError, RangeError, URIError, AggregateError
  ✅ Error cause (ES2022)
  ✅ Erros customizados (hierarquia)
  ✅ Tratamento centralizado de erros
  ✅ Erros em Promises e async/await
  ✅ uncaughtException e unhandledRejection (Node.js)
  ✅ Padrão Result (alternativa a exceções)
  ✅ Logging de erros com contexto

09-regex.js:
  ✅ Criação (literal e construtor)
  ✅ Flags: g, i, m, s, u, d, y, v
  ✅ Metacaracteres e classes
  ✅ Atalhos: \d, \w, \s, \b, \p{...}
  ✅ Quantificadores e grupos
  ✅ Lookahead e lookbehind
  ✅ Grupos nomeados
  ✅ Referências reversas
  ✅ Métodos: test, exec, match, matchAll, search, replace, replaceAll, split
  ✅ Validadores prontos (email, CPF, CNPJ, telefone, URL, senha, etc.)
  ✅ Formatadores (CPF, telefone, camelCase, etc.)

10-avancado.js:
  ✅ Design patterns: Singleton, Observer, Factory, Decorator, Pipeline
  ✅ Programação funcional: imutabilidade, Maybe monad, transducers
  ✅ Math API (todas as funções)
  ✅ Date API (criação, componentes, comparação, formatação)
  ✅ JSON (stringify, parse, toJSON, limitações)
  ✅ Intl API (NumberFormat, DateTimeFormat, RelativeTimeFormat, Collator, ListFormat, Segmenter)

11-dom-e-eventos.js:
  ✅ Seleção de elementos (querySelector, getElementById, etc.)
  ✅ Criação e inserção (createElement, append, insertAdjacentHTML, etc.)
  ✅ Manipulação de conteúdo (textContent, innerHTML, outerHTML)
  ✅ Atributos, dataset
  ✅ classList (add, remove, toggle, replace, contains)
  ✅ Estilos inline e getComputedStyle
  ✅ getBoundingClientRect, dimensões e scroll
  ✅ addEventListener com opções (capture, once, passive, signal)
  ✅ Objeto Event (campos, controle de propagação)
  ✅ Eventos de teclado, formulário
  ✅ Event delegation
  ✅ Eventos customizados e EventTarget
  ✅ BOM: window, navigator (geolocalização, clipboard, vibração)
  ✅ location, URL, URLSearchParams
  ✅ history (pushState, replaceState, popstate)
  ✅ localStorage, sessionStorage
  ✅ IntersectionObserver, MutationObserver, ResizeObserver

12-modulos.js:
  ✅ ES Modules (export, import, reexport)
  ✅ Dynamic import
  ✅ CommonJS (require, module.exports)
  ✅ Padrão Namespace (IIFE)
  ✅ Fetch API e HttpClient wrapper
  ✅ Performance: debounce, throttle, lazy init, memoização, pool de objetos
  ✅ Boas práticas de código
  ✅ Debugging com console (todos os métodos)
*/

// =============================================================================
// FIM DO ARQUIVO 12 - MÓDULOS E PADRÕES
// =============================================================================
