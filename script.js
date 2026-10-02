/* =========================================================
   AI CRO AGENT
   LANDING PAGE SCRIPT

   Backend remains unchanged.
========================================================= */

const API_URL = "https://ai-cro-agent-1xck.onrender.com/analyze";

const urlInput = document.getElementById("urlInput");
const analyzeBtn = document.getElementById("analyzeBtn");

const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const loadingSection = document.getElementById("loadingSection");

const analysisSteps = [
    ...document.querySelectorAll(".analysis-step")
];

let loadingStepTimer = null;
let currentLoadingStep = 0;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    hideLoading();
    hideError();

    createParticleBackground();

});


/* =========================================================
   EVENTS
========================================================= */

analyzeBtn.addEventListener(
    "click",
    analyzeWebsite
);


urlInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            analyzeWebsite();

        }

    }
);


// MAIN ANALYSIS 

async function analyzeWebsite() {

    hideError();

    const rawUrl =
        urlInput.value.trim();


    if (!rawUrl) {

        showError(
            "Please enter a website URL."
        );

        urlInput.focus();

        return;
    }


    const normalizedUrl =
        normalizeUrl(rawUrl);


    if (!isValidUrl(normalizedUrl)) {

        showError(
            "Please enter a valid URL, for example https://example.com"
        );

        urlInput.focus();

        return;
    }


    setAnalyzingState(true);

    startLoadingSteps();


    try {

        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        url: normalizedUrl
                    })
                }
            );


        if (!response.ok) {

            let serverMessage = "";

            try {

                const errorData =
                    await response.json();

                serverMessage =
                    errorData.detail ||
                    errorData.message ||
                    "";

            } catch (_) {
                // Ignore JSON parsing error.
            }


            throw new Error(
                serverMessage ||
                `Analysis failed with status ${response.status}.`
            );

        }


        const result =
            await response.json();


        stopLoadingSteps();

        completeLoadingSteps();


        /*
         * Save the backend response temporarily.
         *
         * sessionStorage allows the new report page
         * to read the analysis without changing backend.
         */

        sessionStorage.setItem(
            "croAnalysisResult",
            JSON.stringify({
                response: result,
                url: normalizedUrl
            })
        );


        await wait(500);


        //IMPORTANT:Go to a completely separate report page.
        window.location.href =
            "report.html";
    } catch (error) {
        stopLoadingSteps();
        console.error(
            "CRO Analysis Error:",
            error
        );
        showError(
            getFriendlyErrorMessage(error)
        );
        setAnalyzingState(false);
    }
}
// URL HELPERS

