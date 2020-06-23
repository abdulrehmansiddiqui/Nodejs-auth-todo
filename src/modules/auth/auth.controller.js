const User = require("./user.model");

module.exports = {

    async reg(req, res, next) {
        let { email, pass, name } = req.body;

        console.log("Reg API")
        email.toLowerCase();

        if (pass.length < 6) {
            return res.status(422).send({
                name: "pass",
                message: "Minimum password length is 6"
            })
        }

        if (pass.length > 16) {
            return res.status(422).send({
                name: "pass",
                message: "Maximum password length is 16"
            })
        }

        User.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, "i") } })
            .then(async item => {
                if (item) {
                    return res.status(422).send({
                        name: "email",
                        message: "This email is already busy"
                    })
                } else {
                    const user = new User({ email, name, password: pass });
                    let userDoc = await user.save()
                    // console.log("xxxxxxxx", userDoc)
                    res.json({ auth: user.generateJWT(), id: userDoc._id });
                }
            })
            .catch(next);
    },

    login(req, res, next) {
        const { email, pass } = req.body;
        console.log("Login API")

        User.findOne({ email: { $regex: new RegExp("^" + email + "$", "i") } })
            .then(user => {
                if (!user) {
                    return res.status(422).send({ message: "this email don't registration" })
                }
                if (user === null) {
                    return res.status(422).send({ message: "Wrong pass or login" })
                }
                else {
                    if (user && user.validatePassword(pass)) {
                        res.json({
                            auth: user.generateJWT(),
                            id: user._id
                        });
                    } else {
                        return res.status(422).send({ message: "Wrong pass or login" })
                    }
                }
            })
            .catch(next);
    },



};
