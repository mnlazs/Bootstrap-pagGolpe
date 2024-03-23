document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffect();
    // Inicialización de otras funciones necesarias al cargar el documento
    logEpisodios();

    // Inicialización del efecto de menú de hamburguesa
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarNav = document.querySelector('.navbar-nav');

    navbarToggler.addEventListener('click', function() {
        navbarNav.classList.toggle('active');
    });

    // Manejo de clics en enlaces de navegación para un desplazamiento suave
    const menuLinks = document.querySelectorAll('.navbar-nav .nav-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            if (link.getAttribute('href').startsWith('#')) {
                event.preventDefault();
                const targetSectionId = link.getAttribute('href').substring(1); // Elimina el #
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

async function fetchEpisodios() {
    try {
        const response = await fetch('/ruta-para-obtener-episodios');
        if (!response.ok) throw new Error('Respuesta de red no fue ok');
        const episodios = await response.json();
        displayEpisodios(episodios);
    } catch (error) {
        console.error('Error al fetch episodios:', error);
    }
}

async function createToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: "a36ee9830b3f478faa84976f71874258",
        client_secret: "80d6ed48368f4c11a46d2d45be5155f6",
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });
    const data = await response.json();
    return data.access_token;
}

async function logEpisodios() {
    const token = await createToken();
    const response = await fetch('https://api.spotify.com/v1/shows/2XXFmPWjgpqqxxzuO8pxSI/episodes?market=US', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch episodes');
    const episodios = await response.json();
    displayEpisodios(episodios.items);
}

function displayEpisodios(episodios) {
    const episodesList = document.getElementById('episodes-list');
    if (episodesList) {
        episodesList.innerHTML = '';
        episodios.forEach((episode) => {
            const episodeElement = document.createElement('div');
            episodeElement.className = 'episode';
            let description = episode.description.length > 100 ? `${episode.description.substring(0, 100)}...` : episode.description;
            episodeElement.innerHTML = `
                <h3>${episode.name}</h3>
                <p>${description}</p>
                <a href="${episode.spotifyLink}" target="_blank">Escuchar en Spotify</a>
            `;
            episodesList.appendChild(episodeElement);
        });
    }
}

function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const position = window.pageYOffset - element.offsetTop;
            element.style.backgroundPositionY = position * 0.5 + 'px';
        });
    });
}
