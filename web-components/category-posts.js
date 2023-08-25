import { SideBarComponent } from "./super-navbar-component.js";


export default class CategoryPosts extends HTMLElement {
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

        this.selectedCategories = new Set();
        this.posts = [];
        this.loadSelectedCategories();
        this.afterId = ''
        this.rssArray = ['https://www.ilsecoloxix.it/genova/rss',
            'https://www.ilsecoloxix.it/levante/rss']

    }

    loadSelectedCategories() {
        const savedCategories = Storage.loadData();
        this.selectedCategories = new Set(savedCategories);
    }

    connectedCallback() {
        if (this.selectedCategories.size > 0) {
            this.loadPosts();
            this.loadRss()
            const openDialog = document.getElementById('add-category');
            openDialog.addEventListener('click', () => {
                document.getElementById('dialog-container').style.display = 'flex';
                this.shadowRoot.innerHTML = '';
                this.render()
            })
        } else {
            this.render();
        }

        const rssLinks = document.querySelectorAll('#rss-links a');
        rssLinks.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const rssUrl = link.getAttribute('href');
                this.loadRss(rssUrl);
            });
        });
        this.loadRss(rssLinks);
    }

    loadPosts() {
        this.posts = [];

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






    loadRss() {
        const rssUrls = this.rssArray;
        const rssContainer = document.getElementById('postContainer');
        const parser = new RSSParser();

        rssUrls.forEach(rssUrl => {
            if (this.selectedCategories.has(rssUrl)) {
                parser.parseURL(rssUrl, (err, feed) => {
                    if (!err && feed && feed.items) {
                        feed.items.forEach(item => {
                            const postTitle = item.title;
                            const postLink = item.link;
                            let imageUrl = this.findImageUrlInContent(item.content);
                            if (!imageUrl) {

                                imageUrl = 'path_to_default_image.jpg';
                            }
                            if (item.enclosures && item.enclosures.length > 0) {
                                imageUrl = item.enclosures[0].url;
                            } else if (item.content && item.content.startsWith('<img')) {
                                const imgTag = document.createElement('div');
                                imgTag.innerHTML = item.content;
                                const imgElement = imgTag.querySelector('img');
                                if (imgElement) {
                                    imageUrl = imgElement.src;
                                }
                            }



                            const rssElement = document.createElement('div');
                           
                            const rssCard = document.createElement('div');
                            rssCard.classList.add('rss-card');
                            const rssHeader = document.createElement('div');
                            rssHeader.classList.add('rss-header');
                            const h5 = document.createElement('h5');
                            const a = document.createElement('a');
                            const img = document.createElement('img');
                            const imgContainer = document.createElement('div');


                            a.href = postLink;
                            a.target = '_blank';
                            a.textContent = postTitle;
                            img.src = imageUrl
                            img.alt = 'Immagine notizia';

                            h5.appendChild(a);
                            rssHeader.appendChild(h5);
                            rssCard.appendChild(rssHeader);
                            rssElement.appendChild(rssCard);
                            imgContainer.appendChild(img)
                            rssElement.appendChild(imgContainer);

                            img.classList.add('rss-img')

                            h5.classList.add('h5-rss');
                            rssHeader.classList.add('rss-header');

                            rssCard.classList.add('rss-card');
                            rssElement.classList.add('rss-element');


                            rssContainer.appendChild(rssElement);
                        });
                    } else {
                        console.error('Errore nel parsing del feed RSS:', err);
                    }
                });
            }
        });

    }

    findImageUrlInContent(content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;


        const imgElement = tempDiv.querySelector('img');

        if (imgElement) {
            return imgElement.src;
        }

        return '';
    }

    render() {
        const postContainer = document.getElementById('postContainer');
        postContainer.innerHTML = '';
        this.shadowRoot.innerHTML = '';
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

        const rssLabels = {
            'https://www.ilsecoloxix.it/genova/rss': 'Il SecoloXIX - Genova',
            'https://www.ilsecoloxix.it/levante/rss': 'Il SecoloXIX - Levante',


        }


        const dialog = document.getElementById('dialog-container');
        dialog.innerHTML = ""

        const dialogInput = document.createElement('div');
        dialogInput.classList.add('dialog-input');

        const rssContainer = document.createElement('div');
        rssContainer.id = 'rss-container';
        rssContainer.innerHTML = '<h2>Feed RSS</h2>';
        this.shadowRoot.appendChild(rssContainer);

        const categoryAddInput = document.createElement('input')
        categoryAddInput.type = 'text';
        categoryAddInput.id = 'category';
        categoryAddInput.type = 'category';
        categoryAddInput.type = 'category';
        categoryAddInput.placeholder = 'Scrivi la categoria che vuoi aggiungere';


        for (let i = 0; i < this.categoryArray.length; i++) {
            const categoryName = this.categoryArray[i];
            const labelItalian = categoryLabels[categoryName];

            const inputCard = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.classList.add('check-box');
            checkbox.type = 'checkbox';
            checkbox.name = categoryName;
            checkbox.value = categoryName;
            checkbox.id = categoryName;

            if (this.selectedCategories.has(categoryName)) {
                checkbox.checked = true;
            }

            const label = document.createElement('label');
            label.for = categoryName;
            label.textContent = labelItalian;
            inputCard.classList.add('input-card');
            inputCard.appendChild(checkbox);
            inputCard.appendChild(label);
            dialogInput.appendChild(inputCard);
            dialogInput.appendChild(document.createElement('br'));
        }

        for (let i = 0; i < this.rssArray.length; i++) {
            const rssUrl = this.rssArray[i];
            const labelRss = rssLabels[rssUrl];

            const inputCard = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.classList.add('check-box');
            checkbox.type = 'checkbox';
            checkbox.name = rssUrl;
            checkbox.value = rssUrl;
            checkbox.id = rssUrl;

            if (this.selectedCategories.has(rssUrl)) {
                checkbox.checked = true;
            }

            Storage.saveData(Array.from(this.rssArray));

            const label = document.createElement('label');
            label.for = rssUrl;
            label.textContent = labelRss;
            inputCard.classList.add('input-card');
            inputCard.appendChild(checkbox);
            inputCard.appendChild(label);
            dialogInput.appendChild(inputCard);
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
            const side = new SideBarComponent()
            side.loadSelectedCategories()
            side.render()
            this.loadPosts();
            this.loadRss()
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

        dialogInput.appendChild(categoryAddInput)
        dialog.appendChild(dialogInput);
        btnDialogContainer.appendChild(addCategoryButton);
        btnDialogContainer.appendChild(showPostsButton);
        btnDialogContainer.appendChild(exitDialog)
        dialog.appendChild(btnDialogContainer)

    }

    showFilteredPosts() {
        const postContainer = document.getElementById('postContainer');
        this.shadowRoot.innerHTML = '';
        postContainer.innerHTML = '';

        this.posts.forEach((post) => {
            const cardComponent = document.createElement('post-card');
            cardComponent.post = post;
            postContainer.appendChild(cardComponent);
        });


        const rssContainer = document.getElementById('rss-container');
        rssContainer.innerHTML = '<h2>Feed RSS</h2>';
        this.loadRss();

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
