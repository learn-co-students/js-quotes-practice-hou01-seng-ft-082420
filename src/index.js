const quoteURL = 'http://localhost:3000/quotes?_embed=likes'
// const likesURL = 'http://localhost:3000/likes'


document.addEventListener("DOMContentLoaded", () => {
    const quoteCollection = document.querySelector('#quote-list')
    const quoteForm = document.querySelector("#new-quote-form")

    fetch(quoteURL)
    .then(resp => resp.json())
    .then(quotes => quotes.forEach(quote => {
        renderQuote(quote)
    }))

    function renderQuote(quote) {
        let quoteCard = document.createElement('li')
        quoteCard.className = 'quote-card'

        let blockQuote = document.createElement('blockquote')
        blockQuote.className = 'blockquote'

        let p = document.createElement('p')
        p.className = 'mb-0'
        p.innerText = quote.quote

        let footer = document.createElement('footer')
        footer.className = 'blockquote-footer'
        footer.innerText = quote.author

        let br = document.createElement('br')

        let likeButton = document.createElement('button')
        likeButton.className = 'btn-success'
        likeButton.innerText = 'Likes:'
        
        let span = document.createElement('span')
        span.innerText = 0
        // console.log(quote)
        
        let deleteButton = document.createElement('button')
        deleteButton.className = 'btn-danger'
        deleteButton.innerText = 'Delete'
        
        quoteCard.append(blockQuote, p, footer, likeButton, deleteButton)
        quoteCollection.append(quoteCard)
        //this appends/shows the number of likes the object has in API
        likeButton.append(span)

        quoteForm.addEventListener('submit', function(e){
            e.preventDefault()
            let quote = {}
            quote.quote = e.target.quote.value
            quote.author = e.target.author.value
            postQuote(quote)
        })
    
        function postQuote(quote){
            let quoteOption = {
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quote: quote.quote,
                    author: quote.author,
                    likes: 0
                })
            }
            fetch(quoteURL, quoteOption)
            .then(renderQuote(quote))
        }

        likeButton.addEventListener('click', function(e){
            fetch('http://localhost:3000/likes', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    quoteId: quote.id,
                })
            })
            .then(function(resp){
                return resp.json()
            })
            .then(function(quote){
                console.log(quote)
                let num = parseInt(span.innerText)
                span.innerText = num + 1
            })
        })

        deleteButton.addEventListener('click', function(e){
            fetch(`http://localhost:3000/quotes/${quote.id}`,{
                method: "DELETE"
            })
            .then(function(){
                quoteCard.remove()
            })
        })




    //below is the end fo renderQuote function    
    }

    





  //below me is the closing of DOMContentLoaded  
})