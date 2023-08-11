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
            const openDialog = document.getElementById('add-category');
        openDialog.addEventListener('click',()=>{document.getElementById('dialog-container').style.display = 'flex';
        this.shadowRoot.innerHTML = '';
        this.render()})
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
     document.getElementById('dialog-container').style.display = 'none';
     
    }

    render() {
        this.shadowRoot.innerHTML = '';
       

        const dialog = document.getElementById('dialog-container');
        dialog.innerHTML = ""

        const dialogInput = document.createElement('div');
        dialogInput.classList.add('dialog-input');
        
        const categoryAddInput = document.createElement('input')
        categoryAddInput.type = 'text';
        categoryAddInput.id = 'category';
        categoryAddInput.type = 'category';
        categoryAddInput.type = 'category';
        categoryAddInput.placeholder = 'Scrivi la categoria che vuoi aggiungere';


        for (let i = 0; i < this.categoryArray.length; i++) {
            const input = this.categoryArray[i];
            const inputCard = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.classList.add('check-box')
            checkbox.type = 'checkbox';
            checkbox.name = input;
            checkbox.value = input;
            checkbox.id = input;

            
            if (this.selectedCategories.has(input)) {
                checkbox.checked = true;
            }

            const label = document.createElement('label');
            label.for = input;
            label.textContent = input;  
            inputCard.classList.add('input-card')
            inputCard.appendChild(checkbox);
            inputCard.appendChild(label);
            dialogInput.appendChild(inputCard)
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
        
        this.loadPosts();
        dialog.style.display = 'none'; 
    });
    const exitDialog = document.createElement('button');
    exitDialog.textContent = 'Cancel';
    exitDialog.addEventListener('click', () => {
      
        this.showFilteredPosts();
        dialog.style.display = 'none';
    });
    
        const addCategoryButton = document.createElement('button');
        addCategoryButton.textContent = 'Aggiungi Categoria';
        addCategoryButton.addEventListener('click', () => {
            const newCategory = document.getElementById('category').value.trim();
            if (newCategory !== '') {
                this.categoryArray.push(newCategory);
                const inputCard = document.createElement('div')
    
                
                const newCheckbox = document.createElement('input');
                newCheckbox.type = 'checkbox';
                newCheckbox.name = newCategory;
                newCheckbox.value = newCategory;
                newCheckbox.id = newCategory;
                newCheckbox.classList.add('check-box')
    
                const newLabel = document.createElement('label');
                newLabel.for = newCategory;
                newLabel.textContent = newCategory;
                inputCard.classList.add('input-card')
                inputCard.appendChild(newCheckbox);
                inputCard.appendChild(newLabel);
                dialogInput.appendChild(inputCard)
                dialogInput.appendChild(document.createElement('br'));
    
                this.selectedCategories.add(newCategory);
                Storage.saveData(Array.from(this.selectedCategories));
    
                this.showFilteredPosts();
            }
        });

        const btnDialogContainer = document.createElement('div')
        btnDialogContainer.classList.add('btn-dialog-container')
        
        dialog.appendChild(dialogInput);
        dialog.appendChild(categoryAddInput)
        btnDialogContainer.appendChild(addCategoryButton);
        btnDialogContainer.appendChild(showPostsButton);
        btnDialogContainer.appendChild(exitDialog)
        dialog.appendChild(btnDialogContainer)
       
    }

    showFilteredPosts() {
        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = '';
    
        this.posts.forEach((post) => {
            const cardComponent = document.createElement('post-card');
            cardComponent.post = post;
            postContainer.appendChild(cardComponent);
        });
        
        Storage.saveData(this.selectedCategories); 
       
    }
    

    showTopPost() {
        JSON.parse(localStorage.getItem('posts')).map((category) =>
            fetch(`https://www.reddit.com/r/${category}/popular/new.json`)
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
