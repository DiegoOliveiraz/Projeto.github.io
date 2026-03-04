// =============================================================================
// 01 - FUNDAMENTOS DO JAVASCRIPT
// =============================================================================
// Este arquivo cobre os fundamentos da linguagem JavaScript:
//   - Variáveis (var, let, const)
//   - Tipos de dados primitivos
//   - Operadores
//   - Coerção de tipos
//   - Escopo
//   - Hoisting
// =============================================================================

'use strict'; // Modo estrito: ajuda a capturar erros comuns de código


// -----------------------------------------------------------------------------
// 1. VARIÁVEIS
// -----------------------------------------------------------------------------

// VAR: escopo de função, sofre hoisting, pode ser redeclarada
var nome = 'Diego';
var nome = 'Carlos'; // OK, var permite redeclaração
console.log(nome); // 'Carlos'

// LET: escopo de bloco, sofre hoisting mas não é inicializada (TDZ), não pode ser redeclarada
let idade = 25;
// let idade = 30; // Erro! SyntaxError: Identifier 'idade' has already been declared
idade = 26; // Reatribuição é permitida
console.log(idade); // 26

// CONST: escopo de bloco, deve ser inicializada na declaração, não pode ser reatribuída
const PI = 3.14159265358979;
// PI = 3; // Erro! TypeError: Assignment to constant variable
// const Y; // Erro! SyntaxError: Missing initializer in const declaration

// CONST com objetos: a referência é constante, mas o conteúdo pode mudar
const pessoa = { nome: 'Diego', idade: 25 };
pessoa.idade = 26;    // OK: mudando propriedade do objeto
pessoa.cidade = 'SP'; // OK: adicionando propriedade
// pessoa = {};       // Erro! Não pode reatribuir a variável

// CONST com arrays: o mesmo vale para arrays
const numeros = [1, 2, 3];
numeros.push(4);  // OK: modificando o array
numeros[0] = 10; // OK: modificando elemento
// numeros = []; // Erro! Não pode reatribuir


// -----------------------------------------------------------------------------
// 2. TIPOS DE DADOS PRIMITIVOS
// -----------------------------------------------------------------------------
// JavaScript tem 7 tipos primitivos (imutáveis, passados por valor):
//   number, string, boolean, null, undefined, symbol, bigint

// NUMBER: representa números inteiros e de ponto flutuante
let inteiro   = 42;
let decimal   = 3.14;
let negativo  = -7;
let notacao   = 1.5e3;   // 1500 (notação científica)
let hex       = 0xFF;    // 255 (hexadecimal)
let octal     = 0o17;    // 15  (octal)
let binario   = 0b1010;  // 10  (binário)

// Valores especiais do tipo number
let infinito     = Infinity;
let negInfinito  = -Infinity;
let naoENumero   = NaN;       // Not a Number (resultado de operação inválida)

console.log(1 / 0);          // Infinity
console.log(-1 / 0);         // -Infinity
console.log('abc' * 2);      // NaN
console.log(NaN === NaN);    // false! NaN nunca é igual a si mesmo
console.log(isNaN(NaN));     // true
console.log(Number.isNaN(NaN)); // true (mais seguro que isNaN global)

// Limites do tipo number (ponto flutuante de 64 bits - IEEE 754)
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991
console.log(Number.MAX_VALUE);        // 1.7976931348623157e+308
console.log(Number.MIN_VALUE);        // 5e-324 (menor positivo)
console.log(Number.EPSILON);          // 2.220446049250313e-16

// Problema de precisão com ponto flutuante
console.log(0.1 + 0.2);              // 0.30000000000000004 (erro de ponto flutuante)
console.log(0.1 + 0.2 === 0.3);      // false!
// Solução: usar EPSILON ou toFixed
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true

// STRING: sequência imutável de caracteres Unicode
let str1 = 'aspas simples';
let str2 = "aspas duplas";
let str3 = `template literal`;       // Permite interpolação e multilinha
let str4 = String(123);              // Converte para string: '123'

// Template literals (ES6): interpolação de expressões com ${...}
let nomePessoa = 'Diego';
let idadePessoa = 25;
let apresentacao = `Olá, meu nome é ${nomePessoa} e tenho ${idadePessoa} anos.`;
console.log(apresentacao);

// Template literals multilinha
let poema = `Linha 1
Linha 2
Linha 3`;
console.log(poema);

