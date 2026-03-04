// =============================================================================
// 08 - TRATAMENTO DE ERROS
// =============================================================================
// Este arquivo cobre:
//   - try/catch/finally
//   - Tipos de erro nativo do JavaScript
//   - Criação de erros customizados
//   - Erros em código assíncrono
//   - Boas práticas de tratamento de erro
// =============================================================================

'use strict';


// -----------------------------------------------------------------------------
// 1. TRY / CATCH / FINALLY
// -----------------------------------------------------------------------------

// Estrutura básica
try {
    // Código que pode lançar um erro
    const resultado = JSON.parse('{invalid json}');
    console.log(resultado); // Não executa
} catch (erro) {
    // Executado se um erro for lançado no try
    console.log('Erro capturado:', erro.message);
    console.log('Tipo:', erro.constructor.name);
} finally {
    // SEMPRE executa, independente de erro ou sucesso
    console.log('finally sempre executa');
}

// Finally com return: o return do finally sobrescreve o do try ou catch!
function exemploFinally() {
    try {
        return 'do try';
    } finally {
        return 'do finally'; // Este retorno vence!
    }
}
console.log(exemploFinally()); // 'do finally' (cuidado!)

// Capturando sem variável de binding (ES2019)
try {
    null.propriedade;
} catch { // Não precisa de (erro) se não usar a variável
    console.log('Erro capturado sem variável');
}

// Relançar erro (re-throw): capturar somente erros específicos
function dividir(a, b) {
    try {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Os argumentos devem ser números');
        }
        if (b === 0) {
            throw new RangeError('Divisão por zero não é permitida');
        }
        return a / b;
    } catch (erro) {
        if (erro instanceof TypeError) {
            console.log('Erro de tipo:', erro.message);
            return null;
        }
        // Relança erros que não sabemos tratar
        throw erro;
    }
}

console.log(dividir(10, 2));      // 5
console.log(dividir('a', 2));     // null (TypeError capturado)
try {
    dividir(10, 0); // RangeError é relançado
} catch (e) {
    console.log('RangeError relançado:', e.message);
}


// -----------------------------------------------------------------------------
// 2. TIPOS DE ERRO NATIVO
// -----------------------------------------------------------------------------

// Error: classe base para todos os erros
const erroBase = new Error('Mensagem de erro');
console.log(erroBase.name);    // 'Error'
console.log(erroBase.message); // 'Mensagem de erro'
console.log(erroBase.stack);   // Stack trace

// SyntaxError: erro de sintaxe JavaScript
try {
    eval('if ('); // Código inválido
} catch (e) {
    console.log(e instanceof SyntaxError); // true
    console.log(e.name); // 'SyntaxError'
}

// ReferenceError: variável não declarada
try {
    console.log(variavelNaoExiste);
} catch (e) {
    console.log(e instanceof ReferenceError); // true
    console.log(e.message); // 'variavelNaoExiste is not defined'
}

// TypeError: tipo errado ou operação inválida no tipo
try {
    null.propriedade; // Cannot read properties of null
} catch (e) {
    console.log(e instanceof TypeError); // true
}

try {
    const obj = {};
    obj(); // obj is not a function
} catch (e) {
    console.log(e instanceof TypeError); // true
    console.log(e.message); // 'obj is not a function'
}

// RangeError: valor fora do intervalo permitido
try {
    new Array(-1); // Tamanho negativo
} catch (e) {
    console.log(e instanceof RangeError); // true
}

try {
    (1).toFixed(200); // toFixed aceita 0-100
} catch (e) {
    console.log(e instanceof RangeError); // true
}

// Maximum call stack: recursão infinita
try {
    function infinita() { return infinita(); }
    infinita();
} catch (e) {
    console.log(e instanceof RangeError); // true
    console.log(e.message); // 'Maximum call stack size exceeded'
}

// URIError: encodeURI/decodeURI com valor inválido
try {
    decodeURIComponent('%');
} catch (e) {
    console.log(e instanceof URIError); // true
}

