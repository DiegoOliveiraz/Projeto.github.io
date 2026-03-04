// =============================================================================
// 04 - OBJETOS E ORIENTAÇÃO A OBJETOS
// =============================================================================
// Este arquivo cobre:
//   - Criação de objetos (literal, construtor, Object.create)
//   - Propriedades e métodos
//   - Getters e Setters
//   - Prototype e cadeia de protótipos
//   - Classes (ES6)
//   - Herança
//   - Encapsulamento (campos privados)
//   - Métodos estáticos
//   - Mixins
//   - Todos os métodos do Object
// =============================================================================

'use strict';


// -----------------------------------------------------------------------------
// 1. CRIAÇÃO DE OBJETOS
// -----------------------------------------------------------------------------

// 1a. Objeto literal (mais comum)
const pessoa = {
    nome: 'Diego',
    idade: 25,
    cidade: 'São Paulo',
    ativo: true,

    // Método (função dentro de objeto)
    saudar() {
        return `Olá, sou ${this.nome}`;
    },

    // Shorthand: quando variável tem o mesmo nome da propriedade
    // { nome: nome } pode ser escrito como { nome }
};

// Acessando propriedades
console.log(pessoa.nome);      // 'Diego' (notação de ponto)
console.log(pessoa['idade']);  // 25 (notação de colchete - útil para nomes dinâmicos)

const chave = 'cidade';
console.log(pessoa[chave]);    // 'São Paulo' (acesso com chave dinâmica)

// Adicionando propriedades
pessoa.email = 'diego@email.com';
pessoa['telefone'] = '(11) 99999-9999';

// Removendo propriedades
delete pessoa.ativo;
console.log(pessoa.ativo); // undefined

// 1b. Shorthand de propriedades (ES6)
const nome = 'Ana';
const idade = 30;
const pessoaShorthand = { nome, idade }; // Equivalente a { nome: nome, idade: idade }
console.log(pessoaShorthand);

// 1c. Propriedades computadas (ES6)
const propriedade = 'corFavorita';
const obj = {
    [propriedade]: 'azul',              // Nome da propriedade dinâmico
    [`prefixo_${propriedade}`]: 'verde' // Pode ser expressão
};
console.log(obj.corFavorita);         // 'azul'
console.log(obj.prefixo_corFavorita); // 'verde'

// 1d. Construtor de objeto (padrão clássico pré-ES6)
function Carro(marca, modelo, ano) {
    this.marca  = marca;
    this.modelo = modelo;
    this.ano    = ano;

    // Método no construtor (problema: cada instância cria sua própria cópia)
    this.toString = function() {
        return `${this.marca} ${this.modelo} (${this.ano})`;
    };
}

// Melhor: colocar métodos no prototype (compartilhado entre todas as instâncias)
Carro.prototype.descrever = function() {
    return `Carro: ${this.marca} ${this.modelo}, ano ${this.ano}`;
};

const carro1 = new Carro('Toyota', 'Corolla', 2023);
const carro2 = new Carro('Honda', 'Civic', 2022);
console.log(carro1.toString()); // 'Toyota Corolla (2023)'
console.log(carro2.descrever()); // 'Carro: Honda Civic, ano 2022'

// 1e. Object.create: cria objeto com prototype específico
const animal = {
    tipo: 'Animal',
    descrever() {
        return `Sou um ${this.tipo} chamado ${this.nome}`;
    }
};

const cachorro = Object.create(animal);
cachorro.nome = 'Rex';
cachorro.tipo = 'Cachorro';
console.log(cachorro.descrever()); // 'Sou um Cachorro chamado Rex'
console.log(Object.getPrototypeOf(cachorro) === animal); // true

// Object.create(null): objeto sem prototype (puro dicionário)
const mapa = Object.create(null);
mapa['chave'] = 'valor';
console.log(mapa.hasOwnProperty); // undefined (sem métodos herdados!)
console.log('chave' in mapa);     // true


