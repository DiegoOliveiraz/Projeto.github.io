// =============================================================================
// 10 - JAVASCRIPT AVANÇADO: PADRÕES E TÉCNICAS
// =============================================================================
// Este arquivo cobre:
//   - Design Patterns (Padrões de Projeto)
//   - Programação Funcional em JavaScript
//   - Metaprogramação (Proxy, Reflect, Symbol)
//   - Módulos (ES Modules e CommonJS)
//   - Web APIs (Math, Date, JSON, URL, URLSearchParams)
//   - Internacionalização (Intl)
//   - Performance e otimizações
// =============================================================================

'use strict';


// =============================================================================
// PARTE 1: DESIGN PATTERNS
// =============================================================================

// -----------------------------------------------------------------------------
// 1. SINGLETON
// -----------------------------------------------------------------------------
// Garante que apenas uma instância da classe seja criada

class ConfiguracaoApp {
    static #instancia = null;

    #config = {
        tema: 'claro',
        idioma: 'pt-BR',
        debug: false,
    };

    constructor() {
        if (ConfiguracaoApp.#instancia) {
            return ConfiguracaoApp.#instancia;
        }
        ConfiguracaoApp.#instancia = this;
    }

    static obterInstancia() {
        if (!ConfiguracaoApp.#instancia) {
            new ConfiguracaoApp();
        }
        return ConfiguracaoApp.#instancia;
    }

    obter(chave) {
        return this.#config[chave];
    }

    definir(chave, valor) {
        this.#config[chave] = valor;
        return this;
    }
}

const config1 = ConfiguracaoApp.obterInstancia();
const config2 = ConfiguracaoApp.obterInstancia();
console.log(config1 === config2); // true (mesma instância)

config1.definir('tema', 'escuro');
console.log(config2.obter('tema')); // 'escuro' (mesma instância!)


// -----------------------------------------------------------------------------
// 2. OBSERVER (Pub/Sub)
// -----------------------------------------------------------------------------
// Permite que objetos "observem" e sejam notificados de eventos

class EventEmitter {
    #ouvintes = new Map();

    on(evento, callback) {
        if (!this.#ouvintes.has(evento)) {
            this.#ouvintes.set(evento, new Set());
        }
        this.#ouvintes.get(evento).add(callback);
        return () => this.off(evento, callback); // Retorna função para remover
    }

    off(evento, callback) {
        this.#ouvintes.get(evento)?.delete(callback);
    }

    once(evento, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(evento, wrapper);
        };
        return this.on(evento, wrapper);
    }

    emit(evento, ...args) {
        this.#ouvintes.get(evento)?.forEach(cb => cb(...args));
    }

    removeAll(evento) {
        if (evento) {
            this.#ouvintes.delete(evento);
        } else {
            this.#ouvintes.clear();
        }
    }
}

// Usando o EventEmitter
const emitter = new EventEmitter();

const remover = emitter.on('dados', (dados) => {
    console.log('Ouvinte 1:', dados);
});

emitter.on('dados', (dados) => {
    console.log('Ouvinte 2:', dados.nome);
});

emitter.once('conectado', () => {
    console.log('Conectado! (só executa uma vez)');
});

emitter.emit('dados', { nome: 'Diego', idade: 25 });
emitter.emit('conectado');
emitter.emit('conectado'); // Não executa (once)

remover(); // Remove o ouvinte 1
emitter.emit('dados', { nome: 'Ana', idade: 30 }); // Só ouvinte 2 recebe


// -----------------------------------------------------------------------------
// 3. FACTORY
// -----------------------------------------------------------------------------
// Cria objetos sem especificar a classe exata

class BotaoBase {
    render() { throw new Error('Implemente render()'); }
}

class BotaoWeb extends BotaoBase {
    constructor({ texto, cor }) {
        super();
        this.texto = texto;
        this.cor   = cor;
    }
    render() {
        return `<button style="color:${this.cor}">${this.texto}</button>`;
    }
}

class BotaoMobile extends BotaoBase {
    constructor({ texto, cor }) {
        super();
        this.texto = texto;
        this.cor   = cor;
    }
    render() {
        return `[Mobile Button: ${this.texto} (${this.cor})]`;
    }
}

// Factory: decide qual classe instanciar
function criarBotao(plataforma, opcoes) {
    const botoes = {
        web:    BotaoWeb,
        mobile: BotaoMobile,
    };
    const Botao = botoes[plataforma];
    if (!Botao) throw new Error(`Plataforma '${plataforma}' não suportada`);
    return new Botao(opcoes);
}

