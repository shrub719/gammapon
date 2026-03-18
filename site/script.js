// TODO: probably use IndexedDB instead

const delay = ms => new Promise(res => setTimeout(res, ms));

const URL = "https://mathworld.wolfram.com";

const machine = document.getElementById("machine");
const result = document.getElementById("result");
const ball = document.getElementById("ball");
const explosion = document.getElementById("explosion");
const tokens = document.getElementById("tokens");

machine.ondragstart = () => false;

let pages = {};
// are you really gonna load that each time....
fetch("assets/pages.json")
    .then(response => response.json())
    .then(data => { pages = data; })

let tokensLeft = parseInt(
    localStorage.getItem("gacha:tokens") ?? "3"
);

let collection = JSON.parse(
    localStorage.getItem("gacha:collection") ?? "[]"
);

let inProgress = false;

function getDate() {
    const now = new Date();
    return now.toISOString().split("T")[0];
}

function checkRefresh() {
    const lastRefresh = localStorage.getItem("gacha:refresh");
    const today = getDate();

    if (lastRefresh !== today) {
        tokensLeft = 3;
        localStorage.setItem("gacha:refresh", today);
    }

    updateTokens();
}

async function updateTokens() {
    tokens.innerText = "";

    localStorage.setItem("gacha:tokens", tokensLeft);
    
    for (let i=0; i<tokensLeft; i++) {
        const token = document.createElement("img");
        token.src = "./assets/token.gif";
        tokens.appendChild(token);
    }

    if (tokensLeft == 0) {
        tokens.innerText = "Tokens refresh daily";
    }
}

async function addToCollection(page) {
    if (!(collection.some(element => element.id === page.id))) {
        collection.push(page);
        localStorage.setItem("gacha:collection", JSON.stringify(collection));
    }
}

async function getPage() {
    page = pages[Math.floor(Math.random() * pages.length)];

    const title = document.createElement("a");
    title.innerText = page.title;
    title.href = `${URL}/${page.id}.html`;
    // title.target = "_blank";
    result.appendChild(title);

    if (page.img) {
        console.log("img");
        const img = document.createElement("img");
        img.src = `${URL}/${page.img}`;
        result.appendChild(img);
    }

    addToCollection(page);
}

async function machineClick() {
    // TODO: check if can pull
    if (inProgress) { return }
    if (tokensLeft <= 0) { return }

    inProgress = true;

    tokensLeft -= 1;    // why can you do this. gross
    updateTokens();

    machine.classList = ["squish"];
    ball.classList = ["move"];
    result.textContent = "";

    await delay(200);

    machine.classList = [];

    await delay(300);

    ball.classList = [];
    explosion.classList = ["explode"];
    explosion.currentTime = 0;
    explosion.play();

    getPage();
    
    await delay(700);

    explosion.classList = [];

    inProgress = false;
}

machine.addEventListener("mousedown", machineClick);

checkRefresh();