// -----------------------------------------------------------------------------
// 2. GETTERS E SETTERS
// -----------------------------------------------------------------------------

const temperatura = {
    _celsius: 0, // Convenção: _ indica "privado" (não realmente privado)

    get fahrenheit() {
        return this._celsius * 9/5 + 32;
    },
    set fahrenheit(valor) {
        this._celsius = (valor - 32) * 5/9;
    },

    get celsius() {
        return this._celsius;
    },
    set celsius(valor) {
        if (valor < -273.15) throw new RangeError('Temperatura abaixo do zero absoluto!');
        this._celsius = valor;
    }
};

temperatura.celsius = 100;
console.log(temperatura.fahrenheit); // 212 (getter executado automaticamente)
temperatura.fahrenheit = 32;
console.log(temperatura.celsius);    // 0

// Getters e Setters em classes (na seção de classes)


// -----------------------------------------------------------------------------
// 3. DESCRITORES DE PROPRIEDADE (Property Descriptors)
// -----------------------------------------------------------------------------
// Toda propriedade tem metadados controlando seu comportamento

// Criando propriedade com descriptor completo
const contaCorrente = {};
Object.defineProperty(contaCorrente, 'saldo', {
    value: 1000,
    writable: false,      // Não pode ser alterada
    enumerable: true,     // Aparece em loops e Object.keys
    configurable: false,  // Não pode ser deletada ou redefinida
});

console.log(contaCorrente.saldo); // 1000
contaCorrente.saldo = 2000;       // Silencioso em non-strict, Erro em strict mode
console.log(contaCorrente.saldo); // 1000 (não mudou!)

// Definindo múltiplas propriedades de uma vez
const config = {};
Object.defineProperties(config, {
    host: {
        value: 'localhost',
        writable: true,
        enumerable: true,
        configurable: true,
    },
    porta: {
        value: 3000,
        writable: true,
        enumerable: true,
        configurable: true,
    }
});

// Lendo descriptor de uma propriedade
console.log(Object.getOwnPropertyDescriptor(config, 'host'));
// { value: 'localhost', writable: true, enumerable: true, configurable: true }

// Lendo todos os descriptors
console.log(Object.getOwnPropertyDescriptors(config));

// Propriedade não enumerável (oculta em iterações)
const objComOculto = { visivel: 1 };
Object.defineProperty(objComOculto, 'oculto', {
    value: 'secreto',
    enumerable: false, // Não aparece em Object.keys, for...in, JSON.stringify
    writable: true,
    configurable: true,
});
console.log(objComOculto.oculto);         // 'secreto' (acessível diretamente)
console.log(Object.keys(objComOculto));   // ['visivel'] (oculto não aparece!)
console.log(JSON.stringify(objComOculto)); // '{"visivel":1}'


// -----------------------------------------------------------------------------
// 4. SELANDO E CONGELANDO OBJETOS
// -----------------------------------------------------------------------------

// Object.freeze: torna objeto completamente imutável (shallow)
const configuracao = Object.freeze({
    ambiente: 'producao',
    debug: false,
    banco: { host: 'db.example.com' } // Objetos aninhados NÃO são frozen!
});

configuracao.ambiente = 'desenvolvimento'; // Silencioso (strict mode: erro)
configuracao.novo = 'valor';               // Silencioso
console.log(configuracao.ambiente); // 'producao' (não mudou)
configuracao.banco.host = 'hackeado.com'; // FUNCIONA! freeze é shallow
console.log(configuracao.banco.host);     // 'hackeado.com'

// Deep freeze (freeze recursivo)
function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(nome => {
        const valor = obj[nome];
        if (typeof valor === 'object' && valor !== null) {
            deepFreeze(valor);
        }
    });
    return Object.freeze(obj);
}

