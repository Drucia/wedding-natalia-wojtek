document.addEventListener("DOMContentLoaded", () => {
    const modal = document.createElement("div");
    modal.className = "img-modal";
    modal.innerHTML = `<img alt="">`;
    document.body.appendChild(modal);
  
    const modalImg = modal.querySelector("img");
  
    const zoomableImages = document.querySelectorAll(".js-zoomable img");
  
    zoomableImages.forEach((img) => {
      img.addEventListener("click", () => {
        modal.classList.add("is-open");
        modalImg.src = img.src;
        modalImg.alt = img.alt || "";
      });
    });
  
    modal.addEventListener("click", () => {
      modal.classList.remove("is-open");
      modalImg.src = "";
      modalImg.alt = "";
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.classList.remove("is-open");
        modalImg.src = "";
        modalImg.alt = "";
      }
    });
  });
