class PostListComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.postArray = [];
    }

    

    connectedCallback(cat) {
        fetch('https://www.reddit.com/r/'+ cat +'/new.json')
            .then(resp => resp.json())
            .then(res => {
                console.log(res)
                const data = res.data;
                const posts = data.children;
                this.postArray = posts;
                this.render(this.postArray);

            });

            
    }

   connectedCallback()

   
    
    render(posts) {
        this.shadowRoot.innerHTML = '';

        const mainContainer = document.createElement('div');
        mainContainer.setAttribute('id', 'main-container');

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];

            const cardComponent = document.createElement('post-card');
            cardComponent.addEventListener('card-clicked', (e) => this.removepost(e.detail));
            cardComponent.post = post;

            const div = document.createElement('div');
            div.classList.add('card');

            const h3 = document.createElement('h3');
            h3.textContent = post.data.title;
            div.appendChild(h3);

            const cardDetailsDiv = document.createElement('div');
            cardDetailsDiv.classList.add('card-details');

            const timestamp = post.data.created;
            const oreFormattate = toHumanTime(timestamp);
            const timestampDisplayElement = document.createElement('span');
            timestampDisplayElement.classList.add('card-detail');
            timestampDisplayElement.textContent = oreFormattate;
            cardDetailsDiv.appendChild(timestampDisplayElement);

            this.shadowRoot.appendChild(div);

            const cardAuthorSpan = document.createElement('span');
            cardAuthorSpan.classList.add('card-author');
            cardAuthorSpan.textContent = post.data.author_fullname;
            div.appendChild(cardAuthorSpan);

            const cardTitleSpan = document.createElement('span');
            cardTitleSpan.classList.add('card-title');
            cardTitleSpan.textContent = post.data.title;
            div.appendChild(cardTitleSpan);

            const cardImage = document.createElement('img');
            cardImage.src = post.data.thumbnail;
            cardImage.alt = '';
            div.appendChild(cardImage);

            const link = document.createElement('a');
            link.href = post.data.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = 'link al post originale';
            cardDetailsDiv.appendChild(link);
            div.appendChild(cardDetailsDiv);

            mainContainer.appendChild(cardComponent);
        }

        this.shadowRoot.appendChild(mainContainer);
   
    }

    removepost(title) {
        this.postArray = this.postArray.filter(post => post.data.title !== title);
        this.render(this.postArray);
    }

    emitEvent() {
        const customEvent = new CustomEvent('card-clicked', { detail: this.post.title });
        this.dispatchEvent(customEvent);
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

    let ore = parseInt(minuti / 60);
    if (ore < 24) {
        return ore + ' ore fa';
    }

    return parseInt(ore / 24) + ' giorni fa';
}

customElements.define('posts-list', PostListComponent);


