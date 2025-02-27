let currentSlide = 0;
let slides;
const restaurantId = document.querySelector('meta[name="restaurant-id"]').getAttribute('content');

function showSlide(index) {
    slides.forEach((slide) => {
        slide.classList.remove('active');
    });
    slides[index].classList.add('active');
}

function changeSlide(direction) {
    if (!slides) return; // Exit the function if slides is not yet initialized
    currentSlide += direction;
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
}

document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loggedDiv = document.querySelector('.leave_review.logged');
    const notLoggedDiv = document.querySelector('.leave_review.not_logged');

    if (isLoggedIn) {
        loggedDiv.style.display = 'block';
        notLoggedDiv.style.display = 'none';
    } else {
        loggedDiv.style.display = 'none';
        notLoggedDiv.style.display = 'block';
    }

    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:8080/restaurants/${restaurantId}`, true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const restaurant = JSON.parse(xhr.responseText);
            const foodRating = document.getElementById('food_rating');
            const serviceRating = document.getElementById('service_rating');
            const settingRating = document.getElementById('setting_rating');
            const overallRating = document.getElementById('overall_rating');
            foodRating.innerText = restaurant.food;
            serviceRating.innerText = restaurant.service;
            settingRating.innerText = restaurant.setting;
            overallRating.innerText = restaurant.rating;

            restaurant.images.forEach((image) => {
                const img = document.createElement('img');
                const imgDiv = document.createElement('div');
                img.setAttribute('src', image);
                img.setAttribute('alt', restaurant.name);
                imgDiv.setAttribute('class', 'slide');
                imgDiv.appendChild(img);
                document.getElementById('slideshow-container').insertAdjacentElement('afterbegin', imgDiv);
            });

            slides = document.querySelectorAll('.slide');
            showSlide(currentSlide);

            restaurant.reviews.forEach((review) => {
                const reviewDiv = document.createElement('div');
                reviewDiv.setAttribute('class', 'review');
                reviewDiv.innerHTML = `
                    <div class="review-header"> 
                    <span class="user">${review['user']}</span> 
                    <div class="ratings"> 
                    <span class="rating-item">Food: <span class="star">&#9733;</span> 
                    <span class="rating">${review.food}</span></span> 
                    <span class="rating-item">Service: <span class="star">&#9733;</span> 
                    <span class="rating">${review.service}</span></span> 
                    <span class="rating-item">Setting: <span class="star">&#9733;</span> 
                    <span class="rating">${review.setting}</span></span> </div> </div> 
                    <p class="review-text">${review['text']}</p>
                `;
                document.querySelector('.reviews_container').appendChild(reviewDiv);
            });
        }
    };
    xhr.send();

    const addReviewBtn = document.getElementById('add-review-btn');
    const reviewForm = document.getElementById('review-form');

    addReviewBtn.addEventListener('click', function() {
        reviewForm.style.display = reviewForm.style.display === 'none' ? 'block' : 'none';
    });

    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const foodRating = document.getElementById('new-food-rating').value;
        const serviceRating = document.getElementById('new-service-rating').value;
        const settingRating = document.getElementById('new-setting-rating').value;
        const reviewText = document.getElementById('review-text').value;
        let username = localStorage.getItem('username');

        let review = JSON.stringify([restaurantId, username, foodRating, serviceRating, settingRating, reviewText]);
        let xhr_review = new XMLHttpRequest();
        xhr_review.open("POST", "http://localhost:8080/send-review")
        xhr_review.setRequestHeader("Content-Type", "application/json");
        xhr_review.send(review);

        reviewForm.reset();
        reviewForm.style.display = 'none';
    });
});
