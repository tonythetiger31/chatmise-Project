exports.cookieParse = function cookieParse(cookie, key){
    cA = cookie.split(/[;=]+/);
    cB = cA.indexOf(key) + 1
    cB = cA[cB]
    cB = cB.toString()
    return(cB)
}