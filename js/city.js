document.addEventListener('DOMContentLoaded', function() {
    
    const popupModal = new bootstrap.Modal(document.getElementById('popsup'));
    popupModal.show();

    const searchInput = document.getElementById('citySearch');
    const searchResults = document.getElementById('searchResults');
    const favoritesList = document.getElementById('favoritesList');
    const cityCards = document.querySelectorAll('.city-card');
    const favoriteDropdown = document.querySelector('.dropdown-menu');
    const favoriteToggleBtn = document.querySelector('[data-bs-toggle="dropdown"]');
    let favorites = [];

   
    favoriteDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    
    function updateFavoritesList() {
    if (favorites.length > 0) {
        favoritesList.innerHTML = favorites.map(city => 
            `<div class="d-flex justify-content-between align-items-center p-2">
                <span class="favorite-city" data-city="${city}" style="cursor: pointer;">
                    ${city}
                </span>
                <button class="btn-favorite-dropdown bg-transparent border-0 p-0">
                    <i class="bi bi-star-fill text-white"></i>
                </button>
            </div>`
        ).join('');

        favoritesList.querySelectorAll('.favorite-city').forEach(cityElement => {
            cityElement.addEventListener('click', function() {
                const cityName = this.dataset.city;
             
                fetch('js/data.json')
                    .then(response => response.json())
                    .then(cities => {
                        const cityData = cities.find(city => city.name === cityName);
                        if (cityData) {
                            window.location.href = `weather-detail.html?city=${encodeURIComponent(cityName)}&lat=${cityData.latitude}&lon=${cityData.longitude}`;
                        }
                    });
            });
        });

    
        favoritesList.querySelectorAll('.btn-favorite-dropdown').forEach((button, index) => {
            button.addEventListener('click', function(e) {
                const cityName = favorites[index];
                toggleFavorite(cityName);
            });
        });
    } else {
        favoritesList.innerHTML = '<div>No favorite cities</div>';
    }
}

 
    function toggleFavorite(cityName) {
        
        const cardIcons = Array.from(document.querySelectorAll('.city-card'))
            .filter(card => card.querySelector('h3').textContent === cityName)
            .map(card => card.querySelector('.btn-favorite i'));

        const searchIcons = Array.from(document.querySelectorAll('.search-result'))
            .filter(result => result.querySelector('span').textContent.split(',')[0] === cityName)
            .map(result => result.querySelector('.btn-favorite i'));

        const dropdownIcons = Array.from(favoritesList.querySelectorAll('.btn-favorite-dropdown i'))
            .filter((icon, index) => favorites[index] === cityName);

        
        const allIcons = [...cardIcons, ...searchIcons, ...dropdownIcons];

        if (favorites.includes(cityName)) {
           
            favorites = favorites.filter(city => city !== cityName);
            
           
            allIcons.forEach(icon => {
                icon.classList.replace('bi-star-fill', 'bi-star');
            });
        } else {
         
            favorites.push(cityName);
            
           
            allIcons.forEach(icon => {
                icon.classList.replace('bi-star', 'bi-star-fill');
            });
        }

        updateFavoritesList();
    }


    cityCards.forEach(card => {
        const cityName = card.querySelector('h3').textContent;
        const favoriteButton = card.querySelector('.btn-favorite');
        
        
        card.addEventListener('click', function(e) {
      
            if (e.target === favoriteButton || e.target.closest('.btn-favorite')) {
                return;
            }
            window.location.href = `weather-detail.html?city=${encodeURIComponent(cityName)}`;
        });
        
       
        favoriteButton.addEventListener('click', function(e) {
            e.stopPropagation(); 
            toggleFavorite(cityName);
        });
    });

    
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if(searchTerm === '') {
            searchResults.classList.add('d-none');
            return;
        }

        fetch('js/data.json')
            .then(response => response.json())
            .then(cities => {
                const matchedCities = cities.filter(city =>
                    city.name.toLowerCase().includes(searchTerm) ||
                    city.country.toLowerCase().includes(searchTerm)
                );

                if(matchedCities.length > 0) {
                    searchResults.classList.remove('d-none');
                    searchResults.innerHTML = matchedCities.map(city =>
                        `<div class="search-result d-flex justify-content-between align-items-center"
                            onclick="window.location.href='weather-detail.html?city=${encodeURIComponent(city.name)}&lat=${city.latitude}&lon=${city.longitude}'">
                            <span>${city.name}, ${city.country}</span>
                            <button class="btn-favorite bg-transparent border-0 p-0" onclick="event.stopPropagation();">
                                <i class="bi ${favorites.includes(city.name) ? 'bi-star-fill' : 'bi-star'} text-white"></i>
                            </button>
                        </div>`
                    ).join('');
                    
                   
                    searchResults.querySelectorAll('.btn-favorite').forEach(button => {
                        button.addEventListener('click', function(e) {
                            const cityName = this.closest('.search-result').querySelector('span').textContent.split(',')[0];
                            toggleFavorite(cityName);
                        });
                    });
                } else {
                    searchResults.innerHTML = `<div class="search-result">No cities found</div>`;
                }
            });
    });

   
    document.addEventListener('click', function(e) {
        if(!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('d-none');
        }
    });

   
    updateFavoritesList();
});