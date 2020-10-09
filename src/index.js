fetch("http://localhost:3000/quotes?_embed=likes")
    .then(function (response) {
        return response.json()
    })
    .then(function (json) {
        for (const quote of json) {
            renderOne(quote)
        }
    })

function renderOne(quote) {
    const li = document.createElement('li')
    li.className = 'quote-card'

    const blockquote = document.createElement('blockquote')
    blockquote.className = 'blockquote'

    const p = document.createElement('p')
    p.className = 'mb-0'
    p.innerText = quote.quote

    const footer = document.createElement('footer')
    footer.className = 'blockquote-footer'
    footer.innerHTML = quote.author

    const btnSuccess = document.createElement('button')
    btnSuccess.className = 'btn-success'
    btnSuccess.innerText = "Likes:"

    const editBtn = document.createElement('button')
    editBtn.className = 'btn-edit'
    editBtn.innerText = 'Edit'

    const editForm = document.createElement("form")
    editForm.className = "invisible"
    editInput = document.createElement("input")
    editInput.type = "text"
    editInput.placeholder = quote.quote
    editInput.id = "quote-edit"
    editSubmit = document.createElement("button")
    editSubmit.type = "submit"
    editSubmit.innerText = "Save"
    editForm.append(editInput, editSubmit)
    editBtn.addEventListener("click", (e) => {
        editForm.className = "visible"
    })
    editForm.addEventListener("submit", (e) => {
        const newQuote = document.getElementById("quote-edit").value
        (e).preventDefault()
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                quote: newQuote
            })
        })
            .then(res => res.json())
            .then(nq => {
                p.innerText = nq
            })
    })



    let numOfLikes = quote.likes.length

    let span = document.createElement('span')
    span.innerText = `${numOfLikes}`
    btnSuccess.append(span)

    btnSuccess.addEventListener('click', (e) => {
        fetch(`http://localhost:3000/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "quoteId": quote.id,
                "createdAt": Math.round((Date.now() / 1000))
            })
        })
            .then(res => res.json())
            .then(like => {
                numOfLikes++
                span.innerText = `${numOfLikes}`
            })
    })


    const btnDanger = document.createElement('button')
    btnDanger.className = 'btn-danger'
    btnDanger.innerText = "Delete"

    btnDanger.addEventListener('click', (e) => {
        li.remove();
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
            method: 'DELETE'
        })
    })

    const br = document.createElement('br')

    blockquote.append(p, footer, br, btnSuccess, editBtn, btnDanger, editForm)
    li.append(blockquote)
    const ul = document.getElementById("quote-list")
    ul.append(li)

}

const form = document.getElementById("new-quote-form")
form.addEventListener("submit", (e) => {
    (e).preventDefault()
    const newQuote = document.getElementById("new-quote").value
    const author = document.getElementById("author").value
    form.reset()
    fetch('http:localhost:3000/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "quote": newQuote,
            'author': author
        })
    })
        .then(res => res.json())
        .then(newQuote => renderOne(newQuote))
})