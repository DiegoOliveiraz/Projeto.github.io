// =============================================================================
// 11 - DOM, EVENTOS E BOM (Browser Object Model)
// =============================================================================
// Este arquivo cobre:
//   - DOM (Document Object Model) - seleção e manipulação de elementos
//   - Criação e remoção de elementos
//   - Atributos, classes e estilos
//   - Sistema de eventos (addEventListener, bubbling, capturing, delegation)
//   - Formulários
//   - BOM (Browser Object Model): window, navigator, location, history, screen
//   - Web Storage (localStorage, sessionStorage)
//   - Cookies
//   - requestAnimationFrame
//   - IntersectionObserver, MutationObserver, ResizeObserver
// NOTA: Este arquivo é para referência. Execute em um ambiente de browser.
// =============================================================================

// Verificação de ambiente
const isBrowser = typeof window !== 'undefined';


// =============================================================================
// PARTE 1: DOM - DOCUMENT OBJECT MODEL
// =============================================================================

// -----------------------------------------------------------------------------
// 1. SELEÇÃO DE ELEMENTOS
// -----------------------------------------------------------------------------
if (isBrowser) {
    // Seletores modernos (CSS selectors)
    const elemento = document.querySelector('.minha-classe');   // Primeiro match
    const elementos = document.querySelectorAll('p.destaque'); // Todos os matches (NodeList)

    // Seletores clássicos (mais específicos e geralmente mais rápidos)
    const porId      = document.getElementById('meuId');
    const porClasse  = document.getElementsByClassName('classe'); // HTMLCollection (live)
    const porTag     = document.getElementsByTagName('div');     // HTMLCollection (live)
    const porName    = document.getElementsByName('campoForm');  // NodeList

    // Diferença importante: NodeList vs HTMLCollection
    // HTMLCollection é "live" (atualiza automaticamente quando DOM muda)
    // NodeList do querySelectorAll é "static" (snapshot)
    // NodeList do childNodes é "live"

    // Verificar se seletor retornou resultado
    if (!elemento) {
        console.log('Elemento não encontrado');
    }

    // Iterar NodeList
    elementos.forEach(el => console.log(el.textContent));

    // Converter HTMLCollection para Array (para usar métodos de array)
    const divArray = Array.from(porTag);
    const divComFiltro = [...divArray].filter(div => div.classList.contains('ativo'));

    // Seletores avançados com CSS
    const primeiroParagrafo    = document.querySelector('p:first-child');
    const ultimoLi             = document.querySelector('li:last-child');
    const inputChecked         = document.querySelector('input:checked');
    const linkExterno          = document.querySelector('a[href^="https"]');
    const imagemSemAlt         = document.querySelector('img:not([alt])');
    const elPar                = document.querySelector('tr:nth-child(even)');

    // Travessia do DOM
    const pai      = elemento?.parentElement;
    const filhos   = elemento?.children;               // HTMLCollection de filhos
    const nodos    = elemento?.childNodes;              // NodeList (inclui texto, comentários)
    const primeiro = elemento?.firstElementChild;      // Primeiro filho elemento
    const ultimo   = elemento?.lastElementChild;       // Último filho elemento
    const anterior = elemento?.previousElementSibling; // Irmão anterior
    const proximo  = elemento?.nextElementSibling;     // Irmão seguinte

    // Verificações
    console.log(elemento?.hasChildNodes());     // true se tem filhos
    console.log(elemento?.childElementCount);   // Número de filhos elemento
    console.log(elemento?.contains(primeiroParagrafo)); // true se é descendente


// -----------------------------------------------------------------------------
// 2. CRIAÇÃO E INSERÇÃO DE ELEMENTOS
// -----------------------------------------------------------------------------
    // Criar elementos
    const div    = document.createElement('div');
    const texto  = document.createTextNode('Conteúdo de texto');
    const frag   = document.createDocumentFragment(); // Fragmento (performance)
    const clone  = div.cloneNode(true); // true = deep clone (inclui filhos)

    // Inserir no DOM
    div.appendChild(texto);              // Adiciona no final
    document.body.appendChild(div);     // Adiciona ao body

    // Métodos modernos de inserção
    const pai2 = document.querySelector('#container');
    if (pai2) {
        pai2.append(div, 'texto', outro);   // Adiciona múltiplos elementos/textos no final
        pai2.prepend(div);                  // Adiciona no início
        pai2.before(div);                   // Insere antes do elemento pai2
        pai2.after(div);                    // Insere após o elemento pai2
        pai2.replaceWith(div);             // Substitui pai2 por div
    }

    // insertBefore (clássico)
    const referencia = document.querySelector('#referencia');
    if (referencia && referencia.parentNode) {
        referencia.parentNode.insertBefore(div, referencia);
    }

    // insertAdjacentElement/HTML/Text (mais performance)
    if (elemento) {
        elemento.insertAdjacentElement('beforebegin', div); // Antes do elemento
        elemento.insertAdjacentElement('afterbegin', div);  // Dentro, no início
        elemento.insertAdjacentElement('beforeend', div);   // Dentro, no final
        elemento.insertAdjacentElement('afterend', div);    // Após o elemento

        elemento.insertAdjacentHTML('beforeend', '<span>Novo span</span>');
        elemento.insertAdjacentText('beforeend', 'Texto simples');
    }

    // Usando DocumentFragment para performance (múltiplas inserções)
    const lista = document.querySelector('#minha-lista');
    if (lista) {
        const fragmento = document.createDocumentFragment();
        const itens = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

        itens.forEach(texto2 => {
            const li = document.createElement('li');
            li.textContent = texto2;
            fragmento.appendChild(li); // Não causa reflow
        });

        lista.appendChild(fragmento); // Apenas UM reflow!
    }


// -----------------------------------------------------------------------------
// 3. MANIPULAÇÃO DE CONTEÚDO
// -----------------------------------------------------------------------------
    const p = document.createElement('p');

    // textContent: texto puro (mais seguro, sem parsing de HTML)
    p.textContent = 'Texto <em>simples</em>'; // Escapa o HTML
    console.log(p.textContent); // 'Texto <em>simples</em>'

    // innerHTML: HTML como string (cuidado com XSS!)
    p.innerHTML = 'Texto <em>estilizado</em>';
    console.log(p.innerHTML); // 'Texto <em>estilizado</em>'

    // NUNCA use innerHTML com dados do usuário sem sanitização!
    // RUIM: elemento.innerHTML = `<p>${userInput}</p>`; // XSS!
    // BOM: elemento.textContent = userInput; // Seguro

    // outerHTML: inclui o próprio elemento
    console.log(p.outerHTML); // '<p>Texto <em>estilizado</em></p>'

    // innerText: texto visível (respeita CSS display:none, linha por linha)
    // Diferente de textContent (que pega todo o texto incluindo display:none)


// -----------------------------------------------------------------------------
// 4. ATRIBUTOS E PROPRIEDADES
// -----------------------------------------------------------------------------
    const img = document.createElement('img');

    // Atributos: direto no HTML
    img.setAttribute('src', 'foto.jpg');
    img.setAttribute('alt', 'Uma foto');
    img.setAttribute('data-id', '123');    // Atributo data-*

    console.log(img.getAttribute('src'));  // 'foto.jpg'
    console.log(img.hasAttribute('alt'));  // true
    img.removeAttribute('alt');

    // Propriedades: no objeto JavaScript (mais performático)
    img.src = 'nova-foto.jpg';
    img.alt = 'Nova foto';
    img.width = 300;

    // dataset: acesso a atributos data-*
    const card = document.createElement('div');
    card.setAttribute('data-usuario-id', '42');
    card.setAttribute('data-papel', 'admin');

    console.log(card.dataset.usuarioId); // '42' (camelCase do atributo kebab-case)
    console.log(card.dataset.papel);     // 'admin'

    card.dataset.criadoEm = '2023-12-25'; // Cria data-criado-em automaticamente
    delete card.dataset.papel;            // Remove data-papel

    // Atributos booleanos
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked   = true;   // Propriedade booleana
    input.disabled  = false;
    input.required  = true;
    input.readOnly  = false;

    // value, checked, selected: propriedades que refletem o estado ATUAL
    // defaultValue, defaultChecked: valor original do HTML


// -----------------------------------------------------------------------------
// 5. CLASSES E ESTILOS
// -----------------------------------------------------------------------------
    const caixinha = document.createElement('div');

    // classList: API moderna para gerenciar classes
    caixinha.classList.add('ativo', 'destaque');         // Adiciona uma ou mais
    caixinha.classList.remove('ativo');                  // Remove
    caixinha.classList.toggle('visivel');                // Alterna
    caixinha.classList.toggle('ativo', true);            // Força adicionar
    caixinha.classList.toggle('ativo', false);           // Força remover
    caixinha.classList.replace('destaque', 'secundario'); // Substitui

    console.log(caixinha.classList.contains('visivel')); // true
    console.log(caixinha.classList.length);              // Número de classes
    console.log([...caixinha.classList]);                // Array de classes

    // style: estilos inline
    caixinha.style.backgroundColor = 'blue'; // camelCase!
    caixinha.style.width            = '200px';
    caixinha.style.padding          = '10px 20px';
    caixinha.style.display          = 'flex';

    // Remover estilo inline
    caixinha.style.backgroundColor = '';
    caixinha.style.removeProperty('width');

    // getComputedStyle: estilo FINAL calculado (inclui CSS externo)
    const estiloFinal = window.getComputedStyle(caixinha);
    console.log(estiloFinal.getPropertyValue('display'));
    console.log(estiloFinal.color);

    // Variáveis CSS (custom properties)
    document.documentElement.style.setProperty('--cor-primaria', '#007bff');
    const corPrimaria = getComputedStyle(document.documentElement)
        .getPropertyValue('--cor-primaria');
    console.log(corPrimaria.trim()); // '#007bff'


// -----------------------------------------------------------------------------
// 6. DIMENSÕES E POSICIONAMENTO
// -----------------------------------------------------------------------------
    if (document.body.firstElementChild) {
        const el = document.body.firstElementChild;

        // getBoundingClientRect: posição relativa ao viewport
        const rect = el.getBoundingClientRect();
        console.log(rect.top);    // Distância do topo do viewport
        console.log(rect.left);   // Distância da esquerda
        console.log(rect.width);  // Largura
        console.log(rect.height); // Altura
        console.log(rect.bottom); // top + height
        console.log(rect.right);  // left + width

        // Dimensões do elemento
        console.log(el.offsetWidth);       // Largura (inclui borda e padding)
        console.log(el.offsetHeight);      // Altura (inclui borda e padding)
        console.log(el.clientWidth);       // Largura da área de conteúdo (inclui padding)
        console.log(el.clientHeight);      // Altura da área de conteúdo
        console.log(el.scrollWidth);       // Largura total incluindo overflow
        console.log(el.scrollHeight);      // Altura total incluindo overflow

        // Posição de scroll
        console.log(el.scrollTop);         // Pixels scrollados verticalmente
        console.log(el.scrollLeft);        // Pixels scrollados horizontalmente
        el.scrollTop = 100;               // Scroll para 100px
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Scroll da janela
    console.log(window.scrollY);           // Pixels scrollados verticalmente
    console.log(window.scrollX);           // Pixels scrollados horizontalmente
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll suave para o topo
    window.scrollBy({ top: 100, behavior: 'smooth' }); // Scroll relativo


// =============================================================================
// PARTE 2: SISTEMA DE EVENTOS
// =============================================================================

// -----------------------------------------------------------------------------
// 7. ADICIONANDO E REMOVENDO EVENTOS
// -----------------------------------------------------------------------------
    const botao = document.querySelector('#meu-botao');

    // addEventListener: método moderno e recomendado
    function aoClicar(event) {
        console.log('Botão clicado!');
        console.log('Elemento:', event.target);
        console.log('Elemento com listener:', event.currentTarget);
        console.log('Tipo:', event.type);
    }

    if (botao) {
        botao.addEventListener('click', aoClicar);

        // Opções de addEventListener
        botao.addEventListener('click', aoClicar, {
            capture: false, // false = bubbling (padrão), true = capturing
            once: true,     // Remove automaticamente após primeira execução
            passive: true,  // Melhora performance de scroll (não chama preventDefault)
        });

        // Remover evento (precisa da mesma referência de função)
        botao.removeEventListener('click', aoClicar);

        // AbortController para remover eventos
        const controller = new AbortController();
        botao.addEventListener('click', aoClicar, { signal: controller.signal });
        // Para remover: controller.abort() (remove todos os listeners com esse signal)

        // Disparar evento programaticamente
        botao.click(); // Método shorthand para click
        botao.dispatchEvent(new Event('click'));
        botao.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            clientX: 100,
            clientY: 200,
        }));
    }