// EvalError: não muito comum hoje
// AggregateError: múltiplos erros (ES2021)
const aggErr = new AggregateError(
    [new Error('erro 1'), new Error('erro 2')],
    'Múltiplos erros ocorreram'
);
console.log(aggErr.message); // 'Múltiplos erros ocorreram'
console.log(aggErr.errors.length); // 2

// Propriedades do Error
const err = new Error('Teste');
console.log(err.name);    // 'Error'
console.log(err.message); // 'Teste'
console.log(typeof err.stack); // 'string'

// Error cause (ES2022): encadear erros
try {
    try {
        JSON.parse('{invalid}');
    } catch (causeError) {
        throw new Error('Falha ao processar configuração', { cause: causeError });
    }
} catch (e) {
    console.log(e.message);         // 'Falha ao processar configuração'
    console.log(e.cause.message);   // Mensagem do SyntaxError original
    console.log(e.cause instanceof SyntaxError); // true
}


// -----------------------------------------------------------------------------
// 3. ERROS CUSTOMIZADOS
// -----------------------------------------------------------------------------

// Erro personalizado básico (estendendo Error)
class AppError extends Error {
    constructor(mensagem, codigo) {
        super(mensagem);          // Chama construtor do Error
        this.name = 'AppError';   // Sobrescreve o nome
        this.codigo = codigo;

        // Necessário para instanceof funcionar corretamente no TypeScript
        // Em JavaScript puro geralmente não precisa, mas é boa prática:
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Hierarquia de erros customizados
class ValidationError extends AppError {
    constructor(campo, mensagem) {
        super(mensagem, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
        this.campo = campo;
    }
}

class DatabaseError extends AppError {
    constructor(mensagem, query) {
        super(mensagem, 'DB_ERROR');
        this.name = 'DatabaseError';
        this.query = query;
    }
}

class NetworkError extends AppError {
    constructor(mensagem, statusCode) {
        super(mensagem, 'NETWORK_ERROR');
        this.name = 'NetworkError';
        this.statusCode = statusCode;
    }
}

class NotFoundError extends NetworkError {
    constructor(recurso) {
        super(`${recurso} não encontrado`, 404);
        this.name = 'NotFoundError';
        this.recurso = recurso;
    }
}

// Usando os erros customizados
function validarIdade(idade) {
    if (typeof idade !== 'number') {
        throw new ValidationError('idade', 'Idade deve ser um número');
    }
    if (idade < 0 || idade > 150) {
        throw new ValidationError('idade', `Idade ${idade} está fora do intervalo válido (0-150)`);
    }
    return true;
}

try {
    validarIdade('vinte');
} catch (e) {
    console.log(e instanceof ValidationError); // true
    console.log(e instanceof AppError);        // true (herança)
    console.log(e instanceof Error);           // true (herança)
    console.log(e.name);    // 'ValidationError'
    console.log(e.campo);   // 'idade'
    console.log(e.codigo);  // 'VALIDATION_ERROR'
    console.log(e.message); // 'Idade deve ser um número'
}

// Manipulador centralizado de erros
function tratarErro(erro) {
    if (erro instanceof ValidationError) {
        console.log(`[Validação] Campo "${erro.campo}": ${erro.message}`);
        return { sucesso: false, tipo: 'validacao', campo: erro.campo };
    }

    if (erro instanceof NotFoundError) {
        console.log(`[404] ${erro.recurso} não encontrado`);
        return { sucesso: false, tipo: 'nao_encontrado', recurso: erro.recurso };
    }

    if (erro instanceof NetworkError) {
        console.log(`[Rede] Status ${erro.statusCode}: ${erro.message}`);
        return { sucesso: false, tipo: 'rede', status: erro.statusCode };
    }

    if (erro instanceof AppError) {
        console.log(`[App] Código ${erro.codigo}: ${erro.message}`);
        return { sucesso: false, tipo: 'app', codigo: erro.codigo };
    }

    // Erro inesperado - logar e relançar
    console.error('[CRÍTICO] Erro não tratado:', erro);
    throw erro;
}

// Testando o manipulador
console.log(tratarErro(new ValidationError('email', 'Email inválido')));
console.log(tratarErro(new NotFoundError('Usuário #123')));
console.log(tratarErro(new NetworkError('Timeout', 408)));


// -----------------------------------------------------------------------------
// 4. ERROS EM CÓDIGO ASSÍNCRONO
// -----------------------------------------------------------------------------

// Promises: erros não tratados → UnhandledPromiseRejection
// SEMPRE adicione .catch() ou use try/catch com await

// Com .catch()
function buscarDadosAsync(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new ValidationError('id', 'ID deve ser positivo'));
                return;
            }
            resolve({ id, dados: 'info' });
        }, 10);
    });
}

