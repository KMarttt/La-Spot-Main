
export const verifyAccountType = (...allowedAccountType) => {
    return (req, res, next) => {
        if (!req?.accountType) return res.sendStatus(401); //Unauthorized
        const accountTypeArrays = [...allowedAccountType];
        const result = accountTypeArrays.includes(req.accountType)
        if (!result) return res.sendStatus(401); //Unauthorized
        next()
    }
}