// =============================================================================
// 03 - FUNÇÕES
// =============================================================================
// Este arquivo cobre tudo sobre funções em JavaScript:
//   - Declaração de função (function declaration)
//   - Expressão de função (function expression)
//   - Arrow functions (funções de seta)
//   - Parâmetros: padrão, rest, destructuring
//   - Escopo léxico e closures
//   - IIFE (Immediately Invoked Function Expression)
//   - Funções de ordem superior (Higher-Order Functions)
//   - Recursão
//   - Generators (function*)
//   - Funções assíncronas (async/await - prévia)
//   - Métodos de função: call, apply, bind
//   - Contexto this
// =============================================================================

'use strict';


// -----------------------------------------------------------------------------
// 1. DECLARAÇÃO DE FUNÇÃO (Function Declaration)
// -----------------------------------------------------------------------------
// Sofre hoisting completo: pode ser chamada antes de ser declarada

// Declaração básica
function saudacao(nome) {
    return `Olá, ${nome}!`;
}
console.log(saudacao('Diego')); // 'Olá, Diego!'

// Hoisting: funciona mesmo antes da declaração
console.log(dobrar(5)); // 10 (funciona por causa do hoisting)
function dobrar(n) {
    return n * 2;
}

// Funções podem ser declaradas dentro de outras funções
function externa() {
    function interna() {
        return 'Sou interna';
    }
    return interna(); // 'Sou interna'
}
// interna(); // Erro! ReferenceError - não existe fora de externa()

// Funções são objetos de primeira classe (first-class citizens)
function ola() { return 'olá'; }
console.log(typeof ola);          // 'function'
console.log(ola.name);            // 'ola' (propriedade name)
console.log(ola.length);          // 0 (número de parâmetros esperados)

// Funções podem ser passadas como argumentos
function executar(fn, valor) {
    return fn(valor);
}
console.log(executar(dobrar, 7)); // 14

// Funções podem ser retornadas por outras funções
function criarMultiplicador(fator) {
    return function(numero) {
        return numero * fator;
    };
}
const triplicar = criarMultiplicador(3);
console.log(triplicar(5));  // 15
console.log(triplicar(10)); // 30


// -----------------------------------------------------------------------------
// 2. EXPRESSÃO DE FUNÇÃO (Function Expression)
// -----------------------------------------------------------------------------
// Não sofre hoisting: não pode ser chamada antes de ser definida

// Função anônima atribuída a variável
const somar = function(a, b) {
    return a + b;
};
console.log(somar(3, 4)); // 7
console.log(somar.name);  // 'somar' (inferido da variável)

// Função nomeada como expressão (nome só visível dentro da função - útil para recursão)
const fatorial = function fat(n) {
    if (n <= 1) return 1;
    return n * fat(n - 1); // Pode chamar 'fat' internamente
    // return n * fatorial(n - 1); // Também funciona mas cria dependência do nome da variável
};
console.log(fatorial(5)); // 120
// fat(5); // Erro! fat não existe fora da função

// Não sofre hoisting
// console.log(subtrair(5, 3)); // Erro! Cannot access 'subtrair' before initialization
const subtrair = function(a, b) { return a - b; };
console.log(subtrair(5, 3)); // 2


// -----------------------------------------------------------------------------
// 3. ARROW FUNCTIONS (Funções de Seta - ES6)
// -----------------------------------------------------------------------------
// Sintaxe mais concisa e não tem seu próprio 'this', 'arguments', 'super', 'new.target'

// Sintaxe básica
const quadrado = (n) => {
    return n * n;
};

// Quando há apenas um parâmetro, os parênteses são opcionais
const cubo = n => {
    return n * n * n;
};

// Quando o corpo é apenas uma expressão, {} e return são opcionais (retorno implícito)
const raizQuadrada = n => Math.sqrt(n);

// Sem parâmetros: parênteses são obrigatórios
const obterData = () => new Date();

// Retornando objeto literal: precisa envolver com ()
const criarPessoa = (nome, idade) => ({ nome, idade });
console.log(criarPessoa('Ana', 25)); // { nome: 'Ana', idade: 25 }

// Arrow function com múltiplos parâmetros
const max = (a, b) => a > b ? a : b;
console.log(max(5, 3)); // 5

