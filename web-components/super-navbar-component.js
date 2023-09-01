import Category from "./category.js";
import Rss from "./rss-input-component.js";

export class SideBarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.postsArray = [];
    this.selectedCategories = new Set();
    this.selectedRss = new Set(); 
    this.loadSelectedCategories();
    this.loadSelectedRss(); // Carica i feed RSS selezionati
    this.afterId = '';
    this.nextBtn = document.getElementById('next-page');
    this.previousBtn = document.getElementById('previous-page');
    this.rssArray = ['https://www.ilsecoloxix.it/genova/rss', 'https://www.ilsecoloxix.it/levante/rss']
  }

  loadSelectedRss() {
    const savedRss = Storage.loadRSSData(this.rssArray);
    this.selectedRss = new Set(savedRss);
  }
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  loadSelectedCategories() {
    const savedCategories = Storage.loadPostData();
    this.selectedCategories = new Set(savedCategories);

  }

  addEventListeners() {
    this.nextBtn.addEventListener('click', () => this.loadNextPosts(10));
    this.previousBtn.addEventListener('click', () => this.loadPreviousPosts());
  }




  async loadPosts(category, url, limit) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        this.afterId = data.data.after;

        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = '';
        
        let loadedPostsCount = 0;

        if (data.data && data.data.children) {
            for (const postData of data.data.children) {
              console.log(this.postsArray)
                
                this.postsArray.push(postData.data);
                loadedPostsCount++;

                if (loadedPostsCount >= limit) {
                    break;
                }
            }
        }
       
        this.showFilteredPosts();

        this.loadSelectedCategories(this.selectedCategories)
        this.loadSelectedRss(this.selectedRss);
    } catch (error) {
        console.error(`Error fetching posts for ${category}:`, error);
    }
}


  async loadNextPosts(limit) {
   for (const category of this.selectedCategories) {
      const postContainer = document.getElementById('postContainer');

    postContainer.innerHTML = '';
    this.postsArray = []
      const url = `https://www.reddit.com/r/${category}/.json?after=${this.afterId}`;
      await this.loadPosts(category, url, limit);
    }
  }

  async loadPreviousPosts() {

    for (const category of this.selectedCategories) {
      const postContainer = document.getElementById('postContainer');

    postContainer.innerHTML = '';
    this.postsArray = []
      const url = `https://www.reddit.com/r/${category}/.json?before=${this.afterId}`;

      await this.loadPosts(category, url);
    }
  }
  render() {
    const sidebar = document.getElementById('sidebar-nav');
    sidebar.innerHTML = '';

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
      'https://oggiscienza.it/feed':'Oggi Scienza',
      'https://www.giallozafferano.it/ricerca-ricette/rss':'GialloZafferano'

    };

    

    

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

    
    for (const rssUrl of this.selectedRss) {
      const rssLabel = rssLabels[rssUrl];
      const rssBtn = document.createElement('button');
      rssBtn.textContent = rssLabel;
      rssBtn.classList.add('rss-btn');
      rssBtn.addEventListener('click', () => {
        console.log(rssBtn)
        document.getElementById('postContainer').innerHTML = '';
        this.rssArray = []
          
         
          const rssView = new Rss()
          
          this.loadSelectedRss()
          
        });
    
        selectedCategoriesContainer.appendChild(rssBtn);
      }
    
    

    sidebar.appendChild(selectedCategoriesContainer);
   
  }


  showFilteredPosts() {
    document.getElementById('postContainer').innerHTML = '';
    this.postsArray.forEach((post) => {
      const cardComponent = document.createElement('post-card');
      cardComponent.post = post;
      postContainer.appendChild(cardComponent);

    });

    this.rssArray.forEach((rss) => {
      const rssComponent = document.createElement('rss-card');
      rssComponent.rss = rss;
      document.getElementById('rss-container').appendChild(rssComponent);

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