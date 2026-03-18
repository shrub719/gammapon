const URL = "https://mathworld.wolfram.com";

const collection = document.getElementById("collection");

let collection_json = JSON.parse(
    localStorage.getItem("gacha:collection") ?? "[]"
);

collection_json.forEach((page) => {
    const title = document.createElement("a");
    title.innerText = page.title;
    title.href = `${URL}/${page.id}.html`;
    // title.target = "_blank";
    collection.appendChild(title);
});

