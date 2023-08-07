class Storage {
    static saveData(data) {
        const dataArray = Array.from(data);
        const dataString = JSON.stringify(dataArray);
        localStorage.setItem('posts', dataString);
    }

    static loadData() {
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
}
