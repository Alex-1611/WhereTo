window.onload = function() {
    let randButton = document.getElementById("random_restaurant");
    randButton.addEventListener("click", function() {
        console.log("clicked");
        let xhr = new XMLHttpRequest();
        xhr.open("GET", `http://localhost:8080/random_restaurant`);
        xhr.onload = function() {
            if (xhr.status === 200) {
                window.location.href = `http://localhost:8080/restaurant_${xhr.responseText}.html`;
            } else {
                console.error("Error fetching random restaurant:", xhr.status);
            }
        }
        xhr.onerror = function() {
            console.error("Network error occurred");
        }
        xhr.send();
    });
}
