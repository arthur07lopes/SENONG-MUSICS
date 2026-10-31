"use-strict";

const formulario = document.querySelector("#form-cadastro");
const nome = document.querySelector("#nome");
const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const confirmacao = document.querySelector("#confirmar-senha");
const mensagem = document.querySelector("#mensagem-formulario");
const botaoMostrarSenhas = document.querySelector("#mostrar-senhas");

const campos = [nome, email, senha, confirmacao];

botaoMostrarSenhas.addEventListener("click", () => {
    const exibir = senha.type === "password";
    senha.type = exibir ? "text" : "password";
    confirmacao.type = exibir ? "text" : "password";
    botaoMostrarSenhas.textContent = exibir ? "Ocultar senhas" : "Exibir senhas";
});
 
function mostrarErro(campo, texto) {
    campo.setAttribute("aria-invalid", "true");
    document.querySelector("#" + campo.id + "-erro").textContent = texto;
}
 
function limparErros() {
    for (const campo of campos) {
        campo.removeAttribute("aria-invalid");
        document.querySelector("#" + campo.id + "-erro").textContent = "";
    }
    mensagem.textContent = "";
}
 
formulario.addEventListener("submit", async (event) => {
    event.preventDefault();
    limparErros();
 

    const erros = [];
 
    if (nome.value.trim().length < 3) {
        erros.push([nome, "Erro: informe seu nome completo, com pelo menos 3 caracteres."]);
    }
    if (email.value.trim() === "" || email.validity.typeMismatch) {
        erros.push([email, "Erro: digite um e-mail válido, como nome@exemplo.com."]);
    }
    if (senha.value.length < 8) {
        erros.push([senha, "Erro: a senha precisa ter no mínimo 8 caracteres."]);
    }
    if (confirmacao.value !== senha.value) {
        erros.push([confirmacao, "Erro: as senhas não são iguais."]);
    }
 
    if (erros.length > 0) {
        for (const [campo, texto] of erros) {
            mostrarErro(campo, texto);
        }
        mensagem.textContent = "Há " + erros.length + " campo(s) para corrigir.";
        erros[0][0].focus(); 
        return;
    }
 
    const usuario = {
        nome: nome.value.trim(),
        email: email.value.trim(),
        senha: senha.value,
    };
 
    try {
        const resposta = await fetch("http://localhost:5500/users", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(usuario),
        });
 
        if (resposta.status === 201) {
            formulario.reset();
            mensagem.innerHTML = 'Conta criada com sucesso. <a href="../index.login.html">Ir para o login</a>';
        } else {
            mensagem.textContent = "Erro: não foi possível criar a conta. Tente de novo.";
        }
    } catch (erro) {
        mensagem.textContent = "Erro: servidor indisponível. Verifique se o json-server está ligado.";
    }
});
