class DBService {

    static getAllShows() {
        const url = "https://64b512caf3dbab5a95c6a515.mockapi.io/NetflixFilm/";
        return fetch(url).then((resp) => resp.json());
    }

    static updateShow(show) {
        const updateUrl = "https://64b512caf3dbab5a95c6a515.mockapi.io/NetflixFilm/" + show.id;
        return fetch(updateUrl, {
            method: "put",
            body: JSON.stringify(show),
            headers: { "content-type": "application/json" },
        }).then((resp) => resp.json());
    }

    static upvote(show){
        show.upVotes++;
        return this.updateShow(show);
    }

    static downvote(show){
        show.downVotes++;
        return this.updateShow(show);
    }

    static deleteShow(show){
        
        const deleteUrl = "https://64b512caf3dbab5a95c6a515.mockapi.io/NetflixFilm/" + show.id;
        console.log(deleteUrl);
        return fetch(deleteUrl, {method: 'delete'}).then(resp => resp.json());
    }


static createShow(show) {
    const url = "https://64b512caf3dbab5a95c6a515.mockapi.io/NetflixFilm/" + show.id;
    return fetch(url, {
        method: "post",
        body: JSON.stringify(show),
        headers: { "content-type": "application/json" },
    }).then((resp) => resp.json());
}
}