// Object.seal: permite modificar valores existentes, mas não adicionar/remover propriedades
const usuario = Object.seal({
    nome: 'Diego',
    idade: 25,
});
usuario.nome = 'Carlos'; // OK: modifica propriedade existente
usuario.email = 'x@y.com'; // Ignorado: não pode adicionar
delete usuario.idade;       // Ignorado: não pode remover
console.log(usuario); // { nome: 'Carlos', idade: 25 }

// Verificações
console.log(Object.isFrozen(configuracao));  // true
console.log(Object.isSealed(usuario));       // true


// -----------------------------------------------------------------------------
// 5. MÉTODOS DO OBJETO (Object static methods)
// -----------------------------------------------------------------------------

const obj1 = { a: 1, b: 2, c: 3 };

// Object.keys: retorna array com as chaves enumeráveis próprias
console.log(Object.keys(obj1));   // ['a', 'b', 'c']

// Object.values: retorna array com os valores das propriedades enumeráveis
console.log(Object.values(obj1)); // [1, 2, 3]

// Object.entries: retorna array de pares [chave, valor]
console.log(Object.entries(obj1)); // [['a', 1], ['b', 2], ['c', 3]]

// Object.fromEntries: cria objeto a partir de pares [chave, valor] (ES2019)
const pares = [['a', 1], ['b', 2], ['c', 3]];
console.log(Object.fromEntries(pares)); // { a: 1, b: 2, c: 3 }

// Transformar objetos com entries + fromEntries
const obj2 = { a: 1, b: 2, c: 3 };
const obj2Dobrado = Object.fromEntries(
    Object.entries(obj2).map(([k, v]) => [k, v * 2])
);
console.log(obj2Dobrado); // { a: 2, b: 4, c: 6 }

// Object.assign: copia propriedades enumeráveis para o objeto destino
const destino = { a: 1, b: 2 };
const origem1 = { b: 3, c: 4 }; // b sobrescreve
const origem2 = { d: 5 };
const resultado = Object.assign(destino, origem1, origem2);
console.log(destino);   // { a: 1, b: 3, c: 4, d: 5 } (modifica destino!)
console.log(resultado === destino); // true (retorna o mesmo objeto)

// Clonar objeto com assign (shallow clone)
const original = { x: 1, y: { z: 2 } };
const clone = Object.assign({}, original);
clone.x = 99;           // Não afeta original
clone.y.z = 99;         // AFETA original! (shallow copy)
console.log(original.x); // 1
console.log(original.y.z); // 99 (afetado!)

// Spread também faz shallow clone
const clone2 = { ...original };

// Deep clone (várias abordagens)
// Opção 1: JSON (limitada - não funciona com funções, undefined, Symbol, Date, etc.)
const deepClone1 = JSON.parse(JSON.stringify({ a: 1, b: [2, 3] }));

// Opção 2: structuredClone (ES2022 - mais completo)
// const deepClone2 = structuredClone(original);

// Object.hasOwn (ES2022): alternativa moderna ao hasOwnProperty
const meuObj = { prop: 42 };
console.log(Object.hasOwn(meuObj, 'prop'));     // true
console.log(Object.hasOwn(meuObj, 'toString')); // false (herdado)

// Object.getPrototypeOf / Object.setPrototypeOf
const pai = { tipo: 'pai' };
const filho = Object.create(pai);
console.log(Object.getPrototypeOf(filho) === pai); // true

// Object.is: comparação como === mas sem bugs do ===
console.log(Object.is(NaN, NaN));    // true (=== retornaria false!)
console.log(Object.is(0, -0));       // false (=== retornaria true!)
console.log(Object.is(1, 1));        // true

// Object.getOwnPropertyNames: inclui propriedades não-enumeráveis
const objComNaoEnum = {};
Object.defineProperty(objComNaoEnum, 'oculto', { value: 1, enumerable: false });
objComNaoEnum.visivel = 2;
console.log(Object.keys(objComNaoEnum));               // ['visivel']
console.log(Object.getOwnPropertyNames(objComNaoEnum)); // ['oculto', 'visivel']

