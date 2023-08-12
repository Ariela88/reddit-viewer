class SideBarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.postsArray = [];
    this.selectedCategories = new Set();
    this.loadSelectedCategories();
  }

  connectedCallback() {
    this.render();
  }

  loadSelectedCategories() {
    const savedCategories = Storage.loadData();
    this.selectedCategories = new Set(savedCategories);
}


render() {
  const sidebar = document.getElementById('sidebar-nav');
  sidebar.innerHTML = ''; 

  const categoriesContainer = document.createElement('div');
  categoriesContainer.classList.add('category-container')

  for (const category of this.selectedCategories) {
    const categoryBtn = document.createElement('button');
    categoryBtn.textContent = category;
    categoryBtn.addEventListener('click', () => {
      this.loadPostsBtn(category);
    });
    categoriesContainer.appendChild(categoryBtn);
  }

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
  showPopularPost() {

    this.shadowRoot.innerHTML = ''
    JSON.parse(localStorage.getItem('posts')).map((category) =>
      fetch(`https://www.reddit.com/r/popular/new.json`)
        .then((resp) => resp.json()).then(res => {
         
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

  showNewPost() {

    this.shadowRoot.innerHTML = ''
    JSON.parse(localStorage.getItem('posts')).map((category) =>
      fetch(`https://www.reddit.com/r/new/new.json`)
        .then((resp) => resp.json()).then(res => {
         
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