// Arrow functions são ótimas como callbacks
const numeros = [1, 2, 3, 4, 5];
const dobrados = numeros.map(n => n * 2);
const pares    = numeros.filter(n => n % 2 === 0);
const soma     = numeros.reduce((acc, n) => acc + n, 0);
console.log(dobrados); // [2, 4, 6, 8, 10]
console.log(pares);    // [2, 4]
console.log(soma);     // 15

// DIFERENÇA PRINCIPAL: Arrow function não tem 'this' próprio
// Usa o 'this' do escopo léxico onde foi criada

function Contador() {
    this.contagem = 0;

    // PROBLEMA com função regular: 'this' não é o objeto Contador dentro do callback
    // setInterval(function() {
    //     this.contagem++; // 'this' é o objeto global (ou undefined em strict mode)
    // }, 1000);

    // SOLUÇÃO com arrow function: herda o 'this' do Contador
    // setInterval(() => {
    //     this.contagem++; // 'this' é o objeto Contador! Correto!
    // }, 1000);
}

// Arrow function NÃO pode ser usada como construtor
// const f = () => {};
// new f(); // Erro! TypeError: f is not a constructor

// Arrow function NÃO tem 'arguments' object
function comArgumentos() {
    console.log(arguments); // objeto Arguments com todos os args
}
comArgumentos(1, 2, 3);

const semArgumentos = () => {
    // console.log(arguments); // Erro! arguments não está definido em arrow functions
};

// Arrow function NÃO tem 'prototype'
const af = () => {};
console.log(af.prototype); // undefined (funções normais têm .prototype)


// -----------------------------------------------------------------------------
// 4. PARÂMETROS
// -----------------------------------------------------------------------------

// Parâmetros padrão (default parameters - ES6)
function cumprimentar(nome = 'Visitante', saudacao = 'Olá') {
    return `${saudacao}, ${nome}!`;
}
console.log(cumprimentar());                    // 'Olá, Visitante!'
console.log(cumprimentar('Diego'));             // 'Olá, Diego!'
console.log(cumprimentar('Diego', 'Bem-vindo')); // 'Bem-vindo, Diego!'
console.log(cumprimentar(undefined, 'Oi'));    // 'Oi, Visitante!' (undefined usa padrão)
console.log(cumprimentar(null, 'Oi'));         // 'Oi, null!' (null NÃO usa padrão)

// Parâmetros padrão podem ser expressões e referenciar parâmetros anteriores
function criarArray(tamanho = 5, valorPadrao = tamanho * 2) {
    return Array(tamanho).fill(valorPadrao);
}
console.log(criarArray());       // [10, 10, 10, 10, 10]
console.log(criarArray(3));      // [6, 6, 6]
console.log(criarArray(3, 0));   // [0, 0, 0]

// Parâmetro padrão com função
function obterTimestamp() {
    return Date.now();
}
function logar(mensagem, timestamp = obterTimestamp()) {
    console.log(`[${timestamp}] ${mensagem}`);
}

// REST PARAMETERS (...): coleta parâmetros extras em um array
function somarTudo(primeiro, segundo, ...resto) {
    // 'primeiro' e 'segundo' são os dois primeiros args
    // 'resto' é um ARRAY com os demais argumentos
    console.log('primeiro:', primeiro);
    console.log('segundo:', segundo);
    console.log('resto:', resto);
    const total = primeiro + segundo + resto.reduce((acc, n) => acc + n, 0);
    return total;
}
console.log(somarTudo(1, 2, 3, 4, 5)); // primeiro=1, segundo=2, resto=[3,4,5], total=15
console.log(somarTudo(1, 2));          // primeiro=1, segundo=2, resto=[], total=3

// Rest parameter vs arguments object
// arguments: array-like (não é array real), não funciona em arrow functions
// rest: é um array real, funciona em arrow functions, mais explícito
function comRest(...args) {
    console.log(Array.isArray(args)); // true - é um array real!
    return args.reduce((a, b) => a + b, 0);
}

