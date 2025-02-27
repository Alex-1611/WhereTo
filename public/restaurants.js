window.onload = function () {
    console.log('Hello World!2');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'restaurants.json', true);
    console.log('Hello World!2');
    xhr.onload = () => {
        if (xhr.status === 200) {
            const restaurants = JSON.parse(xhr.responseText);
            CreateDivs(restaurants);
        } else {
            console.log('Error:' + xhr.status);
        }
    };

    xhr.onerror = function() {
        console.log('Network error occurred');
    };

    xhr.send();
    
};

function CreateDivs(restaurants) {
    let container = document.getElementById('restaurants_container');
    restaurants.forEach(restaurant => {
        console.log(restaurant['name']);
        let restaurantDiv = document.createElement('div');
        restaurantDiv.setAttribute('class', 'restaurant');
        restaurantDiv.setAttribute('data-id', restaurant.id);

        let img = document.createElement('img');
        img.setAttribute('src', restaurant.images[0]);
        img.setAttribute('alt', restaurant.name);

        let infoDIv = document.createElement('div');
        infoDIv.setAttribute('class', 'info');

        let name = document.createElement('h2');
        name.innerText = restaurant.name;

        let info = document.createElement('p');
        info.innerHTML = `
            Food: ${restaurant.food} &nbsp&nbsp|&nbsp&nbsp  Service: ${restaurant.service}  &nbsp&nbsp|&nbsp&nbsp  Setting: ${restaurant.setting} <br>
            Overall: ${restaurant.rating} <br><br>
            Price: ${"$".repeat(restaurant.price)}
        `;
        infoDIv.appendChild(name);
        infoDIv.appendChild(info);
        restaurantDiv.appendChild(img);
        restaurantDiv.appendChild(infoDIv);

        restaurantDiv.addEventListener('click', function() {
            window.location.href = `restaurant_${restaurant.id}.html`;
        });

        container.appendChild(restaurantDiv);
    });
}