// -----------------------------------------------------------------------------
// 8. OBJETO EVENT
// -----------------------------------------------------------------------------
    document.addEventListener('click', function(event) {
        // Informações comuns a todos os eventos
        console.log(event.type);            // Tipo do evento
        console.log(event.target);          // Elemento que disparou o evento
        console.log(event.currentTarget);   // Elemento com o listener
        console.log(event.bubbles);         // Se o evento faz bubbling
        console.log(event.cancelable);      // Se pode ser cancelado
        console.log(event.timeStamp);       // Timestamp em ms
        console.log(event.isTrusted);       // true se gerado pelo usuário, false se programático

        // Controlar propagação
        event.stopPropagation();       // Para bubbling/capturing
        event.stopImmediatePropagation(); // Para propagação E outros listeners no mesmo elemento
        event.preventDefault();        // Cancela o comportamento padrão

        // Infos específicas de MouseEvent
        console.log(event.clientX, event.clientY); // Posição relativa ao viewport
        console.log(event.pageX, event.pageY);     // Posição relativa ao documento
        console.log(event.screenX, event.screenY); // Posição relativa à tela
        console.log(event.button);    // 0=esquerdo, 1=meio, 2=direito
        console.log(event.buttons);   // Botões pressionados (bitfield)
        console.log(event.ctrlKey);   // Ctrl estava pressionado?
        console.log(event.shiftKey);  // Shift estava pressionado?
        console.log(event.altKey);    // Alt estava pressionado?
        console.log(event.metaKey);   // Meta/Cmd estava pressionado?
    });

    // Eventos de teclado
    document.addEventListener('keydown', function(event) {
        console.log(event.key);     // 'Enter', 'a', 'ArrowUp', etc.
        console.log(event.code);    // 'Enter', 'KeyA', 'ArrowUp', etc.
        console.log(event.keyCode); // Depreciado! Use event.key
        console.log(event.repeat);  // true se tecla mantida pressionada

        // Detectar combinações de teclas
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault(); // Previne salvar a página
            console.log('Ctrl+S pressionado - salvando...');
        }
    });

    // Eventos de formulário
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede envio padrão
            const dados = new FormData(form);
            dados.forEach((valor, campo) => console.log(`${campo}: ${valor}`));

            // Converter FormData para objeto
            const obj = Object.fromEntries(dados.entries());
            console.log(obj);
        });

        const input2 = form.querySelector('input[type="text"]');
        if (input2) {
            input2.addEventListener('input', (e) => {
                console.log('Mudança:', e.target.value); // A cada tecla
            });

            input2.addEventListener('change', (e) => {
                console.log('Alteração confirmada:', e.target.value); // Ao sair do campo
            });

            input2.addEventListener('focus', () => console.log('Campo focado'));
            input2.addEventListener('blur',  () => console.log('Campo desfocado'));
        }
    }