// DESESTRUTURAÇÃO em parâmetros
function exibirPessoa({ nome, idade, cidade = 'Desconhecida' }) {
    console.log(`${nome}, ${idade} anos, de ${cidade}`);
}
exibirPessoa({ nome: 'Diego', idade: 25, cidade: 'SP' }); // 'Diego, 25 anos, de SP'
exibirPessoa({ nome: 'Ana', idade: 30 });                  // 'Ana, 30 anos, de Desconhecida'

function primeiroEUltimo([primeiro, ...resto]) {
    const ultimo = resto[resto.length - 1] ?? primeiro;
    return { primeiro, ultimo };
}
console.log(primeiroEUltimo([1, 2, 3, 4, 5])); // { primeiro: 1, ultimo: 5 }
console.log(primeiroEUltimo([42]));              // { primeiro: 42, ultimo: 42 }


// -----------------------------------------------------------------------------
// 5. CLOSURES
// -----------------------------------------------------------------------------
// Uma closure é uma função que "fecha sobre" o escopo léxico onde foi criada,
// mantendo acesso às variáveis desse escopo mesmo após a função externa retornar.

// Exemplo básico de closure
function criarContador() {
    let contagem = 0; // variável privada

    return {
        incrementar: () => ++contagem,
        decrementar: () => --contagem,
        obterValor: () => contagem,
        resetar:    () => { contagem = 0; }
    };
}

const contador = criarContador();
console.log(contador.incrementar()); // 1
console.log(contador.incrementar()); // 2
console.log(contador.incrementar()); // 3
console.log(contador.decrementar()); // 2
console.log(contador.obterValor());  // 2
contador.resetar();
console.log(contador.obterValor());  // 0
// contagem não é acessível diretamente! (encapsulamento via closure)
// console.log(contagem); // Erro! ReferenceError

// Closure para memorização (memoization)
function memorizar(fn) {
    const cache = new Map();

    return function(...args) {
        const chave = JSON.stringify(args);
        if (cache.has(chave)) {
            console.log(`Cache hit para ${chave}`);
            return cache.get(chave);
        }
        const resultado = fn.apply(this, args);
        cache.set(chave, resultado);
        return resultado;
    };
}

const fatorialMemo = memorizar(function fat(n) {
    if (n <= 1) return 1;
    return n * fat(n - 1);
});

console.log(fatorialMemo(5));  // Calcula: 120
console.log(fatorialMemo(5));  // Cache hit: 120 (não recalcula)
console.log(fatorialMemo(6));  // Calcula: 720

// Closure para criar funções especializadas
function criarValidador(min, max) {
    return function(valor) {
        return valor >= min && valor <= max;
    };
}

const validarIdade     = criarValidador(0, 150);
const validarPorcentagem = criarValidador(0, 100);
const validarTemperatura = criarValidador(-273.15, 10000);

console.log(validarIdade(25));         // true
console.log(validarIdade(-1));         // false
console.log(validarPorcentagem(85));   // true
console.log(validarPorcentagem(110));  // false

// PROBLEMA clássico com closure em loops (var)
console.log('Problema com var em loops:');
const funcoesVar = [];
for (var i = 0; i < 3; i++) {
    funcoesVar.push(function() { return i; }); // Captura a REFERÊNCIA de i, não o VALOR
}
// Quando executam, i já é 3 (loop terminou)
console.log(funcoesVar[0]()); // 3 (esperado: 0)
console.log(funcoesVar[1]()); // 3 (esperado: 1)
console.log(funcoesVar[2]()); // 3 (esperado: 2)

// SOLUÇÃO 1: usar let (escopo de bloco cria nova variável a cada iteração)
console.log('Solução com let:');
const funcoesLet = [];
for (let i = 0; i < 3; i++) {
    funcoesLet.push(function() { return i; }); // Cada iteração tem seu próprio 'i'
}
console.log(funcoesLet[0]()); // 0
console.log(funcoesLet[1]()); // 1
console.log(funcoesLet[2]()); // 2

// SOLUÇÃO 2: IIFE para capturar o valor (padrão pré-ES6)
console.log('Solução com IIFE:');
const funcoesIIFE = [];
for (var j = 0; j < 3; j++) {
    funcoesIIFE.push((function(valorJ) {
        return function() { return valorJ; };
    })(j)); // Passa j como argumento, captura o valor atual
}
console.log(funcoesIIFE[0]()); // 0
console.log(funcoesIIFE[1]()); // 1
console.log(funcoesIIFE[2]()); // 2


