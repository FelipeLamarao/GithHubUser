// PEGA AS INFORMAÇÕES DA API DO GITHUB
export class GithubUser{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`


        return fetch(endpoint)
        .then(data => data.json())
        .then(({login,name,public_repos,followeers}) => 
        (
            {
                login,
                name,
                public_repos,
                followeers
            }
        ))

        /* É feito a desustruração */
    }
}