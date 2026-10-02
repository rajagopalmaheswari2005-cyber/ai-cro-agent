import requests

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from scraper import scrape_website
from ai_analyzer import analyze_with_ai


app = FastAPI(
    title="AI CRO Agent",
    description="AI-powered Landing Page CRO Analysis API",
    version="1.0.0"
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    url: HttpUrl


@app.get("/")
def root():
    return {
        "message": "AI CRO Agent API is running"
    }


@app.post("/analyze")
def analyze_website(request: AnalyzeRequest):

    try:
        # Step 1: Scrape the website
        website_data = scrape_website(str(request.url))

        # Step 2: Send scraped data to AI
        ai_result = analyze_with_ai(website_data)

        # Step 3: Return AI CRO report
        return {
            "success": True,
            "data": website_data,
            "analysis": ai_result
        }

    except requests.exceptions.RequestException:
        raise HTTPException(
            status_code=400,
            detail="Unable to access the provided website."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )