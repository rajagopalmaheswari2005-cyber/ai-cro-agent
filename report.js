/* =========================================================
   AI CRO AGENT
   REPORT PAGE
========================================================= */


/* =========================================================
   DOM
========================================================= */

const scoreNumber =
    document.getElementById(
        "scoreNumber"
    );

const scoreProgress =
    document.getElementById(
        "scoreProgress"
    );

const scoreStatusBadge =
    document.getElementById(
        "scoreStatusBadge"
    );

const scoreTitle =
    document.getElementById(
        "scoreTitle"
    );

const scoreInterpretation =
    document.getElementById(
        "scoreInterpretation"
    );

const analyzedUrl =
    document.getElementById(
        "analyzedUrl"
    );

const reportUrl =
    document.getElementById(
        "reportUrl"
    );

const recommendationsList =
    document.getElementById(
        "recommendationsList"
    );


/* =========================================================
   INSIGHT MAP
========================================================= */

const insightElements = {

    hero: {
        title: "Hero Section",
        text:
            document.getElementById(
                "heroAnalysis"
            ),
        status:
            document.getElementById(
                "heroStatus"
            )
    },

    cta: {
        title: "CTA Quality",
        text:
            document.getElementById(
                "ctaAnalysis"
            ),
        status:
            document.getElementById(
                "ctaStatus"
            )
    },

    trust: {
        title: "Trust Signals",
        text:
            document.getElementById(
                "trustAnalysis"
            ),
        status:
            document.getElementById(
                "trustStatus"
            )
    },

    product: {
        title: "Product Page Issues",
        text:
            document.getElementById(
                "productAnalysis"
            ),
        status:
            document.getElementById(
                "productStatus"
            )
    },

    mobile: {
        title: "Mobile UX",
        text:
            document.getElementById(
                "mobileAnalysis"
            ),
        status:
            document.getElementById(
                "mobileStatus"
            )
    },

    copy: {
        title: "Copy & Message",
        text:
            document.getElementById(
                "copyAnalysis"
            ),
        status:
            document.getElementById(
                "copyStatus"
            )
    },

    friction: {
        title: "Friction Points",
        text:
            document.getElementById(
                "frictionAnalysis"
            ),
        status:
            document.getElementById(
                "frictionStatus"
            )
    }

};


/* =========================================================
   INSIGHT EXPLANATIONS
========================================================= */

const insightDetails = {

    hero: {

        why:
            "The hero section is usually the first major conversion signal. Visitors should quickly understand what the page offers, who it is for, and what action they should take.",

        example:
            "For example, instead of a vague headline like \"Better solutions for everyone\", a stronger version could clearly communicate the benefit and target audience.",

        action:
            "Strengthen the headline, supporting value proposition, and primary action so the page communicates its purpose immediately."

    },


    cta: {

        why:
            "The CTA gives visitors a clear next step. A weak or unclear CTA can create hesitation even when the rest of the page is useful.",

        example:
            "For example, a generic \"Learn More\" could be replaced with a more specific action such as \"Start Free Trial\" when that matches the page goal.",

        action:
            "Make the primary CTA visually dominant and use concise action-oriented wording that matches the page's conversion goal."

    },


    trust: {

        why:
            "Trust signals reduce uncertainty and help visitors feel more confident before taking a conversion action.",

        example:
            "Relevant examples include customer reviews, guarantees, certifications, recognizable customer logos, ratings, or clear policies when genuinely available.",

        action:
            "Place relevant proof close to important conversion points and make the information easy to verify."

    },


    product: {

        why:
            "Product pages need enough information for visitors to understand the product and make a confident decision without unnecessary friction.",

        example:
            "A product page may benefit from clearer benefits, specifications, comparison information, delivery details, or purchase guidance when those elements are relevant.",

        action:
            "Identify the missing or unclear product information and move the most decision-critical details closer to the conversion path."

    },


    mobile: {

        why:
            "Mobile visitors interact with a smaller screen, so content hierarchy, readability, navigation and touch interactions become especially important.",

        example:
            "For example, a primary CTA that is difficult to find or content that requires excessive scrolling can make the conversion journey harder on small screens.",

        action:
            "Prioritize important information, CTA visibility and simple interactions for smaller screens. Note that this audit is based on supplied page data unless actual mobile rendering is available."

    },


    copy: {

        why:
            "Clear messaging helps visitors understand the value of the offer quickly and reduces the cognitive effort required to decide what to do next.",

        example:
            "A benefit-led sentence such as \"Create your first report in minutes\" is generally clearer than a vague statement like \"Powerful tools for modern teams\".",

        action:
            "Use concise, benefit-focused messaging and make the relationship between the value proposition and CTA obvious."

    },


    friction: {

        why:
            "Conversion friction includes anything that creates unnecessary hesitation, confusion or extra steps between the visitor and the desired action.",

        example:
            "Examples can include competing CTAs, unclear navigation, unnecessary fields, missing information or confusing wording.",

        action:
            "Remove unnecessary steps, reduce competing actions and make the intended conversion path easier to understand."

    }

};


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createParticleBackground();

        loadReport();

        setupInteractions();

    }
);


