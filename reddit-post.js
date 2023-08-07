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
            .card{
                width:400px;
                position:relative;
                float:right;
                display: flex;
                width: 70%;
                flex-direction: column;
                background-color: white;
                border-radius: 16px;
                padding: 16px;
                margin-bottom: 40px;
               
               
                
               
            }
            .img-container img{
                width:60%;
                border-radius:20px;
            }
            .h3-title{
                width:100%;
                flex-wrap:wrap;
                font-size: 20px;
                font-weight: bold;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }
            .h3-author{
                font-size: large;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }
            .details{
                display: flex;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }
            .details{
                flex:1;
                display:flex;
                flex-direction:column;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }

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
