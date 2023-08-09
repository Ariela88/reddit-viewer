class CategoryPosts extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.categoryArray = ['gaming', 'history', 'animals_and_pets', 'movies', 'science', 'food_and_drink', 'travel', 'music', 'programming', 'hobbies'];
        this.selectedCategories = new Set();
        this.posts = [];
        this.loadSelectedCategories();
       
    }

    loadSelectedCategories() {
        const savedCategories = Storage.loadData();
        this.selectedCategories = new Set(savedCategories);
    }

    connectedCallback() {
        if (this.selectedCategories.size > 0) {
            this.loadPosts();
        } else {
            this.render();
        }
    }

    loadPosts() {
        JSON.parse(localStorage.getItem('posts')).map((category) =>
            fetch(`https://www.reddit.com/r/${category}/new.json`)
                .then((resp) => resp.json()).then(res => {
                    if (res.data && res.data.children) {
                        for (const data of res.data.children) {
                            this.posts.push(data.data);
                        }
                    }
                    this.showFilteredPosts();
                })
                .catch((error) => {
                    console.error(`Error fetching posts for ${category}:`, error);
                    return { data: { children: [] } };
                })
        );
    }

    render() {
        this.shadowRoot.innerHTML = '';
        const mainContainer = document.createElement('div');
        this.shadowRoot.appendChild(mainContainer);
        mainContainer.classList.add('main-container');

        const dialog = document.getElementById('dialog-container');
        

        const dialogInput = document.createElement('div');
        dialogInput.classList.add('dialog-input');

        for (let i = 0; i < this.categoryArray.length; i++) {
            const input = this.categoryArray[i];
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = input;
            checkbox.value = input;
            checkbox.id = input;

            const label = document.createElement('label');
            label.for = input;
            label.textContent = input;

            dialogInput.appendChild(checkbox);
            dialogInput.appendChild(label);
            dialogInput.appendChild(document.createElement('br'));
            
        }

        
       
    const showPostsButton = document.createElement('button');
    showPostsButton.textContent = 'Mostra Post';
    showPostsButton.addEventListener('click', () => {
        this.selectedCategories.clear();
        const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                this.selectedCategories.add(checkbox.value);
            }
        });
        Storage.saveData(Array.from(this.selectedCategories));

        this.showFilteredPosts();
        dialog.style.display = 'none';
    });
    
        const addCategoryButton = document.createElement('button');
        addCategoryButton.textContent = 'Aggiungi Categoria';
        addCategoryButton.addEventListener('click', () => {
            const newCategory = document.getElementById('category').value.trim();
            if (newCategory !== '') {
                this.categoryArray.push(newCategory);
    
                const newCheckbox = document.createElement('input');
                newCheckbox.type = 'checkbox';
                newCheckbox.name = newCategory;
                newCheckbox.value = newCategory;
                newCheckbox.id = newCategory;
    
                const newLabel = document.createElement('label');
                newLabel.for = newCategory;
                newLabel.textContent = newCategory;
    
                dialogInput.appendChild(newCheckbox);
                dialogInput.appendChild(newLabel);
                dialogInput.appendChild(document.createElement('br'));
    
                this.selectedCategories.add(newCategory);
                Storage.saveData(Array.from(this.selectedCategories));
    
                this.showFilteredPosts();
            }
        });
    
        dialogInput.appendChild(showPostsButton);
        dialogInput.appendChild(addCategoryButton);
        dialog.appendChild(dialogInput);
        mainContainer.appendChild(dialog);
    }


        showFilteredPosts() {
         
            this.posts.forEach((post) => {
                const cardComponent = document.createElement('post-card');
                cardComponent.post = post;
                postContainer.appendChild(cardComponent);
            });
        Storage.saveData(this.selectedCategories);
    }

    showTopPost() {
        JSON.parse(localStorage.getItem('posts')).map((category) =>
            fetch(`https://www.reddit.com/r/popular/new.json`)
                .then((resp) => resp.json()).then(res => {
                    if (res.data && res.data.children) {
                        for (const data of res.data.children) {
                            this.posts.push(data.data);
                        }
                    }
                    this.showFilteredPosts();
                })
                .catch((error) => {
                    console.error(`Error fetching posts for ${category}:`, error);
                    return { data: { children: [] } };
                })
        );
    }
}

customElements.define('pref-dialog', CategoryPosts);
