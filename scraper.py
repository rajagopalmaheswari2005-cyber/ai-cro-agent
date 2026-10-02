import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def scrape_website(url: str):

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/131.0.0.0 Safari/537.36"
        ),
        "Accept": (
            "text/html,application/xhtml+xml,"
            "application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
        ),
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://www.google.com/"
    }

    response = None

    # ==========================================
    # METHOD 1: DIRECT WEBSITE REQUEST
    # ==========================================

    try:

        response = requests.get(
            url,
            headers=headers,
            timeout=20,
            allow_redirects=True
        )

        response.raise_for_status()

    except requests.exceptions.RequestException:

        # ======================================
        # METHOD 2: JINA READER FALLBACK
        # ======================================

        jina_url = "https://r.jina.ai/" + url

        jina_response = requests.get(
            jina_url,
            headers={
                "User-Agent": "Mozilla/5.0"
            },
            timeout=30
        )

        jina_response.raise_for_status()

        return parse_jina_content(
            jina_response.text,
            url
        )

    # ==========================================
    # PARSE NORMAL HTML
    # ==========================================

    return parse_html(
        response.text,
        url
    )


def parse_html(html, url):

    soup = BeautifulSoup(
        html,
        "html.parser"
    )

    # Remove unnecessary elements

    for element in soup([
        "script",
        "style",
        "noscript",
        "svg",
        "iframe"
    ]):

        element.decompose()

    # ==========================================
    # TITLE
    # ==========================================

    title = ""

    if soup.title:

        title = soup.title.get_text(
            strip=True
        )

    # ==========================================
    # HEADINGS
    # ==========================================

    headings = []

    for tag in soup.find_all(
        ["h1", "h2", "h3"]
    ):

        text = tag.get_text(
            " ",
            strip=True
        )

        if text:

            headings.append(text)

    # ==========================================
    # PARAGRAPHS
    # ==========================================

    paragraphs = []

    for tag in soup.find_all("p"):

        text = tag.get_text(
            " ",
            strip=True
        )

        if text:

            paragraphs.append(text)

    # ==========================================
    # BUTTONS / LINKS
    # ==========================================

    buttons = []

    for tag in soup.find_all(
        ["button", "a"]
    ):

        text = tag.get_text(
            " ",
            strip=True
        )

        if text:

            buttons.append(text)

    # ==========================================
    # IMAGES
    # ==========================================

    images = []

    for img in soup.find_all("img"):

        alt = img.get(
            "alt",
            ""
        )

        src = img.get(
            "src",
            ""
        )

        if src:

            src = urljoin(
                url,
                src
            )

        images.append({
            "alt": alt,
            "src": src
        })

    # ==========================================
    # PAGE TEXT
    # ==========================================

    page_text = soup.get_text(
        " ",
        strip=True
    )

    return {

        "url": url,

        "title": title,

        "headings": headings[:30],

        "paragraphs": paragraphs[:50],

        "buttons": buttons[:50],

        "images": images[:30],

        "page_text": page_text[:15000]

    }


def parse_jina_content(content, url):

    """
    Fallback parser for websites that block
    direct requests or depend heavily on JS.
    """

    lines = [
        line.strip()
        for line in content.splitlines()
        if line.strip()
    ]

    title = ""

    headings = []

    paragraphs = []

    buttons = []

    # ==========================================
    # FIND TITLE
    # ==========================================

    for line in lines:

        if line.startswith("# "):

            title = line.replace(
                "# ",
                "",
                1
            ).strip()

            break

    # ==========================================
    # FIND HEADINGS
    # ==========================================

    for line in lines:

        if line.startswith("#"):

            heading = line.lstrip(
                "#"
            ).strip()

            if heading:

                headings.append(
                    heading
                )

    # ==========================================
    # FIND LINKS / CTA TEXT
    # ==========================================

    for line in lines:

        if "[" in line and "](" in line:

            buttons.append(
                line[:300]
            )

    # ==========================================
    # PARAGRAPHS
    # ==========================================

    for line in lines:

        if (
            not line.startswith("#")
            and len(line) > 30
        ):

            paragraphs.append(
                line
            )

    # ==========================================
    # PAGE TEXT
    # ==========================================

    page_text = "\n".join(lines)

    return {

        "url": url,

        "title": title,

        "headings": headings[:30],

        "paragraphs": paragraphs[:50],

        "buttons": buttons[:50],

        "images": [],

        "page_text": page_text[:15000]

    }