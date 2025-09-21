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

async function loginPost(req, res) {
    try {
        console.log(req.body);
        const { username, password } = req.body;


    } catch (err) {

    }
}

async function signupPost(req, res) {
    try {
        console.log(req.body);
        const { username, password } = req.body;
    } catch (err) {

    }
}

export const indexController = {
    indexGet,
    loginPost,
    signupPost
}