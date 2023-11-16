
const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 5;
const apiKey = 'U0PqJ5UprbVQExkXc7ZgsGVfIM7Z1O8Uiv7g2hOO';
const end = new Date().toISOString().split('T')[0]
const cal = new Date(new Date().setDate(new Date().getDate() - 20));
const start = cal.toISOString().split('T')[0]
// const end =  cal.toLocaleString();

// const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start}&end_date=${end}`;

console.log(start, end);

let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });

    switch (page) {
        case 'results':
            resultsNav.classList.remove('hidden');
            favoritesNav.classList.add('hidden');
            break;
        case 'favorites':
            resultsNav.classList.add('hidden');
            favoritesNav.classList.remove('hidden');
            break; 
        default:
            console.log("Unknown page identifier");
            break;
    }

    loader.classList.add('hidden');
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    // Loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            // Show Save Confirmation for 2 seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

// Remove item from favorites
function removeFavorite(itemUrl) {
    // remove property from object
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}


function createDOMNodes(page) {
    let currentArray = [];
    switch (page) {
        case 'results':
            currentArray = resultsArray;
            break;
        case 'favorites':
            currentArray = Object.values(favorites);
            break; 
        default:
            console.log("Unknown page identifier");
            break;
    }
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = "NASA Picture of the Day";
        image.loading = "lazy";
        image.classList.add('card-img-top');
        // Card Body
        const body = document.createElement('div');
        body.classList.add('card-body');
        // Card Title
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = result.title;
        // Add to Favorites
        const addToFavorites = document.createElement('p');
        addToFavorites.classList.add('clickable');
        if (page === 'results') {
            addToFavorites.textContent = 'Add to Favorites';
            addToFavorites.url = result.url;
            addToFavorites.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            addToFavorites.textContent = 'Remove Favorite';
            addToFavorites.url = result.url;
            addToFavorites.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // Card Text Explanation
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Muted Text
        const mutedText = document.createElement('small');
        mutedText.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright Info
        const copyrightInfo = document.createElement('span');
        copyrightInfo.textContent = ` ${result.copyright ? result.copyright : ''}`;

        mutedText.append(date, copyrightInfo);
        body.append(title, addToFavorites, cardText, mutedText);
        link.appendChild(image);      
        card.append(link, body);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page) {
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);

}

// Get mages from NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch(error) {
        // Catch Error Here
    }
}

// On Load
getNasaPictures();