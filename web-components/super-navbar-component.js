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
    const mainWrapper = document.getElementById('main-wrapper')
    const sidebar = document.getElementById('sidebar-nav');

    const showNewPost = document.getElementById('top-btn-post')

    showNewPost.addEventListener('click', () => this.showTopPost())







    this.renderButtons();
  }

  renderButtons() {
    const sidebar = document.getElementById('sidebar-nav');
    //sidebar.innerHTML = ''; // Pulisci il contenuto esistente



    const categoriesContainer = document.createElement('div');
    const addCatBtn = document.getElementById('add-category');
    const input = document.getElementById('new-category');



    for (const category of this.categoryArray) {
      const categoryBtn = document.createElement('button');
      categoryBtn.textContent = category.name;
      categoryBtn.addEventListener('click', () => {
        this.loadPostsBtn(category.value);
      });
      categoriesContainer.appendChild(categoryBtn);
    }
    // addCatBtn.addEventListener('click', () => {
    //   const newCategory = document.getElementById('new-category').value.trim();
    //   if (newCategory !== '') {
    //     this.categoryArray.push(newCategory);
    //     console.log(this.categoryArray)

    //     const newCategory = document.createElement('button');

    //     newCategory.name = newCategory;
    //     newCategory.value = newCategory;
    //     newCategory.id = newCategory;



    //     sidebar.appendChild(newCategory);



    //     this.selectedCategories.add(newCategory);
    //     Storage.saveData(Array.from(this.selectedCategories));

    //     this.renderButtons();

    //   };
    // })


    sidebar.appendChild(categoriesContainer);
  }

  addCategory() {

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



  showFilteredPosts() {
    document.getElementById('postContainer').innerHTML = '';
    this.postsArray.forEach((post) => {
      const cardComponent = document.createElement('post-card');
      cardComponent.post = post;
      postContainer.appendChild(cardComponent);

      ;
    });

  };
  showTopPost() {

    this.shadowRoot.innerHTML = ''
    JSON.parse(localStorage.getItem('posts')).map((category) =>
      fetch(`https://www.reddit.com/r/popular/new.json`)
        .then((resp) => resp.json()).then(res => {
          console.log(res)
          if (res.data && res.data.children) {
            for (const data of res.data.children) {
              this.postsArray.push(data.data)
            }
          }
          this.showFilteredPosts();
        })
        .catch((error) => {
          console.error(`Error fetching posts:`, error);
          return { data: { children: [] } };
        })
    );
  }

}

customElements.define('super-nav', SideBarComponent);