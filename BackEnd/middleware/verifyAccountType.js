
export const verifyAccountType = (...allowedAccountType) => {
    return (req, res, next) => {
        if (!req?.accountType) return res.sendStatus(401); //Unauthorized
        const accountTypeArrays = [...allowedAccountType];
        console.log(accountTypeArrays);
        console.log(req.accountType);
        const result = accountTypeArrays.includes(req.accountType)
        if (!result) return res.sendStatus(401); //Unauthorized
        next()
    }
}