buscarDadosAsync(-1)
    .then(dados => console.log(dados))
    .catch(e => {
        if (e instanceof ValidationError) {
            console.log(`Validação falhou: ${e.message}`);
        } else {
            console.error('Erro inesperado:', e);
        }
    });

// Com async/await e try/catch
async function buscarEProcessar(id) {
    try {
        const dados = await buscarDadosAsync(id);
        return { sucesso: true, dados };
    } catch (e) {
        return { sucesso: false, erro: e.message };
    }
}

buscarEProcessar(5).then(r => console.log('Resultado:', r));
buscarEProcessar(-1).then(r => console.log('Resultado:', r));

// Capturar erro em Promise.all (todos rejeitam ou um falha)
async function exemploPromiseAllErro() {
    try {
        const resultados = await Promise.all([
            buscarDadosAsync(1),
            buscarDadosAsync(-1), // Este vai falhar!
            buscarDadosAsync(3),
        ]);
        console.log(resultados);
    } catch (e) {
        console.log('Promise.all falhou:', e.message);
        // Somente o PRIMEIRO erro é capturado
    }
}
exemploPromiseAllErro();

// Promise.allSettled: captura todos os erros
async function exemploAllSettled() {
    const resultados = await Promise.allSettled([
        buscarDadosAsync(1),
        buscarDadosAsync(-1),
        buscarDadosAsync(3),
    ]);

    const sucessos = resultados
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    const falhas = resultados
        .filter(r => r.status === 'rejected')
        .map(r => r.reason.message);

    console.log('Sucessos:', sucessos);
    console.log('Falhas:', falhas);
}
exemploAllSettled();

// Tratando erros de eventos (uncaughtException e unhandledRejection no Node.js)
// Em produção, estes eventos devem logar e encerrar graciosamente

if (typeof process !== 'undefined') {
    // Node.js: capturar exceções não tratadas
    process.on('uncaughtException', (erro) => {
        console.error('EXCEÇÃO NÃO CAPTURADA:', erro.message);
        // Em produção: logar, notificar, encerrar
        // process.exit(1);
    });

    // Node.js: capturar rejeições de Promise não tratadas
    process.on('unhandledRejection', (motivo, promise) => {
        console.error('PROMISE REJEITADA NÃO TRATADA:', motivo);
        // Em produção: logar, notificar, encerrar
        // process.exit(1);
    });
}

// Browser: capturar erros globais
if (typeof window !== 'undefined') {
    window.onerror = (mensagem, arquivo, linha, coluna, erro) => {
        console.error('Erro global:', { mensagem, arquivo, linha, coluna });
        return true; // Previne o erro default do browser
    };

    window.onunhandledrejection = (event) => {
        console.error('Promise rejeitada:', event.reason);
        event.preventDefault(); // Previne erro no console
    };
}


// -----------------------------------------------------------------------------
// 5. PADRÃO RESULT (alternativa a exceções)
// -----------------------------------------------------------------------------
// Em vez de lançar exceções, retornar um objeto com sucesso/erro
// Inspirado em linguagens como Rust, Go

class Result {
    #ok;
    #valor;
    #erro;

    constructor(ok, valor, erro) {
        this.#ok    = ok;
        this.#valor = valor;
        this.#erro  = erro;
        Object.freeze(this);
    }

