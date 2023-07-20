class AppController {
    constructor() {
        this.shows = [];
        this.orderMethod = 'upvote'; 
    }

    init() {
        this.render();
        DBService.getAllShows().then(shows => {
            this.shows = shows;
            this.renderShows();
        });
    }

    render() {
        const appContainer = document.getElementById('app');

        appContainer.innerHTML = `
            <header>
                <!-- <h1>Netflix Score</h1> -->
                <a href="./index.html">lista</a>
                <a href="./new-show.html">nuovo</a>
            </header>
            <main>
                <div id="btn-container"></div>
                <ul id="shows-container"></ul>
            </main>
            <footer>
                <p>i diritti sono tutti miei!!!</p>
            </footer>
        `;
    }

    renderShows() {
        const btnContainer = document.getElementById('btn-container');
        btnContainer.innerHTML = '';

        const sortUpButton = document.createElement('button');
        sortUpButton.appendChild(document.createTextNode('ordina per upvotes'));
        sortUpButton.addEventListener('click', () => this.chooseSort('upvote'));
        btnContainer.appendChild(sortUpButton);

        const sortDownButton = document.createElement('button');
        sortDownButton.appendChild(document.createTextNode('ordina per downvotes'));
        sortDownButton.addEventListener('click', () => this.chooseSort('downVote'));
        btnContainer.appendChild(sortDownButton);

        const showsContainer = document.getElementById('shows-container');
        showsContainer.innerHTML = '';

        const sortedShows = this.getSortedShows();

        for (let i = 0; i < sortedShows.length; i++) {
            const show = sortedShows[i];

            const listElement = document.createElement('li');

            const titleNode = document.createTextNode(show.title);
            listElement.appendChild(titleNode);

            const upvotesSpan = document.createElement('span');
            upvotesSpan.appendChild(document.createTextNode(show.upVotes));
            listElement.appendChild(upvotesSpan);

            const upButton = document.createElement('button');
            upButton.appendChild(document.createTextNode('👍'));
            upButton.addEventListener('click', () => this.upvoteShow(show));
            listElement.appendChild(upButton);

            const downSpan = document.createElement('span');
            downSpan.appendChild(document.createTextNode(show.downVotes));
            listElement.appendChild(downSpan);

            const downButton = document.createElement('button');
            downButton.appendChild(document.createTextNode('👎'));
            downButton.addEventListener('click', () => this.downvoteShow(show));
            listElement.appendChild(downButton);

            showsContainer.appendChild(listElement);
        }
    }

    chooseSort(orderMethod) {
        this.orderMethod = orderMethod;
        this.renderShows();
    }

    getSortedShows() {
        if (this.orderMethod === 'upvote') {
            return this.shows.sort((s1, s2) => s2.upVotes - s1.upVotes);
        } else if (this.orderMethod === 'downVote') {
            return this.shows.sort((s1, s2) => s2.downVotes - s1.downVotes);
        }
        return this.shows;
    }


    upvoteShow(show) {
        DBService.upvote(show).then(updatedShow => {

            this.shows = this.shows.map(s => (s.id === updatedShow.id ? updatedShow : s));
            this.renderShows();
        }).catch(error => {
            console.error(error.message);
        });
    }

    downvoteShow(show) {
        DBService.downvote(show).then(updatedShow => {

            this.shows = this.shows.map(s => (s.id === updatedShow.id ? updatedShow : s));
            this.renderShows();
        }).catch(error => {
            console.error(error.message);
        });
    }
}