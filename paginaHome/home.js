document.addEventListener('DOMContentLoaded', function() {
    verificarLogin(); // Certifica-se de que o link de perfil está definido corretamente

    let usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        let usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        const profilePhotoSrc = usuarioCorrente.profilePhoto;
        if (profilePhotoSrc) {
            const perfilIcon = document.querySelector('.icon-perfil');
            if (perfilIcon) {
                perfilIcon.src = profilePhotoSrc; // Define a foto de perfil carregada
            } else {
                console.error('Elemento com a classe .icon-perfil não encontrado.');
            }
        }
    }
});

function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado'); // Verifica se a chave 'usuarioLogado' existe no localStorage
    const perfilLink = document.getElementById('perfil-link');
    
    if (perfilLink) {
        if (usuarioLogado && usuarioLogado !== 'null' && usuarioLogado !== 'undefined') {
            perfilLink.href = "/meu_perfil/meuperfil.html"; 
        } else {
            perfilLink.href = "/login/login.html";
        }
    } else {
        console.error('Elemento com o ID perfil-link não encontrado.');
    }
}
