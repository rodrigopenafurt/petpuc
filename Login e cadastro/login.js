
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    
    const dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios')) || { usuarios: [] };

   
    const usuario = dbUsuarios.usuarios.find(user => user.email === email && user.password === password);

    if (usuario) { 
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuario));

        window.location.href = '/meu_perfil/meuperfil.html';
    } else {
        document.getElementById('loginErrorMessage').style.display = 'block';
    }
});


document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

   
    const dbUsuarios = JSON.parse(localStorage.getItem('db_usuarios')) || { usuarios: [] };

    
    const usuarioExistente = dbUsuarios.usuarios.find(user => user.email === email);

    if (usuarioExistente) {
        document.getElementById('registerErrorMessage').style.display = 'block';
        document.getElementById('registerSuccessMessage').style.display = 'none';
    } else {
       
        const novoUsuario = { id: Date.now(), name, email, password };
        dbUsuarios.usuarios.push(novoUsuario);
        localStorage.setItem('db_usuarios', JSON.stringify(dbUsuarios));

        
        document.getElementById('registerForm').reset();
        document.getElementById('registerErrorMessage').style.display = 'none';
        document.getElementById('registerSuccessMessage').style.display = 'block';
    }
});
