async function indexGet(req, res) {
    try {
        const randomMessage = await fetch("https://random-word-api.herokuapp.com/word")
        .then(res => res.json())
        .then(data => data[0])

        return res.json({
            text: randomMessage
        });
    } catch (err) {
        console.error("Error loading home page: ", err);
    }
}

export const indexController = {
    indexGet,
}