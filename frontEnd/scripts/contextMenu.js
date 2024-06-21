document.addEventListener("DOMContentLoaded", () => {
  const customMenu = document.getElementById("custom-menu");
  const explainAction = document.getElementById("explain");
  let selectedText = "";

  document.addEventListener("contextmenu", (event) => {
    selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      event.preventDefault();
      // Show custom context menu
      customMenu.style.display = "block";
      customMenu.style.left = `${event.pageX}px`;
      customMenu.style.top = `${event.pageY}px`;
    } else {
      customMenu.style.display = "none";
    }
  });

  document.addEventListener("click", () => {
    customMenu.style.display = "none";
  });

  explainAction.addEventListener("click", () => {
    if (selectedText) {
      const AIMESSAGE = document.getElementById("aiMessage");
      AIMESSAGE.innerHTML = "";

      let aiTitle = document.createElement("h3");
      aiTitle.textContent = selectedText;
      //aiTitle.classList.add("item");
      AIMESSAGE.appendChild(aiTitle);
    }
    customMenu.style.display = "none";
  });
});
