# LLM Conversations

## Project
AI-powered Landing Page CRO Agent

## LLM Used
- Model: GPT-OSS-120B
- Provider: Groq
- API access: OpenAI Python SDK with Groq-compatible API endpoint

## Purpose of LLM Usage
The LLM is used to analyze extracted website content and generate a CRO audit.

The analysis covers:
- Hero section
- CTA quality
- Trust signals
- Product page issues
- Mobile UX observations
- Copy/message clarity
- Friction points
- Recommended improvements
- CRO score out of 100

## Main Analysis Prompt

The model is instructed to act as an expert Conversion Rate Optimization (CRO) analyst.

It receives structured website data extracted by the backend, including:
- Page title
- Headings
- Buttons and links
- Paragraphs
- Images
- Page text

The model is instructed to:
- Analyze only the supplied website information.
- Avoid inventing unsupported facts.
- Distinguish missing information from information that is actually absent.
- Avoid unsupported assumptions about mobile behavior.
- Keep the analysis concise.
- Ensure all parentheses and brackets are properly closed.
- Return only valid JSON.

## Output Format

The LLM returns structured JSON containing:

- CRO score
- Hero section analysis
- CTA quality analysis
- Trust signals analysis
- Product page issues
- Mobile UX observations
- Copy/message clarity
- Friction points
- Recommended improvements

## Tools / Technologies Used

- Python
- FastAPI
- BeautifulSoup
- Requests
- Groq API
- GPT-OSS-120B
- OpenAI Python SDK
- HTML
- CSS
- JavaScript

## Development Assistance

AI coding assistants were used during development to help with:
- Code generation
- Debugging
- UI improvements
- Backend integration
- Prompt refinement
- Deployment troubleshooting

The final application was tested end-to-end using publicly accessible websites.