// -----------------------------------------------------------------------------
// 6. IIFE (Immediately Invoked Function Expression)
// -----------------------------------------------------------------------------
// Função que é definida e imediatamente executada
// Cria um escopo privado para evitar poluição do escopo global

// Sintaxe básica
(function() {
    const variavelPrivada = 'Não vaza para o escopo global';
    console.log('IIFE executada!', variavelPrivada);
})();

// IIFE com arrow function
(() => {
    console.log('IIFE com arrow function');
})();

// IIFE com parâmetros
(function(nome, saudacao) {
    console.log(`${saudacao}, ${nome}!`);
})('Diego', 'Olá');

// IIFE retornando valor
const resultado = (function() {
    const x = 10;
    const y = 20;
    return x + y;
})();
console.log(resultado); // 30

// Padrão módulo usando IIFE (padrão clássico pré-ES6 modules)
const moduloContaBancaria = (function() {
    // Estado privado
    let saldo = 0;
    const historico = [];

    // Interface pública
    return {
        depositar(valor) {
            if (valor <= 0) throw new Error('Valor deve ser positivo');
            saldo += valor;
            historico.push({ tipo: 'depósito', valor, saldo });
            return this; // encadeamento
        },
        sacar(valor) {
            if (valor <= 0) throw new Error('Valor deve ser positivo');
            if (valor > saldo) throw new Error('Saldo insuficiente');
            saldo -= valor;
            historico.push({ tipo: 'saque', valor, saldo });
            return this;
        },
        consultarSaldo() {
            return saldo;
        },
        extrato() {
            return [...historico]; // cópia para proteger o original
        }
    };
})();

moduloContaBancaria.depositar(1000).depositar(500).sacar(200);
console.log(moduloContaBancaria.consultarSaldo()); // 1300
console.log(moduloContaBancaria.extrato());
// [{ tipo: 'depósito', valor: 1000, saldo: 1000 }, ...]


// -----------------------------------------------------------------------------
// 7. FUNÇÕES DE ORDEM SUPERIOR (Higher-Order Functions)
// -----------------------------------------------------------------------------
// Funções que recebem e/ou retornam outras funções

// Funções que recebem funções como argumento
function aplicarDuasVezes(fn, valor) {
    return fn(fn(valor));
}
const incrementar = x => x + 1;
console.log(aplicarDuasVezes(incrementar, 5)); // 7 (5+1+1)
console.log(aplicarDuasVezes(dobrar, 3));      // 12 (3*2*2)

// Composição de funções (function composition)
const compor = (...fns) => (valor) => fns.reduceRight((acc, fn) => fn(acc), valor);
const pipe   = (...fns) => (valor) => fns.reduce((acc, fn) => fn(acc), valor);

const adicionar10  = x => x + 10;
const multiplicar2 = x => x * 2;
const subtrair5    = x => x - 5;

// compor: executa da direita para esquerda
const transformar = compor(subtrair5, multiplicar2, adicionar10);
console.log(transformar(5)); // ((5+10)*2)-5 = 25

// pipe: executa da esquerda para direita (mais intuitivo)
const transformar2 = pipe(adicionar10, multiplicar2, subtrair5);
console.log(transformar2(5)); // ((5+10)*2)-5 = 25 (mesmo resultado aqui)

// Curry: transformar função de múltiplos argumentos em cadeia de funções de um argumento
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...args2) {
            return curried.apply(this, args.concat(args2));
        };
    };
}

const somarCurried = curry((a, b, c) => a + b + c);
console.log(somarCurried(1)(2)(3));    // 6
console.log(somarCurried(1, 2)(3));    // 6
console.log(somarCurried(1)(2, 3));    // 6
console.log(somarCurried(1, 2, 3));    // 6

// Aplicação parcial (partial application)
function parcial(fn, ...argsIniciais) {
    return function(...argsRestantes) {
        return fn(...argsIniciais, ...argsRestantes);
    };
}

