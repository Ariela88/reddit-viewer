class Storage {
    static savePostData(data) {
        try {
            const dataArray = Array.from(data);
            const dataString = JSON.stringify(dataArray);
            localStorage.setItem('posts', dataString);
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }

    static loadPostData() {
        const dataString = localStorage.getItem('posts');
        if (dataString) {
            try {
                const dataArray = JSON.parse(dataString);
                return new Set(dataArray);
            } catch (error) {
                console.error('Error parsing data from localStorage:', error);
            }
        }
        return new Set(); 
    }

    static saveRSSData(data) {
        const dataArray = Array.from(data);
        const dataString = JSON.stringify(dataArray);
        localStorage.setItem('rss', dataString);
    }

    static loadRSSData() {
        const dataString = localStorage.getItem('rss');
        if (dataString) {
            try {
                const dataArray = JSON.parse(dataString);
                return new Set(dataArray);
            } catch (error) {
                console.error('Error parsing data from localStorage:', error);
            }
        }
        return new Set(); 
    }
}