// -----------------------------------------------------------------------------
// 9. EVENT DELEGATION (Delegação de Eventos)
// -----------------------------------------------------------------------------
// Em vez de listener em cada filho, usar um no pai
// Mais eficiente para listas dinâmicas

    const listaDinamica = document.querySelector('#lista-dinamica');
    if (listaDinamica) {
        // Um único listener no pai gerencia TODOS os filhos (incluindo futuros)
        listaDinamica.addEventListener('click', function(event) {
            // Verificar se o elemento clicado tem interesse
            const itemLista = event.target.closest('li[data-id]');
            if (!itemLista) return; // Clicou em outro lugar

            const id = itemLista.dataset.id;
            const acao = event.target.closest('[data-acao]')?.dataset.acao;

            if (acao === 'editar') {
                console.log(`Editando item ${id}`);
            } else if (acao === 'deletar') {
                console.log(`Deletando item ${id}`);
                itemLista.remove();
            } else {
                console.log(`Selecionado item ${id}`);
            }
        });

        // Adicionar novos itens dinamicamente (o listener já os cobre!)
        function adicionarItem(id, texto) {
            const li = document.createElement('li');
            li.dataset.id = id;
            li.innerHTML = `
                ${texto}
                <button data-acao="editar">✏️</button>
                <button data-acao="deletar">🗑️</button>
            `;
            listaDinamica.appendChild(li);
        }
    }


