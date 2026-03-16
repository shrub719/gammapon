from concurrent.futures import ThreadPoolExecutor
import requests
from bs4 import BeautifulSoup

URL = "https://mathworld.wolfram.com"
MAX_DESC_LEN = 500

def parse_index(f):
    print("parsing index..")

    res = get(URL + "/letters")
    soup = BeautifulSoup(res.content, "html.parser")

    for a in soup.select("ul.topics-list li a"):
        parse_letter(a.get("href"), f)

def parse_letter(href, f):
    print(href)

    res = get(URL + href)
    soup = BeautifulSoup(res.content, "html.parser")
    links = [a.get("href") for a in soup.select("ul.topics-list li a")]

    with ThreadPoolExecutor(max_workers=10) as ex:
        for link in links:
            ex.submit(parse_page, link, f)

def clean(s):
    return ( s
        .replace("\"", "&quot;")
    )

def parse_page(href, f):
    res = get(URL + href)
    soup = BeautifulSoup(res.content, "html.parser")

    has_crossref = soup.select("p.CrossRefs")
    if has_crossref: 
        print(" ", href, "(skipped)")
        return

    imgs = soup.select("div.entry-content div.center-image img")
    crumbs = soup.select("nav.breadcrumbs ul.breadcrumb li:first-child")

    id = href.split(".")[0][1:]
    title = soup.find("h1").text

    img_src = ""
    if imgs:
        img_src = imgs[0].get("src")

    categories = []
    if crumbs:
        categories = list(set(crumb.text.replace("\n", "") for crumb in crumbs))

    f.write(f'{{ id: "{id}", title: "{title}", img: "{img_src}", categories: {str(categories)} }},\n')
    f.flush()
    
    print(" ", href)

def get(url):
    return session.get(url)

session = requests.Session()
with open("output/parsed2.json", "w") as f:
    parse_index(f)
    
