function toggleContent(id, element) {
    var content = document.getElementById(id);
    var seta = element.querySelector(".seta");
    
    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
        seta.style.transform = "rotate(90deg)";  // Rotaciona a seta para baixo
    } else {
        content.style.display = "none";
        seta.style.transform = "rotate(0deg)";   // Rotaciona a seta para a direita
    }
}
