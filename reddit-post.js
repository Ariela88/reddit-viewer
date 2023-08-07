class PostCardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.post) {
            this.shadowRoot.innerHTML = '';

            this.shadowRoot.innerHTML += `<style>
            .card-post{
                border: 2px solid black;
                display: flex;
                flex-wrap: wrap;
                width: 800px;
                background-color: rgb(59, 59, 59);
                color: white;
                align-items: center;
                justify-content: center;

            }
            
               
            </style>`;

            this.shadowRoot.innerHTML += `
                <div class="card-post">
                    <div class="card-header">
                        <span class="span-created">${toHumanTime(this.post.created)}</span>
                        <div class="h3-title">
                            <h3>${this.post.title}</h3>
                        </div>
                        <div class="h3-author">
                            <h3>${this.post.author_fullname}</h3>
                        </div>
                        <div class="img-container">
                            <img src="${this.post.thumbnail}" alt="">
                        </div>
                        <div class="details">
                            <a href="${this.post.url}" target="_blank" rel="noopener noreferrer"></a>
                        </div>
                    </div>
                </div>`;
        }
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

    let ore = parseInt((minuti / 60));
    if (ore < 24) {
        return ore + ' ore fa';
    }

    return parseInt(ore / 24) + ' giorni fa';
}

customElements.define('post-card', PostCardComponent);
