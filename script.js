/* ════════════════════════════════════════════════════════════════════
   script.js — OCEANO  |  Script principal unificado
   Carregado em TODAS as páginas. Cada seção usa guards (if elemento)
   para executar somente na página onde os elementos existem.

   ESTRUTURA:
     1.  SHARED — Navbar (scroll + hambúrguer)
     2.  SHARED — Efeito onda no #titulo (index)
     3.  SHARED — Animação de fundo (bolhas + partículas + peixes)
     4.  JOGO DA FORCA
     4.5 JOGO DA VELHA
     5.  TROCA PALAVRAS
     6.  PEIXES (carrossel + painel de detalhes)
     7.  OCEAN CLICKER — configuração e estado
     8.  OCEAN CLICKER — inicialização
     9.  OCEAN CLICKER — clique principal
     10. OCEAN CLICKER — evolução do botão
     11. OCEAN CLICKER — compra de upgrades
     12. OCEAN CLICKER — barra de progresso
     13. OCEAN CLICKER — desbloqueios
     14. OCEAN CLICKER — avisos de aba vazia
     15. OCEAN CLICKER — pop-ups
     16. OCEAN CLICKER — partícula de pontos
     17. OCEAN CLICKER — meta de cliques
     18. OCEAN CLICKER — bolha dourada
     19. OCEAN CLICKER — vitória
     20. OCEAN CLICKER — passivas (auto-clickers, corrente, etc.)
     21. OCEAN CLICKER — vida marinha (peixes + partículas de fundo)
     22. OCEAN CLICKER — design (relógio, música, som, título dinâmico)
     23. OCEAN CLICKER — focus/blur (pausa)
     24. OCEAN CLICKER — troca de aba
     25. OCEAN CLICKER — auxiliares (atualizarTela, salvarTudo, resetar)
════════════════════════════════════════════════════════════════════ */


/* ════════════════════════════════════════════════════════════════════
   1. SHARED — NAVBAR
   Scroll → adiciona .scrolled no #navbar (todas as páginas)
   Hambúrguer → toggle .aberto no #navCollapse (todas as páginas)
════════════════════════════════════════════════════════════════════ */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const toggler = document.getElementById('navToggler');
    const collapse = document.getElementById('navCollapse');

    if (!navbar) return; // ocean-clicker não tem navbar

    // Scroll — adiciona fundo ao navbar ao rolar
    window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hambúrguer mobile
    if (toggler && collapse) {
        toggler.addEventListener('click', function () {
            const aberto = collapse.classList.toggle('aberto');
            toggler.setAttribute('aria-expanded', aberto);
        });
    }
})();


/* ════════════════════════════════════════════════════════════════════
   2. SHARED — EFEITO ONDA NO TÍTULO
   Aplica animação letra a letra no elemento com id="titulo" (index)
════════════════════════════════════════════════════════════════════ */
(function initTituloOnda() {
    const titulo = document.getElementById('titulo');
    if (!titulo) return;

    const letras = titulo.innerText.split('');
    titulo.innerHTML = letras.map(function (l, i) {
        return '<span style="animation-delay:' + (i * 0.08) + 's">' +
            (l === ' ' ? '&nbsp;' : l) + '</span>';
    }).join('');
})();


/* ════════════════════════════════════════════════════════════════════
   3. SHARED — ANIMAÇÃO DE FUNDO
   Gera bolhas e partículas brilhantes nos containers fixos presentes
   em todas as páginas normais (index, forca, peixes, troca-palavras).
   O clicker gerencia seu próprio fundo via ativarRelogio() e
   ativarVidaMarinha() — não executa este bloco.
════════════════════════════════════════════════════════════════════ */
(function initFundoAnimado() {
    const bolhasCont = document.getElementById('bubbles-container');
    const particulasCont = document.getElementById('particles-container');

    // Não executa no clicker (body.pagina-clicker gerencia seu próprio fundo)
    if (!bolhasCont || document.body.classList.contains('pagina-clicker')) return;

    // Bolhas flutuantes
    for (let i = 0; i < 14; i++) {
        const b = document.createElement('div');
        b.classList.add('bolha');
        const size = Math.random() * 28 + 8;
        b.style.cssText =
            'width:' + size + 'px;' +
            'height:' + size + 'px;' +
            'left:' + (Math.random() * 100) + 'vw;' +
            'animation-duration:' + (Math.random() * 7 + 5).toFixed(1) + 's;' +
            'animation-delay:' + (Math.random() * 8).toFixed(1) + 's;';
        bolhasCont.appendChild(b);
    }

    // Partículas brilhantes (pontinhos de luz)
    if (!particulasCont) return;
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.classList.add('bg-particula'); // nome único, sem conflito
        const size = Math.random() * 3 + 1;
        p.style.cssText =
            'width:' + size + 'px;' +
            'height:' + size + 'px;' +
            'left:' + (Math.random() * 100) + 'vw;' +
            'top:' + (Math.random() * 100) + 'vh;' +
            'animation-duration:' + (Math.random() * 3 + 2).toFixed(1) + 's;' +
            'animation-delay:' + (Math.random() * 5).toFixed(1) + 's;';
        particulasCont.appendChild(p);
    }
})();