// -----------------------------------------------------------------------------
// 10. EVENTOS CUSTOMIZADOS
// -----------------------------------------------------------------------------
    // Criar evento customizado
    const eventoCustomizado = new CustomEvent('meu-evento', {
        detail: { mensagem: 'Dados customizados', timestamp: Date.now() },
        bubbles: true,    // Faz bubbling
        cancelable: true, // Pode ser cancelado
    });

    document.addEventListener('meu-evento', (e) => {
        console.log('Evento customizado recebido:', e.detail.mensagem);
    });

    document.dispatchEvent(eventoCustomizado);

    // EventTarget customizado (sem necessidade de elemento DOM!)
    class MinhaLoja extends EventTarget {
        #carrinho = [];

        adicionarItem(item) {
            this.#carrinho.push(item);
            this.dispatchEvent(new CustomEvent('item-adicionado', {
                detail: { item, total: this.#carrinho.length }
            }));
        }

        removerItem(item) {
            const index = this.#carrinho.indexOf(item);
            if (index >= 0) {
                this.#carrinho.splice(index, 1);
                this.dispatchEvent(new CustomEvent('item-removido', {
                    detail: { item, total: this.#carrinho.length }
                }));
            }
        }

        get total() { return this.#carrinho.length; }
    }

    const loja = new MinhaLoja();
    loja.addEventListener('item-adicionado', (e) => {
        console.log(`Item adicionado: ${e.detail.item} (total: ${e.detail.total})`);
    });
    loja.adicionarItem('Notebook');
    loja.adicionarItem('Mouse');


// =============================================================================
// PARTE 3: BOM - BROWSER OBJECT MODEL
// =============================================================================

// -----------------------------------------------------------------------------
// 11. WINDOW
// -----------------------------------------------------------------------------
    // Dimensões da janela
    console.log(window.innerWidth);   // Largura do viewport (incluindo scrollbar)
    console.log(window.innerHeight);  // Altura do viewport
    console.log(window.outerWidth);   // Largura da janela do browser
    console.log(window.outerHeight);  // Altura da janela

    // Caixas de diálogo (usadas com moderação - bloqueiam thread)
    // window.alert('Mensagem');
    // const confirmacao = window.confirm('Tem certeza?');
    // const entrada = window.prompt('Digite algo:', 'valor padrão');

    // Timers (cobertos no arquivo 07)
    // setTimeout, setInterval, clearTimeout, clearInterval

    // requestAnimationFrame: sincroniza com refresh da tela (60fps)
    function animar(timestamp) {
        // Lógica de animação aqui
        // timestamp: tempo em ms desde que a página carregou
        requestAnimationFrame(animar); // Continua o loop
    }
    // requestAnimationFrame(animar); // Inicia a animação

    // cancelAnimationFrame
    const idAnimacao = requestAnimationFrame(animar);
    cancelAnimationFrame(idAnimacao); // Cancela


// -----------------------------------------------------------------------------
// 12. NAVIGATOR
// -----------------------------------------------------------------------------
    console.log(navigator.userAgent);     // String do browser
    console.log(navigator.language);      // Idioma preferido do usuário ('pt-BR')
    console.log(navigator.languages);     // Lista de idiomas preferidos
    console.log(navigator.onLine);        // true se online
    console.log(navigator.cookieEnabled); // true se cookies habilitados
    console.log(navigator.hardwareConcurrency); // Número de CPUs

    // Geolocalização
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (posicao) => {
                console.log('Latitude:', posicao.coords.latitude);
                console.log('Longitude:', posicao.coords.longitude);
            },
            (erro) => console.error('Erro de geolocalização:', erro.message),
            { timeout: 5000, enableHighAccuracy: true }
        );
    }

    // Clipboard API
    async function copiarTexto(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            console.log('Copiado!');
        } catch (e) {
            console.error('Falha ao copiar:', e);
        }
    }

    async function colarTexto() {
        try {
            const texto = await navigator.clipboard.readText();
            console.log('Colado:', texto);
            return texto;
        } catch (e) {
            console.error('Falha ao colar:', e);
        }
    }

    // Vibração (mobile)
    if (navigator.vibrate) {
        navigator.vibrate(200); // Vibrar por 200ms
        navigator.vibrate([200, 100, 200]); // Padrão: vibra 200ms, pausa 100ms, vibra 200ms
    }

    // Conexão de rede
    if (navigator.connection) {
        console.log(navigator.connection.effectiveType); // '4g', '3g', etc.
        console.log(navigator.connection.downlink);      // Mbps estimado
        console.log(navigator.connection.saveData);      // Modo econômico ativo?
    }


