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
        fetch(quotesURL, configObj)
            .then(res => res.json())
            .then(quote => createQuoteCard(quote))
    })
})

const createQuoteCard = (quote) => {
    let ul = document.getElementById('quote-list')

    let li = document.createElement('li')
    li.classList.add('quote-card')
    li.setAttribute("quoteId", quote.id)

    let p = document.createElement('p')
    p.classList.add("mb-0")
    p.innerText = quote.quote

    let footer = document.createElement('footer')
    footer.classList.add("blockquote-footer")
    footer.innerText = quote.author

    let deleteBtn = document.createElement('button')
    deleteBtn.classList.add('btn-danger')
    deleteBtn.innerText = "Delete"

    let likeBtn = document.createElement('button')
    likeBtn.classList.add('btn-success')
    likeBtn.innerText = "Likes:"

    let blockquote = document.createElement('blockquote')
    blockquote.classList.add("blockquote")

    let span = document.createElement('span')
    span.innerText = 0

    let br = document.createElement('br')

    let editBtn = document.createElement('button')
    editBtn.innerText = "Edit"
    editBtn.classList.add('btn-primary')

    likeBtn.append(span)
    blockquote.append(p, footer, br, likeBtn, editBtn, deleteBtn)
    li.append(blockquote)
    ul.append(li)


    deleteBtn.addEventListener("click", function (e) {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "DELETE",
        })
            .then(function () {
                li.remove()
            })
    })

    likeBtn.addEventListener("click", function (e) {
        fetch('http://localhost:3000/likes', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, body: JSON.stringify({
                quoteId: quote.id,
            })
        })
            .then(function (resp) {
                return resp.json()
            })
            .then(function (quote) {
                console.log(quote)
                let num = parseInt(span.innerText)
                span.innerText = num + 1
            })
    })

    editBtn.addEventListener('click', function (e) {
        let form = createEditForm(quote)
        footer.append(form)
        form.addEventListener("submit", function (e) {
            e.preventDefault()
            let newQuote = document.querySelector("#edit-input").value
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quote: newQuote
                })
            })
                .then(res => res.json())
                .then(function (quote) {
                    console.log(quote)
                    p.innerText = quote.quote
                    form.remove()
                })
        })
    })
}

function createEditForm(quote) {
    const form = document.createElement('form')
    const input = document.createElement('input')
    const submitBtn = document.createElement('button')

    input.type = 'text'
    input.value = quote.quote
    input.id = 'edit-input'
    submitBtn.type = 'submit'
    submitBtn.innerText = "Confirm Change"
    form.append(input, submitBtn)
    // form.appendChild(input)
    // form.appendChild(submitBtn)

    form.classList.add('edit-form')

    return form
}

function editQuote(e) {
    let form = createEditForm(quote)
        footer.append(form)
        form.addEventListener("submit", function (e) {
            e.preventDefault()
            let newQuote = document.querySelector("#edit-input").value
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quote: newQuote
                })
            })
                .then(res => res.json())
                .then(function (quote) {
                    console.log(quote)
                    p.innerText = quote.quote
                    form.remove()
                })
        })
}