// String: propriedades e métodos (cobertura completa no arquivo 05)
console.log('hello'.length);        // 5
console.log('hello'.toUpperCase()); // 'HELLO'
console.log('  hello  '.trim());    // 'hello'

// Sequências de escape em strings
let escapado = 'Ele disse: "Olá"\nNova linha\tTab';
console.log(escapado);
// \n = nova linha, \t = tab, \\ = barra invertida, \' = aspa simples,
// \" = aspa dupla, \r = retorno de carro, \0 = null character
// \uXXXX = caractere Unicode (ex: \u0041 = 'A')
console.log('\u0041\u0042\u0043'); // 'ABC'

// BOOLEAN: true ou false
let verdadeiro = true;
let falso      = false;

// UNDEFINED: variável declarada mas não inicializada
let semValor;
console.log(semValor);             // undefined
console.log(typeof semValor);      // 'undefined'

// NULL: ausência intencional de valor (deve ser atribuído explicitamente)
let valorNulo = null;
console.log(valorNulo);            // null
console.log(typeof valorNulo);     // 'object' (bug histórico do JS, não mude!)

// Diferença entre null e undefined
console.log(null == undefined);    // true  (igualdade solta)
console.log(null === undefined);   // false (igualdade estrita)

// SYMBOL (ES6): identificador único e imutável
let sym1 = Symbol('descricao');
let sym2 = Symbol('descricao');
console.log(sym1 === sym2);        // false! Cada Symbol é único
console.log(sym1.toString());      // 'Symbol(descricao)'
console.log(sym1.description);     // 'descricao'

// Symbol como chave de propriedade de objeto (não aparece em for...in ou JSON.stringify)
const chavePrivada = Symbol('private');
const obj = { [chavePrivada]: 'valor secreto', publico: 'visível' };
console.log(obj[chavePrivada]);    // 'valor secreto'
console.log(Object.keys(obj));     // ['publico'] - symbol não aparece!

// Symbol.for: cria/recupera symbol global pelo nome
let symGlobal1 = Symbol.for('app.id');
let symGlobal2 = Symbol.for('app.id');
console.log(symGlobal1 === symGlobal2); // true! Compartilhado globalmente

// BIGINT (ES2020): inteiros de precisão arbitrária
let big1 = 9007199254740991n;     // n no final indica BigInt
let big2 = BigInt(9007199254740991);
let big3 = 1000000000000000000000n; // Inteiros maiores que Number.MAX_SAFE_INTEGER
console.log(big1 + 1n);           // 9007199254740992n
// Não pode misturar BigInt com Number sem conversão explícita
// console.log(big1 + 1); // Erro! TypeError


// -----------------------------------------------------------------------------
// 3. TYPEOF OPERATOR
// -----------------------------------------------------------------------------
// typeof retorna uma string indicando o tipo da operação

console.log(typeof 42);            // 'number'
console.log(typeof 3.14);          // 'number'
console.log(typeof NaN);           // 'number' (NaN é do tipo number!)
console.log(typeof 'texto');       // 'string'
console.log(typeof true);          // 'boolean'
console.log(typeof undefined);     // 'undefined'
console.log(typeof null);          // 'object' (bug histórico!)
console.log(typeof {});            // 'object'
console.log(typeof []);            // 'object' (arrays são objetos!)
console.log(typeof function(){}); // 'function'
console.log(typeof Symbol());      // 'symbol'
console.log(typeof 42n);           // 'bigint'

// Como verificar se algo é array (já que typeof [] retorna 'object')
console.log(Array.isArray([]));    // true
console.log(Array.isArray({}));    // false

// Como verificar null de forma segura
let val = null;
console.log(val === null);         // true (melhor forma de checar null)


// -----------------------------------------------------------------------------
// 4. OPERADORES ARITMÉTICOS
// -----------------------------------------------------------------------------

console.log(10 + 3);   // 13  (adição)
console.log(10 - 3);   // 7   (subtração)
console.log(10 * 3);   // 30  (multiplicação)
console.log(10 / 3);   // 3.3333... (divisão - sempre retorna float)
console.log(10 % 3);   // 1   (resto da divisão / módulo)
console.log(10 ** 3);  // 1000 (exponenciação - ES2016)
console.log(Math.floor(10 / 3)); // 3 (divisão inteira via Math.floor)

