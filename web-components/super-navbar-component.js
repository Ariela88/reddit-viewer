class SideBarComponent extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.postsArray = [];

    this.selectedCategories = new Set();


    this.categoryArray = [
      {
        "name": "Videogiochi",
        "value": "gaming"
      },
      {
        "name": "Storia",
        "value": "history"
      }, {
        "name": "Animali",
        "value": "animals_and_pets"
      }, {
        "name": "Film",
        "value": "movies"
      }, {
        "name": "Scienza",
        "value": "science"
      }, {
        "name": "Cibo",
        "value": "food_and_drink"
      }, {
        "name": "Viaggi",
        "value": "travel"
      }, {
        "name": "Musica",
        "value": "music"
      },
      {
        "name": "Programmazione",
        "value": "programming"
      },
      {
        "name": "Hobby",
        "value": "hobbies"
      }
    ];
   
  }

  connectedCallback() {
    this.render();
  }

  
  render() {
    
    const sidebar = document.createElement('nav');
    sidebar.id = 'sidebar-nav';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'new-category-input';
    input.placeholder = 'Aggiungi una categoria';

    const addCatBtn = document.getElementById('add-category');
   
    addCatBtn.addEventListener('click', () => {
      this.addCategory(input);
    });

    sidebar.appendChild(input);
    sidebar.appendChild(addCatBtn);
    this.renderButtons(); 
    this.shadowRoot.appendChild(sidebar);
  }

  renderButtons() {
    const categoriesContainer = document.createElement('div');

    for (const category of this.categoryArray) {
      const categoryBtn = document.createElement('button');
      categoryBtn.textContent = category.name;
      categoryBtn.addEventListener('click', () => {
        this.loadPostsBtn(category.value);
      });
      categoriesContainer.appendChild(categoryBtn);
    }

    const sidebar = this.shadowRoot.getElementById('sidebar-nav');
    sidebar.appendChild(categoriesContainer);
  }

  addCategory() {
  
    const input = document.getElementById('new-category-input');
    const newCategory = input.value.trim();
    if (newCategory !== '') {
      const categoryValue = newCategory.toLowerCase().replace(/\s/g, '_');
      const category = {
        "name": newCategory,
        "value": categoryValue
      };
      this.categoryArray.push(category);
      input.value = '';
      this.renderButtons();
    }
  }
  loadPostsBtn(value) {
    
    this.postsArray = []
    fetch(`https://www.reddit.com/r/${value}/new.json`)
                .then((resp) => resp.json()).then(res => {
                  if (res.data && res.data.children) {
                    for (const data of res.data.children) {
                            this.postsArray.push(data.data)
                           }
                        }
                    this.showFilteredPosts();
                    })
                .catch((error) => {
                    console.error(`Error fetching posts for:`, error);
                    return { data: { children: [] } };
                })

       
      
      }

  renderButtons() {
    const sidebar = document.getElementById('sidebar-nav');
    //sidebar.innerHTML = ''; // Pulisci il contenuto esistente

    for (const category of this.categoryArray) {
      const categoryBtn = document.createElement('button');
      categoryBtn.textContent = category.name;
      categoryBtn.addEventListener('click', () => {
        this.loadPostsBtn(category.value);
      });
      sidebar.appendChild(categoryBtn);
    }
  }

  showFilteredPosts() {
    document.getElementById('postContainer').innerHTML = '';
    this.postsArray.forEach((post) => {
      const cardComponent = document.createElement('post-card');
      cardComponent.post = post;
      postContainer.appendChild(cardComponent);
  
 ;});
      
    };
}

customElements.define('super-nav', SideBarComponent);