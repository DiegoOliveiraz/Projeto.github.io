// =============================================================================
// 07 - JAVASCRIPT ASSÍNCRONO
// =============================================================================
// Este arquivo cobre:
//   - Event Loop e modelo de execução
//   - Callbacks
//   - Promises (criação, chaining, error handling)
//   - Async/Await
//   - Métodos estáticos de Promise (all, race, allSettled, any)
//   - Padrões assíncronos
//   - setTimeout, setInterval, clearTimeout, clearInterval
//   - queueMicrotask
//   - AbortController
// =============================================================================

'use strict';


// -----------------------------------------------------------------------------
// 1. EVENT LOOP E MODELO DE EXECUÇÃO
// -----------------------------------------------------------------------------
// JavaScript é single-threaded (uma thread de execução)
// O Event Loop gerencia as tarefas assíncronas

// PILHA DE CHAMADAS (Call Stack): executa código síncrono
// FILA DE TAREFAS (Task Queue / Macro-tasks): setTimeout, setInterval, I/O
// FILA DE MICROTAREFAS (Microtask Queue): Promises, queueMicrotask

// Ordem de execução:
// 1. Código síncrono (Call Stack)
// 2. Microtarefas (Promise callbacks, queueMicrotask) - toda a fila!
// 3. Uma macro-task (setTimeout/setInterval callback)
// 4. Repetir

console.log('1 - Código síncrono (começa)');

setTimeout(() => {
    console.log('3 - setTimeout (macro-task)');
}, 0); // 0ms, mas ainda é assíncrono!

Promise.resolve().then(() => {
    console.log('2 - Promise.then (microtask)');
}).then(() => {
    console.log('2b - Segunda Promise.then (microtask)');
});

queueMicrotask(() => {
    console.log('2c - queueMicrotask (microtask)');
});

console.log('1b - Código síncrono (continua)');

// Ordem de saída:
// 1 - Código síncrono (começa)
// 1b - Código síncrono (continua)
// 2 - Promise.then (microtask)
// 2b - Segunda Promise.then (microtask)
// 2c - queueMicrotask (microtask)
// 3 - setTimeout (macro-task)


// -----------------------------------------------------------------------------
// 2. CALLBACKS
// -----------------------------------------------------------------------------
// O padrão mais antigo para código assíncrono
// Problema: "callback hell" com aninhamento profundo

// Simulando operação assíncrona com callback
function buscarDados(id, callback) {
    // Simula delay de rede
    setTimeout(() => {
        if (id <= 0) {
            callback(new Error('ID inválido'), null);
            return;
        }
        const dados = { id, nome: `Item ${id}`, valor: id * 10 };
        callback(null, dados); // Convenção Node.js: (error, data)
    }, 100);
}

// Uso básico
buscarDados(1, (erro, dados) => {
    if (erro) {
        console.error('Erro:', erro.message);
        return;
    }
    console.log('Dados:', dados);
});

// CALLBACK HELL: múltiplas operações assíncronas aninhadas
function buscarUsuario(userId, cb) {
    setTimeout(() => cb(null, { id: userId, nome: 'Diego', postoId: 1 }), 50);
}

function buscarPosto(postoId, cb) {
    setTimeout(() => cb(null, { id: postoId, nome: 'Desenvolvedor Sênior' }), 50);
}

function buscarDepartamento(deptId, cb) {
    setTimeout(() => cb(null, { id: deptId, nome: 'Tecnologia' }), 50);
}

// Callback hell (pirâmide da desgraça!)
buscarUsuario(1, (err, usuario) => {
    if (err) return console.error(err);
    buscarPosto(usuario.postoId, (err, posto) => {
        if (err) return console.error(err);
        buscarDepartamento(posto.id, (err, dept) => {
            if (err) return console.error(err);
            console.log(`${usuario.nome} é ${posto.nome} em ${dept.nome}`);
            // Continua aninhando...
        });
    });
});