// Operadores de incremento e decremento
let x = 5;
console.log(x++); // 5 (retorna o valor ANTES de incrementar - pós-incremento)
console.log(x);   // 6
console.log(++x); // 7 (incrementa ANTES de retornar - pré-incremento)
console.log(x--); // 7 (retorna o valor ANTES de decrementar)
console.log(x);   // 6
console.log(--x); // 5 (decrementa ANTES de retornar)

// Operador unário de negação
let y = 5;
console.log(-y);  // -5
console.log(+y);  // 5 (unário positivo, também converte para number)
console.log(+'42'); // 42 (converte string para number)
console.log(+'');   // 0
console.log(+'abc'); // NaN


// -----------------------------------------------------------------------------
// 5. OPERADORES DE COMPARAÇÃO
// -----------------------------------------------------------------------------

// Igualdade solta (==): realiza coerção de tipo antes de comparar
console.log(1 == 1);      // true
console.log(1 == '1');    // true (coerção: string '1' vira número 1)
console.log(0 == false);  // true (coerção: false vira 0)
console.log(0 == '');     // true (coerção)
console.log(null == undefined); // true (caso especial)
console.log(null == 0);   // false (null só é igual a undefined com ==)

// Igualdade estrita (===): NÃO realiza coerção de tipo - USE SEMPRE ESTE!
console.log(1 === 1);     // true
console.log(1 === '1');   // false (tipos diferentes)
console.log(0 === false); // false (tipos diferentes)
console.log(null === undefined); // false

// Desigualdade
console.log(1 != 2);      // true  (desigualdade solta)
console.log(1 !== '1');   // true  (desigualdade estrita - recomendado)

// Comparações
console.log(5 > 3);       // true
console.log(5 < 3);       // false
console.log(5 >= 5);      // true
console.log(5 <= 4);      // false

// Comparação de strings: usa ordem lexicográfica (Unicode)
console.log('a' < 'b');   // true
console.log('B' < 'a');   // true  (maiúsculas têm código menor)
console.log('10' < '9');  // true  (comparação de string, não número!)
console.log(10 < 9);      // false (comparação de número)


// -----------------------------------------------------------------------------
// 6. OPERADORES LÓGICOS
// -----------------------------------------------------------------------------

// AND (&&): retorna o primeiro valor falsy ou o último valor se todos truthy
console.log(true && true);   // true
console.log(true && false);  // false
console.log(1 && 2);         // 2 (retorna o último valor truthy)
console.log(0 && 2);         // 0 (retorna o primeiro falsy)
console.log('a' && 'b');     // 'b'
console.log('' && 'b');      // '' (string vazia é falsy)

// OR (||): retorna o primeiro valor truthy ou o último valor se todos falsy
console.log(false || true);  // true
console.log(false || false); // false
console.log(0 || 2);         // 2 (primeiro truthy)
console.log(0 || '');        // '' (último falsy)
console.log('a' || 'b');     // 'a' (primeiro truthy)

// NOT (!): inverte o valor booleano
console.log(!true);          // false
console.log(!false);         // true
console.log(!0);             // true  (0 é falsy)
console.log(!'');            // true  (string vazia é falsy)
console.log(!null);          // true
console.log(!'hello');       // false (string não-vazia é truthy)

// Dupla negação (!!) converte para boolean explicitamente
console.log(!!0);            // false
console.log(!!'hello');      // true
console.log(!!null);         // false
console.log(!!undefined);    // false

// NULLISH COALESCING (??): retorna o lado direito APENAS se o esquerdo for null ou undefined
// Diferente de ||, que retorna o lado direito para QUALQUER valor falsy
let config = null;
console.log(config ?? 'padrão');  // 'padrão' (config é null)
let contagem = 0;
console.log(contagem ?? 10);      // 0 (0 não é null/undefined, diferente de ||)
console.log(contagem || 10);      // 10 (0 é falsy, então || usa o lado direito)

// OPTIONAL CHAINING (?.): acessa propriedades sem lançar erro se for null/undefined
let usuario = null;
console.log(usuario?.nome);           // undefined (sem erro!)
console.log(usuario?.endereco?.rua);  // undefined (sem erro!)
let user2 = { nome: 'Diego', endereco: { rua: 'Av. Brasil' } };
console.log(user2?.nome);             // 'Diego'
console.log(user2?.endereco?.rua);    // 'Av. Brasil'
console.log(user2?.telefone?.ddd);    // undefined

