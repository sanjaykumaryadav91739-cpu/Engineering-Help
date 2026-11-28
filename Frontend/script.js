

const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const searchMessage = document.querySelector("#searchMessage");

const notificationBtn =
    document.querySelector("#notificationBtn");

const createPostBtn =
    document.querySelector("#createPostBtn");

const postContainer =
    document.querySelector("#postContainer");

const messageInput =
    document.querySelector("#messageInput");

const sendBtn =
    document.querySelector("#sendBtn");

const messages =
    document.querySelector("#messages");

const chatUsers =
    document.querySelectorAll(".chat-user");

const chatUserName =
    document.querySelector("#chatUserName");

const voiceCallBtn =
    document.querySelector("#voiceCallBtn");

const videoCallBtn =
    document.querySelector("#videoCallBtn");

const attachmentBtn =
    document.querySelector("#attachmentBtn");

const emojiBtn =
    document.querySelector("#emojiBtn");


/* 
   2. INITIALIZATION
 */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Engineering Help loaded successfully 🚀"
    );

    setupSearch();

    setupChat();

    setupCommunity();

    setupPYQ();

    setupNotifications();

    setupCallButtons();

    setupExtraButtons();

    setupNavbarProfile();

    protectPage();

});


/* 
   3. SEARCH
 */

function setupSearch() {

    if (!searchInput || !searchBtn) {
        return;
    }


    searchBtn.addEventListener(
        "click",
        performSearch
    );


    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                performSearch();

            }

        }
    );

}


function performSearch() {

    const query =
        searchInput.value.trim().toLowerCase();


    if (!query) {

        showSearchMessage(
            "Please enter something to search."
        );

        return;

    }


    const searchableElements =
        document.querySelectorAll(
            ".quick-card, .subject-card, .material-card, .pyq-card, .post-card"
        );


    let foundElement = null;


    searchableElements.forEach((element) => {

        const text =
            element.textContent.toLowerCase();


        if (
            !foundElement &&
            text.includes(query)
        ) {

            foundElement = element;

        }

    });


    if (foundElement) {

        foundElement.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        foundElement.classList.add(
            "search-highlight"
        );


        setTimeout(() => {

            foundElement.classList.remove(
                "search-highlight"
            );

        }, 2000);


        showSearchMessage(
            `Result found for "${query}".`
        );

    } else {

        showSearchMessage(
            `No result found for "${query}".`
        );

    }

}


function showSearchMessage(message) {

    if (!searchMessage) {
        return;
    }

    searchMessage.textContent = message;

}


/*
   4. PYQ
*/

function setupPYQ() {

    const pyqButtons =
        document.querySelectorAll(
            ".view-pyq"
        );


    pyqButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(".pyq-card");


                const title =
                    card.querySelector("h3")
                        ?.textContent
                        .trim()
                    || "PYQ";


                alert(
                    `${title}\n\nPDF viewer will be connected to the backend later.`
                );

            }
        );

    });

}


/*
   5. COMMUNITY
 */

function setupCommunity() {

    if (createPostBtn) {

        createPostBtn.addEventListener(
            "click",
            createPost
        );

    }


    setupPostActions();

}


function createPost() {

    const text =
        prompt(
            "Write your question or post:"
        );


    if (!text || !text.trim()) {

        return;

    }


    const post =
        document.createElement("article");


    post.className = "post-card";


    post.innerHTML = `

        <div class="post-user">

            <div class="avatar">
                Y
            </div>

            <div>

                <h4>
                    You
                </h4>

                <span>
                    Just now
                </span>

            </div>

        </div>


        <div class="post-content">

            <h3>
                ${escapeHTML(text.trim())}
            </h3>

            <p>
                Posted on Engineering Help.
            </p>

        </div>


        <div class="post-actions">

            <button class="like-btn">

                <i class="fa-regular fa-heart"></i>

                <span>0</span>

            </button>


            <button class="comment-btn">

                <i class="fa-regular fa-comment"></i>

                <span>0</span>

            </button>


            <button class="share-btn">

                <i class="fa-solid fa-share"></i>

                Share

            </button>

        </div>

    `;


    postContainer.prepend(post);


    setupPostActions();

}


function setupPostActions() {

    const likeButtons =
        document.querySelectorAll(
            ".like-btn"
        );


    const commentButtons =
        document.querySelectorAll(
            ".comment-btn"
        );


    const shareButtons =
        document.querySelectorAll(
            ".share-btn"
        );


    likeButtons.forEach((button) => {

        if (button.dataset.ready) {
            return;
        }

        button.dataset.ready = "true";


        button.addEventListener(
            "click",
            () => {

                const icon =
                    button.querySelector("i");

                const count =
                    button.querySelector("span");


                if (
                    icon.classList.contains(
                        "fa-regular"
                    )
                ) {

                    icon.classList.remove(
                        "fa-regular"
                    );

                    icon.classList.add(
                        "fa-solid"
                    );


                    count.textContent =
                        Number(count.textContent) + 1;

                }

            }
        );

    });


    commentButtons.forEach((button) => {

        if (button.dataset.ready) {
            return;
        }

        button.dataset.ready = "true";


        button.addEventListener(
            "click",
            () => {

                alert(
                    "Comment system will be connected with the backend."
                );

            }
        );

    });


    shareButtons.forEach((button) => {

        if (button.dataset.ready) {
            return;
        }

        button.dataset.ready = "true";


        button.addEventListener(
            "click",
            () => {

                const post =
                    button.closest(".post-card");


                const title =
                    post.querySelector("h3")
                        ?.textContent
                        .trim()
                    || "Engineering Help";


                sharePost(title);

            }
        );

    });

}


