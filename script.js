window.onload = () => {
    document.querySelector(".watch").addEventListener("click", () => {
        document.querySelector(".videoContainer").style.cssText = `
            top: 0;
        `;
    });
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".videoContainer").style.cssText = `
            top: -100%;
        `;
    });
};

