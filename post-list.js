class PostListComponent extends HTMLElement{

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.postArray = [];
    }

    connectedCallback(){
        fetch('https://www.reddit.com/r/aww/new.json')
        .then(resp => resp.json())
        .then(res => {
        const data = res.data;
        const posts = data.children;
        this.postArray = posts;
        this.render(this.postArray);
        console.log(this.postArray);
    })
    }


    disconnectedCallback(){
        
    }



    render(posts){

      
        this.shadowRoot.innerHTML = '';

        
        const mainContainer = document.createElement('div');
        this.shadowRoot.appendChild(mainContainer);

        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            
            const cardComponent = document.createElement('post-card');

            cardComponent.addEventListener('card-clicked', (e) => this.removepost(e.detail));

            cardComponent.post = post;

            mainContainer.appendChild(cardComponent);
        }
        
    }

    removepost(title){
        this.postsArray = this.postsArray.filter(post => post.title !== title);
        this.render(this.postsArray);
    }



}


customElements.define('posts-list', PostListComponent);