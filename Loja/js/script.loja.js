
const produtos = [
    {
        id: 1,
        nome: "Ten",
        artista: "Pearl Jam",
        preco: 149.90,
        imagem: "/FOTOS SENONG MUSICS/capas,discos, bandas e outros/Pearl Jam - Ten/Ten (capa).png"
    },
    {
        id: 2,
        nome: "36 Chambers",
        artista: "Wu-Tang Clan",
        preco: 129.90,
        imagem: "/FOTOS SENONG MUSICS/capas,discos, bandas e outros/Enter The Wu-Tang Clan (36 Chambers)/36 Chambers.png"
    },
    {
        id: 3,
        nome: "The Dark Side of the Moon",
        artista: "Pink Floyd",
        preco: 179.90,
        imagem: "/FOTOS SENONG MUSICS/capas,discos, bandas e outros/Pink Floyd - Dark Side Of The Moon/Dark_Side_of_the_Moon (Capa).png"
    },
    {
        id: 4,
        nome: "Revolver",
        artista: "The Beatles",
        preco: 139.90,
        imagem: "/FOTOS SENONG MUSICS/capas,discos, bandas e outros/the beatles - revolver/Revolver (capa).png"
    }
];


let carrinho = [];
let numeroPedido = 1000;

// Exibir produtos na loja
function carregarProdutos() {
    const vitrine = document.getElementById("produtos");

    vitrine.innerHTML = "";

    produtos.forEach(produto => {
        vitrine.innerHTML += `
            <div class="card">

                <img src="${produto.imagem}" alt="${produto.nome}">

                <h3>${produto.nome}</h3>

                <span class="artista">${produto.artista}</span>

                <p>${produto.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })}</p>

                <button onclick="adicionar(${produto.id})">
                    Adicionar ao carrinho
                </button>

            </div>
        `;
    });
}

// Adicionar produto ao carrinho
function adicionar(id) {
    const produto = produtos.find(item => item.id === id);

    const existente = carrinho.find(item => item.id === id);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

// Atualizar carrinho
function atualizarCarrinho() {
    const itens = document.getElementById("itens-carrinho");
    let total = 0;
    let quantidadeTotal = 0;

    itens.innerHTML = "";

    carrinho.forEach((produto, indice) => {
        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;
        quantidadeTotal += produto.quantidade;

        itens.innerHTML += `
            <div class="item-carrinho">

                <div>
                    <strong>${produto.nome}</strong>

                    <p>
                        ${produto.quantidade} x ${produto.preco.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                        })}
                    </p>
                </div>

                <div class="controles">

                    <button onclick="alterarQuantidade(${indice}, -1)">−</button>

                    <span>${produto.quantidade}</span>

                    <button onclick="alterarQuantidade(${indice}, 1)">+</button>

                    <button class="remover" onclick="remover(${indice})">
                        Remover
                    </button>

                </div>

            </div>
        `;
    });

    document.getElementById("quantidade").textContent = quantidadeTotal;

    document.getElementById("total").textContent =
        "Total: " + total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
}

// Aumentar ou diminuir quantidade
function alterarQuantidade(indice, valor) {
    carrinho[indice].quantidade += valor;

    if (carrinho[indice].quantidade <= 0) {
        carrinho.splice(indice, 1);
    }

    atualizarCarrinho();
}

// Remover produto
function remover(indice) {
    carrinho.splice(indice, 1);
    atualizarCarrinho();
}

// Mostrar ou esconder carrinho
function mostrarCarrinho() {
    const carrinhoElemento = document.getElementById("carrinho");

    if (carrinhoElemento.style.display === "block") {
        carrinhoElemento.style.display = "none";
    } else {
        carrinhoElemento.style.display = "block";
        carrinhoElemento.scrollIntoView({
            behavior: "smooth"
        });
    }
}

// Abrir checkout
function abrirCheckout() {
    if (carrinho.length === 0) {
        alert("Adicione algum disco ao carrinho primeiro!");
        return;
    }

    document.getElementById("checkout").style.display = "block";

    document.getElementById("checkout").scrollIntoView({
        behavior: "smooth"
    });
}

// Processar compra simulada
document.getElementById("form-checkout").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const pagamento = document.getElementById("pagamento").value;

    let total = 0;
    let resumo = "";

    carrinho.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;

        resumo += `
            <p>${produto.nome} — ${produto.quantidade} unidade(s)</p>
        `;
    });

    numeroPedido++;

    document.getElementById("mensagem-pedido").innerHTML = `
        Olá, <strong>${nome}</strong>!

        <br><br>

        Pedido nº <strong>${numeroPedido}</strong>

        <br><br>

        ${resumo}

        <br>

        <strong>Total: ${total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}</strong>

        <br><br>

        Pagamento selecionado: <strong>${pagamento}</strong>

        <br><br>

        <span>Pagamento e pedido simulados com sucesso!</span>
    `;

    document.getElementById("carrinho").style.display = "none";
    document.getElementById("checkout").style.display = "none";
    document.getElementById("confirmacao").style.display = "block";

    carrinho = [];
    atualizarCarrinho();

    document.getElementById("confirmacao").scrollIntoView({
        behavior: "smooth"
    });
});

// Voltar para a loja
function voltarLoja() {
    document.getElementById("confirmacao").style.display = "none";

    document.getElementById("catalogo").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("form-checkout").reset();
}

// Inicializar loja
carregarProdutos();
atualizarCarrinho();