/* ════════════════════════════════════════════════════════════════════
   4. JOGO DA FORCA
   Guard: executa somente se #tenta existir na página
════════════════════════════════════════════════════════════════════ */
(function initForca() {
    if (!document.getElementById('tenta')) return;

    // ── variáveis internas (escopo local — sem poluir o global) ──
    let palavraAtual = '';
    let temaAtual = '';
    let erros = 0;
    let acertos = 0;
    let certas = 0;
    let erradas = 0;

    const banco = [
        { palavra: 'TUBARAO', tema: 'Animal Marinho' },
        { palavra: 'POLVO', tema: 'Animal Marinho' },
        { palavra: 'GOLFINHO', tema: 'Animal Marinho' },
        { palavra: 'BALEIA', tema: 'Animal Marinho' },
        { palavra: 'CORAL', tema: 'Ecossistema' },
        { palavra: 'RECIFE', tema: 'Ecossistema' },
        { palavra: 'MAREMOTO', tema: 'Fenômeno Natural' },
        { palavra: 'CORRENTE', tema: 'Fenômeno Natural' },
        { palavra: 'ABISMO', tema: 'Geografia Marinha' },
        { palavra: 'CAVALO-MARINHO', tema: 'Animal Marinho' },
        { palavra: 'TARTARUGA', tema: 'Animal Marinho' },
        { palavra: 'LAGOSTA', tema: 'Animal Marinho' },
        { palavra: 'SARDINHA', tema: 'Animal Marinho' },
        { palavra: 'CARANGUEJO', tema: 'Animal Marinho' },
        { palavra: 'MEDUSA', tema: 'Animal Marinho' },
        { palavra: 'NAUTILO', tema: 'Animal Marinho' },
        { palavra: 'PEIXE-ESPADA', tema: 'Animal Marinho' },
        { palavra: 'POLVINHO', tema: 'Animal Marinho' },
        { palavra: 'ESPONJA', tema: 'Animal Marinho' },
        { palavra: 'BAIACU', tema: 'Animal Marinho' },
    ];

    // Expõe sorteia() globalmente pois é chamada inline no HTML
    window.sorteia = function () {
        erros = 0;
        const sorteio = banco[Math.floor(Math.random() * banco.length)];
        palavraAtual = sorteio.palavra;
        temaAtual = sorteio.tema;

        document.getElementById('tema').textContent = 'TEMA: ' + temaAtual;
        document.getElementById('imagem').src = 'img-forca/forca1.png';

        // Resetar botões do teclado
        document.querySelectorAll('#letras button').forEach(function (btn) {
            btn.disabled = false;
            btn.style.background = '';
        });

        // Gerar campos de letra
        const form = document.getElementById('tenta');
        form.innerHTML = '';
        for (let i = 0; i < palavraAtual.length; i++) {
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.maxLength = 1;
            inp.readOnly = true;
            inp.dataset.letra = palavraAtual[i];
            if (palavraAtual[i] === '-') {
                inp.value = '-';
                inp.style.borderBottom = 'none';
            }
            form.appendChild(inp);
        }
    };

    window.confere = function (letra) {
        const inputs = document.querySelectorAll('#tenta input');
        const btn = document.getElementById(letra);
        let acertouLetra = false;

        inputs.forEach(function (inp) {
            if (inp.dataset.letra === letra) {
                inp.value = letra;
                acertouLetra = true;
            }
        });

        if (btn) {
            btn.disabled = true;
            btn.style.background = acertouLetra
                ? 'rgba(72,202,228,0.35)'
                : 'rgba(239,83,80,0.35)';
        }

        if (acertouLetra) {
            certas++;
        } else {
            erros++;
            erradas++;
            document.getElementById('imagem').src = 'img-forca/forca' + (erros + 1) + '.png';
            if (erros >= 6) {
                setTimeout(function () {
                    alert('Você perdeu! A palavra era: ' + palavraAtual);
                    acertos = 0;
                    certas = 0;
                    erradas = 0;
                    atualizarBadgesForca();
                    window.sorteia();
                }, 200);
                return;
            }
        }

        // Verifica vitória
        const venceu = Array.from(inputs).every(function (inp) {
            return inp.value !== '' || inp.dataset.letra === '-';
        });

        if (venceu) {
            acertos++;
            atualizarBadgesForca();
            setTimeout(function () {
                alert('Parabéns! Você acertou: ' + palavraAtual);
                window.sorteia();
            }, 200);
            return;
        }

        atualizarBadgesForca();
    };

    window.acabou = function () { /* placeholder para compatibilidade */ };

    function atualizarBadgesForca() {
        const elAcerto = document.getElementById('acerto');
        const elPalcerta = document.getElementById('palcerta');
        if (elAcerto) elAcerto.textContent = 'ACERTOS: ' + acertos;
        if (elPalcerta) elPalcerta.textContent =
            'CERTAS: ' + certas + ' \u00a0|\u00a0 ERRADAS: ' + erradas;
    }
})();

