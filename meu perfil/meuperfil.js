let cropper;

function openCropModal(event) {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
        const reader = new FileReader();
        reader.onload = function () {
            const dataURL = reader.result;
            const image = document.getElementById('crop-image');
            if (image) {
                image.src = dataURL;
                const cropModal = document.getElementById('cropModal');
                if (cropModal) {
                    cropModal.style.display = "flex";
                    cropper = new Cropper(image, {
                        aspectRatio: 1,
                        viewMode: 1,
                    });
                }
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert("Erro: Apenas arquivos PNG ou JPG são permitidos.");
    }
}

function closeCropModal() {
    const cropModal = document.getElementById('cropModal');
    if (cropModal) {
        cropModal.style.display = "none";
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    }
}

function cropAndSave() {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas({
            width: 100,
            height: 100,
        });

        const dataURL = canvas.toDataURL('image/png');
        const profilePhoto = document.getElementById('profile-photo');
        if (profilePhoto) {
            profilePhoto.style.backgroundImage = `url(${dataURL})`;
            saveProfilePhotoToLocalStorage(dataURL); // Função para salvar no localStorage
        }

        closeCropModal();
    }
}

function saveProfilePhotoToLocalStorage(dataURL) {
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        usuarioCorrente.profilePhoto = dataURL;

        // Atualizar o usuário no localStorage
        const db_usuarios = JSON.parse(localStorage.getItem('db_usuarios')) || { usuarios: [] };
        db_usuarios.usuarios = db_usuarios.usuarios.map(user =>
            user.id === usuarioCorrente.id ? { ...user, profilePhoto: dataURL } : user
        );

        localStorage.setItem('db_usuarios', JSON.stringify(db_usuarios));
        sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
    }
}

function openModal(fieldId) {
    const modal = document.getElementById("editModal");
    const label = document.getElementById("modalLabel");
    const input = document.getElementById("modalInput");

    const field = document.getElementById(fieldId);
    if (field && label && input && modal) {
        label.innerText = field.previousElementSibling.innerText;
        input.value = field.value;
        input.setAttribute("data-field-id", fieldId);
        modal.style.display = "flex";
        input.focus();
        input.select();
    }
}

function closeModal() {
    const modal = document.getElementById("editModal");
    if (modal) {
        modal.style.display = "none";
    }
}

function validateInput(fieldId, value) {
    switch (fieldId) {
        case "email":
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(value)) {
                alert("Erro: O endereço de e-mail inserido é inválido. Por favor, use o formato correto, ex: usuario@dominio.com.");
                return false;
            }
            break;
        case "phone":
            const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                alert("Erro: O número de telefone deve estar no formato (XX) XXXXX-XXXX.");
                return false;
            }
            break;
        case "password":
            if (value.length < 8) {
                alert("Erro: A senha deve conter pelo menos 8 caracteres.");
                return false;
            }
            break;
        case "birthdate":
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(value)) {
                alert("Erro: A data deve estar no formato AAAA-MM-DD (exemplo: 2000-01-01).");
                return false;
            }
            break;
    }
    return true;
}

function saveChanges() {
    const input = document.getElementById("modalInput");
    const fieldId = input.getAttribute("data-field-id");
    const field = document.getElementById(fieldId);

    if (field && input) {
        if (!validateInput(fieldId, input.value)) {
            return;
        }
        field.value = input.value;

        const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (usuarioCorrenteJSON) {
            const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
            usuarioCorrente[fieldId] = input.value;

            const db_usuarios = JSON.parse(localStorage.getItem('db_usuarios')) || { usuarios: [] };
            db_usuarios.usuarios = db_usuarios.usuarios.map(user =>
                user.id === usuarioCorrente.id ? { ...user, [fieldId]: input.value } : user
            );

            localStorage.setItem('db_usuarios', JSON.stringify(db_usuarios));
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
        }

        closeModal();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);

        // Carregar os campos do perfil
        const fields = ['name', 'email', 'birthdate', 'password', 'phone'];
        fields.forEach(function (fieldId) {
            const field = document.getElementById(fieldId);
            if (field && usuarioCorrente[fieldId]) {
                field.value = usuarioCorrente[fieldId];
            }
        });

        // Carregar foto de perfil
        const savedPhoto = usuarioCorrente.profilePhoto;
        if (savedPhoto) {
            const profilePhoto = document.getElementById('profile-photo');
            if (profilePhoto) {
                profilePhoto.style.backgroundImage = `url(${savedPhoto})`;
            }
        }

        // Exibir os animais registrados pelo usuário
        exibirAnimaisRegistrados(usuarioCorrente.id);
    }
});

// Função para exibir animais registrados no perfil
function exibirAnimaisRegistrados(userId) {
    const db_usuarios = JSON.parse(localStorage.getItem('db_usuarios')) || { usuarios: [] };
    const usuario = db_usuarios.usuarios.find(user => user.id === userId);
    const animais = usuario ? usuario.animals : [];

    const container = document.getElementById('animaisRegistradosContainer');
    container.innerHTML = ''; // Limpar conteúdo existente

    if (animais.length > 0) {
        animais.forEach(animal => {
            const animalElement = document.createElement('div');
            animalElement.className = 'animal-item';
            animalElement.innerHTML = `
                <img src="${animal.foto}" alt="${animal.nome}" width="100" height="100">
                <p><strong>Nome:</strong> ${animal.nome}</p>
                <p><strong>Tipo:</strong> ${animal.tipo}</p>
                <p><strong>Sexo:</strong> ${animal.sexo}</p>
                <p><strong>Idade:</strong> ${animal.idade}</p>
                <p><strong>Porte:</strong> ${animal.porte}</p>
                <p><strong>Protetor:</strong> ${animal.nomeProtetor}</p>
                <p><strong>Contato:</strong> ${animal.telefoneContato}</p>
            `;
            container.appendChild(animalElement);
        });
    } else {
        container.innerHTML = "<p>Você não possui animais registrados.</p>";
    }
}


// Função para exibir os fóruns registrados
function exibirForumsRegistrados(userId) {
    const db_usuarios = JSON.parse(localStorage.getItem('db_usuarios')) || { usuarios: [] };
    const usuario = db_usuarios.usuarios.find(user => user.id === userId);
    const forums = usuario ? usuario.forums : [];

    const container = document.getElementById('userForumsList');
    container.innerHTML = ''; // Limpar conteúdo existente

    if (forums.length > 0) {
        forums.forEach(forum => {
            const forumElement = document.createElement('li');
            forumElement.textContent = forum.title; // Exibir o título do fórum
            container.appendChild(forumElement);
        });
    } else {
        container.innerHTML = "<p>Você não possui fóruns registrados.</p>";
    }
}




window.onclick = function (event) {
    const editModal = document.getElementById("editModal");
    const cropModal = document.getElementById("cropModal");

    if (event.target === editModal) {
        closeModal();
    }
    if (event.target === cropModal) {
        closeCropModal();
    }
};
