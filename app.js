// const rssInput = document.createElement('input');
// rssInput.type = 'text';
// rssInput.id = 'rss-feed';
// rssInput.placeholder = 'Inserisci URL feed RSS';

// const addRssButton = document.createElement('button');
// addRssButton.textContent = 'Aggiungi Feed RSS';
// addRssButton.addEventListener('click', () => {
//     const rssFeedUrl = document.getElementById('rss-feed').value.trim();
//     if (rssFeedUrl !== '') {
//         this.categoryArray.push(rssFeedUrl);
//         this.selectedCategories.add(rssFeedUrl);
//         Storage.saveData(Array.from(this.selectedCategories));
//         const side = new SideBarComponent();
//         side.loadSelectedCategories();
//         side.render();
//         this.loadPosts();
//         dialog.style.display = 'none';
//     }
// });

// const parser = new RSSParser();
// parser.parseURL(rssFeedUrl, (err, feed) => {
//     if (!err && feed && feed.items) {
//         for (const item of feed.items) {
//             const post = {
//                 title: item.title,
//                 author_fullname: item.author,
//                 created: new Date(item.pubDate).getTime() / 1000,
               
//             };
//             this.posts.push(post);
//         }
//         this.showFilteredPosts();
//     } else {
//         console.error(`Errore nel caricamento del feed RSS ${rssFeedUrl}:`, err);
//     }
// });