/*
   6. SHARE
 */

async function sharePost(text) {

    if (navigator.share) {

        try {

            await navigator.share({

                title: "Engineering Help",

                text: text

            });

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

    } else {

        alert(
            "Share API is not supported in this browser."
        );

    }

}


/* 
   7. CHAT
 */

function setupChat() {

    chatUsers.forEach((user) => {

        user.addEventListener(
            "click",
            () => {

                selectChatUser(user);

            }
        );

    });


    if (sendBtn) {

        sendBtn.addEventListener(
            "click",
            sendMessage
        );

    }


    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Enter") {

                    sendMessage();

                }

            }
        );

    }

}


function selectChatUser(user) {

    chatUsers.forEach((item) => {

        item.classList.remove(
            "active"
        );

    });


    user.classList.add(
        "active"
    );


    const name =
        user.dataset.user
        || "User";


    if (chatUserName) {

        chatUserName.textContent =
            name;

    }


    if (messages) {

        messages.innerHTML = `

            <div class="message received">
                Hello 👋
            </div>

            <div class="message received">
                You are now chatting with ${escapeHTML(name)}.
            </div>

        `;

    }

}


function sendMessage() {

    if (!messageInput || !messages) {
        return;
    }


    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    addMessage(
        text,
        "sent"
    );


    messageInput.value = "";


    /*
        Demo response.

        Later this will be replaced
        by Socket.IO real-time messaging.
    */

    setTimeout(() => {

        addMessage(
            "Message received 👍",
            "received"
        );

    }, 700);

}


function addMessage(text, type) {

    const message =
        document.createElement("div");


    message.className =
        `message ${type}`;


    message.textContent =
        text;


    messages.appendChild(
        message
    );


    messages.scrollTop =
        messages.scrollHeight;

}


/*
   8. CALLING
 */

function setupCallButtons() {

    if (voiceCallBtn) {

        voiceCallBtn.addEventListener(
            "click",
            () => {

                const user =
                    chatUserName?.textContent
                    || "User";


                alert(
                    `Calling ${user}...\n\nWebRTC will be integrated later.`
                );

            }
        );

    }


    if (videoCallBtn) {

        videoCallBtn.addEventListener(
            "click",
            () => {

                const user =
                    chatUserName?.textContent
                    || "User";


                alert(
                    `Video calling ${user}...\n\nWebRTC will be integrated later.`
                );

            }
        );

    }

}


/* 
   9. NOTIFICATIONS
*/

function setupNotifications() {

    if (!notificationBtn) {
        return;
    }


    notificationBtn.addEventListener(
        "click",
        () => {

            alert(
                "🔔 No new notifications."
            );

        }
    );

}


/* 
   10. EXTRA BUTTONS
*/

function setupExtraButtons() {

    if (attachmentBtn) {

        attachmentBtn.addEventListener(
            "click",
            () => {

                alert(
                    "File upload will be connected with the backend later."
                );

            }
        );

    }


    if (emojiBtn) {

        emojiBtn.addEventListener(
            "click",
            () => {

                if (messageInput) {

                    messageInput.value += " 😊";

                    messageInput.focus();

                }

            }
        );

    }

}


/*
   11. SECURITY HELPER
*/

function escapeHTML(text) {

    const element =
        document.createElement("div");


    element.textContent =
        text;


    return element.innerHTML;

}

// ================= SIGNUP =================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        // Frontend validation
        if (name.length < 2) {
            alert("Name must be at least 2 characters.");
            return;
        }

        if (!email.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(
                "https://engineering-help.onrender.com/api/v1/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Signup failed.");
                return;
            }

            alert("Account created successfully!");

            signupForm.reset();
            window.location.href = "login.html";

        } catch (error) {
            console.error("Signup error:", error);
            alert("Unable to connect to server.");
        }
    });
}

/* 
   12. END
 */

console.log(
    "Engineering Help JavaScript ready 🚀"
);

async function connectBackend() {
    try {
        const response = await fetch(
            "https://engineering-help.onrender.com/api/v1/health"
        );

        const data = await response.json();

        console.log("Backend Response:", data);

    } catch (error) {
        console.error("Backend Connection Failed:", error);
    }
}

// ==============================
// NAVBAR PROFILE
// ==============================

function setupNavbarProfile() {
    const profileImage = document.getElementById("navbarProfileImage");
    const profileInitial = document.getElementById("navbarProfileInitial");
    const defaultProfileIcon = document.getElementById("defaultProfileIcon");

    if (!profileImage || !profileInitial || !defaultProfileIcon) {
        return;
    }

    const userData = localStorage.getItem("user");

    if (!userData) {
        profileImage.style.display = "none";
        profileInitial.style.display = "none";
        defaultProfileIcon.style.display = "block";
        return;
    }

    try {
        const user = JSON.parse(userData);

        if (user.profileImage) {
            profileImage.src = user.profileImage;
            profileImage.style.display = "block";
            profileInitial.style.display = "none";
            defaultProfileIcon.style.display = "none";
        } else {
            const firstLetter = user.name
                ? user.name.trim().charAt(0).toUpperCase()
                : "?";

            profileInitial.textContent = firstLetter;

            profileImage.style.display = "none";
            profileInitial.style.display = "flex";
            defaultProfileIcon.style.display = "none";
        }
    } catch (error) {
        console.error("Navbar profile error:", error);

        profileImage.style.display = "none";
        profileInitial.style.display = "none";
        defaultProfileIcon.style.display = "block";
    }
}

connectBackend();