/* =========================================================
   LOAD REPORT
========================================================= */

function loadReport() {

    const stored =
        sessionStorage.getItem(
            "croAnalysisResult"
        );


    if (!stored) {

        window.location.href =
            "index.html";

        return;

    }


    try {

        const payload =
            JSON.parse(stored);


        const response =
            payload.response || {};

        const url =
            payload.url || "";


        renderScore(response);

        renderInsights(response);

        renderRecommendations(response);


        analyzedUrl.textContent =
            url || "—";


        reportUrl.textContent =
            url || "—";


    } catch (error) {

        console.error(
            "Report loading error:",
            error
        );


        window.location.href =
            "index.html";

    }

}


/* =========================================================
   SCORE
========================================================= */

function renderScore(data) {

    const score =
        extractScore(data);


    const safeScore =
        Math.min(
            Math.max(score, 0),
            100
        );


    animateNumber(
        scoreNumber,
        safeScore,
        1000
    );


    const circumference =
        578.05;


    const offset =
        circumference -
        (
            safeScore / 100
        ) *
        circumference;


    requestAnimationFrame(
        () => {

            scoreProgress.style.strokeDashoffset =
                String(offset);

        }
    );


    const interpretation =
        getScoreInterpretation(
            safeScore
        );


    scoreTitle.textContent =
        interpretation.title;


    scoreInterpretation.textContent =
        interpretation.description;


    scoreStatusBadge.textContent =
        interpretation.status;


    scoreStatusBadge.className =
        `score-status ${interpretation.className}`;

}


function extractScore(data) {

    const possibleValues = [

        data?.cro_score,

        data?.croScore,

        data?.score,

        data?.overall_score,

        data?.overallScore,

        data?.analysis?.cro_score,

        data?.analysis?.croScore,

        data?.analysis?.score,

        data?.result?.cro_score,

        data?.result?.score

    ];


    for (
        const value of possibleValues
    ) {

        const number =
            Number(value);


        if (
            Number.isFinite(number) &&
            number >= 0 &&
            number <= 100
        ) {

            return Math.round(number);

        }

    }


    return 0;

}


function getScoreInterpretation(
    score
) {

    if (score >= 80) {

        return {

            title:
                "Strong conversion foundation.",

            description:
                "The page demonstrates several strong conversion elements. Focus on refining weaker signals.",

            status:
                "Strong",

            className:
                "score-strong"

        };

    }


    if (score >= 60) {

        return {

            title:
                "Good foundation with opportunities.",

            description:
                "The page has a workable conversion foundation, but several improvements could make the user journey clearer.",

            status:
                "Good",

            className:
                "score-good"

        };

    }


    if (score >= 40) {

        return {

            title:
                "Several conversion opportunities found.",

            description:
                "The analysis identified multiple areas where clearer messaging, stronger trust and reduced friction could help.",

            status:
                "Needs Work",

            className:
                "score-warning"

        };

    }


    return {

        title:
            "Significant conversion opportunities.",

        description:
            "The page has several areas that may be creating friction. Start with the highest-impact recommendations.",

        status:
            "Needs Attention",

        className:
            "score-critical"

    };

}


/* =========================================================
   INSIGHTS
========================================================= */