// -----------------------------------------------------------------------------
// 13. LOCATION
// -----------------------------------------------------------------------------
    console.log(location.href);     // URL completa
    console.log(location.protocol); // 'https:'
    console.log(location.host);     // 'www.exemplo.com:8080'
    console.log(location.hostname); // 'www.exemplo.com'
    console.log(location.port);     // '8080'
    console.log(location.pathname); // '/caminho/pagina'
    console.log(location.search);   // '?param=valor'
    console.log(location.hash);     // '#ancora'
    console.log(location.origin);   // 'https://www.exemplo.com:8080'

    // Navegar para outra URL
    // location.href = 'https://google.com';  // Navega (cria entrada no histórico)
    // location.replace('https://google.com'); // Navega (sem criar entrada)
    // location.reload();  // Recarrega a página
    // location.reload(true); // Recarrega ignorando cache

    // URL API (mais moderna)
    const url = new URL('https://www.exemplo.com:8080/caminho?q=javascript&pg=1#inicio');
    console.log(url.hostname);           // 'www.exemplo.com'
    console.log(url.port);               // '8080'
    console.log(url.pathname);           // '/caminho'
    console.log(url.searchParams.get('q')); // 'javascript'

    // URLSearchParams
    const params = new URLSearchParams('q=javascript&pg=1&lang=pt');
    console.log(params.get('q'));      // 'javascript'
    console.log(params.getAll('q'));   // ['javascript']
    console.log([...params.keys()]);   // ['q', 'pg', 'lang']
    params.append('novo', 'valor');
    params.set('pg', '2');
    params.delete('lang');
    console.log(params.toString());    // 'q=javascript&pg=2&novo=valor'


