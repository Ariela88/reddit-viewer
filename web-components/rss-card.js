class RssCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
    }

    connectedCallback() {
        this.render();
    }

    render() {
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

    emitEvent() {
        const customEvent = new CustomEvent('card-clicked', { detail: this.post.title });
        this.dispatchEvent(customEvent);
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
}

function toHumanTime(timestamp) {
    const timestampInMils = timestamp * 1000;
    const now = Date.now();

    const delta = now - timestampInMils;

    let second = parseInt(delta / 1000);
    if (second < 60) {
        return second + ' secondi fa';
    }

    let minuti = parseInt(second / 60);
    if (minuti < 60) {
        return minuti + ' minuti fa';
    }

    let ore = parseInt((minuti / 60));
    if (ore < 24) {
        return ore + ' ore fa';
    }

    return parseInt(ore / 24) + ' giorni fa';
}



customElements.define('rss-card', RssCard);
