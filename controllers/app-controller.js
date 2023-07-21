class AppController {
    constructor() {
        this.shows = [];
        this.orderMethod = 'upvote';
        this.favDialog = document.getElementById('favDialog');
        this.form = document.forms['create'];
        this.openDialogBtn = document.getElementById('openDialogBtn');
        this.confirmBtn = this.favDialog.querySelector("#confirmBtn");
    }

    init() {
        this.render();
        DBService.getAllShows()
            .then(shows => {
                this.shows = shows;
                this.renderShows();
            })
            .catch(error => {
                console.error("Errore durante il recupero degli spettacoli:", error);
            });

        this.favDialog.addEventListener('close', () => {
            this.renderShows();
        });
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

            const imageShow = document.createElement('img')
            imageShow.src = show.imageUrl
            listElement.appendChild(imageShow)
            const titleStrong = document.createElement('strong')
            const titleNode = document.createTextNode(show.title);
            titleStrong.appendChild(titleNode)
            listElement.appendChild(titleStrong);







            // const upvotesSpan = document.createElement('span');
            // upvotesSpan.appendChild(document.createTextNode(show.upVotes));
            // listElement.appendChild(upvotesSpan);
            const upButton = document.createElement('button');
            upButton.appendChild(document.createTextNode('👍'));
            upButton.addEventListener('click', () => this.upvoteShow(show));

            // const downSpan = document.createElement('span');
            // downSpan.appendChild(document.createTextNode(show.downVotes));
            // listElement.appendChild(downSpan);
            const divBtnVote = document.createElement('div')

            const downButton = document.createElement('button');
            downButton.appendChild(document.createTextNode('👎'));
            downButton.addEventListener('click', () => this.downvoteShow(show));
            divBtnVote.appendChild(downButton)

            listElement.appendChild(divBtnVote);
            divBtnVote.appendChild(upButton)


            divBtnVote.classList.add('div-btn-vote')

            const deleteBtn = document.createElement('button')
            const deleteNodeBtn = document.createTextNode('Elimina')
            deleteBtn.appendChild(deleteNodeBtn)
            listElement.appendChild(deleteBtn)

            deleteBtn.addEventListener('click', () => this.deleteTheShow(show));

            showsContainer.appendChild(listElement);
        }



        const favDialog = document.getElementById('favDialog');


        this.openDialogBtn.addEventListener('click', () => {
            this.form.reset();
            if (typeof this.favDialog.showModal === "function") {
                this.favDialog.showModal();
            } else {
                this.favDialog.show();
            }
        });

        this.favDialog.querySelector('button[value="cancel"]').addEventListener('click', () => {
            this.favDialog.close();
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




}


function sendData(event) {


    event.preventDefault();

    const form = document.forms['create'];



    const formData = new FormData(form);

    const newShow = {

        title: formData.get('title'),
        author: formData.get('author'),
        imageUrl: formData.get('imageUrl'),
        isOver: formData.get('isOver') === "on" ? true : false,
        upVotes: 0,
        downVotes: 0
    }


    console.log(newShow)

    DBService.createShow(newShow)
        .then(show => {
            // Aggiungi un ritardo di 500 millisecondi prima di chiudere il dialog
            setTimeout(() => {
                window.location = '/index.html';
            }, 500);
        })
        .catch(error => {
            console.error("Errore durante la creazione dello spettacolo:", error);
        });
}





