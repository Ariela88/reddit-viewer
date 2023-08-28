import CategoryPosts from "./category-posts.js";

export class SideBarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.postsArray = [];
    this.selectedCategories = new Set();
    this.loadSelectedCategories();
    this.afterId = '';
    this.nextBtn = null;
    this.previousBtn = null;
    this.rssArray = ['https://www.ilsecoloxix.it/genova/rss', 'https://www.ilsecoloxix.it/levante/rss']

  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  loadSelectedCategories() {
    const savedCategories = Storage.loadData();
    this.selectedCategories = new Set(savedCategories);

  }

  addEventListeners() {
    this.nextBtn.addEventListener('click', () => this.loadNextPosts());
    this.previousBtn.addEventListener('click', () => this.loadPreviousPosts());
  }




  async loadPosts(category, url, limit) {

    if (limit === 10) {
      this.postsArray = [];
    }

    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = '';
    let loadedPostsCount = 0;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.data && data.data.children) {
        for (const postData of data.data.children) {
          this.postsArray.push(postData.data);
          loadedPostsCount++;

          if (loadedPostsCount >= limit) {
            break;
          }
        }
      }
      this.showFilteredPosts();
      Storage.loadData(this.rssArray);
    } catch (error) {
      console.error(`Error fetching posts for ${category}:`, error);
    }
  }



  async loadNextPosts(limit) {
    const postContainer = document.getElementById('postContainer');

    postContainer.innerHTML = '';

    for (const category of this.selectedCategories) {
      const url = `https://www.reddit.com/r/${category}/.json?after=${this.afterId}`;
      await this.loadPosts(category, url, limit);
    }
  }

  async loadPreviousPosts() {

    document.getElementById('postContainer').innerHTML = ''

    for (const category of this.selectedCategories) {
      const url = `https://www.reddit.com/r/${category}/.json?before=${this.afterId}`;

      await this.loadPosts(category, url);
    }
  }
  render() {
    this.shadowRoot.innerHTML = '';
    const showPopPostBtn = document.getElementById('pop-btn-post');
    showPopPostBtn.addEventListener('click', () => this.showPopularPost());

    const categoryLabels = {
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

    const rssLabels = {
      'https://www.ilsecoloxix.it/genova/rss': 'Il SecoloXIX - Genova',
      'https://www.ilsecoloxix.it/levante/rss': 'Il SecoloXIX - Levante',

    };

    this.nextBtn = document.getElementById('next-page');
    this.previousBtn = document.getElementById('previous-page');

    const sidebar = document.getElementById('sidebar-nav');
    sidebar.innerHTML = '';

    const categoriesContainer = document.createElement('div');
    categoriesContainer.classList.add('category-container');

    const selectedCategoriesContainer = document.createElement('div');
    selectedCategoriesContainer.classList.add('selected-categories-container');

    for (const category of this.selectedCategories) {
      const itaLabel = categoryLabels[category];
      const categoryBtn = document.createElement('button');
      categoryBtn.textContent = itaLabel;
      categoryBtn.addEventListener('click', () => {
        document.getElementById('postContainer').innerHTML = '';
        this.postsArray = [];
        const url = `https://www.reddit.com/r/${category}/.json?after=${this.afterId}`;
        this.loadPosts(category, url, 10);
      });

      selectedCategoriesContainer.appendChild(categoryBtn);
    }

    sidebar.appendChild(selectedCategoriesContainer);

    const selectedRSSContainer = document.createElement('div');
    selectedRSSContainer.classList.add('selected-rss-container');

    for (const rss of this.rssArray) {
      if (this.selectedCategories.has(rss)) {
        const rssLabel = rssLabels[rss];
    
        const rssBtn = document.createElement('button');
        rssBtn.textContent = rssLabel;
        rssBtn.classList.add('rss-btn');
        rssBtn.addEventListener('click', () => {
          document.getElementById('postContainer').innerHTML = '';
          const categoryPosts = new CategoryPosts();
          categoryPosts.loadRss(rss);
        });
    
        selectedRSSContainer.appendChild(rssBtn);
      }
    }
    

    sidebar.appendChild(selectedRSSContainer);
  }


  showFilteredPosts() {
    document.getElementById('postContainer').innerHTML = '';
    this.postsArray.forEach((post) => {
      const cardComponent = document.createElement('post-card');
      cardComponent.post = post;
      postContainer.appendChild(cardComponent);

    });

    this.rssArray.forEach((rss) => {
      const cardComponent = document.createElement('post-card');
      cardComponent.rss = rss;
      postContainer.appendChild(cardComponent);

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