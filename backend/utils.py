from bs4 import BeautifulSoup
from markdownify import markdownify as md

def sanitize_html(html: str) -> str:
    soup = BeautifulSoup(html, 'html.parser')
    # Remove script, iframe, form tags for security
    for tag in soup(["script", "iframe", "form"]):
        tag.decompose()
    return md(str(soup))