// Object.getOwnPropertySymbols: retorna propriedades Symbol
const sym = Symbol('teste');
const objComSym = { [sym]: 'valor', normal: 1 };
console.log(Object.getOwnPropertySymbols(objComSym)); // [Symbol(teste)]

// Object.create com descriptor
const objCriado = Object.create(
    { herdado: true }, // prototype
    {
        propria: {
            value: 42,
            writable: true,
            enumerable: true,
            configurable: true,
        }
    }
);
console.log(objCriado.propria);  // 42
console.log(objCriado.herdado);  // true (do prototype)


// -----------------------------------------------------------------------------
// 6. PROTOTYPE E CADEIA DE PROTÓTIPOS
// -----------------------------------------------------------------------------
// JavaScript usa herança baseada em protótipos, não em classes tradicionais.
// Cada objeto tem um [[Prototype]] interno que aponta para outro objeto.

// Verificando a cadeia de protótipos
const arr = [1, 2, 3];
// arr → Array.prototype → Object.prototype → null
console.log(Object.getPrototypeOf(arr) === Array.prototype);  // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null (fim da cadeia)

// Quando você acessa uma propriedade, JavaScript a procura na cadeia de protótipos
// 1. No próprio objeto
// 2. No prototype do objeto
// 3. No prototype do prototype
// 4. Até chegar em null (propriedade não encontrada → undefined)

function Animal(nome, som) {
    this.nome = nome;
    this.som  = som;
}

Animal.prototype.falar = function() {
    return `${this.nome} diz: ${this.som}!`;
};

Animal.prototype.toString = function() {
    return `[Animal: ${this.nome}]`;
};

function Gato(nome) {
    Animal.call(this, nome, 'Miau'); // Chama construtor pai
    this.vidas = 9;
}

// Herança prototipal: Gato.prototype herda de Animal.prototype
Gato.prototype = Object.create(Animal.prototype);
Gato.prototype.constructor = Gato; // Corrige o constructor perdido

Gato.prototype.ronronar = function() {
    return `${this.nome} está ronronando...`;
};

// Sobrescrevendo método do pai
Gato.prototype.toString = function() {
    return `[Gato: ${this.nome}, ${this.vidas} vidas]`;
};

const whiskers = new Gato('Whiskers');
console.log(whiskers.falar());     // 'Whiskers diz: Miau!' (herdado de Animal)
console.log(whiskers.ronronar());  // 'Whiskers está ronronando...'
console.log(whiskers.toString());  // '[Gato: Whiskers, 9 vidas]'
console.log(whiskers instanceof Gato);   // true
console.log(whiskers instanceof Animal); // true (cadeia de herança)

// hasOwnProperty: verifica se propriedade é própria (não herdada)
console.log(whiskers.hasOwnProperty('nome'));    // true (própria)
console.log(whiskers.hasOwnProperty('falar'));   // false (herdada do prototype)
console.log(whiskers.hasOwnProperty('ronronar')); // false (herdada do prototype de Gato)


// -----------------------------------------------------------------------------
// 7. CLASSES (ES6)
// -----------------------------------------------------------------------------
// Açúcar sintático sobre a herança prototipal
// Internamente usa protótipos, mas com sintaxe mais clara

class Veiculo {
    // Campo de classe (ES2022 - class fields)
    #ligado = false;           // Campo privado (# = privado)
    #velocidade = 0;
    tipo = 'genérico';         // Campo público

    // Construtor: chamado quando se usa 'new'
    constructor(marca, modelo, ano) {
        this.marca  = marca;
        this.modelo = modelo;
        this.ano    = ano;
    }

    // Getter
    get velocidade() {
        return this.#velocidade;
    }

    // Setter com validação
    set velocidade(valor) {
        if (valor < 0) throw new RangeError('Velocidade não pode ser negativa');
        if (valor > this.velocidadeMaxima) throw new RangeError(`Velocidade máxima: ${this.velocidadeMaxima}`);
        this.#velocidade = valor;
    }

