// =========================================================
// ADMIN STUDY MATERIAL UPLOAD
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "https://engineering-help.onrender.com/api/v1/materials";


    // =====================================================
    // ELEMENTS
    // =====================================================

    const form =
        document.getElementById(
            "materialUploadForm"
        );

    const titleInput =
        document.getElementById("title");

    const descriptionInput =
        document.getElementById("description");

    const subjectInput =
        document.getElementById("subject");

    const typeInput =
        document.getElementById("type");

    const fileInput =
        document.getElementById("file");

    const message =
        document.getElementById("uploadMessage");

    const submitButton =
        document.getElementById(
            "uploadButton"
        );


    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (
        !form ||
        !titleInput ||
        !descriptionInput ||
        !subjectInput ||
        !typeInput ||
        !fileInput ||
        !message ||
        !submitButton
    ) {

        console.error(
            "Admin Material: Required elements not found."
        );

        return;
    }


    // =====================================================
    // AUTH CHECK
    // =====================================================

    const token =
        localStorage.getItem("token");


    if (!token) {

        console.warn(
            "Authentication token not found."
        );

        window.location.href =
            "../login.html";

        return;
    }


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // =============================================
            // GET VALUES
            // =============================================

            const title =
                titleInput.value.trim();

            const description =
                descriptionInput.value.trim();

            const subject =
                subjectInput.value;

            const type =
                typeInput.value;

            const file =
                fileInput.files[0];


            // =============================================
            // FRONTEND VALIDATION
            // =============================================

            if (
                !title ||
                !subject ||
                !type ||
                !file
            ) {

                showMessage(
                    "Please fill all required fields and select a PDF.",
                    "error"
                );

                return;
            }


            // =============================================
            // PDF CHECK
            // =============================================

            const isPDF =
                file.type ===
                "application/pdf";


            if (!isPDF) {

                showMessage(
                    "Please select a PDF file.",
                    "error"
                );

                return;
            }


            // =============================================
            // FORM DATA
            // =============================================

            const formData =
                new FormData();


            formData.append(
                "title",
                title
            );

            formData.append(
                "description",
                description
            );

            formData.append(
                "subject",
                subject
            );

            formData.append(
                "type",
                type
            );

            formData.append(
                "file",
                file
            );


            // =============================================
            // BUTTON STATE
            // =============================================

            submitButton.disabled = true;

            submitButton.textContent =
                "Uploading...";


            showMessage(
                "Uploading study material...",
                "info"
            );


            // =============================================
            // API REQUEST
            // =============================================

            try {

                const response =
                    await fetch(
                        API_URL,
                        {
                            method: "POST",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Upload Response:",
                    data
                );


                // =========================================
                // UNAUTHORIZED
                // =========================================

                if (
                    response.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );


                    alert(
                        "Session expired. Please login again."
                    );


                    window.location.href =
                        "../login.html";


                    return;
                }


                // =========================================
                // NOT ADMIN
                // =========================================

                if (
                    response.status === 403
                ) {

                    showMessage(
                        "Access denied. Only admin can upload study material.",
                        "error"
                    );

                    return;
                }


                // =========================================
                // OTHER ERROR
                // =========================================

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to upload study material."
                    );
                }


                // =========================================
                // SUCCESS
                // =========================================

                showMessage(
                    "Study material uploaded successfully.",
                    "success"
                );


                form.reset();


            } catch (error) {

                console.error(
                    "Study Material Upload Error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to connect to server.",
                    "error"
                );

            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Upload Material";

            }

        }
    );


    // =====================================================
    // SHOW MESSAGE
    // =====================================================

    function showMessage(
        text,
        type
    ) {

        message.textContent =
            text;

        message.className =
            `upload-message ${type}`;

    }

});