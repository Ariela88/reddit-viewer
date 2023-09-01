const searchBtn = document.getElementById('search-btn')

searchBtn.addEventListener('click',()=> search())

function search(){

    let result = document.ricerca.search.value;
    window.open("https://www.reddit.com/r/" + result)
}

const toggleButton = document.getElementById('toggle-menu');
const navMenu = document.querySelector('.btn-header-toggler');

// Aggiungi un gestore di eventi al pulsante del menu
toggleButton.addEventListener('click', () => {
    // Cambia la visibilità del menu quando il pulsante viene cliccato
    if (navMenu.style.display === 'block' || navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
    } else {
        toggleButton.style.display = 'block';
    }
});