    get velocidadeMaxima() {
        return 200; // Pode ser sobrescrito em subclasses
    }

    // Método público
    ligar() {
        this.#ligado = true;
        return `${this.marca} ${this.modelo} ligado`;
    }

    desligar() {
        if (this.#velocidade > 0) return 'Reduza a velocidade primeiro!';
        this.#ligado = false;
        return `${this.marca} ${this.modelo} desligado`;
    }

    acelerar(delta) {
        if (!this.#ligado) return 'Ligue o veículo primeiro!';
        this.velocidade = Math.min(this.#velocidade + delta, this.velocidadeMaxima);
        return `Velocidade: ${this.#velocidade} km/h`;
    }

    frear(delta) {
        this.velocidade = Math.max(0, this.#velocidade - delta);
        return `Velocidade: ${this.#velocidade} km/h`;
    }

    // Método privado (ES2022)
    #validarEstado() {
        return this.#ligado && this.#velocidade >= 0;
    }

    get estaLigado() {
        return this.#ligado;
    }

    // Método estático: pertence à classe, não às instâncias
    static comparar(v1, v2) {
        if (v1.ano > v2.ano) return `${v1.marca} ${v1.modelo} é mais novo`;
        if (v1.ano < v2.ano) return `${v2.marca} ${v2.modelo} é mais novo`;
        return 'Mesmo ano';
    }

    // toString para melhor representação
    toString() {
        return `${this.marca} ${this.modelo} (${this.ano})`;
    }
}

const meuCarro = new Veiculo('Toyota', 'Camry', 2023);
console.log(meuCarro.ligar());      // 'Toyota Camry ligado'
console.log(meuCarro.acelerar(60)); // 'Velocidade: 60 km/h'
console.log(meuCarro.velocidade);   // 60 (via getter)
console.log(meuCarro.toString());   // 'Toyota Camry (2023)'
// console.log(meuCarro.#velocidade); // Erro! Propriedade privada

// HERANÇA DE CLASSES
class Moto extends Veiculo {
    #sidecar = false;

    constructor(marca, modelo, ano, cilindradas) {
        super(marca, modelo, ano); // OBRIGATÓRIO: chama construtor do pai
        this.cilindradas = cilindradas;
        this.tipo = 'moto'; // Sobrescreve campo público do pai
    }

    get velocidadeMaxima() {
        return 300; // Motos podem ser mais rápidas
    }

    adicionarSidecar() {
        this.#sidecar = true;
        return `Sidecar adicionado à ${this.marca} ${this.modelo}`;
    }

    // super.metodo() para chamar método do pai
    ligar() {
        const resultado = super.ligar();
        return resultado + ' 🏍️';
    }

    toString() {
        return `${super.toString()} - ${this.cilindradas}cc`;
    }
}

class Caminhao extends Veiculo {
    constructor(marca, modelo, ano, capacidadeToneladas) {
        super(marca, modelo, ano);
        this.capacidadeToneladas = capacidadeToneladas;
        this.tipo = 'caminhão';
    }

    get velocidadeMaxima() {
        return 120; // Caminhões são mais lentos
    }
}

const moto = new Moto('Honda', 'CBR 1000', 2023, 1000);
console.log(moto.ligar());          // 'Honda CBR 1000 ligado 🏍️'
console.log(moto.acelerar(150));    // 'Velocidade: 150 km/h'
console.log(moto.toString());       // 'Honda CBR 1000 (2023) - 1000cc'
console.log(moto instanceof Moto);    // true
console.log(moto instanceof Veiculo); // true

// Método estático da classe pai
const caminhao = new Caminhao('Volvo', 'FH', 2022, 25);
console.log(Veiculo.comparar(moto, caminhao)); // depende dos anos

// Classe abstrata (padrão - JS não tem abstract nativo)
class FormaGeometrica {
    constructor(cor = 'preto') {
        if (new.target === FormaGeometrica) {
            throw new Error('FormaGeometrica é abstrata, use uma subclasse');
        }
        this.cor = cor;
    }

    // Método abstrato: deve ser implementado pelas subclasses
    area() {
        throw new Error('Método area() deve ser implementado');
    }

    perimetro() {
        throw new Error('Método perimetro() deve ser implementado');
    }

    toString() {
        return `${this.constructor.name}: área=${this.area().toFixed(2)}, perímetro=${this.perimetro().toFixed(2)}, cor=${this.cor}`;
    }
}

class Circulo extends FormaGeometrica {
    constructor(raio, cor) {
        super(cor);
        this.raio = raio;
    }

    area() {
        return Math.PI * this.raio ** 2;
    }

    perimetro() {
        return 2 * Math.PI * this.raio;
    }
}

class Retangulo extends FormaGeometrica {
    constructor(largura, altura, cor) {
        super(cor);
        this.largura = largura;
        this.altura  = altura;
    }

    area() {
        return this.largura * this.altura;
    }

    perimetro() {
        return 2 * (this.largura + this.altura);
    }
}

class Triangulo extends FormaGeometrica {
    constructor(a, b, c, cor) {
        super(cor);
        this.a = a; this.b = b; this.c = c;
    }

    perimetro() {
        return this.a + this.b + this.c;
    }

    area() {
        // Fórmula de Heron
        const s = this.perimetro() / 2;
        return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
    }
}

const circulo   = new Circulo(5, 'azul');
const retangulo = new Retangulo(4, 6, 'vermelho');
const triangulo = new Triangulo(3, 4, 5, 'verde');

console.log(circulo.toString());   // 'Circulo: área=78.54, perímetro=31.42, cor=azul'
console.log(retangulo.toString()); // 'Retangulo: área=24.00, perímetro=20.00, cor=vermelho'
console.log(triangulo.toString()); // 'Triangulo: área=6.00, perímetro=12.00, cor=verde'

// Polimorfismo: tratar objetos de tipos diferentes de forma uniforme
const formas = [circulo, retangulo, triangulo];
const areaTotal = formas.reduce((acc, f) => acc + f.area(), 0);
console.log(`Área total: ${areaTotal.toFixed(2)}`);


// -----------------------------------------------------------------------------
// 8. MIXINS
// -----------------------------------------------------------------------------
// Padrão para compartilhar comportamento entre classes sem herança

// Definindo mixins como funções que recebem uma classe base
const SerializavelMixin = (Base) => class extends Base {
    serializar() {
        return JSON.stringify(this);
    }

    static desserializar(json) {
        return Object.assign(new this(), JSON.parse(json));
    }
};

const LogavelMixin = (Base) => class extends Base {
    #logs = [];

    logar(mensagem) {
        const entrada = { timestamp: Date.now(), mensagem };
        this.#logs.push(entrada);
        console.log(`[LOG] ${mensagem}`);
    }

    obterLogs() {
        return [...this.#logs];
    }
};

const ValidavelMixin = (Base) => class extends Base {
    #erros = [];

    get valido() {
        return this.#erros.length === 0;
    }

    get erros() {
        return [...this.#erros];
    }

    adicionarErro(erro) {
        this.#erros.push(erro);
        return this;
    }

    limparErros() {
        this.#erros = [];
        return this;
    }
};

// Aplicando múltiplos mixins
class Produto extends SerializavelMixin(LogavelMixin(ValidavelMixin(Object))) {
    constructor(nome, preco, estoque) {
        super();
        this.nome    = nome;
        this.preco   = preco;
        this.estoque = estoque;
        this.validar();
    }

    validar() {
        this.limparErros();
        if (!this.nome) this.adicionarErro('Nome é obrigatório');
        if (this.preco <= 0) this.adicionarErro('Preço deve ser positivo');
        if (this.estoque < 0) this.adicionarErro('Estoque não pode ser negativo');
        return this;
    }
}

const produto = new Produto('Notebook', 2500, 10);
produto.logar('Produto criado');
produto.logar('Preço atualizado');
console.log(produto.valido);       // true
console.log(produto.serializar()); // JSON do produto
console.log(produto.obterLogs());  // Array de logs


// -----------------------------------------------------------------------------
// 9. PATTERN MATCHING MANUAL
// -----------------------------------------------------------------------------
// JavaScript não tem pattern matching nativo (ainda), mas podemos simular

// Visitor pattern: permite "adicionar" operações a uma hierarquia de classes
class VisitorArea {
    visitarCirculo(c)    { return Math.PI * c.raio ** 2; }
    visitarRetangulo(r)  { return r.largura * r.altura; }
    visitarTriangulo(t)  {
        const s = (t.a + t.b + t.c) / 2;
        return Math.sqrt(s * (s-t.a) * (s-t.b) * (s-t.c));
    }
}

// Strategy Pattern: encapsula algoritmos intercambiáveis
class Ordenador {
    constructor(estrategia) {
        this.estrategia = estrategia;
    }

    ordenar(dados) {
        return this.estrategia(dados);
    }
}

const bubbleSort = (arr) => {
    const a = [...arr];
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];
        }
    }
    return a;
};

const nativeSort = (arr) => [...arr].sort((a, b) => a - b);

const ordenadorBubble = new Ordenador(bubbleSort);
const ordenadorNativo = new Ordenador(nativeSort);

const dados = [5, 3, 8, 1, 9, 2, 7, 4, 6];
console.log(ordenadorBubble.ordenar(dados)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(ordenadorNativo.ordenar(dados)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]


// -----------------------------------------------------------------------------
// 10. PROXY E REFLECT
// -----------------------------------------------------------------------------
// Proxy: cria um "interceptador" para operações em objetos
// Reflect: API para chamar operações internas do JS

// Exemplo: objeto com validação automática
function criarPessoaValidada(dadosIniciais = {}) {
    const validadores = {
        nome: (v) => typeof v === 'string' && v.length >= 2,
        idade: (v) => typeof v === 'number' && v >= 0 && v <= 150,
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    };

    return new Proxy(dadosIniciais, {
        get(alvo, propriedade) {
            return Reflect.get(alvo, propriedade);
        },

        set(alvo, propriedade, valor) {
            const validador = validadores[propriedade];
            if (validador && !validador(valor)) {
                throw new TypeError(`Valor inválido para '${propriedade}': ${valor}`);
            }
            return Reflect.set(alvo, propriedade, valor);
        },

        deleteProperty(alvo, propriedade) {
            if (propriedade === 'nome') {
                throw new Error('Não pode deletar o nome!');
            }
            return Reflect.deleteProperty(alvo, propriedade);
        }
    });
}

const pessoaValidada = criarPessoaValidada();
pessoaValidada.nome  = 'Diego';
pessoaValidada.idade = 25;
pessoaValidada.email = 'diego@email.com';
console.log(pessoaValidada.nome); // 'Diego'

try {
    pessoaValidada.idade = -5; // Erro!
} catch (e) {
    console.log(e.message); // 'Valor inválido para 'idade': -5'
}

// Proxy para logging de acesso
function criarLog(obj, nome = 'objeto') {
    return new Proxy(obj, {
        get(alvo, prop) {
            if (prop in alvo) {
                console.log(`[ACESSO] ${nome}.${String(prop)}`);
            }
            return Reflect.get(alvo, prop);
        },
        set(alvo, prop, valor) {
            console.log(`[ESCRITA] ${nome}.${String(prop)} = ${valor}`);
            return Reflect.set(alvo, prop, valor);
        }
    });
}

const contaLog = criarLog({ saldo: 1000 }, 'conta');
contaLog.saldo;          // [ACESSO] conta.saldo
contaLog.saldo = 2000;   // [ESCRITA] conta.saldo = 2000


// =============================================================================
// FIM DO ARQUIVO 04 - OBJETOS E ORIENTAÇÃO A OBJETOS
// =============================================================================
