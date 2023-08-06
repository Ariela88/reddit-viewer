class CategoryPosts extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.categoryArray = ['gaming', 'history', 'animals_and_pets', 'movies', 'science', 'food_and_drink', 'travel', 'music', 'programming', 'hobbies'];
        this.selectedCategories = new Set();
        this.posts = [];
    }

    connectedCallback() {
        this.render();
        this.loadPosts();
    }

    loadPosts() {
        const promises = this.categoryArray.map((category) =>
            fetch('https://www.reddit.com/r/' + category + '/new.json').then((resp) => resp.json())
        );

        Promise.all(promises)
            .then((responses) => {
                responses.forEach((res) => {
                    if (res.data && res.data.children) {
                        const categoryPosts = res.data.children.map((post) => post.data);
                        this.posts = [...this.posts, ...categoryPosts];
                    }
                });
                this.showFilteredPosts();
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }

    render() {
        this.shadowRoot.innerHTML = '';

        const mainContainer = document.createElement('div');
        this.shadowRoot.appendChild(mainContainer);

        const dialog = document.getElementById('dialog');
        const dialogInput = document.createElement('div');

        for (let i = 0; i < this.categoryArray.length; i++) {
            const input = this.categoryArray[i];
            dialogInput.innerHTML += `<input type="checkbox" name="${input}" value="${input}" id="${input}"> <label for="${input}">${input}</label>`;
        }

        const okButton = document.getElementById('okButton');
        okButton.addEventListener('click', () => {
            this.selectedCategories.clear();
            const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    this.selectedCategories.add(checkbox.value);
                }
            });
            this.showFilteredPosts();
            dialog.style.display = 'none';
        });

        dialogInput.appendChild(okButton);
        dialog.appendChild(dialogInput);
    }

    showFilteredPosts() {
        const filteredPosts = this.posts.filter((post) => this.selectedCategories.has(post.category));

        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = '';

        filteredPosts.forEach((post) => {
            const cardComponent = document.createElement('post-card');
            cardComponent.post = post;
            postContainer.appendChild(cardComponent);
        });
    }
}

customElements.define('pref-dialog', CategoryPosts);
