

// const nextBtn = document.querySelector('#next-page');
//          nextBtn.addEventListener('click', () => {
//           console.log('avanti')
//             for (const category of selectedCategories()) {
               
//                 fetch(`https://www.reddit.com/r/${category}/hot/.json?after=${this.afterId}`)
//                     .then(resp => resp.json())
//                     .then(data => {
//                         if (data.data && data.data.children) {
//                             for (const postData of data.data.children) {
//                                 this.posts.push(postData.data);
//                             }
//                         }
//                         this.showFilteredPosts();
//                     })
//                     .catch(error => {
//                         console.error(`Error fetching posts for ${category}:`, error);
//                     });
//             }
//         });

//         const previousBtn = document.querySelector('#previous-page');
//          previousBtn.addEventListener('click', () => {

//             console.log('indietro ')
          
//             for (const category of selectedCategories) {
               
//                 fetch(`https://www.reddit.com/r/${category}/hot/.json?before=${this.afterId}`)
//                     .then(resp => resp.json())
//                     .then(data => {
//                         if (data.data && data.data.children) {
//                             for (const postData of data.data.children) {
//                                 this.posts.push(postData.data);
//                             }
//                         }
//                         this.showFilteredPosts();
//                     })
//                     .catch(error => {
//                         console.error(`Error fetching posts for ${category}:`, error);
//                     });
//             }
//         });