function saudacaoCompleta(saudacao, titulo, nome) {
    return `${saudacao}, ${titulo} ${nome}!`;
}
const olaProfessor = parcial(saudacaoCompleta, 'Olá', 'Professor');
console.log(olaProfessor('Silva'));   // 'Olá, Professor Silva!'
console.log(olaProfessor('Santos'));  // 'Olá, Professor Santos!'


// -----------------------------------------------------------------------------
// 8. RECURSÃO
// -----------------------------------------------------------------------------
// Uma função que chama a si mesma para resolver um problema
// SEMPRE precisa de um caso base para parar!

// Fibonacci recursivo (ineficiente - O(2^n))
function fibonacci(n) {
    if (n <= 0) return 0;       // Caso base 1
    if (n === 1) return 1;      // Caso base 2
    return fibonacci(n - 1) + fibonacci(n - 2); // Caso recursivo
}
console.log(fibonacci(10)); // 55

// Fibonacci com memorização (eficiente - O(n))
function fibonacciMemo(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 0) return 0;
    if (n === 1) return 1;
    memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
    return memo[n];
}
console.log(fibonacciMemo(40)); // 102334155 (rápido com memo)

// Percorrer estrutura de árvore recursivamente
const arvore = {
    valor: 1,
    filhos: [
        { valor: 2, filhos: [
            { valor: 4, filhos: [] },
            { valor: 5, filhos: [] }
        ]},
        { valor: 3, filhos: [
            { valor: 6, filhos: [] }
        ]}
    ]
};

function somarArvore(no) {
    if (!no) return 0;
    const somaFilhos = no.filhos.reduce((acc, filho) => acc + somarArvore(filho), 0);
    return no.valor + somaFilhos;
}
console.log(somarArvore(arvore)); // 1+2+3+4+5+6 = 21