// Solução: extrair callbacks em funções nomeadas (melhora mas não resolve totalmente)
function aoObterUsuario(err, usuario) {
    if (err) return console.error(err);
    buscarPosto(usuario.postoId, aoObterPosto.bind(null, usuario));
}
function aoObterPosto(usuario, err, posto) {
    if (err) return console.error(err);
    console.log(`${usuario.nome} é ${posto.nome}`);
}
buscarUsuario(1, aoObterUsuario);

// Promisificação: converter função com callback para Promise
function promisificar(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (erro, resultado) => {
                if (erro) reject(erro);
                else resolve(resultado);
            });
        });
    };
}

const buscarDadosPromise = promisificar(buscarDados);
buscarDadosPromise(5).then(d => console.log('Promisificado:', d));


// -----------------------------------------------------------------------------
// 3. PROMISES
// -----------------------------------------------------------------------------
// Uma Promise representa um valor que estará disponível no futuro
// Estados: pending (pendente) → fulfilled (resolvida) ou rejected (rejeitada)

// Criando uma Promise
const promessa = new Promise((resolve, reject) => {
    // Código assíncrono aqui
    const sucesso = Math.random() > 0.5;

    setTimeout(() => {
        if (sucesso) {
            resolve({ dados: 'resultado', timestamp: Date.now() });
        } else {
            reject(new Error('Operação falhou'));
        }
    }, 100);
});

// Consumindo a Promise
promessa
    .then(resultado => {
        console.log('Sucesso:', resultado);
        return resultado.dados; // Pode retornar valor para encadear
    })
    .then(dados => {
        console.log('Dados extraídos:', dados);
    })
    .catch(erro => {
        console.error('Erro capturado:', erro.message);
    })
    .finally(() => {
        console.log('Sempre executado (sucesso ou falha)');
    });

// Promise chaining: encadeamento de operações
function delay(ms, valor) {
    return new Promise(resolve => setTimeout(() => resolve(valor), ms));
}

delay(10, 5)
    .then(n => {
        console.log('Passo 1:', n); // 5
        return delay(10, n * 2);   // Retorna nova Promise
    })
    .then(n => {
        console.log('Passo 2:', n); // 10
        return n + 3;               // Pode retornar valor direto (wrap automático)
    })
    .then(n => {
        console.log('Passo 3:', n); // 13
    });

// Criando Promises resolvidas/rejeitadas diretamente
Promise.resolve(42).then(v => console.log('Resolvida:', v));
Promise.reject(new Error('Erro')).catch(e => console.log('Rejeitada:', e.message));

// Cadeia com tratamento de erro
function parsearJSON(str) {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(str));
        } catch (e) {
            reject(new Error(`JSON inválido: ${e.message}`));
        }
    });
}

parsearJSON('{"nome": "Diego"}')
    .then(obj => obj.nome.toUpperCase())
    .then(nome => console.log('Nome:', nome)) // 'DIEGO'
    .catch(e => console.error(e));

parsearJSON('{invalid}')
    .then(obj => obj.nome)
    .catch(e => console.error('Erro:', e.message)); // 'JSON inválido: ...'

// Erro em .then() é capturado pelo próximo .catch()
Promise.resolve(1)
    .then(n => {
        throw new Error('Erro no then!');
        return n + 1;
    })
    .then(n => console.log('Nunca executa'))
    .catch(e => console.log('Capturado:', e.message)); // 'Erro no then!'

// Recuperar de erro com .catch que retorna valor
Promise.reject(new Error('Erro'))
    .catch(e => {
        console.log('Tratando erro:', e.message);
        return 'valor padrão'; // Recupera da rejeição
    })
    .then(v => console.log('Após recuperação:', v)); // 'valor padrão'


// -----------------------------------------------------------------------------
// 4. MÉTODOS ESTÁTICOS DE PROMISE
// -----------------------------------------------------------------------------

const p1 = delay(10, 'rápido');
const p2 = delay(50, 'médio');
const p3 = delay(30, 'lento');

