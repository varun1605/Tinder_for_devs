const authAdmin = (req, res, next) => {
    console.log("This auth works well!");

    const token = "xyjjiz"
    const isAuthorizedToken = token === "xyz";
    if (!isAuthorizedToken) {
        res.status(401).send("Unauthorized access!!")
    }
    else {
        next()
    }
}

module.exports=authAdmin