const botaoWeb    = criarBotao('web',    { texto: 'Clique', cor: 'azul' });
const botaoMobile = criarBotao('mobile', { texto: 'Toque',  cor: 'verde' });
console.log(botaoWeb.render());    // '<button style="color:azul">Clique</button>'
console.log(botaoMobile.render()); // '[Mobile Button: Toque (verde)]'


// -----------------------------------------------------------------------------
// 4. DECORATOR
// -----------------------------------------------------------------------------
// Adiciona funcionalidade a uma função/objeto sem modificá-lo

// Decorador de tempo de execução
function medirTempo(fn, nome = fn.name) {
    return function(...args) {
        const inicio = performance.now();
        const resultado = fn.apply(this, args);
        const fim = performance.now();
        console.log(`${nome} levou ${(fim - inicio).toFixed(3)}ms`);
        return resultado;
    };
}

// Decorador de cache (memoization)
function memoizar(fn) {
    const cache = new Map();
    const wrapped = function(...args) {
        const chave = JSON.stringify(args);
        if (cache.has(chave)) return cache.get(chave);
        const resultado = fn.apply(this, args);
        cache.set(chave, resultado);
        return resultado;
    };
    wrapped.limparCache = () => cache.clear();
    wrapped.tamanhoCache = () => cache.size;
    return wrapped;
}

// Decorador de validação de argumentos
function validarArgs(...validadores) {
    return function(fn) {
        return function(...args) {
            args.forEach((arg, i) => {
                if (validadores[i] && !validadores[i](arg)) {
                    throw new TypeError(`Argumento ${i} inválido: ${arg}`);
                }
            });
            return fn.apply(this, args);
        };
    };
}

// Combinando decoradores
function calcularFibonacci(n) {
    if (n <= 1) return n;
    return calcularFibonacci(n - 1) + calcularFibonacci(n - 2);
}

const fibMemo = memoizar(calcularFibonacci);
const fibMedido = medirTempo(fibMemo, 'fibonacci');

console.log(fibMedido(35)); // Rápido com memoização
console.log(fibMemo.tamanhoCache()); // 36


// -----------------------------------------------------------------------------
// 5. CHAIN OF RESPONSIBILITY (Builder/Pipeline)
// -----------------------------------------------------------------------------
// Passa pedido por cadeia de handlers

class Pipeline {
    #handlers = [];

    use(handler) {
        this.#handlers.push(handler);
        return this; // Permite encadeamento
    }

    async executar(contexto) {
        const executarHandler = async (index, ctx) => {
            if (index >= this.#handlers.length) return ctx;
            const handler = this.#handlers[index];
            return handler(ctx, () => executarHandler(index + 1, ctx));
        };
        return executarHandler(0, contexto);
    }
}

// Usando o pipeline para validação e transformação
const pipeline = new Pipeline()
    .use(async (ctx, next) => {
        console.log('Handler 1: Validando...');
        if (!ctx.nome) throw new Error('Nome obrigatório');
        return next();
    })
    .use(async (ctx, next) => {
        console.log('Handler 2: Transformando...');
        ctx.nome = ctx.nome.toUpperCase();
        return next();
    })
    .use(async (ctx, next) => {
        console.log('Handler 3: Salvando...');
        ctx.salvo = true;
        return next();
    });

pipeline.executar({ nome: 'diego' })
    .then(ctx => console.log('Resultado:', ctx));


// =============================================================================
// PARTE 2: PROGRAMAÇÃO FUNCIONAL
// =============================================================================

// -----------------------------------------------------------------------------
// 6. FUNÇÕES PURAS E IMUTABILIDADE
// -----------------------------------------------------------------------------

// Imutabilidade com objetos
function atualizarUsuario(usuario, atualizacoes) {
    return Object.freeze({ ...usuario, ...atualizacoes });
}

const usuario = Object.freeze({ nome: 'Diego', idade: 25, cidade: 'SP' });
const usuarioAtualizado = atualizarUsuario(usuario, { idade: 26 });
console.log(usuario.idade);          // 25 (original não mudou)
console.log(usuarioAtualizado.idade); // 26

// Atualização profunda imutável
function atualizarProfundo(obj, caminho, valor) {
    const chaves = caminho.split('.');
    if (chaves.length === 1) {
        return { ...obj, [chaves[0]]: valor };
    }
    return {
        ...obj,
        [chaves[0]]: atualizarProfundo(
            obj[chaves[0]] || {},
            chaves.slice(1).join('.'),
            valor
        )
    };
}

const estado = {
    usuario: { nome: 'Diego', configuracoes: { tema: 'claro' } }
};
const novoEstado = atualizarProfundo(estado, 'usuario.configuracoes.tema', 'escuro');
console.log(estado.usuario.configuracoes.tema);      // 'claro' (imutável)
console.log(novoEstado.usuario.configuracoes.tema);  // 'escuro'


// -----------------------------------------------------------------------------
// 7. FUNCTORS E MONADS (conceitos funcionais)
// -----------------------------------------------------------------------------

// Maybe Monad: lida com null/undefined de forma funcional
class Maybe {
    #valor;