// Promise.all: espera TODAS resolverem (falha se qualquer uma rejeitar)
Promise.all([p1, p2, p3])
    .then(valores => console.log('All:', valores))
    // ['rápido', 'médio', 'lento'] - em ordem do array, não de resolução!
    .catch(e => console.error('Alguma falhou:', e));

// Promise.race: retorna a PRIMEIRA que resolver OU rejeitar
Promise.race([
    delay(50, 'devagar'),
    delay(10, 'rápido'),
    delay(30, 'médio'),
]).then(v => console.log('Race:', v)); // 'rápido'

// Promise.allSettled: espera TODAS (independente de falha), retorna resultados
Promise.allSettled([
    Promise.resolve('sucesso 1'),
    Promise.reject(new Error('falha')),
    Promise.resolve('sucesso 2'),
]).then(resultados => {
    resultados.forEach((r, i) => {
        if (r.status === 'fulfilled') {
            console.log(`Promise ${i}: sucesso - ${r.value}`);
        } else {
            console.log(`Promise ${i}: falha - ${r.reason.message}`);
        }
    });
});

// Promise.any: resolve com a PRIMEIRA que resolver com sucesso (rejeita se todas falharem)
Promise.any([
    Promise.reject('erro 1'),
    delay(20, 'sucesso'),
    delay(10, 'também sucesso'),
]).then(v => console.log('Any:', v)); // 'também sucesso' (mais rápida)

Promise.any([
    Promise.reject('erro 1'),
    Promise.reject('erro 2'),
]).catch(e => {
    console.log('Any falhou:', e instanceof AggregateError); // true
    console.log('Erros:', e.errors); // ['erro 1', 'erro 2']
});

// Implementação manual de Promise.all (educacional)
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        const resultados = [];
        let pendentes = promises.length;

        if (pendentes === 0) {
            resolve(resultados);
            return;
        }

        promises.forEach((promise, i) => {
            Promise.resolve(promise)
                .then(valor => {
                    resultados[i] = valor;
                    pendentes--;
                    if (pendentes === 0) resolve(resultados);
                })
                .catch(reject);
        });
    });
}


// -----------------------------------------------------------------------------
// 5. ASYNC/AWAIT (ES2017)
// -----------------------------------------------------------------------------
// Açúcar sintático sobre Promises - código assíncrono com aparência síncrona
// async function sempre retorna uma Promise
// await pausa a execução da função async até a Promise resolver

// Função async básica
async function buscarUsuarioAsync(id) {
    // Simula chamada de API
    await delay(50, null); // Aguarda 50ms
    return { id, nome: 'Diego', email: 'diego@email.com' };
}

// Retorna uma Promise
const promessaUsuario = buscarUsuarioAsync(1);
console.log(promessaUsuario instanceof Promise); // true
promessaUsuario.then(u => console.log('Usuário:', u.nome));

// Consumindo com await (dentro de função async)
async function principal() {
    try {
        const usuario = await buscarUsuarioAsync(1);
        console.log('Nome:', usuario.nome);

        // Operações sequenciais (uma aguarda a outra)
        const dado1 = await delay(10, 'A');
        const dado2 = await delay(10, 'B');
        console.log('Sequencial:', dado1, dado2);

        // Operações paralelas com Promise.all (mais eficiente!)
        const [res1, res2, res3] = await Promise.all([
            delay(20, 'X'),
            delay(30, 'Y'),
            delay(10, 'Z'),
        ]);
        console.log('Paralelo:', res1, res2, res3);

    } catch (erro) {
        console.error('Erro:', erro.message);
    } finally {
        console.log('Função principal concluída');
    }
}

principal();

// Tratamento de erros com async/await
async function funcaoComErro() {
    throw new Error('Erro na função async');
}

// Com try/catch
async function chamarComTryCatch() {
    try {
        await funcaoComErro();
    } catch (e) {
        console.log('Capturado com try/catch:', e.message);
    }
}
chamarComTryCatch();

// Com .catch() no Promise retornado
funcaoComErro().catch(e => console.log('Capturado com .catch:', e.message));