// -----------------------------------------------------------------------------
// 14. HISTORY
// -----------------------------------------------------------------------------
    console.log(history.length);  // Número de entradas no histórico

    // Navegar pelo histórico
    // history.back();
    // history.forward();
    // history.go(-2); // 2 páginas para trás
    // history.go(1);  // 1 página para frente

    // pushState: adiciona entrada no histórico sem recarregar
    history.pushState(
        { pagina: 'dashboard', id: 42 }, // Estado (objeto)
        '',                              // Título (geralmente ignorado)
        '/dashboard/42'                  // Nova URL
    );

    // replaceState: substitui a entrada atual (sem criar nova)
    history.replaceState(
        { pagina: 'dashboard', id: 42 },
        '',
        '/dashboard/42'
    );

    // Evento popstate: disparado quando usuário usa botões de voltar/avançar
    window.addEventListener('popstate', (event) => {
        console.log('Navegou para:', location.pathname);
        console.log('Estado:', event.state);
        // Renderizar a página baseado no estado
    });


// -----------------------------------------------------------------------------
// 15. WEB STORAGE
// -----------------------------------------------------------------------------
    // localStorage: persiste entre sessões (sem expiração)
    localStorage.setItem('usuario', 'Diego');
    localStorage.setItem('configuracao', JSON.stringify({ tema: 'escuro' }));

    console.log(localStorage.getItem('usuario'));      // 'Diego'
    const config = JSON.parse(localStorage.getItem('configuracao'));
    console.log(config.tema); // 'escuro'

    localStorage.removeItem('usuario');
    localStorage.clear(); // Remove tudo

    console.log(localStorage.length); // Número de itens
    for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);
        console.log(chave, localStorage.getItem(chave));
    }

    // sessionStorage: persiste apenas na sessão atual (fecha aba = apaga)
    sessionStorage.setItem('temporario', 'valor');
    // Mesma API do localStorage

    // Storage event: disparado quando outro tab modifica o storage
    window.addEventListener('storage', (event) => {
        console.log('Storage alterado em outra aba:');
        console.log('Chave:', event.key);
        console.log('Valor antigo:', event.oldValue);
        console.log('Novo valor:', event.newValue);
        console.log('URL:', event.url);
    });

    // Wrapper seguro para localStorage
    const storage = {
        definir(chave, valor) {
            try {
                localStorage.setItem(chave, JSON.stringify(valor));
                return true;
            } catch (e) {
                console.error('Erro ao salvar:', e);
                return false;
            }
        },
        obter(chave, padrao = null) {
            try {
                const item = localStorage.getItem(chave);
                return item !== null ? JSON.parse(item) : padrao;
            } catch {
                return padrao;
            }
        },
        remover(chave) {
            localStorage.removeItem(chave);
        },
        limpar() {
            localStorage.clear();
        }
    };