    constructor(valor) {
        this.#valor = valor;
    }

    static of(valor) {
        return new Maybe(valor);
    }

    static vazio() {
        return new Maybe(null);
    }

    get eVazio() {
        return this.#valor === null || this.#valor === undefined;
    }

    get valor() {
        return this.#valor;
    }

    map(fn) {
        if (this.eVazio) return Maybe.vazio();
        return Maybe.of(fn(this.#valor));
    }

    flatMap(fn) {
        if (this.eVazio) return Maybe.vazio();
        return fn(this.#valor);
    }

    getOrElse(padrao) {
        return this.eVazio ? padrao : this.#valor;
    }

    filter(predicado) {
        if (this.eVazio) return this;
        return predicado(this.#valor) ? this : Maybe.vazio();
    }

    toString() {
        return this.eVazio ? 'Maybe(vazio)' : `Maybe(${JSON.stringify(this.#valor)})`;
    }
}

// Usando Maybe para operações seguras sem null checks
const obterUsuario = (id) =>
    id > 0 ? Maybe.of({ id, nome: 'Diego', enderecoId: 1 }) : Maybe.vazio();

const obterEndereco = (id) =>
    id > 0 ? Maybe.of({ id, cidade: 'São Paulo', rua: 'Av. Brasil' }) : Maybe.vazio();

// Encadeando sem verificar null
const cidadeUsuario = obterUsuario(1)
    .flatMap(u => obterEndereco(u.enderecoId))
    .map(e => e.cidade)
    .getOrElse('Cidade desconhecida');

console.log(cidadeUsuario); // 'São Paulo'

const cidadeInexistente = obterUsuario(-1)
    .flatMap(u => obterEndereco(u.enderecoId))
    .map(e => e.cidade)
    .getOrElse('Cidade desconhecida');

console.log(cidadeInexistente); // 'Cidade desconhecida'


// -----------------------------------------------------------------------------
// 8. TRANSDUCERS (transformações compostas eficientes)
// -----------------------------------------------------------------------------
// Transducers permitem compor map/filter sem criar arrays intermediários

const map = fn => reducer => (acc, item) => reducer(acc, fn(item));
const filter = pred => reducer => (acc, item) => pred(item) ? reducer(acc, item) : acc;
const take = n => reducer => {
    let count = 0;
    return (acc, item) => {
        if (count < n) {
            count++;
            return reducer(acc, item);
        }
        return acc;
    };
};

const compor = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// Combinando transducers (sem arrays intermediários!)
const transducer = compor(
    filter(n => n % 2 === 0),  // Só pares
    map(n => n * n),            // Elevar ao quadrado
    take(3)                     // Pegar apenas 3
);

const juntar = transducer((acc, x) => [...acc, x]);

const dados = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const resultado = dados.reduce(juntar, []);
console.log(resultado); // [4, 16, 36] (primeiros 3 pares elevados ao quadrado)

// Versão equivalente com métodos normais (cria arrays intermediários):
// dados.filter(n => n % 2 === 0).map(n => n * n).slice(0, 3)


// =============================================================================
// PARTE 3: WEB APIS E UTILIDADES
// =============================================================================

// -----------------------------------------------------------------------------
// 9. OBJETO MATH
// -----------------------------------------------------------------------------

// Constantes
console.log(Math.PI);    // 3.141592653589793
console.log(Math.E);     // 2.718281828459045
console.log(Math.LN2);   // 0.6931471805599453
console.log(Math.LN10);  // 2.302585092994046
console.log(Math.SQRT2); // 1.4142135623730951

// Arredondamento
console.log(Math.round(4.5));  // 5  (arredonda para o mais próximo)
console.log(Math.round(4.4));  // 4
console.log(Math.ceil(4.1));   // 5  (arredonda para cima)
console.log(Math.floor(4.9));  // 4  (arredonda para baixo)
console.log(Math.trunc(4.9));  // 4  (remove decimal, sem arredondamento)
console.log(Math.trunc(-4.9)); // -4 (diferente de floor para negativos!)
console.log(Math.floor(-4.9)); // -5

// Exponencial e logaritmo
console.log(Math.sqrt(16));    // 4   (raiz quadrada)
console.log(Math.cbrt(27));    // 3   (raiz cúbica)
console.log(Math.pow(2, 10));  // 1024 (2^10)
console.log(Math.exp(1));      // ~2.718 (e^1)
console.log(Math.log(Math.E)); // 1   (logaritmo natural)
console.log(Math.log2(8));     // 3   (log base 2)
console.log(Math.log10(1000)); // 3   (log base 10)
console.log(Math.hypot(3, 4)); // 5   (hipotenusa)
console.log(Math.hypot(1, 1, 1)); // ~1.732 (norma 3D)

// Trigonometria (argumentos em radianos)
console.log(Math.sin(Math.PI / 2)); // 1
console.log(Math.cos(0));           // 1
console.log(Math.tan(Math.PI / 4)); // ~1
console.log(Math.asin(1));          // ~1.5707 (arcoseno)
console.log(Math.acos(1));          // 0
console.log(Math.atan(1));          // ~0.7854
console.log(Math.atan2(1, 1));      // ~0.7854 (atan com dois argumentos)

// Converter graus para radianos e vice-versa
const grausParaRad = graus => graus * Math.PI / 180;
const radParaGraus = rad => rad * 180 / Math.PI;
console.log(grausParaRad(90));    // ~1.5707 (π/2)
console.log(radParaGraus(Math.PI)); // 180

// Outros
console.log(Math.abs(-5));        // 5   (valor absoluto)
console.log(Math.sign(-3));       // -1  (sinal: -1, 0, ou 1)
console.log(Math.sign(0));        // 0
console.log(Math.sign(5));        // 1
console.log(Math.max(3, 1, 4, 1, 5, 9)); // 9
console.log(Math.min(3, 1, 4, 1, 5, 9)); // 1
console.log(Math.max(...[3, 1, 4, 1, 5, 9])); // 9 (com spread)

// Números aleatórios
console.log(Math.random());         // [0, 1) - float aleatório
console.log(Math.floor(Math.random() * 10));     // [0, 9] - inteiro aleatório
console.log(Math.floor(Math.random() * 6) + 1);  // [1, 6] - dado
// Aleatório no intervalo [min, max] inclusive:
const aleatorioEntre = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
console.log(aleatorioEntre(10, 20)); // Entre 10 e 20

// fround: arredondamento para precisão de 32 bits
console.log(Math.fround(1.337)); // 1.3370000123977661 (32-bit float)

// clz32: contar zeros à esquerda em representação 32-bit
console.log(Math.clz32(1));  // 31
console.log(Math.clz32(2));  // 30

// imul: multiplicação inteira de 32 bits
console.log(Math.imul(3, 4)); // 12


// -----------------------------------------------------------------------------
// 10. OBJETO DATE
// -----------------------------------------------------------------------------

// Criação
const agora     = new Date();             // Data/hora atual
const dataEspecifica = new Date('2023-12-25');      // ISO 8601
const porParametros  = new Date(2023, 11, 25);      // Ano, mês(0-based), dia
const porTimestamp   = new Date(0);                 // Epoch (1 Jan 1970 00:00:00 UTC)
const porMs          = new Date(1703465400000);      // Por milissegundos desde epoch

console.log(agora.toISOString());     // '2023-12-25T12:00:00.000Z'
console.log(agora.toLocaleDateString('pt-BR')); // '25/12/2023'
console.log(agora.toLocaleTimeString('pt-BR')); // '12:00:00'
console.log(agora.toLocaleString('pt-BR'));      // '25/12/2023 12:00:00'

// Obter componentes da data
console.log(agora.getFullYear());   // 2023 (ano com 4 dígitos)
console.log(agora.getMonth());      // 0-11 (0=Janeiro, 11=Dezembro!)
console.log(agora.getDate());       // 1-31 (dia do mês)
console.log(agora.getDay());        // 0-6 (0=Domingo, 6=Sábado)
console.log(agora.getHours());      // 0-23
console.log(agora.getMinutes());    // 0-59
console.log(agora.getSeconds());    // 0-59
console.log(agora.getMilliseconds()); // 0-999
console.log(agora.getTime());       // Milissegundos desde epoch
console.log(Date.now());            // Milissegundos desde epoch (mais rápido)

// UTC equivalents
console.log(agora.getUTCFullYear()); // Ano em UTC
console.log(agora.getUTCMonth());    // Mês em UTC

// Definir componentes
const data = new Date('2023-01-15');
data.setFullYear(2024);
data.setMonth(5); // Junho (0-based)
data.setDate(20);
console.log(data.toLocaleDateString('pt-BR')); // '20/06/2024'

// Comparar datas (com timestamp)
const data1 = new Date('2023-01-01');
const data2 = new Date('2023-12-31');
console.log(data1 < data2);           // true
console.log(data2 - data1);           // Milissegundos de diferença

// Calcular diferença em dias
function diferencaDias(d1, d2) {
    const ms = Math.abs(d2 - d1);
    return Math.floor(ms / (1000 * 60 * 60 * 24));
}
console.log(diferencaDias(new Date('2023-01-01'), new Date('2023-12-31'))); // 364

// Adicionar dias
function adicionarDias(data, dias) {
    const resultado = new Date(data);
    resultado.setDate(resultado.getDate() + dias);
    return resultado;
}
console.log(adicionarDias(new Date('2023-12-25'), 7).toLocaleDateString('pt-BR'));

// Formatar data manualmente
function formatarData(data, formato) {
    const pad = (n) => String(n).padStart(2, '0');
    return formato
        .replace('YYYY', data.getFullYear())
        .replace('MM', pad(data.getMonth() + 1))
        .replace('DD', pad(data.getDate()))
        .replace('HH', pad(data.getHours()))
        .replace('mm', pad(data.getMinutes()))
        .replace('ss', pad(data.getSeconds()));
}
console.log(formatarData(new Date(), 'DD/MM/YYYY HH:mm:ss'));

// performance.now(): tempo de alta resolução (para benchmark)
const inicio = performance.now();
for (let i = 0; i < 1000000; i++) {} // Loop de teste
const fim = performance.now();
console.log(`Loop levou ${(fim - inicio).toFixed(3)}ms`);


// -----------------------------------------------------------------------------
// 11. JSON
// -----------------------------------------------------------------------------

// JSON.stringify: converte para string JSON
const obj = {
    nome: 'Diego',
    idade: 25,
    hobbies: ['ler', 'programar'],
    endereco: { cidade: 'SP', estado: 'SP' }
};

const json = JSON.stringify(obj);
console.log(json);
// '{"nome":"Diego","idade":25,"hobbies":["ler","programar"],...}'

// Com indentação
const jsonFormatado = JSON.stringify(obj, null, 2);
console.log(jsonFormatado);

// Com replacer (filtrando propriedades)
const jsonFiltrado = JSON.stringify(obj, ['nome', 'idade']);
console.log(jsonFiltrado); // Só inclui nome e idade

// Com replacer como função
const jsonTransformado = JSON.stringify(obj, (chave, valor) => {
    if (typeof valor === 'string') return valor.toUpperCase();
    return valor;
});
console.log(jsonTransformado);

// JSON.parse: converte string JSON para objeto
const objRestaurado = JSON.parse(json);
console.log(objRestaurado.nome); // 'Diego'

// Com reviver (transformando valores na leitura)
const jsonComData = JSON.stringify({ data: new Date().toISOString(), valor: 42 });
const objComData = JSON.parse(jsonComData, (chave, valor) => {
    // Convertendo strings ISO de volta para Date
    if (chave === 'data') return new Date(valor);
    return valor;
});
console.log(objComData.data instanceof Date); // true

// toJSON: personaliza a serialização
class Produto {
    constructor(nome, preco, estoque) {
        this.nome    = nome;
        this.preco   = preco;
        this.estoque = estoque;
    }

    toJSON() {
        // Pode omitir dados sensíveis ou formatar
        return {
            nome:  this.nome,
            preco: `R$ ${this.preco.toFixed(2)}`, // Formata preço
            // estoque não é incluído (dado interno)
        };
    }
}

const produto = new Produto('Notebook', 2500.50, 10);
console.log(JSON.stringify(produto)); // {"nome":"Notebook","preco":"R$ 2500.50"}

// Limitações do JSON:
// - Não suporta: undefined, functions, Symbols, Date (vira string), Set, Map
// - Referências circulares causam erro
// - BigInt não suportado

// Demonstração de limitações
const limitacoes = {
    funcao:    function() {},           // undefined (omitido)
    simbolo:   Symbol('s'),             // undefined (omitido)
    indefinido: undefined,              // undefined (omitido)
    data:      new Date(),              // string ISO (perde o tipo!)
    nan:       NaN,                     // null
    infinito:  Infinity,                // null
};
console.log(JSON.stringify(limitacoes));

// Deep clone via JSON (com limitações)
const objOriginal = { a: 1, b: [2, 3], c: { d: 4 } };
const objClone = JSON.parse(JSON.stringify(objOriginal));
objClone.b[0] = 99;
console.log(objOriginal.b[0]); // 2 (deep copy!)


// -----------------------------------------------------------------------------
// 12. INTERNACIONALIZAÇÃO (Intl API)
// -----------------------------------------------------------------------------

// Intl.NumberFormat: formatar números
const formatarMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});
console.log(formatarMoeda.format(1234567.89)); // 'R$ 1.234.567,89'

const formatarNumero = new Intl.NumberFormat('pt-BR');
console.log(formatarNumero.format(1234567.89)); // '1.234.567,89'

const formatarPercent = new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
});
console.log(formatarPercent.format(0.1234)); // '12,3%'

// Múltiplas moedas
const moedas = ['USD', 'EUR', 'JPY', 'BRL'];
moedas.forEach(moeda => {
    const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda });
    console.log(fmt.format(1000));
});

