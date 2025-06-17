document.addEventListener('DOMContentLoaded', () => {
    const contentContainer = document.getElementById('content-container');
    const navLinks = document.querySelectorAll('nav ul li a');

    // Función para cargar el contenido
    async function loadContent(sectionName) {
        let filePath;
        if (sectionName === 'home') {
            // Contenido inicial para la página de inicio o un archivo home.html
            contentContainer.innerHTML = `
                <h2>Bienvenido a la Guía de Modernización</h2>
                <p>Aquí encontrarás información detallada sobre cómo modernizar tus aplicaciones y entornos con las soluciones de IBM.</p>
                <p>Explora las diferentes secciones para conocer más sobre cada producto.</p>
            `;
            return; // No necesitamos cargar un archivo externo si es el home simple
        } else {
            filePath = `secciones/${sectionName}.html`;
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            contentContainer.innerHTML = text;
        } catch (error) {
            console.error('Error al cargar la sección:', error);
            contentContainer.innerHTML = `<p>Lo siento, no se pudo cargar el contenido de esta sección.</p>`;
        }
    }

    // Manejar clics en la navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevenir la navegación predeterminada
            const section = event.target.dataset.section;
            loadContent(section);

            // Opcional: Actualizar la URL sin recargar
            history.pushState({ section: section }, '', `#${section}`);
        });
    });

    // Manejar el estado del historial (botones atrás/adelante del navegador)
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.section) {
            loadContent(event.state.section);
        } else {
            loadContent('home'); // Cargar la sección de inicio si no hay estado
        }
    });

    // Cargar el contenido inicial al cargar la página o si hay un hash en la URL
    const initialSection = window.location.hash ? window.location.hash.substring(1) : 'home';
    loadContent(initialSection);
});
