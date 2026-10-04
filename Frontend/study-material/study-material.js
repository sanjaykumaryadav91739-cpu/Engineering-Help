// =========================================================
// STUDY MATERIAL
// Backend API + Search + Category Filter
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000/api/v1/materials";

    const searchInput =
        document.getElementById("materialSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const subjectContainer =
        document.getElementById("subjectContainer");

    const subjectCards =
        document.querySelectorAll(".subject-card");

    const noMaterialMessage =
        document.getElementById("noMaterialMessage");


    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (
        !searchInput ||
        !categoryFilter ||
        !subjectContainer ||
        !noMaterialMessage
    ) {
        console.error(
            "Study Material: Required elements not found."
        );

        return;
    }


    // =====================================================
    // BACKEND MATERIAL DATA
    // =====================================================

    let allMaterials = [];


    // =====================================================
    // CREATE BACKEND MATERIAL SECTION
    // =====================================================

    const backendMaterialContainer =
        document.createElement("div");

    backendMaterialContainer.id =
        "backendMaterialContainer";

    backendMaterialContainer.className =
        "backend-material-container";

    backendMaterialContainer.style.display = "none";

    subjectContainer.insertAdjacentElement(
        "afterend",
        backendMaterialContainer
    );


    // =====================================================
    // GET STUDY MATERIALS FROM BACKEND
    // =====================================================

    async function loadMaterials() {

        try {

            const token =
                localStorage.getItem("token");


            // -------------------------------------------------
            // TOKEN NOT FOUND
            // -------------------------------------------------

            if (!token) {

                console.warn(
                    "Authentication token not found."
                );

                window.location.href =
                    "../login.html";

                return;
            }


            // -------------------------------------------------
            // API REQUEST
            // -------------------------------------------------

            const response =
                await fetch(API_URL, {

                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                });


            const data =
                await response.json();


            console.log(
                "Study Material Response:",
                data
            );


            // -------------------------------------------------
            // TOKEN INVALID / EXPIRED
            // -------------------------------------------------

            if (response.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert(
                    "Session expired. Please login again."
                );

                window.location.href =
                    "../login.html";

                return;
            }


            // -------------------------------------------------
            // OTHER API ERROR
            // -------------------------------------------------

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to fetch study materials"
                );
            }


            // -------------------------------------------------
            // SAVE MATERIALS
            // -------------------------------------------------

            allMaterials =
                Array.isArray(data.materials)
                    ? data.materials
                    : [];


            console.log(
                "Study Materials Loaded Successfully:",
                allMaterials
            );


            // -------------------------------------------------
            // SETUP EXPLORE BUTTONS
            // -------------------------------------------------

            setupExploreButtons();


        } catch (error) {

            console.error(
                "Study Material API Error:",
                error
            );

            backendMaterialContainer.innerHTML = `
                <div class="material-error">
                    <p>
                        Unable to load study materials.
                    </p>
                </div>
            `;

        }

    }


    // =====================================================
    // SETUP EXPLORE BUTTONS
    // =====================================================

    function setupExploreButtons() {

        const exploreButtons =
            document.querySelectorAll(
                ".subject-card .subject-btn"
            );


        exploreButtons.forEach((button) => {

            button.addEventListener(
                "click",
                handleExploreClick
            );

        });

    }


    // =====================================================
    // EXPLORE BUTTON CLICK
    // =====================================================

    function handleExploreClick(event) {

        event.preventDefault();


        const button =
            event.currentTarget;


        const card =
            button.closest(".subject-card");


        if (!card) {
            return;
        }


        const subject =
            card.dataset.subject || "";


        console.log(
            "Selected Subject:",
            subject
        );


        showSubjectMaterials(subject);

    }


    // =====================================================
    // SHOW SUBJECT MATERIALS
    // =====================================================

    function showSubjectMaterials(subject) {

        const normalizedSubject =
            subject.trim().toLowerCase();


        const matchedMaterials =
            allMaterials.filter((material) => {

                const materialSubject =
                    String(
                        material.subject || ""
                    )
                    .trim()
                    .toLowerCase();


                return (
                    materialSubject ===
                    normalizedSubject
                );

            });


        backendMaterialContainer.innerHTML = `

            <div class="backend-material-header">

                <h2>
                    ${escapeHTML(subject)}
                    Study Materials
                </h2>

                <button
                    type="button"
                    id="backToSubjects"
                    class="back-subject-btn"
                >
                    ← Back to Subjects
                </button>

            </div>

            <div
                id="backendMaterialGrid"
                class="backend-material-grid"
            ></div>

            <div
                id="subjectMaterialEmpty"
                class="subject-material-empty"
                hidden
            >
                <h3>
                    No Materials Available
                </h3>

                <p>
                    No study material is available
                    for ${escapeHTML(subject)} yet.
                </p>
            </div>

        `;


        const grid =
            document.getElementById(
                "backendMaterialGrid"
            );


        const emptyMessage =
            document.getElementById(
                "subjectMaterialEmpty"
            );


        // =================================================
        // NO MATERIAL FOUND
        // =================================================

        if (matchedMaterials.length === 0) {

            emptyMessage.hidden = false;

        } else {

            // =============================================
            // DISPLAY MATERIAL CARDS
            // =============================================

            matchedMaterials.forEach(
                (material) => {

                    const materialCard =
                        document.createElement("div");


                    materialCard.className =
                        "backend-material-card";


                    materialCard.innerHTML = `

                        <div
                            class="material-card-content"
                        >

                            <span
                                class="material-type"
                            >
                                ${escapeHTML(
                                    material.type ||
                                    "Material"
                                )}
                            </span>


                            <h3>
                                ${escapeHTML(
                                    material.title ||
                                    "Untitled Material"
                                )}
                            </h3>


                            <p
                                class="material-subject"
                            >
                                <strong>
                                    Subject:
                                </strong>

                                ${escapeHTML(
                                    material.subject ||
                                    "N/A"
                                )}
                            </p>


                            <p
                                class="material-description"
                            >
                                ${escapeHTML(
                                    material.description ||
                                    "No description available."
                                )}
                            </p>


                            <a
                                href="${escapeHTML(
                                    material.fileUrl || "#"
                                )}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="material-view-btn"
                            >
                                View Material →
                            </a>

                        </div>

                    `;


                    grid.appendChild(
                        materialCard
                    );

                }
            );

        }


        // =================================================
        // SHOW MATERIAL SECTION
        // =================================================

        subjectContainer.style.display =
            "none";


        noMaterialMessage.hidden =
            true;


        backendMaterialContainer.style.display =
            "block";


        backendMaterialContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        // =================================================
        // BACK TO SUBJECTS
        // =================================================

        const backButton =
            document.getElementById(
                "backToSubjects"
            );


        if (backButton) {

            backButton.addEventListener(
                "click",
                () => {

                    backendMaterialContainer.style.display =
                        "none";


                    subjectContainer.style.display =
                        "";


                    filterMaterials();


                    subjectContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }

    }


    // =====================================================
    // FILTER STATIC SUBJECT CARDS
    // =====================================================

    function filterMaterials() {

        const searchValue =
            searchInput.value
                .trim()
                .toLowerCase();


        const selectedCategory =
            categoryFilter.value;


        let visibleCards = 0;


        subjectCards.forEach((card) => {

            const subject =
                (card.dataset.subject || "")
                    .toLowerCase();


            const category =
                (card.dataset.category || "")
                    .toLowerCase();


            const matchesSearch =
                subject.includes(
                    searchValue
                );


            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            if (
                matchesSearch &&
                matchesCategory
            ) {

                card.style.display = "";

                visibleCards++;

            } else {

                card.style.display = "none";

            }

        });


        noMaterialMessage.hidden =
            visibleCards !== 0;

    }


    // =====================================================
    // SEARCH
    // =====================================================

    searchInput.addEventListener(
        "input",
        filterMaterials
    );


    // =====================================================
    // CATEGORY FILTER
    // =====================================================

    categoryFilter.addEventListener(
        "change",
        filterMaterials
    );


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(value) {

        return String(value)

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    filterMaterials();

    loadMaterials();


    // =====================================================
    // NAVBAR PROFILE
    // =====================================================

    if (
        typeof setupNavbarProfile ===
        "function"
    ) {

        setupNavbarProfile();

    }

});