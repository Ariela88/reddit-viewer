class CategoryPosts extends HTMLElement {


    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.categoryArray = ['gaming', 'history', 'animals_and_pets', 'movies', 'science', 'food_and_drink', 'travel', 'music', 'programming', 'hobbies']

    }

    connectedCallback() {
     

    this.render(this.categoryArray);
        

    }





    render() {

        const dialog = document.getElementById('dialog')
        const dialogInput = document.createElement('div')

        for (let i = 0; i < this.categoryArray.length; i++) {
            const input = this.categoryArray[i];

            dialogInput.innerHTML += `<input type="checkbox" name="${input}" value="${input}" id=""> <label for="${input}">${input}</label>`

          

        } dialog.appendChild(dialogInput)
        } 

    }







customElements.define('pref-dialog', CategoryPosts);