// Optional chaining com métodos e arrays
let arr = null;
console.log(arr?.length);     // undefined
console.log(arr?.[0]);        // undefined
let obj2 = { metodo: () => 42 };
console.log(obj2.metodo?.());  // 42
console.log(obj2.inexistente?.()); // undefined


// -----------------------------------------------------------------------------
// 7. OPERADORES DE ATRIBUIÇÃO
// -----------------------------------------------------------------------------

let a = 10;
a += 5;   // a = a + 5  => 15
a -= 3;   // a = a - 3  => 12
a *= 2;   // a = a * 2  => 24
a /= 4;   // a = a / 4  => 6
a %= 4;   // a = a % 4  => 2
a **= 3;  // a = a ** 3 => 8

// Logical assignment (ES2021)
let b = null;
b ??= 'padrão';    // b = b ?? 'padrão' => 'padrão' (atribui se null/undefined)
console.log(b);    // 'padrão'

let c = 0;
c ||= 42;          // c = c || 42 => 42 (atribui se falsy)
console.log(c);    // 42

let d = 1;
d &&= 100;         // d = d && 100 => 100 (atribui se truthy)
console.log(d);    // 100


// -----------------------------------------------------------------------------
// 8. OPERADORES BIT A BIT (Bitwise)
// -----------------------------------------------------------------------------
// Operam em representação binária de 32 bits (inteiros com sinal)

console.log(5 & 3);   // 1  (AND bit a bit:  0101 & 0011 = 0001)
console.log(5 | 3);   // 7  (OR bit a bit:   0101 | 0011 = 0111)
console.log(5 ^ 3);   // 6  (XOR bit a bit:  0101 ^ 0011 = 0110)
console.log(~5);      // -6 (NOT bit a bit:  inverte todos os bits)
console.log(5 << 1);  // 10 (shift left:     0101 << 1 = 1010)
console.log(5 >> 1);  // 2  (shift right:    0101 >> 1 = 0010)
console.log(-1 >>> 0); // 4294967295 (unsigned shift right)

// Uso prático: verificar se número é par/ímpar
const ehPar   = (n) => (n & 1) === 0;
const ehImpar = (n) => (n & 1) === 1;
console.log(ehPar(4));    // true
console.log(ehImpar(7));  // true

// Uso prático: truncar número para inteiro (mais rápido que Math.floor para positivos)
console.log(3.9 | 0);    // 3
console.log(-3.9 | 0);   // -3 (cuidado: não é o mesmo que Math.floor para negativos)


// -----------------------------------------------------------------------------
// 9. OPERADOR TERNÁRIO
// -----------------------------------------------------------------------------
// Sintaxe: condição ? valorSeVerdadeiro : valorSeFalso

let numero = 10;
let tipo = numero % 2 === 0 ? 'par' : 'ímpar';
console.log(tipo); // 'par'

// Ternários aninhados (use com moderação, pode dificultar leitura)
let nota = 85;
let conceito = nota >= 90 ? 'A' :
               nota >= 80 ? 'B' :
               nota >= 70 ? 'C' :
               nota >= 60 ? 'D' : 'F';
console.log(conceito); // 'B'


// -----------------------------------------------------------------------------
// 10. COERÇÃO DE TIPOS (Type Coercion)
// -----------------------------------------------------------------------------
// JavaScript converte tipos automaticamente em muitas operações

// String concatenação vs adição numérica
console.log('5' + 3);     // '53' (number vira string, concatena)
console.log('5' - 3);     // 2    (string '5' vira number 5, subtrai)
console.log('5' * '3');   // 15   (ambas viram numbers)
console.log('5' / '2');   // 2.5  (ambas viram numbers)
console.log(true + 1);    // 2    (true vira 1)
console.log(false + 1);   // 1    (false vira 0)
console.log(null + 1);    // 1    (null vira 0)
console.log(undefined + 1); // NaN (undefined vira NaN)
console.log('' + 1);      // '1'  (string concatena)
console.log([] + []);     // ''   (ambos viram string '')
console.log({} + []);     // '[object Object]' ou 0 (depende do contexto!)