/* ════════════════════════════════════════════════════════════════════
   4.5 JOGO DA VELHA
   Guard: executa somente se #tenta existir na página
════════════════════════════════════════════════════════════════════ */
// bolhas de fundo
const bc = document.getElementById('bubbles-container');
for (let i = 0; i < 14; i++) {
    const b = document.createElement('div'); b.classList.add('bolha');
    const s = Math.random() * 25 + 8;
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}vw;animation-duration:${(Math.random() * 6 + 5).toFixed(1)}s;animation-delay:${(Math.random() * 8).toFixed(1)}s;`;
    bc.appendChild(b);
}

const JOGADOR = '🐚'; // concha = jogador
const ORCA = '🐋'; // orca   = CPU
const COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

let board = Array(9).fill(null);
let fimDeJogo = false;
let placar = { jogador: 0, empate: 0, orca: 0 };

const celulas = document.querySelectorAll('.celula');
const statusEl = document.getElementById('velha-status')

celulas.forEach(c => c.addEventListener('click', () => jogar(+c.dataset.i)));

function jogar(i) {
    if (fimDeJogo || board[i]) return;
    board[i] = JOGADOR;
    renderizar();
    const fim = verificar();
    if (!fim) {
        statusEl.textContent = 'A orca está pensando...';
        setTimeout(jogadaOrca, 500);
    }
}

function jogadaOrca() {
    if (fimDeJogo) return;
    const dif = document.getElementById('dificuldade').value;
    let idx;
    if (dif === 'facil') {
        idx = jogadaAleatoria();
    } else if (dif === 'medio') {
        idx = Math.random() < .5 ? jogadaMinimax() : jogadaAleatoria();
    } else {
        idx = jogadaMinimax();
    }
    if (idx !== null) {
        board[idx] = ORCA;
        renderizar();
        verificar();
    }
}

function jogadaAleatoria() {
    const livres = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
    return livres.length ? livres[Math.floor(Math.random() * livres.length)] : null;
}

function jogadaMinimax() {
    // tenta ganhar
    for (const combo of COMBOS) {
        const [a, b, c] = combo;
        if (board[a] === ORCA && board[b] === ORCA && board[c] === null) return c;
        if (board[a] === ORCA && board[c] === ORCA && board[b] === null) return b;
        if (board[b] === ORCA && board[c] === ORCA && board[a] === null) return a;
    }
    // bloqueia jogador
    for (const combo of COMBOS) {
        const [a, b, c] = combo;
        if (board[a] === JOGADOR && board[b] === JOGADOR && board[c] === null) return c;
        if (board[a] === JOGADOR && board[c] === JOGADOR && board[b] === null) return b;
        if (board[b] === JOGADOR && board[c] === JOGADOR && board[a] === null) return a;
    }
    // centro
    if (board[4] === null) return 4;
    return jogadaAleatoria();
}

function verificar() {
    for (const [a, b, c] of COMBOS) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            fimDeJogo = true;
            [a, b, c].forEach(i => celulas[i].classList.add('vencedora'));
            if (board[a] === JOGADOR) {
                placar.jogador++;
                statusEl.textContent = 'Você venceu! A orca fugiu!';
            } else {
                placar.orca++;
                statusEl.textContent = 'A orca venceu! Tente de novo!';
            }
            atualizarPlacar();
            return true;
        }
    }
    if (board.every(v => v)) {
        fimDeJogo = true;
        placar.empate++;
        statusEl.textContent = 'Empate! O oceano sorriu pra ambos.';
        atualizarPlacar();
        return true;
    }
    statusEl.textContent = 'Sua vez! Escolha uma célula.';
    return false;
}

function renderizar() {
    celulas.forEach((c, i) => {
        c.textContent = board[i] || '';
        c.classList.toggle('ocupada', !!board[i]);
    });
}

function atualizarPlacar() {
    document.getElementById('pts-jogador').textContent = placar.jogador;
    document.getElementById('pts-empate').textContent = placar.empate;
    document.getElementById('pts-orca').textContent = placar.orca;
}

function reiniciar() {
    board = Array(9).fill(null);
    fimDeJogo = false;
    celulas.forEach(c => { c.textContent = ''; c.classList.remove('ocupada', 'vencedora'); });
    statusEl.textContent = 'Sua vez! Escolha uma célula.';
}

function zerarPlacar() {
    placar = { jogador: 0, empate: 0, orca: 0 };
    atualizarPlacar();
    reiniciar();
}
/* ════════════════════════════════════════════════════════════════════
   5. TROCA PALAVRAS
   Guard: executa somente se .trocar existir na página
════════════════════════════════════════════════════════════════════ */
(function initTrocaPalavras() {
    if (!document.querySelector('.trocar')) return;

    window.trocarPalavra = function () {
        const input = document.getElementById('substituicao');
        const valor = input ? input.value.trim() : '';
        if (!valor) return;

        document.querySelectorAll('.trocar').forEach(function (span) {
            span.textContent = valor;
        });
    };
})();


/* ════════════════════════════════════════════════════════════════════
   6. PEIXES — carrossel + painel de detalhes
   Guard: executa somente se #carrossel-trilho existir na página.

   LÓGICA: migração completa do JS antigo para a nova arquitetura.
   Diferenças em relação à versão anterior (simplificada):
     • Carrega dados de /data/peixes.json via fetch (não mais hardcoded)
     • Centralização matemática do carrossel via viewport height
     • Imagens reais do JSON com fallback para placeholder
     • Scroll detection no carrossel horizontal mobile
     • sincronizarHorizontal() via scrollIntoView
     • limparHtml() e truncar() para dados vindos de API
     • Tags dinâmicas: calorias, proteína, sabor, textura, status
════════════════════════════════════════════════════════════════════ */
(function initPeixes() {

    /* ════════════════════════════════════════════
JAVASCRIPT DA SELEÇAO DE PEIXES
════════════════════════════════════════════ */

    /* ------------------------------------------------
       DADOS E ESTADO
    ------------------------------------------------ */
    let peixes = [];   // array completo vindo da API
    let idxAtivo = 0;   // Indice do peixe selecionado no array `peixes`
    let idxCarrossel = 0;   // Indice do item no centro do carrossel

    // Altura de cada item + gap no carrossel vertical
    const ITEM_H = 60;
    const ITEM_G = 8;
    const PASSO = ITEM_H + ITEM_G; // 68px por posiçAo

    /* ------------------------------------------------
       UTILITARIOS
    ------------------------------------------------ */

    // Remove tags HTML de strings vindas da API
    function limparHtml(str) {
        if (!str) return '';
        return str.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim();
    }

    // Trunca texto longo
    function truncar(str, max) {
        if (!str) return '—';
        return str.length > max ? str.slice(0, max) + '...' : str;
    }

    /* ------------------------------------------------
       CARREGAMENTO DA API
    ------------------------------------------------ */
    async function carregarPeixes() {
        const loading = document.getElementById('loading-screen');
        const erro = document.getElementById('erro-screen');
        const layout = document.getElementById('layout-principal');

        // Garante estado inicial
        if (loading) {
            loading.style.display = 'flex';
            erro.style.display = 'none';
            layout.style.display = 'none';


            try {
                // const resp = await fetch('https://www.fishwatch.gov/api/species');
                const resp = await fetch('data/peixes.json');
                if (!resp.ok) throw new Error('Falha na API');

                const dados = await resp.json();

                // Filtra peixes com nome e com imagem (para o carrossel ficar bonito)
                // Pega até 30 peixes para nAo sobrecarregar
                peixes = dados
                    .filter(p => p['Species Name'] && p['Species Name'].trim() !== '')
                    .slice(0, 30)
                    .map(p => ({
                        nome: p['Species Name'] || 'Sem nome',
                        cientifico: p['Scientific Name'] || '',
                        imagem: p['Species Illustration Photo']?.src || null,
                        habitat: limparHtml(p['Habitat'] || p['Location'] || ''),
                        aparencia: limparHtml(p['Physical Description'] || p['Biology'] || ''),
                        calorias: p['Calories'] || null,
                        proteina: p['Protein'] || null,
                        sabor: p['Taste'] || null,
                        textura: p['Texture'] || null,
                        populacao: p['Population Status'] || null,
                    }));

                if (peixes.length === 0) throw new Error('Sem dados');

                // Monta os dois carrosseis
                montarCarrosselVertical();
                montarCarrosselHorizontal();

                // Exibe o primeiro peixe
                idxAtivo = 0;
                idxCarrossel = 0;
                atualizarEstadoCarrossel();
                exibirDetalhes(0);

                loading.style.display = 'none';
                layout.style.display = 'block';

            } catch (e) {
                loading.style.display = 'none';
                erro.style.display = 'flex';
            }
        }
    }

    /* ------------------------------------------------
       CARROSSEL VERTICAL (desktop)
    ------------------------------------------------ */
    function montarCarrosselVertical() {
        const trilho = document.getElementById('carrossel-trilho');
        trilho.innerHTML = '';

        peixes.forEach((peixe, i) => {
            const item = document.createElement('div');
            item.classList.add('carrossel-item');
            item.dataset.idx = i;

            if (peixe.imagem) {
                const img = document.createElement('img');
                img.src = peixe.imagem;
                img.alt = peixe.nome;
                img.loading = 'lazy';
                item.appendChild(img);
            } else {
                item.innerHTML = '<span class="sem-img">🐟</span>';
            }

            item.addEventListener('click', () => selecionarItem(i));
            trilho.appendChild(item);
        });
    }

    let btn_anterior = document.getElementById('btn_anterior')
    let btn_proximo = document.getElementById('btn_proximo')

    // Move o carrossel e atualiza destaque
    function moverCarrossel(direcao) {
        const novoIdx = idxCarrossel + direcao;
        if (novoIdx < 0 || novoIdx >= peixes.length) return;
        idxCarrossel = novoIdx;
        idxAtivo = novoIdx;
        atualizarEstadoCarrossel();
        exibirDetalhes(idxAtivo);
    }

    if (btn_anterior) {
        btn_anterior.addEventListener('click', () => {
            moverCarrossel(-1);
        });
    }

    if (btn_proximo) {
        btn_proximo.addEventListener('click', () => {
            moverCarrossel(1);
        });
    }

    // Seleciona pelo clique numa imagem
    function selecionarItem(i) {
        idxCarrossel = i;
        idxAtivo = i;
        atualizarEstadoCarrossel();
        exibirDetalhes(idxAtivo);
        sincronizarHorizontal(i);
    }

    // Recalcula posições relativas e move o trilho
    function atualizarEstadoCarrossel() {
        const itens = document.querySelectorAll('.carrossel-item');
        const viewport = document.querySelector('.carrossel-viewport');

        // Altura visIvel do viewport / 2 → posiçAo do centro
        const alturaVisivel = viewport.offsetHeight; // 340px
        const centroPx = alturaVisivel / 2 - ITEM_H / 2;

        // Desloca o trilho para centralizar o item ativo
        // Cada item ocupa PASSO px; o centro fica em centroPx
        const deslocamento = centroPx - idxCarrossel * PASSO;
        document.getElementById('carrossel-trilho').style.transform =
            `translateY(${deslocamento}px)`;

        // Atualiza data-pos de cada item (distAncia do centro)
        itens.forEach((item, i) => {
            const pos = i - idxCarrossel;
            item.dataset.pos = pos;
        });

        // Atualiza indicador
        document.getElementById('indicador-pos').textContent =
            `${idxCarrossel + 1} / ${peixes.length}`;
    }

    /* ------------------------------------------------
       CARROSSEL HORIZONTAL (mobile)
    ------------------------------------------------ */
    function montarCarrosselHorizontal() {
        const cont = document.getElementById('carrossel-horizontal');
        cont.innerHTML = '';

        peixes.forEach((peixe, i) => {
            const item = document.createElement('div');
            item.classList.add('item-h');
            item.dataset.idx = i;
            if (i === 0) item.classList.add('ativo-h');

            if (peixe.imagem) {
                const img = document.createElement('img');
                img.src = peixe.imagem;
                img.alt = peixe.nome;
                img.loading = 'lazy';
                item.appendChild(img);
            } else {
                item.textContent = '🐟';
            }

            item.addEventListener('click', () => {
                idxAtivo = i;
                sincronizarHorizontal(i);
                exibirDetalhes(i);
                // sincroniza o carrossel vertical também
                idxCarrossel = i;
                atualizarEstadoCarrossel();
            });

            cont.appendChild(item);
        });

        // Detecta scroll para atualizar item central
        cont.addEventListener('scroll', () => {
            const itensH = cont.querySelectorAll('.item-h');
            const centroX = cont.scrollLeft + cont.offsetWidth / 2;
            let maisProximo = 0, menorDist = Infinity;
            itensH.forEach((el, i) => {
                const dist = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centroX);
                if (dist < menorDist) { menorDist = dist; maisProximo = i; }
            });
            if (maisProximo !== idxAtivo) {
                idxAtivo = maisProximo;
                sincronizarHorizontal(maisProximo);
                exibirDetalhes(maisProximo);
            }
        });
    }

    function sincronizarHorizontal(i) {
        const itensH = document.querySelectorAll('.item-h');
        itensH.forEach(el => el.classList.remove('ativo-h'));
        if (itensH[i]) {
            itensH[i].classList.add('ativo-h');
            itensH[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    /* ------------------------------------------------
       PAINEL DE DETALHES
    ------------------------------------------------ */
    function exibirDetalhes(i) {
        const peixe = peixes[i];
        const painel = document.getElementById('painel-detalhes');

        // AnimaçAo de fade-out → atualiza → fade-in
        painel.classList.add('atualizando');

        setTimeout(() => {
            // Imagem
            const img = document.getElementById('detalhe-img');
            const placeholder = document.getElementById('placeholder-img');

            if (peixe.imagem) {
                img.src = peixe.imagem;
                img.alt = peixe.nome;
                img.style.display = 'block';
                placeholder.style.display = 'none';
            } else {
                img.style.display = 'none';
                placeholder.style.display = 'block';
            }

            // Textos
            document.getElementById('detalhe-nome').textContent =
                peixe.nome;

            document.getElementById('detalhe-cientifico').textContent =
                peixe.cientifico || '—';

            document.getElementById('detalhe-habitat').textContent =
                truncar(peixe.habitat, 220) || '—';

            document.getElementById('detalhe-aparencia').textContent =
                truncar(peixe.aparencia, 260) || '—';

            // Tags rApidas
            const tagsEl = document.getElementById('detalhe-tags');
            tagsEl.innerHTML = '';
            const tags = [
                peixe.calorias ? ` ${peixe.calorias} kcal` : null,
                peixe.proteina ? ` ${peixe.proteina}g proteIna` : null,
                peixe.sabor ? ` ${peixe.sabor}` : null,
                peixe.textura ? ` ${peixe.textura}` : null,
                peixe.populacao ? ` ${peixe.populacao}` : null,
            ].filter(Boolean);

            tags.forEach(t => {
                const span = document.createElement('span');
                span.classList.add('detalhe-tag');
                span.textContent = t;
                tagsEl.appendChild(span);
            });

            // Fade-in
            painel.classList.remove('atualizando');
        }, 280); // espera o fade-out terminar (transition: 0.3s)
    }

    /* ------------------------------------------------
       INICIALIZAÇAO
    ------------------------------------------------ */
    carregarPeixes();

})();


/* ════════════════════════════════════════════════════════════════════
   ████████████████████████████████████████████████████████████████
   OCEAN CLICKER
   Todo este bloco só executa se #btn-apertar existir na página.
   Isso protege index, forca, peixes e troca-palavras de qualquer
   efeito colateral do código do jogo.
   ████████████████████████████████████████████████████████████████
════════════════════════════════════════════════════════════════════ */
(function initOceanClicker() {
    let clicker_titulo = document.getElementById('clicker-titulo')
    if (clicker_titulo) {
        clicker_titulo.addEventListener('click', () => window.location.href = 'index.html')
    }

    const botao = document.getElementById('btn-apertar');
    if (!botao) return; // ← guard principal: só executa no clicker


    /* ════════════════════════════════════════════════════════════
       7. OCEAN CLICKER — CONFIGURAÇÃO E ESTADO
    ════════════════════════════════════════════════════════════ */

    // ── Upgrades disponíveis ──────────────────────────────────
    const upgrades = {
        // Melhorias (clique direto)
        mais1: { preco: 10, requisito: 10, unico: false, aba: 'Melhorias' },
        mais5: { preco: 120, requisito: 120, unico: false, aba: 'Melhorias' },
        mult11: { preco: 600, requisito: 600, unico: false, aba: 'Melhorias' },
        mais20: { preco: 3000, requisito: 3000, unico: false, aba: 'Melhorias' },
        cardumegrande: { preco: 10000, requisito: 10000, unico: false, aba: 'Melhorias' },
        mult15: { preco: 40000, requisito: 40000, unico: false, aba: 'Melhorias' },
        mais100: { preco: 150000, requisito: 150000, unico: false, aba: 'Melhorias' },
        // Passivas
        auto1: { preco: 80, requisito: 80, unico: true, aba: 'Passivas' },
        rede: { preco: 500, requisito: 500, unico: true, aba: 'Passivas' },
        auto2: { preco: 2000, requisito: 2000, unico: true, aba: 'Passivas' },
        dobro: { preco: 6000, requisito: 6000, unico: true, aba: 'Passivas' },
        bolhadourada: { preco: 18000, requisito: 18000, unico: true, aba: 'Passivas' },
        corrente: { preco: 45000, requisito: 45000, unico: true, aba: 'Passivas' },
        tempestade: { preco: 130000, requisito: 130000, unico: true, aba: 'Passivas' },
        baleia: { preco: 380000, requisito: 380000, unico: true, aba: 'Passivas' },
        // Design
        particulas: { preco: 30, requisito: 30, unico: true, aba: 'Design' },
        somclick: { preco: 50, requisito: 50, unico: true, aba: 'Design' },
        fundoazul: { preco: 150, requisito: 150, unico: true, aba: 'Design' },
        relogio: { preco: 300, requisito: 300, unico: true, aba: 'Design' },
        animacaoclique: { preco: 1000, requisito: 1000, unico: true, aba: 'Design' },
        musica: { preco: 800, requisito: 800, unico: true, aba: 'Design' },
        tituloDinamico: { preco: 5000, requisito: 5000, unico: true, aba: 'Design' },
        vidamarinha: { preco: 100000, requisito: 100000, unico: true, aba: 'Design' },
    };

    // ── Fases de evolução do botão ────────────────────────────
    const fasesEvolucao = [
        { min: 0, emoji: '🦠', nome: 'Célula' },
        { min: 101, emoji: '🧽', nome: 'Esponja do Mar' },
        { min: 1001, emoji: '🐚', nome: 'Coral' },
        { min: 5001, emoji: '🐟', nome: 'Peixe' },
        { min: 20001, emoji: '🦈', nome: 'Tubarão' },
        { min: 100001, emoji: '🐋', nome: 'Baleia' },
        { min: 400001, emoji: '🐙', nome: 'Colossal' },
    ];

    // ── SVGs dos peixes (upgrade Vida Marinha) ────────────────
    const fishSVGs = [
        '<img src="img/vermilion-snapper-fish-silhouette-svgrepo-com.svg" width="45" alt="peixe">',
        '<img src="img/vermilion-snapper-fish-silhouette-svgrepo-com.svg" width="45" alt="peixe">',
        '<img src="img/vermilion-snapper-fish-silhouette-svgrepo-com.svg" width="45" alt="peixe">',
        '<img src="img/anglerfish-fish-sea-svgrepo-com.svg"               width="45" alt="peixe">',
        '<img src="img/anglerfish-fish-sea-svgrepo-com.svg"               width="45" alt="peixe">',
        '<img src="img/anglerfish-fish-sea-svgrepo-com.svg"               width="45" alt="peixe">',
        '<img src="img/fish-food-salmon-svgrepo-com.svg"                  width="45" alt="peixe">',
        '<img src="img/fish-food-salmon-svgrepo-com.svg"                  width="45" alt="peixe">',
        '<img src="img/fish-food-salmon-svgrepo-com.svg"                  width="45" alt="peixe">',
        '<img src="img/food-prawn-sea-svgrepo-com.svg"                    width="45" alt="peixe">',
        '<img src="img/food-prawn-sea-svgrepo-com.svg"                    width="45" alt="peixe">',
        '<img src="img/food-prawn-sea-svgrepo-com.svg"                    width="45" alt="peixe">',
        '<img src="img/food-octopus-sea-svgrepo-com.svg"                  width="45" alt="peixe">',
        '<img src="img/food-octopus-sea-svgrepo-com.svg"                  width="45" alt="peixe">',
        '<img src="img/shark-facing-right-svgrepo-com.svg"                width="45" alt="tubarao">',
        '<img src="img/shark-facing-right-svgrepo-com.svg"                width="45" alt="tubarao">',
        '<img src="img/whale-6-svgrepo-com.svg"                           width="45" alt="tubarao">',
        '<img src="img/whale-6-svgrepo-com.svg"                           width="45" alt="tubarao">',
    ];

    // ── Carregar estado salvo do localStorage ─────────────────
    let pontosAcumulados = parseFloat(localStorage.getItem('pontosAcumulados')) || 0;
    let faseAtual = '';
    let contador = parseFloat(localStorage.getItem('contador')) || 0;
    let click = parseFloat(localStorage.getItem('click')) || 1;
    let cliquesTotal = parseInt(localStorage.getItem('cliquesTotal')) || 0;
    let notificadoSecaoCompra = localStorage.getItem('notificadoSecaoCompra') === 'true';

    const estadoSalvo = JSON.parse(localStorage.getItem('upgrades')) || {};
    for (const id in estadoSalvo) {
        if (upgrades[id]) {
            upgrades[id].preco = estadoSalvo[id].preco;
            upgrades[id].comprado = estadoSalvo[id].comprado;
            upgrades[id].notificado = estadoSalvo[id].notificado;
        }
    }

    // ── Intervalos e flags de estado ─────────────────────────
    let intervaloAuto1 = null;
    let intervaloAuto2 = null;
    let intervaloCorrente = null;
    let intervaloTempestade = null;
    let intervaloBaleia = null;
    let intervaloRelogio = null;

    let intervaloBolha = null;
    let bolhaAtiva = false;
    let multBolhaAtiva = false;
    let timeoutMultBolha = null;

    let venceu = false;
    let pausado = false;
    let primeiroClique = false;

    // ── Referências de DOM (todas no escopo do clicker) ───────
    const textoContador = document.getElementById('textoContador');
    const textoClick = document.getElementById('textoClick');
    const secaoCompra = document.getElementById('secao-compra');
    const spanRelogio = document.getElementById('relogio');
    const containerPopups = document.getElementById('container-popups');
    const elBolhaDourada = document.getElementById('bolha-dourada');
    const elContadorCliques = document.getElementById('contador-cliques');
    const elTextoCTTotal = document.getElementById('textoCliquesTotal');
    const barraFill = document.getElementById('barra-progresso-fill');
    const textoProximo = document.getElementById('texto-proximo-upgrade');
    const textoInicio = document.getElementById('texto-inicio');
    const tituloOnda = document.getElementById('titulo-onda');

    // CORREÇÃO: bolhasContainer é a única referência — a variável
    // duplicada "bcont" que existia antes foi removida
    const fishContainer = document.getElementById('fish-container');
    const bolhasContainer = document.getElementById('bubbles-container');
    const pcont = document.getElementById('particles-container');


    /* ════════════════════════════════════════════════════════
       8. OCEAN CLICKER — INICIALIZAÇÃO DO EFEITO ONDA
    ════════════════════════════════════════════════════════ */
    if (tituloOnda) {
        const letras = tituloOnda.innerText.split('');
        tituloOnda.innerHTML = letras.map(function (l, i) {
            return '<span style="animation-delay:' + (i * 0.08) + 's">' +
                (l === ' ' ? '&nbsp;' : l) + '</span>';
        }).join('');
    }


    /* ════════════════════════════════════════════════════════
       9. OCEAN CLICKER — INICIALIZAÇÃO DO ESTADO
    ════════════════════════════════════════════════════════ */
    atualizarTela();
    atualizarBotaoEvolucao();
    atualizarBarraProgresso();
    verificarDesbloqueios();
    atualizarAvisos();
    verificarMetaCliques();

    if (upgrades.auto1.comprado) ativarAutoClicker1();
    if (upgrades.auto2.comprado) ativarAutoClicker2();
    if (upgrades.corrente.comprado) ativarCorrente();
    if (upgrades.tempestade.comprado) ativarTempestade();
    if (upgrades.baleia.comprado) ativarBaleia();
    if (upgrades.bolhadourada.comprado) ativarBolhaDourada();
    // NOTA: dobro NÃO é re-aplicado aqui — o valor já está salvo no
    // localStorage. Chamar dobroClickPower() no init dobraria o click
    // a cada recarga de página.
    if (upgrades.animacaoclique.comprado) botao.classList.add('aniBasica');
    if (upgrades.fundoazul.comprado) document.body.classList.add('tema-azul-escuro');
    if (upgrades.relogio.comprado) ativarRelogio();
    if (upgrades.somclick.comprado) somClick();
    if (upgrades.tituloDinamico.comprado) ativarTituloDinamico();
    if (upgrades.musica.comprado) ativarMusica();
    if (upgrades.vidamarinha.comprado) ativarVidaMarinha();

    if (cliquesTotal > 0 && textoInicio) {
        textoInicio.style.display = 'none';
    }


    /* ════════════════════════════════════════════════════════
       10. OCEAN CLICKER — CLIQUE NO BOTÃO PRINCIPAL
    ════════════════════════════════════════════════════════ */
    botao.addEventListener('click', function (evento) {

        // Fade do texto de boas-vindas no primeiro clique
        if (!primeiroClique && textoInicio) {
            primeiroClique = true;
            textoInicio.classList.add('fadeout');
            setTimeout(function () { textoInicio.style.display = 'none'; }, 1000);
        }

        let ganho = parseFloat(click);
        let critico = false;

        // Rede de pesca: 20% de chance de dobrar
        if (upgrades.rede.comprado && Math.random() < 0.2) {
            ganho *= 2;
            critico = true;
        }

        // Multiplicador da bolha dourada
        if (multBolhaAtiva) ganho *= 2;

        contador += ganho;
        pontosAcumulados += ganho;
        cliquesTotal++;

        if (upgrades.particulas.comprado) criarParticula(evento, ganho, critico);

        atualizarTela();
        atualizarBotaoEvolucao();
        atualizarBarraProgresso();
        verificarDesbloqueios();
        atualizarAvisos();
        verificarVitoria();
        verificarMetaCliques();
        salvarTudo();
    });


    /* ════════════════════════════════════════════════════════
       11. OCEAN CLICKER — EVOLUÇÃO DO BOTÃO
       Muda o emoji conforme pontos TOTAIS (não regride ao gastar)
    ════════════════════════════════════════════════════════ */
    function atualizarBotaoEvolucao() {
        let faseCorreta = fasesEvolucao[0];
        for (let i = 0; i < fasesEvolucao.length; i++) {
            if (pontosAcumulados >= fasesEvolucao[i].min) faseCorreta = fasesEvolucao[i];
        }

        if (faseCorreta.nome !== faseAtual) {
            const faseAnterior = faseAtual;
            faseAtual = faseCorreta.nome;
            botao.textContent = faseCorreta.emoji;

            if (faseAnterior !== '') {
                mostrarPopup('Evolução!', 'Seu oceano virou: ' + faseCorreta.emoji + ' ' + faseCorreta.nome);
            }
        }
    }


    /* ════════════════════════════════════════════════════════
       12. OCEAN CLICKER — COMPRAR UPGRADE
    ════════════════════════════════════════════════════════ */
    // Exposto globalmente pois é chamado via onclick no HTML
    window.comprar = function (id) {
        const upg = upgrades[id];
        if (!upg) return;
        if (upg.unico && upg.comprado) return;

        if (contador < upg.preco) {
            alert('Pontos insuficientes!');
            return;
        }

        contador -= upg.preco;

        // Melhorias — juros 1.3x (aditivos) e 1.5x (multiplicativos)
        if (id === 'mais1') { click += 1; upg.preco = Math.floor(upg.preco * 1.3); }
        if (id === 'mais5') { click += 5; upg.preco = Math.floor(upg.preco * 1.3); }
        if (id === 'mult11') { click *= 1.1; upg.preco = Math.floor(upg.preco * 1.5); }
        if (id === 'mais20') { click += 20; upg.preco = Math.floor(upg.preco * 1.3); }
        if (id === 'cardumegrande') { click += 50; upg.preco = Math.floor(upg.preco * 1.3); }
        if (id === 'mult15') { click *= 1.5; upg.preco = Math.floor(upg.preco * 1.5); }
        if (id === 'mais100') { click += 100; upg.preco = Math.floor(upg.preco * 1.3); }

        // Passivas
        if (id === 'auto1') { upg.comprado = true; ativarAutoClicker1(); }
        if (id === 'auto2') { upg.comprado = true; ativarAutoClicker2(); }
        if (id === 'rede') { upg.comprado = true; }
        if (id === 'dobro') { upg.comprado = true; dobroClickPower(); }
        if (id === 'bolhadourada') {
            upg.comprado = true;
            ativarBolhaDourada();
            mostrarPopup('🫧 Bolhas douradas!', 'Fique de olho na tela — elas aparecem por pouco tempo!');
        }
        if (id === 'corrente') { upg.comprado = true; ativarCorrente(); }
        if (id === 'tempestade') { upg.comprado = true; ativarTempestade(); }
        if (id === 'baleia') { upg.comprado = true; ativarBaleia(); }

        // Design
        if (id === 'particulas') { upg.comprado = true; }
        if (id === 'somclick') { upg.comprado = true; somClick(); }
        if (id === 'animacaoclique') { upg.comprado = true; botao.classList.add('aniBasica'); }
        if (id === 'fundoazul') { upg.comprado = true; document.body.classList.add('tema-azul-escuro'); }
        if (id === 'relogio') { upg.comprado = true; ativarRelogio(); }
        if (id === 'musica') { upg.comprado = true; ativarMusica(); }
        if (id === 'tituloDinamico') { upg.comprado = true; ativarTituloDinamico(); }
        if (id === 'vidamarinha') { upg.comprado = true; ativarVidaMarinha(); }

        atualizarTela();
        atualizarBarraProgresso();
        verificarDesbloqueios();
        atualizarAvisos();
        salvarTudo();
    };


    /* ════════════════════════════════════════════════════════
       13. OCEAN CLICKER — BARRA DE PROGRESSO
    ════════════════════════════════════════════════════════ */
    function atualizarBarraProgresso() {
        const todos = Object.keys(upgrades).map(function (id) {
            return { id: id, requisito: upgrades[id].requisito };
        }).sort(function (a, b) { return a.requisito - b.requisito; });

        let proximoRequisito = null;
        let proximoNome = null;
        let anteriorRequisito = 0;

        for (let i = 0; i < todos.length; i++) {
            const req = todos[i].requisito;
            if (contador >= req) { anteriorRequisito = req; continue; }

            proximoRequisito = req;
            const card = document.getElementById('card-' + todos[i].id);
            proximoNome = card ? card.querySelector('.nome').textContent.trim() : todos[i].id;
            break;
        }

        if (proximoRequisito === null) {
            barraFill.style.width = '100%';
            textoProximo.textContent = 'Tudo desbloqueado! ';
            return;
        }

        const intervalo = proximoRequisito - anteriorRequisito;
        const progresso = Math.max(0, contador - anteriorRequisito);
        const porcentagem = Math.min(100, Math.floor((progresso / intervalo) * 100));

        barraFill.style.width = porcentagem + '%';
        textoProximo.textContent = 'Próximo: ' + proximoNome + ' (' + porcentagem + '%)';
    }


    /* ════════════════════════════════════════════════════════
       14. OCEAN CLICKER — DESBLOQUEIOS
    ════════════════════════════════════════════════════════ */
    function verificarDesbloqueios() {
        if (contador >= 10 && !secaoCompra.classList.contains('visivel')) {
            secaoCompra.classList.add('visivel');
            setTimeout(function () { secaoCompra.style.opacity = '1'; }, 50);
        }
        if (contador >= 10 && !notificadoSecaoCompra) {
            notificadoSecaoCompra = true;
            localStorage.setItem('notificadoSecaoCompra', 'true');
            mostrarPopup('Loja desbloqueada!', 'Acesse as abas à direita.');
        }

        for (const id in upgrades) {
            const upg = upgrades[id];
            const card = document.getElementById('card-' + id);
            if (!card) continue;

            const recemDesbloqueado = contador >= upg.requisito && !upg.notificado && !upg.comprado;
            if (recemDesbloqueado) {
                card.classList.add('desbloqueado');
                upg.notificado = true;
                mostrarPopup('Novo upgrade em ' + upg.aba + '!', card.querySelector('.nome').textContent);
                salvarTudo();
            }

            if (contador >= upg.requisito || upg.comprado || upg.notificado) {
                card.classList.add('desbloqueado');
            }

            if (upg.unico && upg.comprado) {
                if (!card.classList.contains('ja-comprado')) {
                    card.classList.add('ja-comprado');
                    card.onclick = null;
                    card.querySelector('.preco').textContent = 'Já comprado ✓';
                }
                continue;
            }

            if (contador < upg.preco) {
                card.classList.add('sem-pontos');
            } else {
                card.classList.remove('sem-pontos');
            }

            const spanPreco = document.getElementById('preco-' + id);
            if (spanPreco) {
                spanPreco.textContent = 'Custo: ' + Math.floor(upg.preco).toLocaleString('pt-BR') + ' pts';
            }
        }
    }


    /* ════════════════════════════════════════════════════════
       15. OCEAN CLICKER — AVISOS DE ABA VAZIA
    ════════════════════════════════════════════════════════ */
    function atualizarAvisos() {
        const abaParaIds = {
            melhorias: ['mais1', 'mais5', 'mult11', 'mais20', 'cardumegrande', 'mult15', 'mais100'],
            passivas: ['auto1', 'rede', 'auto2', 'dobro', 'bolhadourada', 'corrente', 'tempestade', 'baleia'],
            design: ['particulas', 'somclick', 'fundoazul', 'relogio', 'animacaoclique', 'musica', 'tituloDinamico', 'vidamarinha'],
        };

        for (const nomeAba in abaParaIds) {
            const aviso = document.getElementById('aviso-' + nomeAba);
            const temAlgum = abaParaIds[nomeAba].some(function (id) {
                const card = document.getElementById('card-' + id);
                return card && card.classList.contains('desbloqueado');
            });
            if (aviso) aviso.style.display = temAlgum ? 'none' : 'block';
        }
    }


    /* ════════════════════════════════════════════════════════
       16. OCEAN CLICKER — POP-UPS DE NOTIFICAÇÃO
    ════════════════════════════════════════════════════════ */
    function mostrarPopup(titulo, descricao) {
        const popup = document.createElement('div');
        popup.classList.add('popup-notificacao');
        popup.innerHTML =
            '<div class="popup-titulo">' + titulo + '</div>' +
            '<div class="popup-descricao">' + descricao + '</div>';
        containerPopups.appendChild(popup);

        setTimeout(function () { popup.classList.add('visivel'); }, 10);
        setTimeout(function () {
            popup.classList.remove('visivel');
            setTimeout(function () { popup.remove(); }, 300);
        }, 4000);
    }


    /* ════════════════════════════════════════════════════════
       17. OCEAN CLICKER — PARTÍCULA DE PONTOS
       Classe CSS: .clicker-particula (nome único, sem conflito
       com .bg-particula das páginas normais)
    ════════════════════════════════════════════════════════ */
    function criarParticula(evento, ganho, critico) {
        const el = document.createElement('div');
        // CORRIGIDO: era 'particula' — renomeado para 'clicker-particula'
        el.classList.add('clicker-particula');
        if (critico) {
            el.classList.add('critico');
            el.textContent = '✦ +' + Math.floor(ganho);
        } else {
            el.textContent = '+' + Math.floor(ganho);
        }
        el.style.left = evento.clientX + 'px';
        el.style.top = evento.clientY + 'px';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 800);
    }


    /* ════════════════════════════════════════════════════════
       18. OCEAN CLICKER — META DE CLIQUES
    ════════════════════════════════════════════════════════ */
    function verificarMetaCliques() {
        if (elTextoCTTotal) elTextoCTTotal.textContent = cliquesTotal.toLocaleString('pt-BR');

        if (cliquesTotal >= 1500 && elContadorCliques) {
            elContadorCliques.style.display = 'inline';
        }

        if (cliquesTotal >= 5000 && !localStorage.getItem('notificado5000')) {
            localStorage.setItem('notificado5000', 'true');
            mostrarPopup(' Marco atingido!', '5.000 cliques! Você é dedicado!');
        }
    }


    /* ════════════════════════════════════════════════════════
       19. OCEAN CLICKER — BOLHA DOURADA
    ════════════════════════════════════════════════════════ */
    function ativarBolhaDourada() {
        if (intervaloBolha) return;
        agendarProximaBolha();
    }

    function agendarProximaBolha() {
        const espera = Math.random() * 24000 + 26000;
        intervaloBolha = setTimeout(mostrarBolhaDourada, espera);
    }

    function mostrarBolhaDourada() {
        if (bolhaAtiva) return;
        bolhaAtiva = true;

        const maxX = window.innerWidth * 0.6 - 60;
        const maxY = window.innerHeight - 120;
        const x = Math.random() * maxX + 20;
        const y = Math.random() * (maxY - 100) + 80;

        elBolhaDourada.style.left = x + 'px';
        elBolhaDourada.style.top = y + 'px';
        elBolhaDourada.style.display = 'block';

        intervaloBolha = setTimeout(function () {
            esconderBolhaDourada();
            agendarProximaBolha();
        }, 8000);
    }

    function esconderBolhaDourada() {
        elBolhaDourada.style.display = 'none';
        bolhaAtiva = false;
    }

    // Exposto globalmente pois é chamado via onclick no HTML
    window.clicarBolhaDourada = function () {
        clearTimeout(intervaloBolha);
        esconderBolhaDourada();

        if (Math.random() < 0.5) {
            const bonus = Math.floor(click * 100);
            contador += bonus;
            pontosAcumulados += bonus;
            mostrarPopup('🫧 Bolha dourada!', '+' + bonus.toLocaleString('pt-BR') + ' pontos!');
        } else {
            multBolhaAtiva = true;
            mostrarPopup('🫧 Bolha dourada!', '2x pontos por 30 segundos!');
            if (timeoutMultBolha) clearTimeout(timeoutMultBolha);
            timeoutMultBolha = setTimeout(function () { multBolhaAtiva = false; }, 30000);
        }

        atualizarTela();
        atualizarBotaoEvolucao();
        atualizarBarraProgresso();
        verificarDesbloqueios();
        atualizarAvisos();
        verificarVitoria();
        salvarTudo();
        agendarProximaBolha();
    };


    /* ════════════════════════════════════════════════════════
       20. OCEAN CLICKER — VITÓRIA (meta: 1.000.000 pts)
    ════════════════════════════════════════════════════════ */
    function verificarVitoria() {
        if (contador >= 1000000 && !venceu) {
            venceu = true;
            setTimeout(mostrarTelaVitoria, 100);
        }
    }

    function mostrarTelaVitoria() {
        const overlay = document.createElement('div');
        overlay.id = 'tela-vitoria';
        overlay.innerHTML =
            '<div class="vitoria-caixa">' +
            '<div class="vitoria-emoji">🏆</div>' +
            '<div class="vitoria-titulo">Você ganhou!</div>' +
            '<div class="vitoria-descricao">Parabéns! Você construiu um oceano completo com 1.000.000 pontos!</div>' +
            '<button class="vitoria-btn" onclick="resetarSemConfirmar()">Jogar novamente</button>' +
            '<button class="vitoria-btn secundario" onclick="document.getElementById(\'tela-vitoria\').remove()">Continuar</button>' +
            '</div>';
        document.body.appendChild(overlay);
    }

    window.resetarSemConfirmar = function () {
        localStorage.clear();
        location.reload();
    };


    /* ════════════════════════════════════════════════════════
       21. OCEAN CLICKER — PASSIVAS
    ════════════════════════════════════════════════════════ */
    function ativarAutoClicker1() {
        if (intervaloAuto1) return;
        intervaloAuto1 = setInterval(function () {
            if (pausado) return;
            const g = click;
            contador += g; pontosAcumulados += g;
            atualizarTela(); atualizarBotaoEvolucao(); atualizarBarraProgresso();
            verificarDesbloqueios(); atualizarAvisos(); verificarVitoria(); salvarTudo();
        }, 3000);
    }

    function ativarAutoClicker2() {
        if (intervaloAuto2) return;
        intervaloAuto2 = setInterval(function () {
            if (pausado) return;
            const g = parseFloat(click);
            contador += g; pontosAcumulados += g;
            atualizarTela(); atualizarBotaoEvolucao(); atualizarBarraProgresso();
            verificarDesbloqueios(); atualizarAvisos(); verificarVitoria(); salvarTudo();
        }, 1000);
    }

    function ativarCorrente() {
        if (intervaloCorrente) return;
        intervaloCorrente = setInterval(function () {
            if (pausado) return;
            const g = parseFloat(click);
            contador += g; pontosAcumulados += g;
            atualizarTela(); atualizarBotaoEvolucao(); atualizarBarraProgresso();
            verificarDesbloqueios(); verificarVitoria(); salvarTudo();
        }, 5000);
    }

    function ativarTempestade() {
        if (intervaloTempestade) return;
        intervaloTempestade = setInterval(function () {
            if (pausado) return;
            const bonus = parseFloat(click) * 5;
            contador += bonus; pontosAcumulados += bonus;
            mostrarPopup('⚡ Tempestade!', '+' + Math.floor(bonus).toLocaleString('pt-BR') + ' pts');
            atualizarTela(); atualizarBotaoEvolucao(); atualizarBarraProgresso();
            verificarDesbloqueios(); verificarVitoria(); salvarTudo();
        }, 30000);
    }

    function ativarBaleia() {
        if (intervaloBaleia) return;
        intervaloBaleia = setInterval(function () {
            if (pausado) return;
            const g = parseFloat(click) * 2;
            contador += g; pontosAcumulados += g;
            atualizarTela(); atualizarBotaoEvolucao(); atualizarBarraProgresso();
            verificarDesbloqueios(); verificarVitoria(); salvarTudo();
        }, 1000);
    }

    function dobroClickPower() { click *= 2; }


    /* ════════════════════════════════════════════════════════
       22. OCEAN CLICKER — VIDA MARINHA
       CORRIGIDO: 'particula-fundo' → 'bg-particula'
    ════════════════════════════════════════════════════════ */
    function ativarVidaMarinha() {
        fishContainer.classList.add('ativo');

        // Gerar peixes
        for (let i = 0; i < fishSVGs.length; i++) {
            const wrapper = document.createElement('div');
            wrapper.classList.add('peixe');
            wrapper.innerHTML = fishSVGs[i % fishSVGs.length];

            const peixeImg = wrapper.querySelector('img');
            if (peixeImg && peixeImg.alt === 'tubarao') {
                peixeImg.style.width = (100 + Math.random() * 60) + 'px';
            }

            const topVal = 10 + Math.random() * 70;
            const dur = 18 + Math.random() * 20;
            const delay = Math.random() * 15;

            wrapper.style.cssText =
                'top:' + topVal + 'vh;' +
                'animation-duration:' + dur.toFixed(1) + 's;' +
                'animation-delay:-' + delay.toFixed(1) + 's;';

            fishContainer.appendChild(wrapper);
        }

        // Gerar partículas brilhantes de fundo
        // CORRIGIDO: era 'particula-fundo' → renomeado para 'bg-particula'
        for (let i = 0; i < 70; i++) {
            const p = document.createElement('div');
            p.classList.add('bg-particula');
            const size = Math.random() * 3.5 + 1;
            p.style.cssText =
                'width:' + size + 'px;' +
                'height:' + size + 'px;' +
                'left:' + (Math.random() * 100) + 'vw;' +
                'top:' + (Math.random() * 100) + 'vh;' +
                'animation-duration:' + (Math.random() * 3 + 2).toFixed(1) + 's;' +
                'animation-delay:' + (Math.random() * 5).toFixed(1) + 's;';
            pcont.appendChild(p);
        }
    }


    /* ════════════════════════════════════════════════════════
       23. OCEAN CLICKER — DESIGN (relógio, música, som, título)
    ════════════════════════════════════════════════════════ */
    function ativarRelogio() {
        // Bolhas decorativas
        bolhasContainer.classList.add('ativo');
        for (let i = 0; i < 18; i++) {
            const b = document.createElement('div');
            b.classList.add('bolha');
            const size = Math.random() * 28 + 8;
            b.style.cssText =
                'width:' + size + 'px;' +
                'height:' + size + 'px;' +
                'left:' + (Math.random() * 100) + 'vw;' +
                'animation-duration:' + (Math.random() * 7 + 5).toFixed(1) + 's;' +
                'animation-delay:' + (Math.random() * 8).toFixed(1) + 's;';
            bolhasContainer.appendChild(b);
        }

        // Relógio
        if (intervaloRelogio) return;
        if (spanRelogio) spanRelogio.textContent = new Date().toLocaleTimeString('pt-BR');
        intervaloRelogio = setInterval(function () {
            if (spanRelogio) spanRelogio.textContent = new Date().toLocaleTimeString('pt-BR');
        }, 1000);
    }

    function ativarMusica() {
        document.addEventListener('click', function iniciarSom() {
            const audio = document.getElementById('som-bolhas');
            if (audio) { audio.volume = 0.30; audio.play(); }
        }, { once: true });
    }

    function somClick() {
        const audioclique = document.getElementById('audio-clique');
        if (!audioclique) return;
        audioclique.volume = 0.10;
        botao.addEventListener('click', function () {
            audioclique.currentTime = 0;
            audioclique.play();
        });
    }

    function ativarTituloDinamico() {
        // CORRIGIDO: a variável local 'intervaloTitulo' era declarada e
        // logo verificada — nunca seria truthy. Usamos uma flag de escopo.
        let ativo = false;
        if (ativo) return;
        ativo = true;
        setInterval(function () {
            document.title = '[' + Math.floor(contador).toLocaleString('pt-BR') + ' pts] Ocean Clicker';
        }, 1000);
    }


    /* ════════════════════════════════════════════════════════
       24. OCEAN CLICKER — FOCUS / BLUR (pausa)
    ════════════════════════════════════════════════════════ */
    window.addEventListener('blur', function () {
        pausado = true;
        mostrarPopup('Te vejo outra hora 👋', 'O jogo está pausado.');
    });

    window.addEventListener('focus', function () {
        pausado = false;
        mostrarPopup('Continue clicando!', 'Os auto-clickers retomaram.');
    });


    /* ════════════════════════════════════════════════════════
       25. OCEAN CLICKER — TROCA DE ABA
    ════════════════════════════════════════════════════════ */
    window.trocarAba = function (nomeAba) {
        document.querySelectorAll('.painel-aba').forEach(function (p) { p.classList.remove('ativa'); });
        document.querySelectorAll('.aba-btn').forEach(function (b) { b.classList.remove('ativa'); });
        document.getElementById('painel-' + nomeAba).classList.add('ativa');

        const indice = { melhorias: 0, passivas: 1, design: 2 };
        const btns = document.querySelectorAll('.aba-btn');
        if (btns[indice[nomeAba]]) btns[indice[nomeAba]].classList.add('ativa');
    };


    /* ════════════════════════════════════════════════════════
       26. OCEAN CLICKER — AUXILIARES
    ════════════════════════════════════════════════════════ */
    function atualizarTela() {
        if (textoContador) textoContador.textContent = Math.floor(contador).toLocaleString('pt-BR');
        if (textoClick) textoClick.textContent = parseFloat(click).toFixed(2);
    }

    function salvarTudo() {
        localStorage.setItem('contador', contador);
        localStorage.setItem('click', click);
        localStorage.setItem('cliquesTotal', cliquesTotal);
        localStorage.setItem('pontosAcumulados', pontosAcumulados);

        const estado = {};
        for (const id in upgrades) {
            estado[id] = {
                preco: upgrades[id].preco,
                comprado: upgrades[id].comprado,
                notificado: upgrades[id].notificado,
            };
        }
        localStorage.setItem('upgrades', JSON.stringify(estado));
    }

    window.resetar = function () {
        if (confirm('Tem certeza? Todo o progresso será perdido.')) {
            localStorage.clear();
            location.reload();
        }
    };

})(); // ← fim do IIFE do Ocean Clicker