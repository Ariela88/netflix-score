

function sendData(event) {

   
    event.preventDefault();

    const form = document.forms['create'];



    const formData = new FormData(form);

    const newShow = {

        title:formData.get('title'),
        author:formData.get('author'),
        imageUrl:formData.get('imageUrl'),
        isOver:formData.get('isOver') === "on" ? true : false,
        upVotes: 0,
        downVotes: 0
    }


    console.log(newShow)

DBService.createShow(newShow).then(show => window.location = '/index.html')
    
}