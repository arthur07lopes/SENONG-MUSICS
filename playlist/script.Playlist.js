const CAPA_PADRAO = "playlist img.jpg";
const CHAVE = "playlist_ids";

const lista = document.getElementById("lista_musicas");
const contagem = document.getElementById("contagem");
const modal = document.getElementById("modal");
const btnAbrir = document.getElementById("btn_abrir");
const btnFechar = document.getElementById("btn_fechar");
const busca = document.getElementById("busca");
const resultados = document.getElementById("resultados");
const statusModal = document.getElementById("status_modal");
const topo = document.getElementById("topo");

let catalogo = [];
let idsPlaylist = [];

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function salvar() {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(idsPlaylist));
    } catch (e) {}
}

function carregarIds() {
    try {
        const salvo = localStorage.getItem(CHAVE);
        if (salvo) return JSON.parse(salvo);
    } catch (e) {}
    return catalogo.filter((m)=> m.naPlaylist).map((m) => m.id);
}

/*Playlist*/
function criarLinha(musica) {
    const div= document.createElement("div");
    div.className ="musica";

    const img = document.createElement("img");
    img.className = "capa_musica";
    img.alt ="capa do álbum";
    img.src = musica.capa || CAPA_PADRAO;

    const info = document.createElement("div");
    info.className = "info_musica";

    const principais = document.createElement("div");
    principais.className = "dados_principais";

    const artista = document.createElement("span");
    artista.className = "artista";
    artista.textContent = musica.artista;

    const nome = document.createElement("span");
    nome.className = "nome_musica";
    nome.textContent = musica.nome;

    principais.append(artista, nome);

    const duracao = document.createElement("span");
    duracao.className = "duracao";
    duracao.textContent = musica.duracao +" min";

    info.append(principais, duracao);
    div.append(img, info);

    if (musica.spotifyId) {
        const titulo = musica.nome + " - " + musica.artista;
        div.setAttribute("role", "group");
        div.setAttribute("aria-label", titulo);

        const iframe = document.createElement("iframe");
        iframe.className = "player_spotify";
        iframe.src = "https://open.spotify.com/embed/track/" + musica.spotifyId;
        iframe.title = "Player do Spotify: " + titulo;
        iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        iframe.loading = "lazy";
        div.appendChild(iframe);
    }
    return div;
}

function renderPlaylist() {
    lista.innerHTML = "";
    const musicas = idsPlaylist
        .map((id) => catalogo.find((m) => m.id === id))
        .filter(Boolean);

    const total = musicas.length;
    if (total === 0) {
        const vazio = document.createElement("div");
        vazio.className = "vazio";
        vazio.textContent = "Nenhuma música na playlist. Clique em “Adicionar música”.";
        lista.appendChild(vazio);
    } else {
        musicas.forEach((m) => lista.appendChild(criarLinha(m)));
    }

    contagem.textContent = total + (total === 1 ? " música" : " músicas");
}

/*Aba de busca*/
function renderResultados() {
    const termo = normalizar(busca.value.trim());
    resultados.innerHTML = "";

    const encontradas = catalogo.filter((m) =>
        normalizar(m.nome + " " + m.artista).includes(termo)
    );

    if (encontradas.length === 0) {
        const vazio = document.createElement("div");
        vazio.className = "vazio";
        vazio.textContent = "Nenhuma música encontrada.";
        resultados.appendChild(vazio);
        return;
    }
    encontradas.forEach((m) => {
        const item = document.createElement("div");
        item.className = "resultado";

        const img = document.createElement("img");
        img.className = "resultado_capa";
        img.alt = "capa do álbum";
        img.src = m.capa || CAPA_PADRAO;

        const textos = document.createElement("div");
        textos.className = "resultado_textos";

        const nome = document.createElement("span");
        nome.className = "nome_musica";
        nome.textContent = m.nome;

        const artista = document.createElement("span");
        artista.className = "artista";
        artista.textContent = m.artista + " · " + m.duracao + " min";

        textos.append(nome, artista);

        const btn = document.createElement("button");
        const jaAdicionada = idsPlaylist.includes(m.id);
        btn.className = "btn_item";
        btn.textContent = jaAdicionada ? "Na playlist" : "Adicionar";
        btn.disabled = jaAdicionada;
        btn.addEventListener("click", () => adicionar(m.id));

        item.append(img, textos, btn);
        resultados.appendChild(item);
    });
}

function adicionar(id) {
    if (idsPlaylist.includes(id)) return;
    idsPlaylist.push(id);
    salvar();
    renderPlaylist();
    renderResultados();
    // O botão clicado foi recriado/desabilitado; devolve o foco ao diálogo.
    statusModal.textContent = "Música adicionada à playlist.";
    busca.focus();
}

let focoAnterior = null;

function abrirModal() {
    focoAnterior = document.activeElement;
    modal.hidden = false;
    topo.inert = true;
    lista.inert = true;
    busca.value = "";
    statusModal.textContent = "";
    renderResultados();
    busca.focus();
}

function fecharModal() {
    modal.hidden = true;
    topo.inert = false;
    lista.inert = false;
    (focoAnterior || btnAbrir).focus();
}

btnAbrir.addEventListener("click", abrirModal);
btnFechar.addEventListener("click", fecharModal);
busca.addEventListener("input", renderResultados);
modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
});
document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") fecharModal();
    if (e.key === "Tab") {
        const foco = [...modal.querySelectorAll("button, input")].filter((el) => !el.disabled);
        const primeiro = foco[0];
        const ultimo = foco[foco.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
            e.preventDefault();
            ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
            e.preventDefault();
            primeiro.focus();
        }
    }
});

async function iniciar() {
    try {
        const resposta = await fetch("musicas.json");
        if (!resposta.ok) throw new Error("Erro " + resposta.status);
        catalogo = await resposta.json();
        idsPlaylist = carregarIds();
        renderPlaylist();
    } catch (e) {
        lista.innerHTML = "";
        const aviso = document.createElement("div");
        aviso.className = "vazio";
        aviso.textContent = "Não foi possível carregar musicas.json. Abra o projeto com um servidor local (ex: Live Server do VS Code).";
        lista.appendChild(aviso);
        btnAbrir.disabled = true;
        console.error(e);
    }
}
iniciar();