// Intl.DateTimeFormat: formatar datas
const dataIntl = new Date('2023-12-25T12:00:00');

const fmtData = new Intl.DateTimeFormat('pt-BR');
console.log(fmtData.format(dataIntl)); // '25/12/2023'

const fmtDataHora = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
});
console.log(fmtDataHora.format(dataIntl)); // '25 de dezembro de 2023 às 12:00'

// Intl.RelativeTimeFormat: tempo relativo
const relativo = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' });
console.log(relativo.format(-1, 'day'));    // 'ontem'
console.log(relativo.format(1, 'day'));     // 'amanhã'
console.log(relativo.format(-3, 'month')); // 'há 3 meses'
console.log(relativo.format(2, 'week'));   // 'em 2 semanas'

// Intl.Collator: comparação de strings respeitando idioma
const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });
const palavras = ['São Paulo', 'são paulo', 'SAO PAULO', 'sao paulo'];
palavras.sort(collator.compare);
console.log(palavras); // Ordenados semanticamente

// Intl.PluralRules: regras de plural
const plural = new Intl.PluralRules('pt-BR');
const regra = plural.select(1); // 'one'
console.log(regra);
console.log(plural.select(0));  // 'other'
console.log(plural.select(2));  // 'other'

function pluralizar(quantidade, singular, plural_) {
    const regra = new Intl.PluralRules('pt-BR').select(quantidade);
    return `${quantidade} ${regra === 'one' ? singular : plural_}`;
}
console.log(pluralizar(1, 'item', 'itens'));   // '1 item'
console.log(pluralizar(5, 'item', 'itens'));   // '5 itens'

// Intl.ListFormat: formatar listas
const listaFmt = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
console.log(listaFmt.format(['Ana', 'Bruno', 'Carlos']));
// 'Ana, Bruno e Carlos'

const listaOu = new Intl.ListFormat('pt-BR', { style: 'short', type: 'disjunction' });
console.log(listaOu.format(['maçã', 'banana', 'laranja']));
// 'maçã, banana ou laranja'

// Intl.Segmenter: dividir texto em segmentos (ES2022)
if (typeof Intl.Segmenter !== 'undefined') {
    const segmenter = new Intl.Segmenter('pt-BR', { granularity: 'word' });
    const segmentos = segmenter.segment('Olá, mundo!');
    for (const { segment, isWordLike } of segmentos) {
        if (isWordLike) console.log(segment); // 'Olá', 'mundo'
    }
}


// =============================================================================
// FIM DO ARQUIVO 10 - JAVASCRIPT AVANÇADO
// =============================================================================
