const URLBase = 'http://localhost:3000/quotes?_embed=likes'

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("new-quote-form")

    fetch(URLBase).then(res => res.json()).then(function (quotes) {
        for (const quote of quotes) {
            createQuoteCard(quote);
        }
    })

    form.addEventListener("submit", function (e) {
        e.preventDefault()
        const quotesURL = 'http://localhost:3000/quotes'
        let quoteValue = document.getElementById('new-quote').value
        let authorValue = document.getElementById('author').value
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quote: quoteValue,
                author: authorValue
            })
        }
        console.log(quoteValue)
        fetch(quotesURL, configObj)
            .then(res => res.json())
            .then(quote => createQuoteCard(quote))
    })
})

const createQuoteCard = (quote) => {
    let ul = document.getElementById('quote-list')
    let li = document.createElement('li')
    let p = document.createElement('p')
    let footer = document.createElement('footer')
    let deleteBtn = document.createElement('button')
    let likeBtn = document.createElement('button')
    let blockquote = document.createElement('blockquote')
    let span = document.createElement('span')
    let br = document.createElement('br')

    li.classList.add('quote-card')
    li.setAttribute("quoteId", quote.id)
    blockquote.classList.add("blockquote")
    p.classList.add("mb-0")
    footer.classList.add("blockquote-footer")
    deleteBtn.classList.add('btn-danger')
    likeBtn.classList.add('btn-success')
    likeBtn.innerText = "Likes:"
    deleteBtn.innerText = "Delete"
    span.innerText = 0
    likeBtn.append(span)

    blockquote.append(p, footer, br, likeBtn, deleteBtn)
    li.append(blockquote)
    ul.append(li)

    p.innerText = quote.quote
    footer.innerText = quote.author

    deleteBtn.addEventListener("click", function(e){
        fetch(`http://localhost:3000/quotes/${quote.id}`,{
            method: "DELETE",
        })
        .then(function(){
            li.remove()
        })
    })
    
    likeBtn.addEventListener("click", function(e){
        fetch('http://localhost:3000/likes',{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"            
            }  , body: JSON.stringify({
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
}