// -----------------------------------------------------------------------------
// 16. OBSERVERS
// -----------------------------------------------------------------------------
    // IntersectionObserver: observa quando elemento entra/sai da viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('Elemento visível:', entry.target);
                entry.target.classList.add('visivel');
                // Lazy loading de imagens, animações ao scroll, etc.
            } else {
                entry.target.classList.remove('visivel');
            }
        });
    }, {
        root: null,          // null = viewport
        rootMargin: '0px',   // Margem extra
        threshold: [0, 0.5, 1], // Percentuais de visibilidade para disparar
    });

    document.querySelectorAll('.lazy').forEach(el => observer.observe(el));

    // MutationObserver: observa mudanças no DOM
    const mutationObs = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                console.log('Filhos adicionados:', mutation.addedNodes);
                console.log('Filhos removidos:', mutation.removedNodes);
            }
            if (mutation.type === 'attributes') {
                console.log(`Atributo "${mutation.attributeName}" mudou`);
                console.log('Valor antigo:', mutation.oldValue);
            }
            if (mutation.type === 'characterData') {
                console.log('Texto mudou');
            }
        });
    });

    const elementoObservado = document.querySelector('#monitorar');
    if (elementoObservado) {
        mutationObs.observe(elementoObservado, {
            childList: true,     // Observar filhos
            subtree: true,       // Observar descendentes também
            attributes: true,    // Observar atributos
            attributeOldValue: true, // Salvar valor antigo
            characterData: true, // Observar texto
        });
        // mutationObs.disconnect(); // Para de observar
    }

    // ResizeObserver: observa mudanças de tamanho de elementos
    const resizeObs = new ResizeObserver((entries) => {
        entries.forEach(entry => {
            const { width, height } = entry.contentRect;
            console.log(`Elemento redimensionado: ${width}x${height}`);
        });
    });

    const elParaResizar = document.querySelector('#resizavel');
    if (elParaResizar) {
        resizeObs.observe(elParaResizar);
    }
} // fim do if (isBrowser)


// =============================================================================
// FIM DO ARQUIVO 11 - DOM, EVENTOS E BOM
// =============================================================================