function renderInsights(data) {

    const mappings = {

        hero: [
            "hero_section",
            "heroSection",
            "hero_analysis",
            "heroAnalysis",
            "hero"
        ],

        cta: [
            "cta_quality",
            "ctaQuality",
            "cta_analysis",
            "ctaAnalysis",
            "cta"
        ],

        trust: [
            "trust_signals",
            "trustSignals",
            "trust_analysis",
            "trustAnalysis",
            "trust"
        ],

        product: [
            "product_page_issues",
            "productPageIssues",
            "product_issues",
            "productIssues",
            "product"
        ],

        mobile: [
            "mobile_ux",
            "mobileUX",
            "mobile_analysis",
            "mobileAnalysis",
            "mobile"
        ],

        copy: [
            "copy_message",
            "copyMessage",
            "copy_and_message",
            "copyAndMessage",
            "copy"
        ],

        friction: [
            "friction_points",
            "frictionPoints",
            "friction_analysis",
            "frictionAnalysis",
            "friction"
        ]

    };


    Object.entries(
        mappings
    ).forEach(
        ([key, possibleKeys]) => {

            const item =
                insightElements[key];


            const raw =
                findValueByKeys(
                    data,
                    possibleKeys
                );


            const text =
                normalizeAnalysisText(
                    raw
                );


            item.text.textContent =
                text ||
                "No analysis was returned.";


            const status =
                getStatusFromValue(
                    raw,
                    text
                );


            setStatusBadge(
                item.status,
                status
            );

        }
    );

}


/* =========================================================
   STATUS
========================================================= */

function getStatusFromValue(
    raw,
    text
) {

    /*
     * First use AI-provided status if
     * the backend contains it.
     */

    if (
        raw &&
        typeof raw === "object" &&
        raw.status
    ) {

        return formatStatus(
            raw.status
        );

    }


    /*
     * Fallback only when backend does not
     * provide a status.
     */

    const lower =
        text.toLowerCase();


    if (
        lower.includes("strong") ||
        lower.includes("excellent") ||
        lower.includes("effective") ||
        lower.includes("positive")
    ) {

        return {
            label: "Positive",
            className: "good"
        };

    }


    if (
        lower.includes("critical") ||
        lower.includes("poor") ||
        lower.includes("missing") ||
        lower.includes("weak") ||
        lower.includes("major issue")
    ) {

        return {
            label: "Attention",
            className: "critical"
        };

    }


    return {
        label: "Review",
        className: "warning"
    };

}


function formatStatus(
    value
) {

    const lower =
        String(value)
            .toLowerCase();


    if (
        lower.includes("good") ||
        lower.includes("positive") ||
        lower.includes("strong") ||
        lower.includes("excellent")
    ) {

        return {
            label: "Positive",
            className: "good"
        };

    }


    if (
        lower.includes("critical") ||
        lower.includes("poor") ||
        lower.includes("attention") ||
        lower.includes("high")
    ) {

        return {
            label: "Attention",
            className: "critical"
        };

    }


    return {
        label: "Review",
        className: "warning"
    };

}


function setStatusBadge(
    element,
    status
) {

    element.textContent =
        status.label;


    element.classList.remove(
        "good",
        "warning",
        "critical"
    );


    element.classList.add(
        status.className
    );

}


/* =========================================================
   RECOMMENDATIONS
========================================================= */

function renderRecommendations(
    data
) {

    const raw =
        findValueByKeys(
            data,
            [
                "recommended_improvements",
                "recommendedImprovements",
                "recommendations",
                "improvements",
                "action_items",
                "actionItems"
            ]
        );


    const recommendations =
        normalizeRecommendations(
            raw
        );


    recommendationsList.innerHTML =
        "";


    if (!recommendations.length) {

        return;

    }


    recommendations.forEach(
        (recommendation, index) => {

            const card =
                createRecommendationCard(
                    recommendation,
                    index
                );


            recommendationsList.appendChild(
                card
            );

        }
    );

}


function normalizeRecommendations(
    value
) {

    if (!value) {
        return [];
    }


    if (Array.isArray(value)) {

        return value
            .map(
                item => {

                    if (
                        typeof item ===
                        "string"
                    ) {

                        return {

                            title:
                                makeRecommendationTitle(
                                    item
                                ),

                            text:
                                item

                        };

                    }


                    if (
                        item &&
                        typeof item ===
                        "object"
                    ) {

                        const text =
                            item.description ||
                            item.recommendation ||
                            item.action ||
                            item.text ||
                            item.content ||
                            "";


                        return {

                            title:
                                item.title ||
                                item.heading ||
                                makeRecommendationTitle(
                                    text
                                ),

                            text

                        };

                    }


                    return null;

                }
            )
            .filter(Boolean);

    }


    return [];

}


