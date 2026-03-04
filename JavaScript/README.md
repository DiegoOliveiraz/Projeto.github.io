# 📚 JavaScript — Guia Completo de Aprendizado

Este diretório contém mais de **8.400 linhas** de código JavaScript puro, com comentários detalhados explicando **como cada recurso da linguagem funciona**, do básico ao avançado.

## 📁 Estrutura dos Arquivos

| Arquivo | Conteúdo | Aprox. Linhas |
|---------|----------|--------------|
| `01-fundamentos.js` | Variáveis, tipos de dados, operadores, coerção, escopo, hoisting | ~450 |
| `02-controle-de-fluxo.js` | if/else, switch, while, do-while, for, for...in, for...of, break/continue, labels | ~370 |
| `03-funcoes.js` | Declaração, expressão, arrow, closures, IIFE, HOF, recursão, generators, call/apply/bind | ~530 |
| `04-objetos.js` | Objetos literais, protótipos, classes, herança, mixins, Proxy, Reflect | ~490 |
| `05-arrays-e-strings.js` | Todos os métodos de array e string, padrões funcionais | ~500 |
| `06-es6-moderno.js` | Destructuring, spread/rest, Map, Set, WeakMap/WeakSet, Symbol, iteradores, ES2016-2023 | ~460 |
| `07-assincrono.js` | Event loop, callbacks, Promises, async/await, padrões assíncronos | ~430 |
| `08-erros.js` | try/catch/finally, tipos de erro, erros customizados, padrão Result | ~380 |
| `09-regex.js` | Criação, flags, metacaracteres, grupos, métodos, validadores práticos | ~380 |
| `10-avancado.js` | Design patterns, programação funcional, Math, Date, JSON, Intl API | ~480 |
| `11-dom-e-eventos.js` | DOM, eventos, BOM, Web Storage, Observers | ~550 |
| `12-modulos.js` | ES Modules, CommonJS, Fetch API, performance, boas práticas | ~470 |

**Total: ~8.400 linhas de puro aprendizado**

---

## 🚀 Como Usar

### No Node.js (terminal)

```bash
# Execute qualquer arquivo individualmente
node JavaScript/01-fundamentos.js
node JavaScript/03-funcoes.js
# ... etc
```

> **Nota:** O arquivo `11-dom-e-eventos.js` é para ambiente de navegador (browser).
> Execute-o em um arquivo HTML.

### No Navegador

Crie um arquivo HTML e inclua o script:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Aprendendo JavaScript</title>
</head>
<body>
    <script src="JavaScript/01-fundamentos.js"></script>
    <!-- Abra o console do navegador (F12) para ver os resultados -->
</body>
</html>
```

---

## 📖 Ordem de Estudo Recomendada

### Iniciante
1. `01-fundamentos.js` — Conceitos básicos da linguagem
2. `02-controle-de-fluxo.js` — Estruturas de controle
3. `03-funcoes.js` — Funções (parte 1: declaração, expressão, arrow)
4. `05-arrays-e-strings.js` — Manipulação de dados

### Intermediário
5. `04-objetos.js` — Objetos e orientação a objetos
6. `06-es6-moderno.js` — Recursos modernos do JavaScript
7. `03-funcoes.js` — Funções (parte 2: closures, generators, HOF)
8. `07-assincrono.js` — Código assíncrono

### Avançado
9. `08-erros.js` — Tratamento de erros
10. `09-regex.js` — Expressões regulares
11. `10-avancado.js` — Padrões de projeto e APIs
12. `11-dom-e-eventos.js` — DOM e eventos do browser
13. `12-modulos.js` — Módulos e boas práticas

---

## 🗺️ Tópicos Cobertos

### Fundamentos
- ✅ `var`, `let`, `const` — diferenças e escopos
- ✅ Tipos primitivos: `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- ✅ Coerção de tipos (implícita e explícita)
- ✅ Operadores: aritméticos, comparação, lógicos, bitwise, ternário
- ✅ `typeof`, `instanceof`
- ✅ Valores truthy e falsy
- ✅ Nullish coalescing (`??`), optional chaining (`?.`)
- ✅ Hoisting

### Controle de Fluxo
- ✅ `if / else if / else`, guard clauses
- ✅ `switch / case` (fall-through intencional)
- ✅ `while`, `do...while`
- ✅ `for`, `for...in`, `for...of`
- ✅ `break`, `continue`, labels

### Funções
- ✅ Declarações e expressões de função
- ✅ Arrow functions e diferenças com funções regulares
- ✅ Parâmetros padrão, rest parameters, destructuring
- ✅ Closures e o problema com `var` em loops
- ✅ IIFE (Immediately Invoked Function Expression)
- ✅ Funções de ordem superior (HOF)
- ✅ Composição, curry, aplicação parcial
- ✅ Recursão, memoização, trampolim
- ✅ Generators (`function*`, `yield`, `yield*`)
- ✅ `call`, `apply`, `bind` e contexto `this`
- ✅ Debounce, throttle, once