// Aplanar array aninhado recursivamente
function aplanar(arr) {
    return arr.reduce((acc, item) => {
        if (Array.isArray(item)) {
            return acc.concat(aplanar(item)); // Recursivo para sub-arrays
        }
        return acc.concat(item);
    }, []);
}
console.log(aplanar([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]

// Tail call optimization (TCO): recursão de cauda (chamada recursiva é a última operação)
// JavaScript suporta TCO em strict mode (mas a maioria dos engines ainda não otimiza)
function fatorialTCO(n, acumulador = 1) {
    if (n <= 1) return acumulador;
    return fatorialTCO(n - 1, n * acumulador); // Tail call
}
console.log(fatorialTCO(10)); // 3628800


// -----------------------------------------------------------------------------
// 9. GENERATORS (Geradores - ES6)
// -----------------------------------------------------------------------------
// Funções que podem pausar e retomar a execução usando yield
// Úteis para: sequências infinitas, iteração lazy, controle de fluxo assíncrono

// Generator básico
function* gerador() {
    console.log('Antes do primeiro yield');
    yield 1; // Pausa e retorna 1
    console.log('Entre os yields');
    yield 2; // Pausa e retorna 2
    console.log('Após o último yield');
    yield 3;
    // Ao chegar aqui, retorna { value: undefined, done: true }
}

const gen = gerador();
console.log(gen.next()); // 'Antes do primeiro yield' | { value: 1, done: false }
console.log(gen.next()); // 'Entre os yields'          | { value: 2, done: false }
console.log(gen.next()); // 'Após o último yield'      | { value: 3, done: false }
console.log(gen.next()); //                             | { value: undefined, done: true }

// Generator infinito (sequência de Fibonacci)
function* fibonacciInfinito() {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// Pegar os primeiros N valores
function* take(n, iteravel) {
    let count = 0;
    for (const valor of iteravel) {
        if (count >= n) return;
        yield valor;
        count++;
    }
}

const primeiros10Fib = [...take(10, fibonacciInfinito())];
console.log(primeiros10Fib); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Passando valores para generator com next(valor)
function* calculadora() {
    let resultado = 0;
    while (true) {
        const input = yield resultado; // yield retorna E recebe valores!
        if (input === null) break;
        resultado += input;
    }
    return resultado;
}

const calc = calculadora();
calc.next();       // Inicializa (sem valor)
console.log(calc.next(5).value);   // 5  (resultado += 5)
console.log(calc.next(3).value);   // 8  (resultado += 3)
console.log(calc.next(10).value);  // 18 (resultado += 10)

// yield* delega para outro generator ou iterável
function* concatenar(gen1, gen2) {
    yield* gen1; // Itera gen1 completamente
    yield* gen2; // Então itera gen2
}

function* range(inicio, fim, passo = 1) {
    for (let i = inicio; i < fim; i += passo) {
        yield i;
    }
}

const combinado = concatenar(range(0, 3), range(10, 13));
console.log([...combinado]); // [0, 1, 2, 10, 11, 12]

// Generator para controle de IDs únicos
function* geradorId(prefixo = '') {
    let id = 1;
    while (true) {
        yield `${prefixo}${String(id++).padStart(5, '0')}`;
    }
}

const idUsuario = geradorId('USR-');
console.log(idUsuario.next().value); // 'USR-00001'
console.log(idUsuario.next().value); // 'USR-00002'
console.log(idUsuario.next().value); // 'USR-00003'


// -----------------------------------------------------------------------------
// 10. MÉTODOS DE FUNÇÃO: call, apply, bind
// -----------------------------------------------------------------------------

// O problema do 'this'
const pessoa = {
    nome: 'Diego',
    saudar: function() {
        return `Olá, eu sou ${this.nome}`;
    }
};
console.log(pessoa.saudar()); // 'Olá, eu sou Diego'

const saudar = pessoa.saudar;
// console.log(saudar()); // Em strict mode: Erro! 'this' é undefined
// Em non-strict: 'Olá, eu sou undefined' (this é window/global)

// CALL: chama a função com um 'this' específico e argumentos individuais
function apresentar(cargo, empresa) {
    return `${this.nome} é ${cargo} na ${empresa}`;
}
const dev = { nome: 'Diego' };
console.log(apresentar.call(dev, 'Desenvolvedor', 'TechCorp')); // 'Diego é Desenvolvedor na TechCorp'

// APPLY: igual ao call, mas argumentos são passados como array
const args = ['Desenvolvedor', 'TechCorp'];
console.log(apresentar.apply(dev, args)); // 'Diego é Desenvolvedor na TechCorp'

// Truque: usar apply para encontrar máximo/mínimo em array
const numeros2 = [3, 1, 4, 1, 5, 9, 2, 6];
console.log(Math.max.apply(null, numeros2)); // 9
console.log(Math.min.apply(null, numeros2)); // 1
// Hoje em dia, spread é mais limpo:
console.log(Math.max(...numeros2)); // 9

// BIND: retorna uma NOVA função com 'this' e/ou argumentos fixos
const saudarDiego = apresentar.bind(dev, 'Desenvolvedor');
console.log(saudarDiego('Google')); // 'Diego é Desenvolvedor na Google'
console.log(saudarDiego('Meta'));   // 'Diego é Desenvolvedor na Meta'

// Bind em event handlers (uso clássico)
class Botao {
    constructor(texto) {
        this.texto = texto;
        // Sem bind, 'this' dentro de onClick seria o elemento HTML, não o Botao
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        console.log(`Botão "${this.texto}" foi clicado`);
    }
}

const meuBotao = new Botao('Enviar');
meuBotao.onClick(); // 'Botão "Enviar" foi clicado'


// -----------------------------------------------------------------------------
// 11. CONTEXTO this
// -----------------------------------------------------------------------------
// 'this' em JavaScript é dinâmico e depende de COMO a função é chamada

// 1. this no objeto: refere ao objeto que chama o método
const obj = {
    valor: 42,
    obterValor() {
        return this.valor; // this = obj
    }
};
console.log(obj.obterValor()); // 42

// 2. this em função regular (fora de objeto): undefined em strict mode, global em non-strict
function funcaoRegular() {
    // Em strict mode: this === undefined
    // Em non-strict mode: this === window (browser) ou global (Node.js)
    console.log('this em função regular:', typeof this);
}
funcaoRegular();

// 3. this em construtor: refere ao novo objeto sendo criado
function Pessoa(nome, idade) {
    this.nome = nome; // this = novo objeto
    this.idade = idade;
}
const p1 = new Pessoa('Diego', 25);
console.log(p1.nome); // 'Diego'

// 4. this em arrow function: herda do escopo léxico externo
const timer = {
    segundos: 0,
    iniciar() {
        const callback = () => {
            this.segundos++; // this = timer (herdado do método iniciar)
        };
        // Simula uma iteração
        callback();
        callback();
        console.log(this.segundos); // 2
    }
};
timer.iniciar();

// 5. this com event listener (em browser):
// elemento.addEventListener('click', function() { this === elemento });
// elemento.addEventListener('click', () => { this === contexto_externo });

// globalThis: referência ao objeto global em qualquer contexto (ES2020)
console.log(globalThis === global); // true no Node.js
// console.log(globalThis === window); // true no browser


// -----------------------------------------------------------------------------
// 12. FUNÇÕES PURAS E EFEITOS COLATERAIS
// -----------------------------------------------------------------------------

// Função PURA: mesmo input, mesmo output; sem efeitos colaterais
function somarPuro(a, b) {
    return a + b; // Sempre retorna a + b, não modifica nada externo
}

// Função IMPURA: modifica estado externo ou tem efeito colateral
let total = 0;
function adicionarAoTotal(n) {
    total += n; // Modifica variável externa - EFEITO COLATERAL!
    return total;
}

// Função pura que processa array sem mutação
function adicionarItemPuro(arr, item) {
    return [...arr, item]; // Retorna NOVO array, não modifica o original
}

// Função impura que muta o array
function adicionarItemImpuro(arr, item) {
    arr.push(item); // MUTA o array original!
    return arr;
}

const original = [1, 2, 3];
const novo = adicionarItemPuro(original, 4);
console.log(original); // [1, 2, 3] (não foi modificado)
console.log(novo);     // [1, 2, 3, 4]


// -----------------------------------------------------------------------------
// 13. RECURSÃO COM TRAMPOLIM (Trampoline)
// -----------------------------------------------------------------------------
// Técnica para evitar stack overflow em recursão profunda

// Sem trampolim: pode causar stack overflow para n grande
function somaRecursiva(n, acc = 0) {
    if (n <= 0) return acc;
    return somaRecursiva(n - 1, acc + n); // Pode causar RangeError para n > ~10000
}

// Com trampolim: converte recursão em iteração
function trampolim(fn) {
    return function(...args) {
        let resultado = fn(...args);
        // Se retorna uma função, continua chamando (sem empilhar chamadas!)
        while (typeof resultado === 'function') {
            resultado = resultado();
        }
        return resultado;
    };
}

function somaTrampolin(n, acc = 0) {
    if (n <= 0) return acc;
    return () => somaTrampolin(n - 1, acc + n); // Retorna função (não chama diretamente)
}

const somarSeguro = trampolim(somaTrampolin);
console.log(somarSeguro(100));    // 5050
console.log(somarSeguro(10000));  // 50005000 (sem stack overflow!)


// -----------------------------------------------------------------------------
// 14. EXEMPLOS PRÁTICOS
// -----------------------------------------------------------------------------

// Debounce: adia a execução até que pare de ser chamado por X ms
function debounce(fn, delay) {
    let timeoutId = null;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
            timeoutId = null;
        }, delay);
    };
}

// Throttle: garante que a função execute no máximo uma vez por X ms
function throttle(fn, limite) {
    let ultimaExecucao = 0;
    return function(...args) {
        const agora = Date.now();
        if (agora - ultimaExecucao >= limite) {
            ultimaExecucao = agora;
            return fn.apply(this, args);
        }
    };
}

// Once: garante que a função execute apenas uma vez
function once(fn) {
    let executado = false;
    let resultado;
    return function(...args) {
        if (!executado) {
            executado = true;
            resultado = fn.apply(this, args);
        }
        return resultado;
    };
}

const inicializar = once(() => {
    console.log('Inicializando...');
    return 'inicializado';
});

console.log(inicializar()); // 'Inicializando...' | 'inicializado'
console.log(inicializar()); // 'inicializado' (sem executar de novo!)
console.log(inicializar()); // 'inicializado'


// =============================================================================
// FIM DO ARQUIVO 03 - FUNÇÕES
// =============================================================================