// Valores truthy e falsy
// Falsy: false, 0, -0, 0n, '', "", ``, null, undefined, NaN
// Todos os outros são truthy (incluindo '0', 'false', [], {}, function(){})
const valoresFalsy = [false, 0, -0, 0n, '', null, undefined, NaN];
const valoresTruthy = [true, 1, -1, 'a', ' ', '0', 'false', [], {}, function(){}];
valoresFalsy.forEach(v  => console.log(`${String(v)} é falsy: ${!v}`));
valoresTruthy.forEach(v => console.log(`${String(v)} é truthy: ${!!v}`));

// Conversão explícita de tipos
console.log(Number('42'));      // 42
console.log(Number(''));        // 0
console.log(Number(' '));       // 0
console.log(Number('3.14'));    // 3.14
console.log(Number('abc'));     // NaN
console.log(Number(true));      // 1
console.log(Number(false));     // 0
console.log(Number(null));      // 0
console.log(Number(undefined)); // NaN
console.log(Number([]));        // 0
console.log(Number([3]));       // 3

console.log(parseInt('42px'));     // 42 (para no primeiro char inválido)
console.log(parseInt('px42'));     // NaN (começa com char inválido)
console.log(parseInt('10', 2));    // 2 (interpreta '10' em base 2 = binário)
console.log(parseInt('ff', 16));   // 255 (base 16 = hexadecimal)
console.log(parseFloat('3.14abc')); // 3.14

console.log(String(42));        // '42'
console.log(String(true));      // 'true'
console.log(String(null));      // 'null'
console.log(String(undefined)); // 'undefined'
console.log(String([]));        // ''
console.log(String([1,2,3]));   // '1,2,3'

console.log(Boolean(0));        // false
console.log(Boolean(''));       // false
console.log(Boolean(null));     // false
console.log(Boolean(1));        // true
console.log(Boolean('a'));      // true


// -----------------------------------------------------------------------------
// 11. ESCOPO (Scope)
// -----------------------------------------------------------------------------
// Escopo determina onde variáveis são acessíveis

// Escopo global: variável acessível em todo o programa
var globalVar = 'global';

function exemploEscopo() {
    // Escopo de função: variável só existe dentro da função
    var funcVar = 'função';
    let blockVar = 'bloco de função';

    if (true) {
        // Escopo de bloco: let e const só existem dentro do {}
        var varNoBloco = 'var ignora bloco';  // sobe para escopo de função
        let letNoBloco = 'let respeita bloco';
        const constNoBloco = 'const respeita bloco';
        console.log(varNoBloco);   // ok
        console.log(letNoBloco);   // ok
        console.log(constNoBloco); // ok
    }

    console.log(varNoBloco);   // 'var ignora bloco' (var vazou do bloco!)
    // console.log(letNoBloco);   // Erro! ReferenceError
    // console.log(constNoBloco); // Erro! ReferenceError

    console.log(globalVar); // 'global' (acessa escopo externo)
}

exemploEscopo();
// console.log(funcVar); // Erro! ReferenceError: funcVar is not defined


// -----------------------------------------------------------------------------
// 12. HOISTING
// -----------------------------------------------------------------------------
// JavaScript move declarações para o topo do seu escopo durante a compilação

// Hoisting de var: declaração é movida, mas NÃO a inicialização
console.log(hoistedVar); // undefined (não lança erro, mas ainda não tem valor)
var hoistedVar = 'valor';
console.log(hoistedVar); // 'valor'

// O código acima é equivalente a:
// var hoistedVar;
// console.log(hoistedVar); // undefined
// hoistedVar = 'valor';
// console.log(hoistedVar); // 'valor'

// Hoisting de let e const: declaração é movida mas NÃO é inicializada
// A variável existe em uma "Temporal Dead Zone" (TDZ) até a linha de declaração
// console.log(hoistedLet); // Erro! ReferenceError: Cannot access before initialization
let hoistedLet = 'valor';

// Hoisting de funções: funções declaradas são completamente hoisted (declaração + corpo)
console.log(somarHoisted(2, 3)); // 5 (funciona antes da declaração!)
function somarHoisted(a, b) {
    return a + b;
}

// Funções expressão (var) têm somente a declaração hoisted, não a função em si
// console.log(multiplicar(2, 3)); // Erro! multiplicar is not a function
var multiplicar = function(a, b) { return a * b; };


