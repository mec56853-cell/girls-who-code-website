
const pages = document.querySelectorAll(".story-page");
const picture = document.getElementById("story-picture");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const pageCount = document.getElementById("page-count");
const playLink = document.getElementById("play-link");

const pictures = ["🌼", "🎒", "🔁", "🐛", "💻"];

let currentPage = 0;

function showPage() {
    pages.forEach((page, index) => {
        const selected = index === currentPage;
        page.hidden = !selected;
        page.classList.toggle("active", selected);
    });

    picture.textContent = pictures[currentPage];

    pageCount.textContent =
        `Page ${currentPage + 1} of ${pages.length}`;

    backBtn.disabled = currentPage === 0;

    const isLastPage = currentPage === pages.length - 1;

    nextBtn.hidden = isLastPage;
    playLink.hidden = !isLastPage;
}

nextBtn.addEventListener("click", () => {
    if (currentPage < pages.length - 1) {
        currentPage++;
        showPage();
    }
});

backBtn.addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        showPage();
    }
});

showPage();
