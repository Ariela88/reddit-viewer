class RssCardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';

        
        if (this.post) {
            

            this.shadowRoot.innerHTML += `<style>
            .card{
                background-color: transparent;
               
                
                float:right;
                display: flex;
                width: 100%;
                flex-direction: column;
                
                padding: 16px;
                margin-bottom: 40px;
                
               
               
                
               
            }
            .img-container img{
                width:70%;
                border-radius:20px;
            }
            .h2-title{
                width:100%;
                flex-wrap:wrap;
                font-size: 16px;
                font-weight: bold;
                font-family: 'Neucha', cursive;
            }
            h5{
               
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }
            .card-header{
                background-color: #282626;
                display:flex;
                justify-content: space-around;
                align-items:center;
                width:95%;
                color:white;
                
            }
            .span-created{
                font-size: 12px;
            }
            .details{
                display: flex;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
           
               
                flex-direction:column;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            }

        
            
               
            </style>`;

            this.shadowRoot.innerHTML += `
                <div class="card">
                    <div class="card-header">
                    
                    <h5>${this.post.author_fullname}</h5>
                    
                    <span class="span-created">${toHumanTime(this.post.created)}</span>
                        </div>
                        <div class="h2-title">
                        <h2>${this.post.title}</h2>
                            
                        </div>
                        <div class="img-container">
                            <img src="${this.post.thumbnail}" alt="thumbails">
                        </div>
                        <div class="details">
                            <a href="${this.post.url}" target="_blank" rel="noopener noreferrer"></a>
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



customElements.define('post-card', RssCardComponent);