### Objetos e OOP
- ✅ Objetos literais (shorthand, computed properties)
- ✅ Getters e setters
- ✅ Descritores de propriedade (`Object.defineProperty`)
- ✅ `Object.freeze`, `Object.seal`
- ✅ Todos os métodos estáticos do `Object`
- ✅ Cadeia de protótipos
- ✅ Classes ES6 (campos públicos e privados `#`, métodos estáticos)
- ✅ Herança com `extends` e `super`
- ✅ Mixins
- ✅ `Proxy` e `Reflect`
- ✅ Padrão de classe abstrata

### Arrays e Strings
- ✅ Todos os métodos de Array (30+)
- ✅ ES2023: `toReversed`, `toSorted`, `toSpliced`, `with`, `at`, `findLast`
- ✅ Todos os métodos de String (40+)
- ✅ Template literals e tagged templates
- ✅ Padrões: deduplicar, interseção, diferença, chunk, zip, pipeline

### ES6+ Moderno
- ✅ Destructuring de array e objeto (aninhado, renomeação, padrões)
- ✅ Spread e rest operator
- ✅ `Map` e `Set` (todos os métodos + operações de conjunto)
- ✅ `WeakMap`, `WeakSet`, `WeakRef`, `FinalizationRegistry`
- ✅ `Symbol` e well-known symbols (`iterator`, `toPrimitive`, etc.)
- ✅ Protocolo de iteração
- ✅ Recursos ES2016 até ES2023

### Assíncrono
- ✅ Event loop: microtasks vs macrotasks
- ✅ Callbacks e callback hell
- ✅ Promises (criação, encadeamento, tratamento de erro)
- ✅ `Promise.all`, `Promise.race`, `Promise.allSettled`, `Promise.any`
- ✅ `async/await`
- ✅ Async generators e `for await...of`
- ✅ `setTimeout`, `setInterval`, `queueMicrotask`
- ✅ `AbortController`
- ✅ Padrões: retry com backoff, timeout, semáforo, cache de promises

### Erros
- ✅ `try/catch/finally`, relançar erros
- ✅ Todos os tipos nativos de erro
- ✅ `Error cause` (ES2022)
- ✅ Hierarquia de erros customizados
- ✅ Tratamento centralizado de erros
- ✅ Padrão Result (alternativa funcional a exceções)

### Regex
- ✅ Todas as flags (g, i, m, s, u, d, y)
- ✅ Metacaracteres, classes de caractere, atalhos
- ✅ Quantificadores gulosos e não-gulosos
- ✅ Lookahead e lookbehind
- ✅ Grupos nomeados e referências reversas
- ✅ Validadores: email, CPF, CNPJ, telefone, URL, senha forte, etc.

### Avançado
- ✅ Design Patterns: Singleton, Observer, Factory, Decorator, Pipeline
- ✅ Programação funcional: imutabilidade, Maybe monad, transducers
- ✅ Math API (todas as funções)
- ✅ Date API
- ✅ JSON (stringify, parse, toJSON, limitações)
- ✅ Intl API (NumberFormat, DateTimeFormat, RelativeTimeFormat, ListFormat)

### DOM e Eventos (Browser)
- ✅ Seleção de elementos (moderna e clássica)
- ✅ Criação, inserção e remoção de elementos
- ✅ Atributos, `dataset`, classes, estilos
- ✅ `getBoundingClientRect`, dimensões, scroll
- ✅ `addEventListener` com todas as opções
- ✅ Bubbling, capturing, delegation
- ✅ Eventos customizados e `EventTarget`
- ✅ BOM: `window`, `navigator`, `location`, `history`
- ✅ `localStorage`, `sessionStorage`
- ✅ `IntersectionObserver`, `MutationObserver`, `ResizeObserver`

### Módulos e Organização
- ✅ ES Modules (export, import, reexport, dynamic import)
- ✅ CommonJS (require/module.exports)
- ✅ Fetch API e HTTP client
- ✅ Performance: debounce, throttle, lazy init, pool de objetos
- ✅ Boas práticas e debugging

---

## 💡 Dicas de Aprendizado

1. **Leia os comentários** — cada bloco explica o "porquê", não só o "como"
2. **Execute e experimente** — modifique os valores e veja o que acontece
3. **Use o Console do DevTools** — para testar expressões interativamente
4. **Não memorize, entenda** — a documentação (MDN) sempre estará disponível
5. **Pratique com projetos** — aplicar os conceitos é a melhor forma de aprender

---

## 📚 Recursos Adicionais

- [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) — Documentação oficial
- [JavaScript.info](https://javascript.info) — Tutorial completo e moderno
- [ECMAScript Spec](https://tc39.es/ecma262/) — Especificação oficial da linguagem
- [Can I Use](https://caniuse.com) — Compatibilidade de recursos nos browsers
- [Node.js Docs](https://nodejs.org/docs) — Documentação do Node.js
