# import requests
# from bs4 import BeautifulSoup
# import json

# def fetch_scheme_links(base_url):
#     response = requests.get(base_url)
#     soup = BeautifulSoup(response.text, "html.parser")

#     scheme_links = []

#     for link in soup.find_all("a", href=True):
#         href = link["href"]
#         if "scheme" in href.lower():
#             scheme_links.append(href)

#     return scheme_links

# if __name__ == "__main__":
#     base_url = "https://www.myscheme.gov.in"
#     links = fetch_scheme_links(base_url)

#     print("Discovered links:")
#     for l in links[:20]:
#         print(l)

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

url = "https://www.myscheme.gov.in/schemes/pradhan-mantri-mudra-yojana"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto(url, timeout=60000)

    page.wait_for_timeout(5000)

    html = page.content()
    browser.close()

# Parse with BeautifulSoup
soup = BeautifulSoup(html, "html.parser")

# Extract all visible text
text = soup.get_text(separator="\n")

# Print first 2000 characters
print(text[:2000])