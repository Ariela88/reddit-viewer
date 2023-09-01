import { SideBarComponent } from "./super-navbar-component.js";

export default class Category extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.categoryArray = ['gaming',
            'history',
            'animals_and_pets',
            'movies',
            'science',
            'food_and_drink',
            'travel', 'music',
            'programming',
            'hobbies'];


            this.categoryLabels = {
                'gaming': 'Giochi',
                'history': 'Storia',
                'animals_and_pets': 'Animali e Animali Domestici',
                'movies': 'Films',
                'science': 'Scienza',
                'food_and_drink': 'Cibo e Bevande',
                'travel': 'Viaggi',
                'music': 'Musica',
                'programming': 'Programmazione',
                'hobbies': 'Passatempi'
    
            };

        this.selectedCategories = new Set();
        this.categories = [];
        this.loadSelectedCategories();
        const sidebar = new SideBarComponent()
            sidebar.category = this.categoryLabels
        
    }
    

    // FUNZIONE CHE RECUPERA E SALVA LE CATEGORIE IN LOCALE
    loadSelectedCategories() {
        const savedCategories = Storage.loadPostData();
        this.selectedCategories = new Set(savedCategories);
    }

    connectedCallback() {
        // VIENE CONTROLLATO SE ALL'INTERNO DELL'ARRAY SONO PRESENTI DATI E VENGONO VISUALIZZATI
        if (this.selectedCategories.size >= 0) {
            this.loadPosts();
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
        const categoriesContainer = document.getElementById('categories-container');
        categoriesContainer.innerHTML = '';
        this.shadowRoot.innerHTML = '';
        

        const dialog = document.getElementById('selection-dialog-container');
        dialog.innerHTML = ""

       
        const dialogInput = document.createElement('div');
        dialogInput.classList.add('dialog-input');



        for (let i = 0; i < this.categoryArray.length; i++) {
            const categoryName = this.categoryArray[i];
            const labelItalian = this.categoryLabels[categoryName];
           
            const inputCard = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.classList.add('checkbox-categories');
            checkbox.type = 'checkbox';
            checkbox.value = categoryName;

            if (this.selectedCategories.has(categoryName)) {
                checkbox.checked = true;
            }

            const text = document.createTextNode(labelItalian);
            
            inputCard.classList.add('input-card');
            inputCard.appendChild(checkbox);
            inputCard.appendChild(text);
            dialogInput.appendChild(inputCard);
        }

        const select = document.getElementById('dialog-select-type')
        

        const showPostsButton = document.getElementById('show-post');
        showPostsButton.textContent = 'Mostra Post';
        showPostsButton.addEventListener('click', () => {
         
            const checkboxes = dialog.querySelectorAll('.checkbox-categories');
            checkboxes.forEach((checkbox) => {
               
                if (checkbox.checked) {
                    this.selectedCategories.add(checkbox.value);
                }
            });
           
            Storage.savePostData(Array.from(this.selectedCategories));
            const sidebar = new SideBarComponent()
            sidebar.category = this.categoryLabels
            sidebar.loadSelectedCategories()
            sidebar.render()
            this.loadPosts();
            document.getElementById('dialog-container').style.display = 'none';
        });

        

        const exitDialog = document.getElementById('cancel');
        exitDialog.textContent = 'Cancel';
        exitDialog.addEventListener('click', () => {
            document.getElementById('dialog-container').style.display = 'none';
        });

        
        const addCategoryButton = document.getElementById('add-new-category');
        addCategoryButton.addEventListener('click', () => {
          
            const newCategory = document.getElementById('value-choice').value.trim();
           
            if (newCategory !== '' && select.value === 'category' && !this.categoryArray.includes(newCategory)) {
                this.categoryArray.push(newCategory);
                this.categoryLabels[newCategory] = newCategory
             
               this.render()
               
            }
        });
        
        

        dialog.appendChild(dialogInput);

        
       
    }

   async loadPosts() {
        this.categories = [];
        const postsPerPage = 10; 
        const promises = [];
    
        JSON.parse(localStorage.getItem('posts')).map((category) => {
            const fetchPromise = fetch(`https://www.reddit.com/r/${category}/new.json`)
                .then((resp) => resp.json())
                .then((res) => {
                    if (res.data && res.data.children) {
                        for (const data of res.data.children.slice(0, postsPerPage)) {
                            this.categories.push(data.data);
                        }
                    }
                })
                .catch((error) => {
                    console.error(`Error fetching posts for ${category}:`, error);
                    return { data: { children: [] } };
                });
    
            promises.push(fetchPromise);
        });
    
        Promise.all(promises)
            .then(() => {
                this.showFilteredPosts();
            });
    }
    

    showFilteredPosts() {
        const postContainer = document.getElementById('postContainer');
        this.shadowRoot.innerHTML = '';
        postContainer.innerHTML = '';

        this.categories.forEach((post) => {
            const cardComponent = document.createElement('post-card');
            cardComponent.post = post;
            postContainer.appendChild(cardComponent);
        });
    }

    
}

customElements.define('category-dialog', Category);
