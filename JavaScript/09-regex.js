// =============================================================================
// 09 - EXPRESSÕES REGULARES (REGEX)
// =============================================================================
// Este arquivo cobre:
//   - Criação de regex
//   - Flags
//   - Caracteres especiais e metacaracteres
//   - Grupos e capturas
//   - Métodos de string com regex
//   - Métodos de RegExp
//   - Exemplos práticos de validação
// =============================================================================

'use strict';


// -----------------------------------------------------------------------------
// 1. CRIAÇÃO DE REGEX
// -----------------------------------------------------------------------------

// Literal (recomendado para padrões conhecidos)
const regex1 = /hello/;

// Construtor RegExp (para padrões dinâmicos)
const padrao = 'hello';
const regex2 = new RegExp(padrao);
const regex3 = new RegExp(padrao, 'gi'); // Com flags

// Testando correspondência básica
console.log(regex1.test('hello world')); // true
console.log(regex1.test('Hello world')); // false (case sensitive por padrão)


// -----------------------------------------------------------------------------
// 2. FLAGS (modificadores)
// -----------------------------------------------------------------------------

// g - global: encontra TODAS as correspondências (não só a primeira)
const regexG = /a/g;
console.log('banana'.match(regexG)); // ['a', 'a', 'a']

// i - case insensitive: ignora maiúsculas/minúsculas
const regexI = /hello/i;
console.log(regexI.test('Hello'));   // true
console.log(regexI.test('HELLO'));   // true

// m - multiline: ^ e $ correspondem ao início/fim de CADA LINHA
const texto = 'linha1\nlinha2\nlinha3';
console.log(texto.match(/^\w+/g));  // null (^ = início do string sem m)
console.log(texto.match(/^\w+/gm)); // ['linha1', 'linha2', 'linha3']

// s - dotAll: . corresponde a qualquer caractere INCLUDING newlines (ES2018)
console.log(/a.b/.test('a\nb'));   // false (. não pega \n por padrão)
console.log(/a.b/s.test('a\nb')); // true (com flag s)

// u - unicode: suporte completo a Unicode (ES2015)
console.log(/😀/.test('😀')); // true
console.log(/\u{1F600}/u.test('😀')); // true (com flag u, suporta \u{...})

// v - unicodeSets (ES2024): modo aprimorado de Unicode
// const regexV = /[\p{Emoji}]/v;

