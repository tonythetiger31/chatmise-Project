exports.cookieParse = function cookieParse(cookie, key){
    try{
        str = cookie.replace(/\s+/g, "")
        cA = str.split(/[;=]+/);
        cB = cA.indexOf(key)
        if (cB === -1){
            return(null)
        } else {
        cB += 1
        cB = cA[cB]
        cB = cB.toString()
        return(cB)
        }
    } catch(err){
        return(null)
    }
}