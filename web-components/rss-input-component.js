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

   
        this.selectedRss = new Set();
       this.loadSelectedRss()
        //se commento questa riga, scompaiono le categorie dalla dialog ma compaiono gli rss. altrimenti il contrario
    }


    // FUNZIONE CHE RECUPERA E SALVA LE CATEGORIE IN LOCALE
    loadSelectedRss() {
        console.log(this.rssArray)
        const savedRss = Storage.saveRSSData(this.rssArray);
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
            
            this.loadRss()
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

    loadRss() {
        this.shadowRoot.innerHTML = '';
       
        const rssUrls = this.rssArray;
    
        const rssContainer = document.getElementById('postContainer');
        const parser = new RSSParser();

        rssUrls.forEach(rssUrl => {
            if (this.selectedRss.has(rssUrl)) {
                fetch(rssUrl, {
                    method: "GET",
                    mode: "cors",
                    credentials: "include",
                    headers: {
                        "Content-Type": "text/html"
                    }
                })
                parser.parseURL(rssUrl, (err, feed) => {
                    if (!err && feed && feed.items) {
                        feed.items.forEach(item => {
                            const postTitle = item.title;
                            const postLink = item.link;
                            let imageUrl = this.findImageUrlInContent(item.content);
                            if (!imageUrl) {

                                imageUrl = 'path_to_default_image.jpg';
                            }
                            if (item.enclosures && item.enclosures.length > 0) {
                                imageUrl = item.enclosures[0].url;
                            } else if (item.content && item.content.startsWith('<img')) {
                                const imgTag = document.createElement('div');
                                imgTag.innerHTML = item.content;
                                const imgElement = imgTag.querySelector('img');
                                if (imgElement) {
                                    imageUrl = imgElement.src;
                                }
                            }


    
                                const rssElement = document.createElement('div');
    
                                const rssCard = document.createElement('div');
                                rssCard.classList.add('rss-card');
                                const rssHeader = document.createElement('div');
                                rssHeader.classList.add('rss-header');
                                const h5 = document.createElement('h5');
                                const a = document.createElement('a');
                                const img = document.createElement('img');
                                const imgContainer = document.createElement('div');
    
    
                                a.href = postLink;
                                a.target = '_blank';
                                a.textContent = postTitle;
                                img.src = imageUrl
                                img.alt = 'Immagine notizia';
    
                                h5.appendChild(a);
                                rssHeader.appendChild(h5);
                                rssCard.appendChild(rssHeader);
                                rssElement.appendChild(rssCard);
                                imgContainer.appendChild(img)
                                rssElement.appendChild(imgContainer);
    
                                img.classList.add('rss-img')
    
                                h5.classList.add('h5-rss');
                                rssHeader.classList.add('rss-header');
    
                                rssCard.classList.add('rss-card');
                                rssElement.classList.add('rss-element');
    
    
                                rssContainer.appendChild(rssElement);
                            });
                        } else {
                            console.error('Errore nel parsing del feed RSS:', err);
                        }
                    });
                }
            });
    
    
        }

        findImageUrlInContent(content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
    
    
            const imgElement = tempDiv.querySelector('img');
    
            if (imgElement) {
                return imgElement.src;
            }
    
            return '';
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
