//criação de dados E estruturação
export class Favorites{ 
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }



    load(){ // AQUI ESTÃO OS OBJETOS COM OS USUARIOS
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [] // logica que cria um array com o que esta no local estorage ou cria um array vazio
        /* Transforma as strings em Json em um objeto ou array  */
    }


    async add(username){

        try {
            const user = await GithubUser.search(username)

            if (user.login === undefined) {
                throw new Error('Usuario não encontrado !')
            }

            this.entries = [user, ...this.entries] // imutabilidade - cria um novo array 
            this.update() // atualiza a vizualização
            this.save()
            
        } catch(error) {
            alert(error.message)
        }

    }

    /* è feita a varificação se o usuario está no gitbub 
    é utilizado o try e catch , juntamente com o throw */

    save(){
        localStorage.setItem('@github-favorites:',JSON.stringify(this.entries))
    }

    delete(user){

        const filteredEntries = this.entries.filter( entry => entry.login !== user.login)
        /* Se o valor for true ele mantem o array , se for false ele vai mudar principio de imutabilidade 
        o array anterior deixa de existir e é criado um novo */
        this.entries = filteredEntries // recebe o novo array 
        this.update()
        this.save()
    }
    
}


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


// Vizualização

export class FavoritesView extends Favorites { 
    constructor(root){
        super(root) 

        /* Recebe a o #app e vai ser incluido dentro do root de  Favoritesview recebe o root (#app) e chama o super que envia o root tbm para a classe Favorites */
        this.tbody = this.root.querySelector('table tbody')        
        this.update()
        this.onadd()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const  { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update(){ // 
        this.removeAllTr() 

        this.entries.forEach( user => { // para cada entrada crie uma linha 
            const row = this.createrow() // CRIA UMA LINHA OU SEJA UMA TR NO HTML  rfrufvgbitugtgvrfuruktr

            row.querySelector('.user img').src = `https://github.com/${user.login}.png` // dentro de cada linha vá ate a img e altere o src pelo que foi colocado no array de objetos
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followeers

            row.querySelector('.remove').onclick = () => {
                const isOK = confirm('Tem certeza que deseja deletar essa linha ?')
                if (isOK) {
                    this.delete(user)
                }
            }
            
            this.tbody.append(row)
        })
    } 


    removeAllTr(){
        this.tbody.querySelectorAll('tr') // dentro  tbody busque o tr 
        .forEach((tr) =>{ // para cada linha (tr)
            tr.remove() // faca isso = para cada tr , remova a linha tr 
        })
    }

    createrow(){
        const tr = document.createElement('tr')

        tr.innerHTML =  `
        
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="imagem de mayk brito">
                <a href="https://github.com/maykbrito">
                    <p>Mayk Brito</p>
                    <span>maykbrito</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>        

        `

        return tr
    }
    /* Cria as linhas de tr dentro do HTML */

    
}
