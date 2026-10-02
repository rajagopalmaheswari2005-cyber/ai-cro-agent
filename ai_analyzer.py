import os
import json

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)


def analyze_with_ai(website_data):

    # Keep the input small enough for Groq's token limit.
    headings = website_data.get("headings", [])[:12]
    buttons = website_data.get("buttons", [])[:20]
    paragraphs = website_data.get("paragraphs", [])[:12]
    images = website_data.get("images", [])[:10]

    # Avoid sending the entire webpage.
    page_text = website_data.get("page_text", "")

    # Keep only the most useful part of the extracted text.
    page_text = page_text[:7000]

    prompt = f"""
You are an expert Conversion Rate Optimization (CRO) analyst.

Analyze the supplied website data and create a practical CRO audit.

IMPORTANT RULES:
- Use ONLY the supplied website data.
- Do NOT invent products, prices, features, claims, statistics, reviews, or trust signals.
- If something cannot be determined from the supplied data, say:
  "Not directly observable from the supplied page data."
- Do not assume how the page behaves on mobile if mobile behavior is not available.
- Distinguish "not found in supplied data" from "does not exist".
- Keep the analysis concise.
- Ensure all parentheses and brackets are properly closed.
- Return ONLY valid JSON.


WEBSITE URL:
{website_data.get("url", "")}

PAGE TITLE:
{website_data.get("title", "")}

HEADINGS:
{json.dumps(headings, ensure_ascii=False)}

BUTTONS / LINKS:
{json.dumps(buttons, ensure_ascii=False)}

PARAGRAPHS:
{json.dumps(paragraphs, ensure_ascii=False)}

IMAGES:
{json.dumps(images, ensure_ascii=False)}

PAGE TEXT:
{page_text}

Evaluate these areas:

1. Hero Section
2. CTA Quality
3. Trust Signals
4. Product Page Issues
5. Mobile UX
6. Copy & Message Clarity
7. Friction Points
8. Recommended Improvements
9. Overall CRO Score out of 100

For each area:
- Give a short status.
- Give a concise analysis.
- Base the analysis only on the supplied data.

Return exactly this JSON structure:

{{
    "cro_score": 0,

    "hero_section": {{
        "status": "",
        "analysis": ""
    }},

    "cta_quality": {{
        "status": "",
        "analysis": ""
    }},

    "trust_signals": {{
        "status": "",
        "analysis": ""
    }},

    "product_page_issues": {{
        "status": "",
        "analysis": ""
    }},

    "mobile_ux": {{
        "status": "",
        "analysis": ""
    }},

    "copy_message": {{
        "status": "",
        "analysis": ""
    }},

    "friction_points": {{
        "status": "",
        "analysis": ""
    }},

    "recommended_improvements": [
        "",
        "",
        "",
        ""
    ]
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a CRO analyst. "
                    "Return only valid JSON. "
                    "Keep the response concise."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_tokens=1200
    )

    result = response.choices[0].message.content

    return json.loads(result)