// d - hasIndices: inclui índices de cada match (ES2022)
const regexD = /(?<ano>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/d;
const match = regexD.exec('2023-12-25');
if (match) {
    console.log(match.indices.groups.ano); // [0, 4]
    console.log(match.indices.groups.mes); // [5, 7]
}

// y - sticky: só procura na posição exata (lastIndex)
const regexY = /\d+/y;
regexY.lastIndex = 4;
console.log(regexY.exec('abc 123 def')); // ['123']
regexY.lastIndex = 0;
console.log(regexY.exec('abc 123 def')); // null (não começa com dígito)


// -----------------------------------------------------------------------------
// 3. METACARACTERES E CLASSES DE CARACTERE
// -----------------------------------------------------------------------------

// . : qualquer caractere exceto newline (com /s pega newline também)
console.log(/a.c/.test('abc'));  // true
console.log(/a.c/.test('a_c'));  // true
console.log(/a.c/.test('ac'));   // false

// ^ : início da string (ou linha com /m)
console.log(/^hello/.test('hello world'));  // true
console.log(/^hello/.test('say hello'));    // false

// $ : fim da string (ou linha com /m)
console.log(/world$/.test('hello world')); // true
console.log(/world$/.test('world hello')); // false

// * : 0 ou mais repetições
console.log(/ab*c/.test('ac'));    // true (b aparece 0x)
console.log(/ab*c/.test('abc'));   // true (b aparece 1x)
console.log(/ab*c/.test('abbbc')); // true (b aparece 3x)

// + : 1 ou mais repetições
console.log(/ab+c/.test('ac'));    // false (b deve aparecer >= 1x)
console.log(/ab+c/.test('abc'));   // true
console.log(/ab+c/.test('abbbc')); // true

// ? : 0 ou 1 repetição (torna opcional)
console.log(/colou?rs/.test('color'));   // true
console.log(/colou?rs/.test('colours')); // true (u é opcional)

// {n} : exatamente n repetições
console.log(/a{3}/.test('aaa'));   // true
console.log(/a{3}/.test('aa'));    // false

// {n,} : no mínimo n repetições
console.log(/a{2,}/.test('aa'));    // true
console.log(/a{2,}/.test('aaaa')); // true

// {n,m} : entre n e m repetições
console.log(/a{2,4}/.test('a'));     // false
console.log(/a{2,4}/.test('aa'));    // true
console.log(/a{2,4}/.test('aaaa')); // true
console.log(/a{2,4}/.test('aaaaa')); // true (encontra 'aaaa' dentro)

// Classes de caractere [ ]
console.log(/[aeiou]/.test('hello'));  // true (qualquer vogal)
console.log(/[^aeiou]/.test('hello')); // true (qualquer NÃO-vogal)
console.log(/[a-z]/.test('A'));        // false (somente minúsculas)
console.log(/[a-zA-Z]/.test('A'));     // true (minúsculas E maiúsculas)
console.log(/[0-9]/.test('5'));        // true (dígitos)
console.log(/[a-zA-Z0-9_]/.test('_')); // true

// Atalhos de classe
// \d : dígito [0-9]
// \D : não-dígito [^0-9]
// \w : word char [a-zA-Z0-9_]
// \W : não-word char [^a-zA-Z0-9_]
// \s : whitespace [ \t\n\r\f\v]
// \S : não-whitespace [^ \t\n\r\f\v]
// \b : word boundary
// \B : não word boundary

console.log(/\d+/.test('abc123'));   // true
console.log(/^\d+$/.test('12345')); // true (só dígitos)
console.log(/^\d+$/.test('123a5')); // false

// \b - word boundary
console.log(/\bcat\b/.test('cat'));       // true
console.log(/\bcat\b/.test('catfish'));   // false ('cat' não termina em boundary)
console.log(/\bcat\b/.test('the cat')); // true

// Categorias Unicode com \p{...} (requer flag u)
const regexUnicode = /\p{L}+/gu; // Qualquer letra Unicode
console.log('Hello Olá 你好'.match(regexUnicode)); // ['Hello', 'Olá', '你好']

const regexNum = /\p{N}+/gu; // Qualquer número Unicode
console.log('1 ² ③'.match(regexNum)); // ['1', '²', '③']


// -----------------------------------------------------------------------------
// 4. ÂNCORAS E LOOKAHEAD/LOOKBEHIND
// -----------------------------------------------------------------------------

// Lookahead positivo (?=...): verifica o que vem A SEGUIR sem capturar
// Encontra 'Java' somente quando seguido de 'Script'
console.log(/Java(?=Script)/.test('JavaScript')); // true
console.log(/Java(?=Script)/.test('Java SE'));    // false

// Extrair versões somente de pacotes específicos
const texto2 = 'node@18 react@18.2 vue@3';
const versoesNode = texto2.match(/\d+(?:\.\d+)*(?=\s|$)/g);
console.log(versoesNode); // ['18', '18.2', '3']

// Lookahead negativo (?!...): verifica o que NÃO vem a seguir
console.log(/Java(?!Script)/.test('Java SE'));     // true
console.log(/Java(?!Script)/.test('JavaScript'));  // false

// Lookbehind positivo (?<=...): verifica o que vem ANTES sem capturar (ES2018)
console.log(/(?<=\$)\d+/.exec('preço: $50'))?.[0]; // '50' (só o número)

// Lookbehind negativo (?<!...): o que NÃO vem antes (ES2018)
const str = 'arquivo.jpg arquivo.png arquivo.gif';
const naoGif = str.match(/\w+\.(?<!gif$)\w{3}/g);
// Complexo com lookbehind... melhor usar filter
const extensoes = str.match(/\w+\.\w+/g)?.filter(f => !f.endsWith('.gif'));
console.log(extensoes); // ['arquivo.jpg', 'arquivo.png']


// -----------------------------------------------------------------------------
// 5. GRUPOS E CAPTURAS
// -----------------------------------------------------------------------------

// Grupo de captura (): captura parte do match
const dataRegex = /(\d{4})-(\d{2})-(\d{2})/;
const matchData = '2023-12-25'.match(dataRegex);
console.log(matchData[0]); // '2023-12-25' (match completo)
console.log(matchData[1]); // '2023' (grupo 1)
console.log(matchData[2]); // '12' (grupo 2)
console.log(matchData[3]); // '25' (grupo 3)

// Grupo de captura nomeado (?<nome>...)
const dataRegexNomeada = /(?<ano>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/;
const matchNomeado = '2023-12-25'.match(dataRegexNomeada);
console.log(matchNomeado.groups.ano); // '2023'
console.log(matchNomeado.groups.mes); // '12'
console.log(matchNomeado.groups.dia); // '25'

// Substituição com grupos nomeados
const dataReformatada = '2023-12-25'.replace(
    /(?<ano>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/,
    '$<dia>/$<mes>/$<ano>'
);
console.log(dataReformatada); // '25/12/2023'

// Grupo não-capturante (?:...): agrupa sem capturar
const urlRegex = /(?:https?|ftp):\/\/[\w.]+/;
console.log(urlRegex.test('https://google.com')); // true
console.log(urlRegex.test('ftp://arquivo.txt'));  // true

// Referência reversa \1, \2... (back-reference)
// Encontra palavras duplicadas consecutivas
const dupl = /\b(\w+)\s+\1\b/i;
console.log(dupl.test('the the'));    // true
console.log(dupl.test('hello hello')); // true
console.log(dupl.test('hello world')); // false

// Encontrar tags HTML emparelhadas
const tagRegex = /<(\w+)>(.*?)<\/\1>/;
const htmlMatch = '<p>Parágrafo</p>'.match(tagRegex);
console.log(htmlMatch?.[1]); // 'p'
console.log(htmlMatch?.[2]); // 'Parágrafo'

// Alternância |
console.log(/cat|dog/.test('I have a cat'));  // true
console.log(/cat|dog/.test('I have a dog'));  // true
console.log(/cat|dog/.test('I have a fish')); // false

// Quantificadores gulosos vs. não-gulosos
const html2 = '<b>texto</b><i>italico</i>';
console.log(html2.match(/<.+>/)[0]);   // '<b>texto</b><i>italico</i>' (guloso)
console.log(html2.match(/<.+?>/)[0]);  // '<b>' (não-guloso com ?)


// -----------------------------------------------------------------------------
// 6. MÉTODOS DE STRING COM REGEX
// -----------------------------------------------------------------------------

const texto3 = 'JavaScript é uma linguagem de programação. JavaScript é versátil!';

// test: verifica se há correspondência
console.log(/JavaScript/i.test(texto3)); // true

// match: retorna array com correspondências
// Sem flag g: retorna primeiro match com grupos
const m1 = texto3.match(/(\w+) é/);
console.log(m1[0]); // 'JavaScript é'
console.log(m1[1]); // 'JavaScript'
console.log(m1.index); // 0

// Com flag g: retorna todos os matches (sem grupos)
const m2 = texto3.match(/\b\w{4}\b/g);
console.log(m2); // Palavras de exatamente 4 letras

// matchAll: retorna todos os matches com grupos (ES2020)
const iterator = texto3.matchAll(/(\w+) é (\w+)/g);
for (const match of iterator) {
    console.log(`Match: "${match[0]}", grupos: "${match[1]}", "${match[2]}"`);
}

// search: retorna índice do primeiro match
console.log(texto3.search(/linguagem/)); // índice
console.log(texto3.search(/Python/));    // -1

// replace: substitui correspondências
console.log(texto3.replace(/JavaScript/g, 'JS'));
// 'JS é uma linguagem de programação. JS é versátil!'

// replace com função callback
const formatado = texto3.replace(/(\w+)/g, (match) => {
    return match.length > 5 ? `[${match}]` : match;
});
console.log(formatado); // Palavras longas entre colchetes

// replaceAll: substitui TODAS as ocorrências sem flag g
console.log(texto3.replaceAll('JavaScript', 'TypeScript'));

// split com regex
const partes = 'um, dois;  três    quatro'.split(/[,;\s]+/);
console.log(partes); // ['um', 'dois', 'três', 'quatro']

// split com grupo de captura: mantém o separador
const comSeparador = 'a1b2c3'.split(/(\d)/);
console.log(comSeparador); // ['a', '1', 'b', '2', 'c', '3', '']


// -----------------------------------------------------------------------------
// 7. MÉTODOS DE REGEXP
// -----------------------------------------------------------------------------

// test: verifica se há match (mais rápido que match para boolean)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
console.log(emailRegex.test('usuario@email.com')); // true
console.log(emailRegex.test('invalido'));          // false

// exec: retorna informações detalhadas do próximo match
const regexGlobal = /\d+/g;
const str2 = 'abc123def456';
let execMatch;
while ((execMatch = regexGlobal.exec(str2)) !== null) {
    console.log(`Encontrou "${execMatch[0]}" no índice ${execMatch.index}`);
    // lastIndex é atualizado automaticamente com flag g
}

// Propriedades de RegExp
const r = /(\w+)-(\d+)/gi;
console.log(r.source);     // '(\w+)-(\d+)' (padrão sem /)
console.log(r.flags);      // 'gi'
console.log(r.global);     // true
console.log(r.ignoreCase); // true
console.log(r.multiline);  // false
console.log(r.lastIndex);  // 0 (posição atual para regex com g)


// -----------------------------------------------------------------------------
// 8. EXEMPLOS PRÁTICOS DE VALIDAÇÃO
// -----------------------------------------------------------------------------

// Validadores reutilizáveis
const validadores = {
    // Email
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // CPF (formato: 000.000.000-00)
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,

    // CNPJ (formato: 00.000.000/0000-00)
    cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,

    // CEP (formato: 00000-000)
    cep: /^\d{5}-?\d{3}$/,

    // Telefone brasileiro (com ou sem DDD, com ou sem espaços)
    telefone: /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[-\s]?\d{4}$/,

    // URL
    url: /^(?:https?:\/\/)?(?:www\.)?[\w.-]+\.[a-zA-Z]{2,}(?:\/[\w./?=%&-]*)?$/,

    // IPv4
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,

    // Data (YYYY-MM-DD)
    data: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,

    // Hora (HH:MM ou HH:MM:SS)
    hora: /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/,

    // Senha forte (min 8 chars, maiúscula, minúscula, número, especial)
    senhaForte: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,

    // Hexadecimal (cor)
    corHex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

    // Somente letras e espaços
    somenteLetras: /^[a-zA-ZÀ-ÿ\s]+$/,

    // Número inteiro
    inteiro: /^-?\d+$/,

    // Número decimal
    decimal: /^-?\d+(?:\.\d+)?$/,

    // Username (3-20 chars, letras, números, underscore, hífen)
    username: /^[a-zA-Z0-9_-]{3,20}$/,
};

// Função de validação
function validar(tipo, valor) {
    const regex = validadores[tipo];
    if (!regex) throw new Error(`Validador '${tipo}' não encontrado`);
    return regex.test(valor);
}

// Testando validadores
console.log(validar('email', 'user@email.com'));    // true
console.log(validar('email', 'invalido@'));         // false
console.log(validar('cpf', '123.456.789-09'));      // true
console.log(validar('cpf', '12345678909'));         // false (sem pontuação)
console.log(validar('cep', '01310-100'));           // true
console.log(validar('data', '2023-12-25'));         // true
console.log(validar('data', '2023-13-25'));         // false (mês 13)
console.log(validar('senhaForte', 'Senha@123'));    // true
console.log(validar('senhaForte', 'fraca'));        // false


// -----------------------------------------------------------------------------
// 9. EXPRESSÕES REGULARES PARA EXTRAÇÃO DE DADOS
// -----------------------------------------------------------------------------

// Extrair todos os emails de um texto
function extrairEmails(texto) {
    return texto.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
}

const textoComEmails = 'Contate joao@empresa.com ou maria@email.org para mais info';
console.log(extrairEmails(textoComEmails));
// ['joao@empresa.com', 'maria@email.org']

// Extrair URLs
function extrairURLs(texto) {
    return texto.match(/https?:\/\/[^\s,]+/g) || [];
}

const textoComURLs = 'Veja https://google.com e também http://github.com/user/repo';
console.log(extrairURLs(textoComURLs));

// Parsear query string
function parsearQueryString(qs) {
    const resultado = {};
    const regex = /([^&=?]+)=([^&]*)/g;
    let match;
    while ((match = regex.exec(qs)) !== null) {
        resultado[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return resultado;
}

const qs = '?nome=Diego&idade=25&cidade=SP';
console.log(parsearQueryString(qs));
// { nome: 'Diego', idade: '25', cidade: 'SP' }

// Formatar CPF (adicionar pontuação)
function formatarCPF(cpf) {
    const somenteNumeros = cpf.replace(/\D/g, '');
    return somenteNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
console.log(formatarCPF('12345678909'));  // '123.456.789-09'
console.log(formatarCPF('123.456.789-09')); // '123.456.789-09'

// Formatar número de telefone
function formatarTelefone(tel) {
    const nums = tel.replace(/\D/g, '');
    if (nums.length === 11) {
        return nums.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (nums.length === 10) {
        return nums.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return tel; // Retorna original se não reconhecer
}
console.log(formatarTelefone('11987654321'));  // '(11) 98765-4321'
console.log(formatarTelefone('1134567890'));  // '(11) 3456-7890'

// Converter camelCase para kebab-case
const kebab = str => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
console.log(kebab('camelCaseToKebab')); // 'camel-case-to-kebab'
console.log(kebab('backgroundColor'));  // 'background-color'

// Converter snake_case para camelCase
const toCamel = str => str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
console.log(toCamel('snake_case_string')); // 'snakeCaseString'

// Truncar texto com reticências respeitando palavras
function truncar(texto, limite) {
    if (texto.length <= limite) return texto;
    return texto.slice(0, limite).replace(/\s+\S*$/, '') + '...';
}
console.log(truncar('Esta é uma frase muito longa para exibir', 20));
// 'Esta é uma frase...'

// Highlight de termos em texto (para busca)
function highlight(texto, termo) {
    const regex = new RegExp(`(${escapeRegex(termo)})`, 'gi');
    return texto.replace(regex, '**$1**'); // Em browser: '<mark>$1</mark>'
}

// Escapar caracteres especiais para usar em regex
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

console.log(highlight('JavaScript é JavaScript!', 'javascript'));
// '**JavaScript** é **JavaScript**!'

console.log(escapeRegex('preço: R$10.00 (10% off)'));
// 'preço: R\$10\.00 \(10% off\)'


// =============================================================================
// FIM DO ARQUIVO 09 - EXPRESSÕES REGULARES
// =============================================================================
