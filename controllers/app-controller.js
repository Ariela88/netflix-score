class AppController {
    constructor() {
        this.shows = [];
        this.orderMethod = 'upvote';
        this.form = document.getElementById('create');
        this.favDialog = document.getElementById('favDialog');
        this.openDialogBtn = document.getElementById('openDialogBtn');
        this.confirmBtn = this.favDialog.querySelector("#confirmBtn");
        this.favDialog.querySelector('button[value="cancel"]').addEventListener('click',()=> this.closeDialog())
    }

    toggleFormDialog() {
        this.form.style.display = (this.form.style.display === 'none') ? 'block' : 'none';
    }

    init() {
        this.render();
        const form = document.getElementById('favDialog');
        form.addEventListener('submit', (event) => this.sendData(event));
        DBService.getAllShows()
            .then(shows => {
                this.shows = shows;
                this.renderShows();
            })
            .catch(error => console.error("Errore durante il recupero degli spettacoli:", error));
        this.openDialogBtn.addEventListener('click', () => this.toggleFormDialog());
    }

    render() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = `
            <header>
                <!-- <h1>Netflix Score</h1> -->
            </header>
            <main>
                <div id="btn-container"></div>
                <ul id="shows-container"></ul>
            </main>
        `;
    }

    renderShows() {
        const btnContainer = document.getElementById('btn-container');
        btnContainer.innerHTML = '';

        const createSortButton = (text, method) => {
            const button = document.createElement('button');
            button.appendChild(document.createTextNode(text));
            button.addEventListener('click', () => this.chooseSort(method));
            return button;
        };

        btnContainer.appendChild(createSortButton('ordina per upvotes', 'upvote'));
        btnContainer.appendChild(createSortButton('ordina per downvotes', 'downVote'));

        const showsContainer = document.getElementById('shows-container');
        showsContainer.innerHTML = '';

        const sortedShows = this.getSortedShows();

        for (const show of sortedShows) {
            const listElement = document.createElement('li');

            const imageShow = document.createElement('img');
            imageShow.src = show.imageUrl;
            listElement.appendChild(imageShow);

            const titleStrong = document.createElement('strong');
            const titleNode = document.createTextNode(show.title);
            titleStrong.appendChild(titleNode);
            listElement.appendChild(titleStrong);

            const createButton = (text, action) => {
                const button = document.createElement('button');
                button.appendChild(document.createTextNode(text));
                button.addEventListener('click', action);
                return button;
            };

            const upButton = createButton('👍', () => this.upvoteShow(show));
            const downButton = createButton('👎', () => this.downvoteShow(show));
            downButton.classList.add('down-button');
            upButton.classList.add('up-button');

            const divBtnVote = document.createElement('div');
            divBtnVote.classList.add('div-btn-vote');
            divBtnVote.appendChild(upButton);
            divBtnVote.appendChild(downButton);

            listElement.appendChild(divBtnVote);

            const deleteBtn = createButton('Elimina', () => this.deleteTheShow(show));
            listElement.appendChild(deleteBtn);

            showsContainer.appendChild(listElement);
        }
    }

    sendData(event) {
        event.preventDefault();

        const form = document.forms['create'];
        const formData = new FormData(form);

        const newShow = {
            title: formData.get('title'),
            author: formData.get('author'),
            imageUrl: formData.get('imageUrl'),
            isOver: formData.get('isOver') === "on",
            upVotes: 0,
            downVotes: 0,
            id: 10
        };

        console.log(newShow);

        DBService.createShow(newShow)
            .then(show => {
                setTimeout(() => {
                    window.location = '/index.html';
                }, 500);
            })
            .catch(error => {
                console.error("Errore durante la creazione dello spettacolo:", error);
            });
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
        DBService.upvote(show)
            .then(updatedShow => {
                this.shows = this.shows.map(s => (s.id === updatedShow.id ? updatedShow : s));
                this.renderShows();
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    downvoteShow(show) {
        DBService.downvote(show)
            .then(updatedShow => {
                this.shows = this.shows.map(s => (s.id === updatedShow.id ? updatedShow : s));
                this.renderShows();
            })
            .catch(error => {
                console.error(error.message);
            });
    }

    deleteTheShow(show) {
        DBService.deleteShow(show)
            .then(() => {
                this.shows = this.shows.filter(s => s.id !== show.id);
                this.renderShows();
            })
            .catch(error => {
                console.error("Errore durante l'eliminazione dello spettacolo:", error);
            });
    }

    closeDialog() {
        document.getElementById('favDialog').style.display = 'none';
      }
}
