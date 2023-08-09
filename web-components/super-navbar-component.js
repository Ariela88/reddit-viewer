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
    

  this.render()



  }

  render() {
    
    
    const sidebar = document.getElementById('sidebar-nav');
    const topBtn = document.getElementById('top-btn-post')
    topBtn.addEventListener('click', () => {
        this.postsArray = []
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
                console.error(`Error fetching posts for:`, error);
                return { data: { children: [] } };
            })

    }

    )
    
for (const object of this.categoryArray) {
        const categoryBtn = document.createElement('button')
      const btnCategoryNode = document.createTextNode(object.name)
      categoryBtn.appendChild(btnCategoryNode)
      
      categoryBtn.addEventListener('click', () => {
        this.loadPostsBtn(object.value);
        console.log('Categoria selezionata:', object.value);
    });

      sidebar.appendChild(categoryBtn)
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