function makeRecommendationTitle(
    text
) {

    const lower =
        String(text)
            .toLowerCase();


    if (
        lower.includes("cta") ||
        lower.includes("call to action")
    ) {

        return "Strengthen Primary CTA";

    }


    if (
        lower.includes("trust") ||
        lower.includes("review") ||
        lower.includes("badge")
    ) {

        return "Add Trust Signals";

    }


    if (
        lower.includes("hero") ||
        lower.includes("headline")
    ) {

        return "Clarify Hero Message";

    }


    if (
        lower.includes("mobile")
    ) {

        return "Improve Mobile Experience";

    }


    if (
        lower.includes("navigation") ||
        lower.includes("link")
    ) {

        return "Reduce Navigation Friction";

    }


    if (
        lower.includes("copy") ||
        lower.includes("message") ||
        lower.includes("value proposition")
    ) {

        return "Improve Message Clarity";

    }


    const cleaned =
        String(text)
            .replace(
                /^[-•*\d.)\s]+/,
                ""
            )
            .trim();


    if (!cleaned) {

        return "Improve Conversion Experience";

    }


    const words =
        cleaned.split(/\s+/);


    return words
        .slice(0, 6)
        .join(" ")
        .replace(/[.,:;!?]+$/, "");

}


function createRecommendationCard(
    recommendation,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "recommendation-card";


    card.dataset.recommendation =
        String(index);


    const number =
        String(index + 1)
            .padStart(2, "0");


    const numberElement =
        document.createElement(
            "div"
        );


    numberElement.className =
        "recommendation-number";


    numberElement.textContent =
        number;


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "recommendation-content";


    const titleElement =
        document.createElement(
            "h3"
        );


    titleElement.textContent =
        recommendation.title;


    const textElement =
        document.createElement(
            "p"
        );


    textElement.textContent =
        recommendation.text;


    content.appendChild(
        titleElement
    );

    content.appendChild(
        textElement
    );


    const arrow =
        document.createElement(
            "div"
        );


    arrow.className =
        "recommendation-arrow";


    arrow.textContent =
        "→";


    card.appendChild(
        numberElement
    );

    card.appendChild(
        content
    );

    card.appendChild(
        arrow
    );


    return card;

}


/* =========================================================
   INTERACTIONS
========================================================= */

function setupInteractions() {


    /*
     * New analysis
     */

    document
        .getElementById(
            "backHomeBtn"
        )
        .addEventListener(
            "click",
            () => {

                sessionStorage.removeItem(
                    "croAnalysisResult"
                );

                window.location.href =
                    "index.html";

            }
        );


    /*
     * Back to top
     */

    document
        .getElementById(
            "backToTopBtn"
        )
        .addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );


    /*
     * Insight cards
     */

    document
        .getElementById(
            "insightsGrid"
        )
        .addEventListener(
            "click",
            (event) => {

                const card =
                    event.target.closest(
                        ".insight-card"
                    );


                if (!card) {
                    return;
                }


                const key =
                    card.dataset.card;


                openInsightModal(
                    key
                );

            }
        );


    /*
     * Recommendation cards
     */

    recommendationsList
        .addEventListener(
            "click",
            (event) => {

                const card =
                    event.target.closest(
                        ".recommendation-card"
                    );


                if (!card) {
                    return;
                }


                const index =
                    Number(
                        card.dataset.recommendation
                    );


                openRecommendationModal(
                    index
                );

            }
        );


    /*
     * Modal close
     */

    document
        .getElementById(
            "detailClose"
        )
        .addEventListener(
            "click",
            closeModal
        );


    document
        .getElementById(
            "detailModal"
        )
        .addEventListener(
            "click",
            (event) => {

                if (
                    event.target.id ===
                    "detailModal"
                ) {

                    closeModal();

                }

            }
        );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeModal();

            }

        }
    );

}


/* =========================================================
   INSIGHT MODAL
========================================================= */

function openInsightModal(
    key
) {

    const item =
        insightElements[key];


    if (!item) {
        return;
    }


    const details =
        insightDetails[key];


    const analysis =
        item.text.textContent;


    const status =
        item.status.textContent;


    document
        .getElementById(
            "detailEyebrow"
        )
        .textContent =
        "AI INSIGHT";


    document
        .getElementById(
            "detailTitle"
        )
        .textContent =
        item.title;


    document
        .getElementById(
            "detailStatus"
        )
        .textContent =
        status;


    document
        .getElementById(
            "detailAnalysis"
        )
        .textContent =
        analysis;


    document
        .getElementById(
            "detailWhy"
        )
        .textContent =
        details.why;


    document
        .getElementById(
            "detailExample"
        )
        .textContent =
        details.example;


    document
        .getElementById(
            "detailAction"
        )
        .textContent =
        details.action;


    showModal();

}


/* =========================================================
   RECOMMENDATION MODAL
========================================================= */