function normalizeUrl(value) {
    let url =
        value.trim();
    if (!/^https?:\/\//i.test(url)) {
        url =
            `https://${url}`;
    }
    return url;
}
function isValidUrl(value) {
    try {
        const parsed =
            new URL(value);
        return (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        );
    } catch (_) {
        return false;

    }
}
// LOADING
function startLoadingSteps() {
    currentLoadingStep = 0;
    resetLoadingSteps();
    loadingSection.classList.add(
        "active"
    );
    loadingStepTimer =
        setInterval(
            () => {
                if (
                    currentLoadingStep <
                    analysisSteps.length - 1
                ) {
                    completeStep(
                        currentLoadingStep
                    );
                    currentLoadingStep++;
                    activateStep(
                        currentLoadingStep
                    );
                }
            },
            900
        );
}
function stopLoadingSteps() {
    if (loadingStepTimer) {
        clearInterval(
            loadingStepTimer
        );
        loadingStepTimer = null;
    }
}
function completeLoadingSteps() {
    analysisSteps.forEach(
        (step) => {
            step.classList.remove(
                "active"
            );
            step.classList.add(
                "completed"
            );
            const icon =
                step.querySelector(
                    ".step-icon"
                );
            if (icon) {
                icon.innerHTML = "✓";
                icon.style.color =
                    "#6ee7b7";
                icon.style.fontWeight =
                    "700";
            }
        }
    );
}
function resetLoadingSteps() {
    analysisSteps.forEach(
        (step, index) => {
            step.classList.remove(
                "active",
                "completed"
            );
            const icon =
                step.querySelector(
                    ".step-icon"
                );
            if (!icon) {
                return;
            }
            if (index === 0) {
                icon.innerHTML =
                    '<span class="step-spinner"></span>';
            } else {
                icon.innerHTML =
                    `<span class="step-number">${index + 1}</span>`;
            }
        }
    );
    activateStep(0);
}
function activateStep(index) {
    analysisSteps.forEach(
        (step, stepIndex) => {
            step.classList.toggle(
                "active",
                stepIndex === index
            );
        }
    );
}
function completeStep(index) {
    const step =
        analysisSteps[index];
    if (!step) {
        return;
    }
    step.classList.remove(
        "active"
    );
    step.classList.add(
        "completed"
    );
    const icon =
        step.querySelector(
            ".step-icon"
        );
    if (icon) {
        icon.innerHTML = "✓";
        icon.style.color =
            "#6ee7b7";
        icon.style.fontWeight =
            "700";
    }
}
// UI STATE
function setAnalyzingState(
    isAnalyzing
) {
    analyzeBtn.disabled =
        isAnalyzing;
    analyzeBtn.classList.toggle(
        "loading",
        isAnalyzing
    );
    urlInput.disabled =
        isAnalyzing;
}
function hideLoading() {
    loadingSection.classList.remove(
        "active"
    );
}
function showError(message) {
    errorText.textContent =
        message;
    errorMessage.classList.add(
        "show"
    );
}
function hideError() {
    errorMessage.classList.remove(
        "show"
    );
}
function getFriendlyErrorMessage(
    error
) {
    if (!error) {
        return (
            "Unable to analyze the website."
        );
    }
    const message =
        error.message || "";
    if (
        message.includes(
            "Failed to fetch"
        )
    ) {
        return (
            "Could not connect to the CRO backend. " +
            "Make sure FastAPI is running at http://127.0.0.1:8000."
        );
    }
    return (
        message ||
        "Something went wrong while analyzing the website."
    );
}
// PARTICLE WAVE BACKGROUND
function createParticleBackground() {
    const container =
        document.querySelector(
            ".background-effects"
        );
    if (!container) {
        return;
    }
    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }
    const canvas =
        document.createElement(
            "canvas"
        );
    canvas.className =
        "particle-canvas";
    container.prepend(
        canvas
    );
    const ctx =
        canvas.getContext(
            "2d"
        );
    if (!ctx) {
        return;
    }
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId;
    function resize() {
        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                1.5
            );
        width =
            window.innerWidth;
        height =
           window.innerHeight;
        canvas.width =
            width * dpr;
        canvas.height =
            height * dpr;
        canvas.style.width =
            `${width}px`;
        canvas.style.height =
            `${height}px`;
        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
        createParticles();
    }
    function createParticles() {
        const count =
            width < 700
                ? 75
                : 145;
        particles = [];
        for (
            let i = 0;
            i < count;
            i++
        ) {
            const x =
                Math.random() *
                width;
            const wave =
                Math.sin(
                    x / 190
                ) * 90;
            const y =
                height * 0.52 +
                wave +
                (Math.random() - 0.5) *
                240;
            particles.push({
                x,
                y,
                baseY: y,
                size:
                    Math.random() *
                    1.7 +
                    0.5,
                speed:
                    Math.random() *
                    0.18 +
                    0.04,
                phase:
                    Math.random() *
                    Math.PI *
                    2,
                depth:
                    Math.random()
            });
        }
    }
    function draw(time) {
        ctx.clearRect(
            0,
            0,
            width,
            height
        );
        const seconds =
            time / 1000;
        particles.forEach(
            (particle) => {
                particle.x +=
                    particle.speed;
                if (
                    particle.x >
                    width + 20
                ) {
                    particle.x =
                        -20;
                }
                const wave =
                    Math.sin(
                        particle.x / 180 +
                        seconds * 0.18 +
                        particle.phase
                    ) * 85;
                const y =
                    particle.baseY +
                    wave * 0.18;
                const alpha =
                    0.16 +
                    particle.depth *
                    0.34;
                const radius =
                    particle.size *
                    (
                        0.7 +
                        particle.depth *
                        1.8
                    );
                ctx.beginPath();
                ctx.arc(
                    particle.x,
                    y,
                    radius,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle =
                    `rgba(155, 145, 245, ${alpha})`;


                ctx.fill();
            }
        );
        animationId =
            requestAnimationFrame(
                draw
            );
    }
    window.addEventListener(
        "resize",
        resize
    );
    resize();
    animationId =
        requestAnimationFrame(
            draw
        );
    window.addEventListener(
        "beforeunload",
        () => {
            if (animationId) {
                cancelAnimationFrame(
                    animationId
                );
            }
        }
    );
}
//UTILITY
function wait(milliseconds) {
    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
           )
    );
}
