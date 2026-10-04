// =========================================================
// COMMON NAVBAR
// =========================================================

function setupNavbarProfile() {

    const profileImage =
        document.getElementById("navbarProfileImage");

    const profileInitial =
        document.getElementById("navbarProfileInitial");

    const defaultProfileIcon =
        document.getElementById("defaultProfileIcon");


    // =====================================================
    // CHECK ELEMENTS
    // =====================================================

    if (
        !profileImage ||
        !profileInitial ||
        !defaultProfileIcon
    ) {
        return;
    }


    // =====================================================
    // GET USER FROM LOCAL STORAGE
    // =====================================================

    const userData =
        localStorage.getItem("user");


    // =====================================================
    // USER NOT LOGGED IN
    // =====================================================

    if (!userData) {

        profileImage.style.display = "none";

        profileInitial.style.display = "none";

        defaultProfileIcon.style.display = "block";

        return;
    }


    // =====================================================
    // PARSE USER DATA
    // =====================================================

    try {

        const user =
            JSON.parse(userData);


        // =================================================
        // PROFILE IMAGE AVAILABLE
        // =================================================

        if (
            user.profileImage &&
            user.profileImage.trim() !== ""
        ) {

            profileImage.src =
                user.profileImage;

            profileImage.style.display =
                "block";

            profileInitial.style.display =
                "none";

            defaultProfileIcon.style.display =
                "none";


            // ---------------------------------------------
            // IMAGE LOAD ERROR
            // ---------------------------------------------

            profileImage.onerror = () => {

                profileImage.style.display =
                    "none";

                const firstLetter =
                    user.name
                        ? user.name
                            .trim()
                            .charAt(0)
                            .toUpperCase()
                        : "?";

                profileInitial.textContent =
                    firstLetter;

                profileInitial.style.display =
                    "flex";

                defaultProfileIcon.style.display =
                    "none";
            };

            return;
        }


        // =================================================
        // NO PROFILE IMAGE
        // SHOW USER INITIAL
        // =================================================

        const firstLetter =
            user.name
                ? user.name
                    .trim()
                    .charAt(0)
                    .toUpperCase()
                : "?";


        profileInitial.textContent =
            firstLetter;

        profileInitial.style.display =
            "flex";

        profileImage.style.display =
            "none";

        defaultProfileIcon.style.display =
            "none";


    } catch (error) {

        console.error(
            "Navbar profile error:",
            error
        );

        profileImage.style.display =
            "none";

        profileInitial.style.display =
            "none";

        defaultProfileIcon.style.display =
            "block";
    }
}


// =========================================================
// AUTO INITIALIZE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavbarProfile();

    }
);