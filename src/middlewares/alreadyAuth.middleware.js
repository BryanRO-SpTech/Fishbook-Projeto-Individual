const AlreadyAuthMiddleware = async (req, res, next) => {
    const { session } = req.signedCookies;

    if (session) {
        return res.redirect("feed");
    }

    return next();
}

module.exports = AlreadyAuthMiddleware;