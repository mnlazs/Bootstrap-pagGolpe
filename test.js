document.addEventListener('DOMContentLoaded', function() {
    initParallaxEffect();
    initParallaxEffect(); // Inicializa el efecto parallax

});


async function fetchEpisodios() {

    try {
        const response = await fetch('/ruta-para-obtener-episodios'); // Asegúrate de tener esta ruta configurada en tu servidor
        if (!response.ok) throw new Error('Respuesta de red no fue ok');
        
        const episodios = await response.json(); // Suponiendo que el servidor devuelve un JSON con los episodios
        const episodesList = document.getElementById('episodes-list');
        episodesList.innerHTML = ''; // Limpiar lista actual
        
        episodios.forEach(episode => {
            const episodeElement = document.createElement('div');
            episodeElement.innerHTML = `
                <h3>${episode.name}</h3>
                <p>${episode.description}</p>
                <a href="${episode.spotifyLink}" target="_blank">Escuchar en Spotify</a>
            `;
            episodesList.appendChild(episodeElement);
        });
    } catch (error) {
        console.error('Error al fetch episodios:', error);
    }
}

// Define menuLinks seleccionando todos los enlaces dentro de la navegación
const menuLinks = document.querySelectorAll('.navbar-nav .nav-link');

  menuLinks.forEach(link => {
    link.addEventListener('click', async (event) => {
        if (link.getAttribute('href').startsWith('#')) {
            event.preventDefault();
            const targetSectionId = link.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});


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
    if (!response.ok) {
        // Si la respuesta no es exitosa, lanza un error
        throw new Error('Failed to fetch episodes');
    }
    const episodios = await response.json(); // Convierte la respuesta en JSON

    // Asegúrate de que el elemento 'episodes-list' exista en tu HTML
    const episodesList = document.getElementById('episodes-list');
    if (episodesList) {
        episodesList.innerHTML = ''; // Limpia el contenido actual del elemento

        episodios.items.forEach((episode) => {
            // Crea elementos HTML para mostrar la información de cada episodio
            const episodeElement = document.createElement('div');
            episodeElement.className = 'episode my-3 p-3 rounded bg-light shadow-sm';

            // Limitar la descripción a 50 caracteres y agregar "..." si es más larga
            let shortDescription = episode.description.length > 50 ? episode.description.substring(0, 50) + '...' : episode.description;

            episodeElement.innerHTML = `
                <div class="media">
                  <img src="${episode.images[0].url}" class="mr-3" alt="Episode cover" style="width: 200px; height: 200px; border-radius: 20px;">
                  <div class="media-body">
                    <h5 class="mt-0">${episode.name}</h5>
                    <p>${shortDescription}</p> <!-- Usa shortDescription aquí -->
                    <audio controls>
                      <source src="${episode.audio_preview_url}" type="audio/mpeg">
                      Tu navegador no soporta el elemento de audio.
                    </audio>
                  </div>
                </div>
            `;
            // Agrega el elemento del episodio al contenedor de episodios
            episodesList.appendChild(episodeElement);
        });
    }

}
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        var parallaxElement = document.querySelector('.section1 img'); // Asegúrate de que este selector coincida con tu elemento parallax
        if (parallaxElement) { // Verifica si el elemento existe para evitar errores
            var scrollPosition = window.pageYOffset;
            parallaxElement.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px)';
        }
    });
}
// Llamada a la función logEpisodios para ejecutarla
logEpisodios();
