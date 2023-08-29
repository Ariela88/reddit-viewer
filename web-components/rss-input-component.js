import { SideBarComponent } from "./super-navbar-component.js";

export default class Rss extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.selectedRss = new Set();
        this.afterId = ''
        this.rssArray = ['https://www.ilsecoloxix.it/genova/rss',
            'https://www.ilsecoloxix.it/levante/rss',
            'https://oggiscienza.it/feed', 'https://www.giallozafferano.it/ricerca-ricette/rss']

        this.rssLabels = {
            'https://www.ilsecoloxix.it/genova/rss': 'Il SecoloXIX - Genova',
            'https://www.ilsecoloxix.it/levante/rss': 'Il SecoloXIX - Levante',
            'https://oggiscienza.it/feed': 'Oggi Scienza',
            'https://www.giallozafferano.it/ricerca-ricette/rss': 'GialloZafferano'


        }
        //this.loadSelectedRss()
        //se commento questa riga, scompaiono le categorie dalla dialog ma compaiono gli rss. altrimenti il contrario
    }


    // FUNZIONE CHE RECUPERA E SALVA LE CATEGORIE IN LOCALE
    loadSelectedRss() {
        const savedRss = Storage.saveRSSData();
        this.selectedRss = new Set(savedRss);
    }

    connectedCallback() {
        // VIENE CONTROLLATO SE ALL'INTERNO DELL'ARRAY SONO PRESENTI DATI E VENGONO VISUALIZZATI

        if (this.selectedRss.size > 0) {
            const openDialog = document.getElementById('add-category');
            openDialog.addEventListener('click', () => {
                document.getElementById('dialog-container').style.display = 'flex';
                this.shadowRoot.innerHTML = '';
                this.render()
            })
        } else {
            this.render();
        }
    }



    render() {

        document.getElementById('dialog-container').style.display = 'flex';
        const rssContainer = document.getElementById('rss-container');
        rssContainer.innerHTML = '';
        this.shadowRoot.innerHTML = '';


        const dialog = document.getElementById('rss-dialog-container');
        dialog.innerHTML = ""


        const dialogInput = document.createElement('div');
        dialogInput.classList.add('dialog-input');



        for (let i = 0; i < this.rssArray.length; i++) {
            const rssUrl = this.rssArray[i];
            const labelRss = this.rssLabels[rssUrl];

            const inputCard = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.classList.add('checkbox-rss');
            checkbox.type = 'checkbox';
            checkbox.name = rssUrl;
            checkbox.value = rssUrl;
            checkbox.id = rssUrl;

            if (this.selectedRss.has(rssUrl)) {
                checkbox.checked = true;
            }

            Storage.saveRSSData(this.rssArray);

            const label = document.createElement('label');
            label.for = rssUrl;
            label.textContent = labelRss;
            inputCard.classList.add('input-card');
            inputCard.appendChild(checkbox);
            inputCard.appendChild(label);
            dialogInput.appendChild(inputCard);
            dialogInput.appendChild(document.createElement('br'));

        }
        const select = document.getElementById('dialog-select-type')


        const showPostsButton = document.getElementById('show-post');

        showPostsButton.addEventListener('click', () => {

            const checkboxes = dialog.querySelectorAll('.checkbox-rss');
            checkboxes.forEach((checkbox) => {

                if (checkbox.checked) {
                    this.selectedRss.add(checkbox.value);
                }
            });

            Storage.saveRSSData(this.selectedRss);
            const sidebar = new SideBarComponent()
            sidebar.rss = this.rssLabels
            sidebar.loadSelectedRss()
            sidebar.render()
            document.getElementById('dialog-container').style.display = 'none';
        });



        const exitDialog = document.getElementById('cancel');
        exitDialog.textContent = 'Cancel';
        exitDialog.addEventListener('click', () => {
            document.getElementById('dialog-container').style.display = 'none';
        });


        const addCategoryButton = document.getElementById('add-new-category');
        addCategoryButton.addEventListener('click', () => {

            const newRssUrl = document.getElementById('value-choice').value.trim();

            if (newRssUrl !== '' && select.value === 'rss' && !this.rssArray.includes(newRssUrl)) {
                this.rssArray.push(newRss);
                this.rssLabels[newRss] = newRss

                this.render()

            }
        });



        dialog.appendChild(dialogInput);


        Storage.saveRSSData(this.selectedRss);



    }



    showFilteredRss() {
        const rssContainer = document.getElementById('rss-container');
        this.shadowRoot.innerHTML = '';
        rssContainer.innerHTML = '';

        this.rssUrl.forEach((rss) => {
            const rssCard = document.createElement('rss-card');
            rssCard.rss = rss;
            rssContainer.appendChild(rssCard);
        });
    }

   
}

customElements.define('rss-input-dialog', Rss);