// Padrão: função que pode falhar com valor padrão em caso de erro
async function tentarOuPadrao(promise, valorPadrao) {
    try {
        return await promise;
    } catch {
        return valorPadrao;
    }
}

async function exampleTentarOuPadrao() {
    const resultado = await tentarOuPadrao(
        Promise.reject(new Error('falhou')),
        'valor padrão'
    );
    console.log(resultado); // 'valor padrão'
}
exampleTentarOuPadrao();

// Async iterator e for-await-of (ES2018)
async function* gerarNumeros() {
    for (let i = 1; i <= 5; i++) {
        await delay(10, null); // Simula trabalho assíncrono
        yield i;
    }
}

async function consumirIterador() {
    for await (const num of gerarNumeros()) {
        console.log('Async iterator:', num);
    }
}
consumirIterador();

// Top-level await (ES2022) - apenas em módulos ES!
// const dados = await fetch('https://api.exemplo.com/dados');
// const json = await dados.json();
// (Fora de função async, funciona em arquivos .mjs ou com type="module")


// -----------------------------------------------------------------------------
// 6. SETTIMEOUT E SETINTERVAL
// -----------------------------------------------------------------------------

// setTimeout: executa função após um delay
const timeoutId = setTimeout(() => {
    console.log('Executado após 100ms');
}, 100);

// clearTimeout: cancela o timeout antes de executar
clearTimeout(timeoutId); // Cancelado! Não vai executar

// setTimeout com 0ms: adia para o final da fila de tasks
setTimeout(() => console.log('Fim do event loop'), 0);
console.log('Código síncrono');
// Síncrono executa primeiro!

// setInterval: executa repetidamente com intervalo
let contador2 = 0;
const intervalId = setInterval(() => {
    contador2++;
    console.log(`Intervalo #${contador2}`);
    if (contador2 >= 3) {
        clearInterval(intervalId); // Para após 3 execuções
        console.log('Intervalo parado');
    }
}, 100);

// Implementar sleep/delay com Promise
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function exemploSleep() {
    console.log('Antes do sleep');
    await sleep(50);
    console.log('Após 50ms de sleep');
    await sleep(50);
    console.log('Após mais 50ms');
}
exemploSleep();

// setInterval vs setTimeout recursivo
// setInterval pode acumular se a execução demorar mais que o intervalo
// setTimeout recursivo garante o delay entre execuções

function intervaleSeguros(callback, delay) {
    let timeoutId;

    async function executar() {
        await callback();
        timeoutId = setTimeout(executar, delay);
    }

    timeoutId = setTimeout(executar, delay);

    return {
        parar: () => clearTimeout(timeoutId)
    };
}


// -----------------------------------------------------------------------------
// 7. PADRÕES ASSÍNCRONOS AVANÇADOS
// -----------------------------------------------------------------------------

// Retry: tentar novamente em caso de falha
async function comRetry(fn, tentativas = 3, delayMs = 100) {
    for (let i = 0; i < tentativas; i++) {
        try {
            return await fn();
        } catch (erro) {
            if (i === tentativas - 1) throw erro; // Última tentativa
            console.log(`Tentativa ${i + 1} falhou, aguardando ${delayMs}ms...`);
            await sleep(delayMs);
            delayMs *= 2; // Backoff exponencial
        }
    }
}

let tentativasCount = 0;
async function operacaoInstavel() {
    tentativasCount++;
    if (tentativasCount < 3) throw new Error(`Falha na tentativa ${tentativasCount}`);
    return 'Sucesso!';
}

async function exemploRetry() {
    try {
        const resultado = await comRetry(operacaoInstavel, 5, 10);
        console.log('Resultado com retry:', resultado); // 'Sucesso!'
    } catch (e) {
        console.error('Falhou após todas as tentativas:', e.message);
    }
}
exemploRetry();

