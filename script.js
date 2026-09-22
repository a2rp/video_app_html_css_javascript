const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const mobileNavigation = document.querySelector("#mobile-navigation");
const mobileLinks = document.querySelectorAll(".mobile-nav a");

const videoModal = document.querySelector(".video-modal");
const videoDialog = document.querySelector(".video-dialog");
const videoOpenButtons = document.querySelectorAll("[data-video-open]");
const videoCloseButtons = document.querySelectorAll("[data-video-close]");
const videoFrame = document.querySelector("#project-video");

const backToTopButton = document.querySelector(".back-to-top");
const currentYear = document.querySelector("#current-year");

let previousFocusedElement = null;
let lastScrollPosition = 0;

const setCurrentYear = () => {
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
};

const closeMobileMenu = () => {
    if (!menuButton || !mobileNavigation) {
        return;
    }

    mobileNavigation.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
};

const toggleMobileMenu = () => {
    if (!menuButton || !mobileNavigation) {
        return;
    }

    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    const nextState = !isOpen;

    mobileNavigation.hidden = !nextState;

    menuButton.setAttribute("aria-expanded", String(nextState));

    menuButton.setAttribute(
        "aria-label",
        nextState ? "Close navigation menu" : "Open navigation menu",
    );
};

const openVideo = () => {
    if (!videoModal || !videoFrame) {
        return;
    }

    previousFocusedElement = document.activeElement;

    const videoSource = videoFrame.dataset.src;

    if (videoSource) {
        videoFrame.src = videoSource;
    }

    videoModal.hidden = false;
    document.body.classList.add("modal-open");

    const closeButton = videoModal.querySelector(".video-close");

    window.requestAnimationFrame(() => {
        closeButton?.focus();
    });
};

const closeVideo = () => {
    if (!videoModal || !videoFrame) {
        return;
    }

    videoFrame.src = "about:blank";

    videoModal.hidden = true;
    document.body.classList.remove("modal-open");

    previousFocusedElement?.focus?.();
};

const trapModalFocus = (event) => {
    if (!videoModal || videoModal.hidden || event.key !== "Tab") {
        return;
    }

    const focusableElements = videoDialog?.querySelectorAll(
        [
            "button:not([disabled])",
            "a[href]",
            "iframe",
            "[tabindex]:not([tabindex='-1'])",
        ].join(","),
    );

    if (!focusableElements?.length) {
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();

        return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
};

const handleDocumentKeyDown = (event) => {
    if (event.key === "Escape") {
        if (videoModal && !videoModal.hidden) {
            closeVideo();

            return;
        }

        closeMobileMenu();
    }

    trapModalFocus(event);
};

const handleScroll = () => {
    const currentScrollPosition = window.scrollY;

    if (backToTopButton) {
        backToTopButton.hidden = currentScrollPosition < 420;
    }

    if (!header) {
        return;
    }

    if (currentScrollPosition <= 20) {
        header.classList.remove("header-hidden");
    } else if (
        currentScrollPosition > lastScrollPosition &&
        currentScrollPosition > 120
    ) {
        header.classList.add("header-hidden");
        closeMobileMenu();
    } else if (currentScrollPosition < lastScrollPosition) {
        header.classList.remove("header-hidden");
    }

    lastScrollPosition = Math.max(currentScrollPosition, 0);
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
};

const handleResize = () => {
    if (window.innerWidth > 760) {
        closeMobileMenu();
    }
};

menuButton?.addEventListener("click", toggleMobileMenu);

mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

videoOpenButtons.forEach((button) => {
    button.addEventListener("click", openVideo);
});

videoCloseButtons.forEach((button) => {
    button.addEventListener("click", closeVideo);
});

backToTopButton?.addEventListener("click", scrollToTop);

document.addEventListener("keydown", handleDocumentKeyDown);

window.addEventListener("scroll", handleScroll, {
    passive: true,
});

window.addEventListener("resize", handleResize);

setCurrentYear();
handleScroll();
