document.addEventListener("DOMContentLoaded", () => {
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

    const createForumButton = document.getElementById("createForumButton");
    const forumModal = document.getElementById("forumModal");
    const closeModal = document.getElementById("closeModal");
    const saveForumButton = document.getElementById("saveForumButton");
    const forumList = document.getElementById("forumList");
    const sortOrder = document.getElementById("sortOrder");
    const commentModal = document.getElementById("commentModal");
    const closeCommentModal = document.getElementById("closeCommentModal");
    const saveCommentButton = document.getElementById("saveCommentButton");
    const editModal = document.getElementById("editModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const saveEditButton = document.getElementById("saveEditButton");
    const dropdownButtons = document.querySelectorAll(".dropdown-btn"); // Seleciona todos os botões de dropdown

    let currentForumId = null; // Para edição e comentários
    
    // Abrir modal de criação
    createForumButton.addEventListener("click", () => {
        forumModal.style.display = "block";
    });

    // Fechar modais
    closeModal.addEventListener("click", () => (forumModal.style.display = "none"));
    closeCommentModal.addEventListener("click", () => (commentModal.style.display = "none"));
    closeEditModal.addEventListener("click", () => (editModal.style.display = "none"));

    // Salvar novo fórum
    saveForumButton.addEventListener("click", () => {
        const title = document.getElementById("forumTitle").value;
        const content = document.getElementById("forumContent").value;
        const forumImage = document.getElementById("forumImage").files[0]; // Pega o arquivo de imagem
        const id = Date.now();

        if (title && content) {
            const forums = JSON.parse(localStorage.getItem("forums")) || [];

            // Se uma imagem foi selecionada, cria um URL de objeto para ela
            let imageUrl = "";
            if (forumImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    imageUrl = reader.result; // Armazena a URL da imagem
                    // Cria o objeto fórum com a imagem
                    forums.push({ 
                        id, 
                        title, 
                        content, 
                        date: new Date().toISOString(), 
                        image: imageUrl, // Armazena a imagem
                        comments: [] 
                    });
                    localStorage.setItem("forums", JSON.stringify(forums));
                    forumModal.style.display = "none";
                    document.getElementById("forumTitle").value = "";
                    document.getElementById("forumContent").value = "";
                    displayForums();
                };
                reader.readAsDataURL(forumImage); // Lê o arquivo como uma URL de dados
            } else {
                // Se não houver imagem, salva o fórum sem imagem
                forums.push({ 
                    id, 
                    title, 
                    content, 
                    date: new Date().toISOString(), 
                    image: "", // Sem imagem
                    comments: [] 
                });
                localStorage.setItem("forums", JSON.stringify(forums));
                forumModal.style.display = "none";
                document.getElementById("forumTitle").value = "";
                document.getElementById("forumContent").value = "";
                displayForums();
            }
        } else {
            alert("Preencha todos os campos!");
        }
    });

    // Exibir fóruns
    function displayForums() {
        const forums = JSON.parse(localStorage.getItem("forums")) || [];
        const sortedForums = forums.sort((a, b) => {
            return sortOrder.value === "recent"
                ? new Date(b.date) - new Date(a.date)
                : new Date(a.date) - new Date(b.date);
        });

        forumList.innerHTML = ""; // Limpa a lista

        sortedForums.forEach((forum) => {
            const forumDiv = document.createElement("div");
            forumDiv.className = "forum-item";

            // Exibe a imagem, se existir
            const imageHtml = forum.image ? `<img src="${forum.image}" alt="Imagem do fórum" class="forum-image">` : '';

            forumDiv.innerHTML = `
                <div class="img-dropdown">
                    <div class="forum">
                        ${imageHtml}
                        <div class="conteudo-forum">
                            <h3>${forum.title}</h3>
                            <p>${forum.content}</p>   
                        </div>            
                    </div> 
                    <div class="dropdown">
                        <button class="dropdown-btn">...</button>
                        <div class="dropdown-content">
                            <button onclick="editForum(${forum.id})">Editar</button>
                            <button onclick="deleteForum(${forum.id})">Excluir</button>
                        </div>
                    </div>
                </div>
                <section class="comments">
                    <div id="comments-${forum.id}" class="comment-section">
                        <button onclick="openCommentModal(${forum.id})">Comentar</button>
                        ${Array.isArray(forum.comments) ? forum.comments.map((c) => `<p>${c}</p>`).join("") : ""}
                    </div>
                </section>
                <!-- Modal de Comentário (Inicia escondido) -->
                <div class="comment-modal" id="commentModal-${forum.id}" style="display:none;">
                    <div class="modal-content">
                        <span class="close-btn" onclick="closeCommentModal(${forum.id})">&times;</span>
                        <textarea id="commentText-${forum.id}" placeholder="Escreva seu comentário"></textarea>
                        <button onclick="saveComment(${forum.id})">Comentar</button>
                    </div>
                </div>
            `;
            forumList.appendChild(forumDiv);
        });
    }

    // Abrir modal de comentário
    window.openCommentModal = (forumId) => {
        currentForumId = forumId;
        commentModal.style.display = "block";
    };

    saveCommentButton.addEventListener("click", () => {
        const commentText = document.getElementById("commentText").value;
        if (commentText) {
            const forums = JSON.parse(localStorage.getItem("forums"));
            const forum = forums.find((f) => f.id === currentForumId);
            forum.comments.push(commentText);
            localStorage.setItem("forums", JSON.stringify(forums));
            commentModal.style.display = "none";
            displayForums();
        }
    });

    // Editar fórum
    window.editForum = (forumId) => {
        currentForumId = forumId;
        const forums = JSON.parse(localStorage.getItem("forums"));
        const forum = forums.find((f) => f.id === forumId);
        document.getElementById("editTitle").value = forum.title;
        document.getElementById("editContent").value = forum.content;
        editModal.style.display = "block";
    };

    saveEditButton.addEventListener("click", () => {
        const title = document.getElementById("editTitle").value;
        const content = document.getElementById("editContent").value;

        const forums = JSON.parse(localStorage.getItem("forums"));
        const forum = forums.find((f) => f.id === currentForumId);

        forum.title = title;
        forum.content = content;

        localStorage.setItem("forums", JSON.stringify(forums));
        editModal.style.display = "none";
        displayForums();
    });

    // Excluir fórum
    window.deleteForum = (forumId) => {
        let forums = JSON.parse(localStorage.getItem("forums"));
        forums = forums.filter((f) => f.id !== forumId);
        localStorage.setItem("forums", JSON.stringify(forums));
        displayForums();
    };

    // Inicializar
    sortOrder.addEventListener("change", displayForums);
    displayForums();
});

// Função para verificar login e definir o link de perfil
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

function openCommentModal(forumId) {
    const modal = document.getElementById(`commentModal-${forumId}`);
    modal.style.display = "flex"; // Exibe o modal
}

function closeCommentModal(forumId) {
    const modal = document.getElementById(`commentModal-${forumId}`);
    modal.style.display = "none"; // Fecha o modal
}

function saveComment(forumId) {
    const commentText = document.getElementById(`commentText-${forumId}`).value;
    if (commentText) {
        const forums = JSON.parse(localStorage.getItem("forums"));
        const forum = forums.find((f) => f.id === forumId);
        forum.comments.push(commentText);
        localStorage.setItem("forums", JSON.stringify(forums));

        // Atualiza a lista de fóruns e fecha o modal
        displayForums();
        closeCommentModal(forumId);
    } else {
        alert("Digite um comentário.");
    }
}