// Timeout: cancelar Promise se demorar muito
function comTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout após ${ms}ms`)), ms)
    );
    return Promise.race([promise, timeout]);
}

async function exemploTimeout() {
    try {
        const resultado = await comTimeout(delay(200, 'demorou'), 100);
        console.log(resultado);
    } catch (e) {
        console.log('Timeout:', e.message); // 'Timeout após 100ms'
    }

    try {
        const resultado = await comTimeout(delay(50, 'rápido'), 100);
        console.log('Rápido:', resultado); // 'rápido'
    } catch (e) {
        console.log('Timeout:', e.message);
    }
}
exemploTimeout();

// Semáforo: limitar concorrência
class Semaforo {
    #limite;
    #ativo = 0;
    #fila = [];

    constructor(limite) {
        this.#limite = limite;
    }

    async adquirir() {
        if (this.#ativo < this.#limite) {
            this.#ativo++;
            return;
        }
        await new Promise(resolve => this.#fila.push(resolve));
        this.#ativo++;
    }

    liberar() {
        this.#ativo--;
        if (this.#fila.length > 0) {
            const proximo = this.#fila.shift();
            proximo();
        }
    }

    async executar(fn) {
        await this.adquirir();
        try {
            return await fn();
        } finally {
            this.liberar();
        }
    }
}

// Processar no máximo 3 ao mesmo tempo
const semaforo = new Semaforo(3);
async function exemploSemaforo() {
    const tarefas = Array.from({ length: 10 }, (_, i) =>
        semaforo.executar(async () => {
            await sleep(20);
            return `Tarefa ${i} concluída`;
        })
    );
    const resultados = await Promise.all(tarefas);
    console.log('Semáforo:', resultados.length, 'tarefas concluídas');
}
exemploSemaforo();

// Debounce assíncrono
function debounceAsync(fn, delay) {
    let timeoutId = null;
    let resolverAtual = null;

    return function(...args) {
        return new Promise((resolve) => {
            clearTimeout(timeoutId);
            if (resolverAtual) resolverAtual(null);
            resolverAtual = resolve;

            timeoutId = setTimeout(async () => {
                const resultado = await fn(...args);
                resolve(resultado);
                resolverAtual = null;
            }, delay);
        });
    };
}

// Cache de Promises (evita requisições duplicadas)
function criarCachePromise(fn) {
    const cache = new Map();

    return function(...args) {
        const chave = JSON.stringify(args);

        if (cache.has(chave)) {
            return cache.get(chave); // Retorna a mesma Promise!
        }

        const promessa = fn(...args).finally(() => {
            cache.delete(chave); // Remove do cache quando resolver/rejeitar
        });

        cache.set(chave, promessa);
        return promessa;
    };
}


// -----------------------------------------------------------------------------
// 8. ABORTCONTROLLER
// -----------------------------------------------------------------------------
// Permite cancelar operações assíncronas (fetch, etc.)

async function buscarComCancelamento() {
    const controller = new AbortController();
    const { signal } = controller;

    // Cancelar após 50ms
    const timeout = setTimeout(() => {
        controller.abort(new Error('Requisição cancelada por timeout'));
    }, 50);

    // Simulação de fetch cancelável
    const busca = new Promise((resolve, reject) => {
        signal.addEventListener('abort', () => {
            reject(signal.reason || new Error('Abortado'));
        });
        // Simula resposta demorada
        setTimeout(() => resolve('dados da API'), 200);
    });

    try {
        const dados = await busca;
        clearTimeout(timeout);
        console.log('Dados recebidos:', dados);
    } catch (e) {
        clearTimeout(timeout);
        console.log('Cancelado:', e.message);
    }
}
buscarComCancelamento();

// Verificar se signal foi abortado
function operacaoCancelavel(signal) {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(new Error('Já foi cancelado antes de começar'));
            return;
        }

        const handler = () => reject(new Error('Cancelado durante execução'));
        signal.addEventListener('abort', handler, { once: true });

        setTimeout(() => {
            signal.removeEventListener('abort', handler);
            resolve('Concluído!');
        }, 100);
    });
}


// =============================================================================
// FIM DO ARQUIVO 07 - JAVASCRIPT ASSÍNCRONO
// =============================================================================
