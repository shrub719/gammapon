import requests
from bs4 import BeautifulSoup

URL = "https://mathworld.wolfram.com"
MAX_DESC_LEN = 500

def parse_index(f):
    print("parsing index..")

    res = requests.get(URL + "/letters")
    soup = BeautifulSoup(res.content, "html.parser")

    for a in soup.select("ul.topics-list li a"):
        parse_letter(a.get("href"), f)

def parse_letter(href, f):
    print(href)

    res = requests.get(URL + href)
    soup = BeautifulSoup(res.content, "html.parser")

    for a in soup.select("ul.topics-list li a"):
        parse_page(a.get("href"), a.text, f)

# def parse_page(href, f):
#     print(" ", href)
# 
#     res = requests.get(URL + href)
#     soup = BeautifulSoup(res.content, "html.parser")
#     p = soup.select("div.entry-content p")
# 
#     id = href.split(".")[0][1:]
#     title = soup.find("h1").text
#     if p: 
#         desc = p[0].text.replace("\n", "")
#         if len(desc) > MAX_DESC_LEN: desc = desc[:MAX_DESC_LEN]
#         # desc = desc.replace('src="/', 'src="' + URL + '/')
#     else: 
#         desc = ""
# 
#     f.write(f'{{ id: "{id}", title: "{title}", desc: """{desc}""" }},\n')

def parse_page(href, text, f):
    print(" ", href)
    
    id = href.split(".")[0][1:]
    title = text

    f.write(f"{id} // {text}\n")

with open("parsed.csv", "w") as f:
    parse_index(f)
    
