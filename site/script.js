const result = document.getElementById("result");

const url = "https://mathworld.wolfram.com/cgi-bin/random.cgi";

async function getRandomPage() {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
}

getRandomPage();