// -----------------------------------------------------------------------------
// 13. OPERADOR SPREAD E REST (prévia - detalhado no arquivo 06)
// -----------------------------------------------------------------------------

// Spread (...): expande iterável em elementos individuais
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let combinado = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
console.log(combinado);

let spreadObj1 = { a: 1, b: 2 };
let spreadObj2 = { c: 3, d: 4 };
let objCombinado = { ...spreadObj1, ...spreadObj2 }; // { a: 1, b: 2, c: 3, d: 4 }
console.log(objCombinado);

// Rest (...): coleta argumentos restantes em um array
function soma(...numeros) { // rest parameter
    return numeros.reduce((acc, n) => acc + n, 0);
}
console.log(soma(1, 2, 3, 4, 5)); // 15


// -----------------------------------------------------------------------------
// 14. OPERADOR VÍRGULA
// -----------------------------------------------------------------------------
// Avalia múltiplas expressões e retorna o valor da última

let resultado = (1 + 2, 3 + 4, 5 + 6);
console.log(resultado); // 11 (valor da última expressão)

// Uso em loop for com múltiplas variáveis
for (let i = 0, j = 10; i < 5; i++, j--) {
    // i vai de 0 a 4, j vai de 10 a 6
}


// -----------------------------------------------------------------------------
// 15. IN e INSTANCEOF
// -----------------------------------------------------------------------------

// in: verifica se propriedade existe em um objeto
const carro = { marca: 'Toyota', modelo: 'Corolla', ano: 2023 };
console.log('marca' in carro);      // true
console.log('preco' in carro);      // false
console.log('toString' in carro);   // true (herdada do prototype!)

// in também funciona com arrays (verifica índices)
const frutas = ['maçã', 'banana', 'laranja'];
console.log(0 in frutas);           // true (índice 0 existe)
console.log(5 in frutas);           // false (índice 5 não existe)

// instanceof: verifica se objeto é instância de uma classe/construtor
class Animal {}
class Cachorro extends Animal {}
const rex = new Cachorro();
console.log(rex instanceof Cachorro); // true
console.log(rex instanceof Animal);   // true (herança)
console.log(rex instanceof Object);   // true (tudo é Object)
console.log([] instanceof Array);     // true
console.log([] instanceof Object);    // true
console.log({} instanceof Object);    // true

// Verificação mais confiável: Object.prototype.toString
const verificarTipo = (val) => Object.prototype.toString.call(val);
console.log(verificarTipo(42));        // '[object Number]'
console.log(verificarTipo('texto'));   // '[object String]'
console.log(verificarTipo([]));        // '[object Array]'
console.log(verificarTipo({}));        // '[object Object]'
console.log(verificarTipo(null));      // '[object Null]'
console.log(verificarTipo(undefined)); // '[object Undefined]'
console.log(verificarTipo(() => {}));  // '[object Function]'


// -----------------------------------------------------------------------------
// 16. PRECEDÊNCIA DE OPERADORES (da maior para menor prioridade)
// -----------------------------------------------------------------------------
// 1. () - Agrupamento
// 2. . [] () - Membro/Chamada
// 3. new - Criação de instância
// 4. ++ -- - Pós-incremento/decremento
// 5. ! ~ + - ++ -- typeof void delete - Unários
// 6. ** - Exponenciação
// 7. * / % - Multiplicação/Divisão/Módulo
// 8. + - - Adição/Subtração
// 9. << >> >>> - Shift
// 10. < <= > >= in instanceof - Relacional
// 11. == != === !== - Igualdade
// 12. & - AND bit
// 13. ^ - XOR bit
// 14. | - OR bit
// 15. && - AND lógico
// 16. || ?? - OR lógico / Nullish
// 17. ?: - Ternário
// 18. = += -= etc. - Atribuição
// 19. , - Vírgula

// Exemplo de precedência
console.log(2 + 3 * 4);       // 14 (multiplicação primeiro)
console.log((2 + 3) * 4);     // 20 (parênteses primeiro)
console.log(2 ** 3 ** 2);     // 512 (exponenciação é associativa à direita: 3**2=9, 2**9=512)
console.log(true || false && false); // true (&& tem maior prioridade que ||)


// -----------------------------------------------------------------------------
// FIM DO ARQUIVO 01 - FUNDAMENTOS
// =============================================================================
