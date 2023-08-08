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
    
    
    fetch(`https://www.reddit.com/r/${value}/new.json`)
        .then((resp) => resp.json())
        .then((res)=> {if(res.data && res.data.children){
          this.postsArray = res.data.children;
          this.showFilteredPosts()
        }})

        .catch((error) => {
            console.error(`Error fetching posts for ${value}:`, error);
        })

       
      
      }

  showFilteredPosts() {
    const filteredPosts = this.postsArray.filter((post) => this.selectedCategories.has(post.category,console.log(post)));
    
    
    const postContainer = document.getElementById('postContainer');
    postContainer.innerHTML = '';

    
      for (const post of this.postsArray) {
        
        const cardComponent = document.createElement('post-card');
     cardComponent.post = post
      this.shadowRoot.innerHTML = `
                <div class="card-post">
                    <div class="card-header">
                        <span class="span-created">${toHumanTime(post.data.created)}</span>
                        <div class="h3-title">
                            <h3>${post.data.title}</h3>
                        </div>
                        <div class="h3-author">
                            <h3>${post.data.author_fullname}</h3>
                        </div>
                        <div class="img-container">
                            <img src="${post.data.thumbnail}" alt="">
                        </div>
                        <div class="details">
                            <a href="${post.data.url}" target="_blank" rel="noopener noreferrer"></a>
                        </div>
                    </div>
                </div>`; 
              }
      
    };
  
  }





customElements.define('super-nav', SideBarComponent);