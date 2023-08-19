

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
    this.rssArray = ['https://www.ilsecoloxix.it/genova/rss','https://www.ilsecoloxix.it/levante/rss']
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

  async loadPosts(category, url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.data && data.data.children) {
        for (const postData of data.data.children) {
          this.postsArray.push(postData.data);
        }
      }
      this.showFilteredPosts();
    } catch (error) {
      console.error(`Error fetching posts for ${category}:`, error);
    }
  }

  async loadNextPosts() {

    this.postContainer = ''
    for (const category of this.selectedCategories) {
      const url = `https://www.reddit.com/r/${category}/hot/.json?after=${this.afterId}`;
      await this.loadPosts(category, url);
    }
  }

  async loadPreviousPosts() {

    this.postContainer = ''
    console.log('Loading previous posts...');
    for (const category of this.selectedCategories) {
      const url = `https://www.reddit.com/r/${category}/hot/.json?before=${this.afterId}`;
      console.log('Fetching data from:', url);
      await this.loadPosts(category, url);
    }
  }

  render() {
    this.shadowRoot.innerHTML = '';
    const showPopPostBtn = document.getElementById('pop-btn-post')
    showPopPostBtn.addEventListener('click',()=> this.showPopularPost())
    
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

    }
    this.nextBtn = document.getElementById('next-page');
    this.previousBtn = document.getElementById('previous-page');



    const sidebar = document.getElementById('sidebar-nav');
    sidebar.innerHTML = '';

    const categoriesContainer = document.createElement('div');
    categoriesContainer.classList.add('category-container');

    for (const category of this.selectedCategories) {
      const itaLabel = categoryLabels[category];
      const categoryBtn = document.createElement('button');
      categoryBtn.textContent = itaLabel;
      categoryBtn.addEventListener('click', () => {
        const dialog = new CategoryPosts();
        dialog.loadPosts(category);
      });

      categoriesContainer.appendChild(categoryBtn);
    }





for (const rss of this.rssArray) {
  
      const rssBtn = document.createElement('button');
      const rssName = rss; 
      rssBtn.textContent = rssName;
      rssBtn.classList.add('rss-btn')
      rssBtn.addEventListener('click', () => {
          const dialog = new CategoryPosts();
          dialog.loadPosts(rss);
      });
      categoriesContainer.appendChild(rssBtn);
  
}
    
    
    
    sidebar.appendChild(categoriesContainer);
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