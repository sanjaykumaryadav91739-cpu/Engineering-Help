
const userData = localStorage.getItem("user");

if (!userData) {

    window.location.href = "login.html";

} else {

    const user = JSON.parse(userData);


    // ==============================
    // Profile Information
    // ==============================

    document.getElementById("profileName").textContent =
        user.name || "Not added";

    document.getElementById("profileEmail").textContent =
        user.email || "Not added";

    document.getElementById("profilePhone").textContent =
        user.phone || "Not added";

    document.getElementById("profileAddress").textContent =
        user.address || "Not added";


    // ==============================
    // Profile Image / Initial
    // ==============================

    const profileImage =
        document.getElementById("profileImage");

    const profileInitial =
        document.getElementById("profileInitial");


    function showProfilePicture(userData) {

        if (userData.profileImage) {

            profileImage.src = userData.profileImage;
            profileImage.style.display = "block";

            profileInitial.style.display = "none";

        } else {

            const firstLetter =
                userData.name
                    ? userData.name.trim().charAt(0).toUpperCase()
                    : "?";

            profileInitial.textContent = firstLetter;

            profileInitial.style.display = "flex";
            profileImage.style.display = "none";
        }
    }


    showProfilePicture(user);


    // ==============================
    // Profile Image Elements
    // ==============================

    const profileImageInput =
        document.getElementById("profileImageInput");

    const changeProfileImageBtn =
        document.getElementById("changeProfileImageBtn");

    const uploadProfileImageBtn =
        document.getElementById("uploadProfileImageBtn");

    const imageMessage =
        document.getElementById("imageMessage");


    // ==============================
    // Choose Image
    // ==============================

    changeProfileImageBtn.addEventListener("click", () => {

        profileImageInput.click();

    });


    // ==============================
    // Image Selected
    // ==============================

    profileImageInput.addEventListener("change", () => {

        const file = profileImageInput.files[0];

        if (!file) {
            return;
        }


        // Check image type
        if (!file.type.startsWith("image/")) {

            alert("Please select an image file.");

            profileImageInput.value = "";

            return;
        }


        // Check file size - 5 MB
        if (file.size > 5 * 1024 * 1024) {

            alert("Image size must be less than 5 MB.");

            profileImageInput.value = "";

            return;
        }


        // Preview image
        const reader = new FileReader();

        reader.onload = (event) => {

            profileImage.src = event.target.result;

            profileImage.style.display = "block";
            profileInitial.style.display = "none";

        };

        reader.readAsDataURL(file);


        uploadProfileImageBtn.style.display = "block";

        imageMessage.textContent =
            "Image selected. Click Upload Picture.";

    });


    // ==============================
    // Upload Profile Image
    // ==============================

    uploadProfileImageBtn.addEventListener("click", async () => {

        const file = profileImageInput.files[0];

        if (!file) {

            alert("Please select an image first.");

            return;
        }


        const formData = new FormData();

        formData.append("profileImage", file);


        uploadProfileImageBtn.disabled = true;

        uploadProfileImageBtn.textContent =
            "Uploading...";


        try {

            const response = await fetch(
                `http://localhost:3000/api/v1/users/${user._id}/profile-image`,
                {
                    method: "POST",
                    body: formData
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Profile image upload failed"
                );

                return;
            }


            // Update local user data
            user.profileImage = data.profileImage;


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // Show uploaded image
            showProfilePicture(user);


            // Reset input
            profileImageInput.value = "";

            uploadProfileImageBtn.style.display = "none";

            imageMessage.textContent =
                "Profile picture updated successfully.";


            alert("Profile picture uploaded successfully");


        } catch (error) {

            console.error(
                "Profile image upload error:",
                error
            );

            alert("Unable to connect to server");

        } finally {

            uploadProfileImageBtn.disabled = false;

            uploadProfileImageBtn.textContent =
                "Upload Picture";
        }

    });


    // ==============================
    // Logout
    // ==============================

    document.getElementById("logoutBtn").addEventListener("click", () => {

        localStorage.removeItem("user");
        

        window.location.href = "login.html";

    });


    // ==============================
    // Edit Profile
    // ==============================

    document.getElementById("editProfileBtn").addEventListener("click", () => {

        const editForm =
            document.getElementById("editProfileForm");

        editForm.style.display = "block";


        document.getElementById("editPhone").value =
            user.phone || "";

        document.getElementById("editAddress").value =
            user.address || "";

    });


    // ==============================
    // Save Profile
    // ==============================

    document.getElementById("saveProfileBtn").addEventListener("click", async () => {

        const phone =
            document.getElementById("editPhone").value.trim();

        const address =
            document.getElementById("editAddress").value.trim();


        try {

            const response = await fetch(
                `http://localhost:3000/api/v1/users/${user._id}/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        phone,
                        address
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Profile update failed"
                );

                return;
            }


            // Updated user save
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // Keep local user updated
            Object.assign(user, data.user);


            // Screen update
            document.getElementById("profilePhone").textContent =
                data.user.phone || "Not added";

            document.getElementById("profileAddress").textContent =
                data.user.address || "Not added";


            // Profile image remain correct
            showProfilePicture(user);


            // Hide form
            document.getElementById("editProfileForm").style.display =
                "none";


            alert("Profile updated successfully");


        } catch (error) {

            console.error(
                "Update profile error:",
                error
            );

            alert("Unable to connect to server");

        }

    });

}