    static ok(valor) {
        return new Result(true, valor, null);
    }

    static erro(erro) {
        return new Result(false, null, erro);
    }

    get eOk() { return this.#ok; }
    get eErro() { return !this.#ok; }
    get valor() {
        if (!this.#ok) throw new Error('Tentou acessar valor de um Result de erro');
        return this.#valor;
    }
    get erro() {
        if (this.#ok) throw new Error('Tentou acessar erro de um Result de sucesso');
        return this.#erro;
    }

    map(fn) {
        if (!this.#ok) return this;
        try {
            return Result.ok(fn(this.#valor));
        } catch (e) {
            return Result.erro(e);
        }
    }

    flatMap(fn) {
        if (!this.#ok) return this;
        try {
            return fn(this.#valor);
        } catch (e) {
            return Result.erro(e);
        }
    }

    recuperar(fn) {
        if (this.#ok) return this;
        return Result.ok(fn(this.#erro));
    }

    toString() {
        return this.#ok
            ? `Result.ok(${JSON.stringify(this.#valor)})`
            : `Result.erro(${this.#erro.message})`;
    }
}

// Funções que retornam Result em vez de lançar exceções
function parsearJSONSafe(texto) {
    try {
        return Result.ok(JSON.parse(texto));
    } catch (e) {
        return Result.erro(new Error(`JSON inválido: ${e.message}`));
    }
}

function obterPropriedade(obj, chave) {
    if (!(chave in obj)) {
        return Result.erro(new Error(`Propriedade '${chave}' não existe`));
    }
    return Result.ok(obj[chave]);
}

// Usando o padrão Result
const r1 = parsearJSONSafe('{"nome": "Diego"}');
console.log(r1.eOk);          // true
console.log(r1.valor.nome);   // 'Diego'

const r2 = parsearJSONSafe('{invalido}');
console.log(r2.eErro);        // true
console.log(r2.erro.message); // 'JSON inválido: ...'

// Encadeando operações com map/flatMap
const resultado = parsearJSONSafe('{"usuario": {"nome": "Diego", "idade": 25}}')
    .flatMap(obj => obterPropriedade(obj, 'usuario'))
    .map(usuario => `${usuario.nome} tem ${usuario.idade} anos`);

console.log(resultado.toString()); // 'Result.ok("Diego tem 25 anos")'

const resultadoErro = parsearJSONSafe('{invalido}')
    .flatMap(obj => obterPropriedade(obj, 'usuario'))
    .map(u => u.nome);

console.log(resultadoErro.toString()); // 'Result.erro(JSON inválido: ...)'


// -----------------------------------------------------------------------------
// 6. STACK TRACE E DEBUGGING
// -----------------------------------------------------------------------------

// Criar erro com stack trace personalizado
class ErroComContexto extends Error {
    constructor(mensagem, contexto = {}) {
        super(mensagem);
        this.name = 'ErroComContexto';
        this.contexto = contexto;
        this.timestamp = new Date().toISOString();
    }

    toString() {
        return `[${this.timestamp}] ${this.name}: ${this.message}\nContexto: ${JSON.stringify(this.contexto, null, 2)}\n${this.stack}`;
    }
}

// Logar erros com contexto útil
function logarErro(erro, contextoExtra = {}) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        tipo: erro.constructor.name,
        mensagem: erro.message,
        stack: erro.stack,
        ...contextoExtra,
    };

    if (erro instanceof AppError) {
        logEntry.codigo = erro.codigo;
    }

    console.error('[ERRO]', JSON.stringify(logEntry, null, 2));
}

try {
    throw new ErroComContexto('Falha ao processar pedido', {
        pedidoId: '123',
        usuario: 'diego',
        acao: 'checkout'
    });
} catch (e) {
    logarErro(e, { ambiente: 'producao' });
}


// =============================================================================
// FIM DO ARQUIVO 08 - TRATAMENTO DE ERROS
// =============================================================================
