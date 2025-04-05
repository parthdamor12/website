// Function to show the Like button and hide other content
function showLike() {
    // Hide initial content
    document.getElementById("content").style.display = "none";

    // Show the like section
    document.getElementById("likeSection").style.display = "block";
}

// Function to show the 'like' message after clicking like
function like() {
    // Show the "You liked this page!" message
    document.getElementById("likeMessage").style.display = "block";
}