function openRecommendationModal(
    index
) {

    const stored =
        sessionStorage.getItem(
            "croAnalysisResult"
        );


    if (!stored) {
        return;
    }


    const payload =
        JSON.parse(
            stored
        );


    const raw =
        findValueByKeys(
            payload.response,
            [
                "recommended_improvements",
                "recommendedImprovements",
                "recommendations",
                "improvements",
                "action_items",
                "actionItems"
            ]
        );


    const recommendations =
        normalizeRecommendations(
            raw
        );


    const recommendation =
        recommendations[index];


    if (!recommendation) {
        return;
    }


    document
        .getElementById(
            "detailEyebrow"
        )
        .textContent =
        "AI ACTION PLAN";


    document
        .getElementById(
            "detailTitle"
        )
        .textContent =
        recommendation.title;


    document
        .getElementById(
            "detailStatus"
        )
        .textContent =
        "Recommended";


    document
        .getElementById(
            "detailAnalysis"
        )
        .textContent =
        recommendation.text;


    document
        .getElementById(
            "detailWhy"
        )
        .textContent =
        "This recommendation was generated from the conversion signals identified on the analyzed page.";


    document
        .getElementById(
            "detailExample"
        )
        .textContent =
        getRecommendationExample(
            recommendation.text
        );


    document
        .getElementById(
            "detailAction"
        )
        .textContent =
        recommendation.text;


    showModal();

}


function getRecommendationExample(
    text
) {

    const lower =
        String(text)
            .toLowerCase();


    if (
        lower.includes("cta")
    ) {

        return (
            "Example: Make the primary action visually dominant and use specific wording that tells visitors what happens next."
        );

    }


    if (
        lower.includes("trust")
    ) {

        return (
            "Example: Place genuine reviews, guarantees or other relevant proof close to the primary conversion point."
        );

    }


    if (
        lower.includes("hero") ||
        lower.includes("headline")
    ) {

        return (
            "Example: Rewrite the headline around the main customer benefit and support it with one concise explanation."
        );

    }


    if (
        lower.includes("mobile")
    ) {

        return (
            "Example: Keep the primary action easy to find and reduce unnecessary content or interaction steps on small screens."
        );

    }


    return (
        "Example: Apply the recommendation to the relevant page section and verify that the primary conversion path becomes clearer."
    );

}


/* =========================================================
   MODAL
========================================================= */

function showModal() {

    const modal =
        document.getElementById(
            "detailModal"
        );


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal() {

    const modal =
        document.getElementById(
            "detailModal"
        );


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   DATA HELPERS
========================================================= */

function findValueByKeys(
    object,
    keys
) {

    if (
        object === null ||
        object === undefined
    ) {

        return undefined;

    }


    if (
        typeof object !==
        "object"
    ) {

        return undefined;

    }


    for (
        const key of keys
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                object,
                key
            )
        ) {

            return object[key];

        }

    }


    for (
        const key of Object.keys(
            object
        )
    ) {

        const value =
            object[key];


        if (
            value &&
            typeof value ===
            "object"
        ) {

            const found =
                findValueByKeys(
                    value,
                    keys
                );


            if (
                found !== undefined
            ) {

                return found;

            }

        }

    }


    return undefined;

}


function normalizeAnalysisText(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    if (
        typeof value ===
        "string"
    ) {

        return value.trim();

    }


    if (
        typeof value ===
        "number"
    ) {

        return String(value);

    }


    if (
        Array.isArray(value)
    ) {

        return value
            .map(
                item =>
                    normalizeAnalysisText(
                        item
                    )
            )
            .filter(Boolean)
            .join(" ");

    }


    if (
        typeof value ===
        "object"
    ) {

        const keys = [

            "analysis",
            "description",
            "summary",
            "assessment",
            "feedback",
            "recommendation",
            "text",
            "content",
            "issue"

        ];


        for (
            const key of keys
        ) {

            if (
                value[key] !==
                undefined
            ) {

                const result =
                    normalizeAnalysisText(
                        value[key]
                    );


                if (result) {
                    return result;
                }

            }

        }

    }


    return "";

}


/* =========================================================
   ANIMATION
========================================================= */

function animateNumber(
    element,
    target,
    duration
) {

    const start =
        Number(
            element.textContent
        ) || 0;


    const startTime =
        performance.now();


    function update(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            Math.round(
                start +
                (
                    target -
                    start
                ) *
                eased
            );


        element.textContent =
            String(value);


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================================
   PARTICLE BACKGROUND
========================================================= */

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
                (
                    Math.random() -
                    0.5
                ) *
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
            particle => {

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