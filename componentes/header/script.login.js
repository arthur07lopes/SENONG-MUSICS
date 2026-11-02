"use strict";

const formularioLogin = document.querySelector("#login-form");
const campoUsuario = document.querySelector("#username");
const campoSenha = document.querySelector("#password");
const mostrarSenha = document.querySelector("#show-password");

mostrarSenha.addEventListener("change", () => {
    campoSenha.type = mostrarSenha.checked ? "text" : "password";
});

formularioLogin.addEventListener("submit", (event) => {
    event.preventDefault();

    const identificador = campoUsuario.value.trim().toLowerCase();
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuario = usuarios.find(
        (u) =>
            (u.email.toLowerCase() === identificador || u.nome.toLowerCase() === identificador) &&
            u.senha === campoSenha.value
    );

    if (!usuario) {
        alert("Usuário ou senha incorretos.");
        return;
    }

    localStorage.setItem("usuarioLogado", JSON.stringify({ nome: usuario.nome, email: usuario.email }));
    window.location.href = "../../PaginaInicial/index.paginainicial.html";
});
