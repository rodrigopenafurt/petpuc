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
// Funções de abertura e fechamento do modal
function abrirModal() {
    document.getElementById('modalCadastro').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalCadastro').style.display = 'none';
    document.getElementById('formCadastro').reset();
}

// Função para carregar os animais salvos do localStorage
function carregarAnimais() {
    const listaAnimais = JSON.parse(localStorage.getItem('animais')) || [];
    const listaAnimaisElement = document.getElementById('listaAnimais');
    listaAnimaisElement.innerHTML = '';
    listaAnimais.forEach((animal, index) => {
        adicionarAnimalNaLista(animal, index);
    });
    document.addEventListener('DOMContentLoaded', carregarAnimais);

}

function adicionarAnimalNaLista(animal, index) {
    const animalItem = document.createElement('div'); // Declare aqui
    animalItem.className = 'animal-item';
    animalItem.innerHTML = `
    <img src="${animal.foto}" alt="${animal.nome}" onclick="abrirFoto('${animal.foto}')" style="cursor: pointer;" width="100%" height="150px">
    <h3>${animal.nome}</h3>
    <p><strong>Tipo:</strong> ${animal.tipo}</p>
    <p><strong>Sexo:</strong> ${animal.sexo}</p>
    <p><strong>Idade:</strong> ${animal.idade}</p>
    <p><strong>Porte:</strong> ${animal.porte}</p>
    <button class="contato" onclick="abrirContato(${index})">Entrar em Contato</button>
    <button class="editar" onclick="editarAnimal(${index})">Editar</button>
    <button class="excluir" onclick="excluirAnimal(${index})">Excluir</button>
`;


    // Adicione o item à lista
    document.getElementById('listaAnimais').appendChild(animalItem);
}


function abrirContato(index) {
    const listaAnimais = JSON.parse(localStorage.getItem('animais')) || [];
    const animal = listaAnimais[index];

    if (animal) {
        const detalhesContato = `
            <strong>Nome do Protetor:</strong> ${animal.nomeProtetor || 'Não informado'}<br>
            <strong>Telefone de Contato:</strong> ${animal.telefoneContato || 'Não informado'}
        `;

        document.getElementById('detalhesContato').innerHTML = detalhesContato;
        document.getElementById('modalContato').style.display = 'block';
    } else {
        alert("Erro ao carregar os detalhes do contato.");
    }
}

function fecharModalContato() {
    document.getElementById('modalContato').style.display = 'none';
}

// Função para cadastrar ou atualizar um animal
function cadastrarAnimal(event) {
    event.preventDefault();
    
    const tipo = document.getElementById('tipo').value;
    const nome = document.getElementById('nome').value;
    const sexo = document.getElementById('sexo').value;
    const idade = document.getElementById('idade').value;
    const porte = document.getElementById('porte').value;
    const nomeProtetor = document.getElementById('nomeProtetor').value;
    const telefoneContato = document.getElementById('telefoneContato').value;
    const fotoFile = document.getElementById('foto').files[0];
    const currentUserId = sessionStorage.getItem('usuarioCorrente') ? JSON.parse(sessionStorage.getItem('usuarioCorrente')).id : null;

    const reader = new FileReader();
    reader.onload = function(e) {
        const foto = e.target.result;
        let listaAnimais = JSON.parse(localStorage.getItem('animais')) || [];
        
        const animalEditando = document.getElementById('animalEditando');
        const animal = { tipo, nome, sexo, idade, porte, nomeProtetor, telefoneContato, foto, userId: currentUserId };
        
        if (animalEditando.value !== '') {
            listaAnimais[animalEditando.value] = animal;
            animalEditando.value = '';
        } else {
            listaAnimais.push(animal);
        }

        localStorage.setItem('animais', JSON.stringify(listaAnimais));
        registrarAnimalNoPerfil(currentUserId, animal);
        carregarAnimais();
        fecharModal();
    };
    reader.readAsDataURL(fotoFile);
}

// Função para registrar o animal no perfil do usuário
function registrarAnimalNoPerfil(userId, animal) {
    let db_usuarios = JSON.parse(localStorage.getItem('db_usuarios')) || { usuarios: [] };
    db_usuarios.usuarios = db_usuarios.usuarios.map(user => {
        if (user.id === userId) {
            user.animals = user.animals || [];
            user.animals.push(animal);
        }
        return user;
    });

    localStorage.setItem('db_usuarios', JSON.stringify(db_usuarios));
}
// Função para editar um animal
function editarAnimal(index) {
    const listaAnimais = JSON.parse(localStorage.getItem('animais'));
    const animal = listaAnimais[index];

    document.getElementById('tipo').value = animal.tipo;
    document.getElementById('nome').value = animal.nome;
    document.getElementById('sexo').value = animal.sexo;
    document.getElementById('idade').value = animal.idade;
    document.getElementById('porte').value = animal.porte;
    document.getElementById('nomeProtetor').value = animal.nomeProtetor;
    document.getElementById('telefoneContato').value = animal.telefoneContato;
    document.getElementById('animalEditando').value = index; // Armazena o índice do animal que está sendo editado
    abrirModal();
}

function excluirAnimal(index) {
    const confirmar = confirm("Você tem certeza de que deseja excluir este animal?");
    if (confirmar) {
        let listaAnimais = JSON.parse(localStorage.getItem('animais'));
        listaAnimais.splice(index, 1);
        localStorage.setItem('animais', JSON.stringify(listaAnimais));
        carregarAnimais();
        alert("Animal excluído com sucesso!");
    } else {
        alert("Ação de exclusão cancelada.");
    }
}


// Carregar os animais ao abrir a página
document.addEventListener('DOMContentLoaded', carregarAnimais);

function abrirFoto(foto) {
    const modalFoto = document.getElementById('modalFoto');
    document.getElementById('imagemModal').src = foto;
    modalFoto.style.display = 'block';
}

function fecharModalFoto() {
    document.getElementById('modalFoto').style.display = 'none';
}

