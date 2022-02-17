const screen = {
    userProfile: document.querySelector('.profile-data'),
    renderUser(user) {
        this.userProfile.innerHTML = `<div class="info"><img src="${user.avatarUrl}" alt="Foto do Perfil do usuário />
                            <div class="data">
                                 <h1>${user.name ?? 'Não possui nome cadastrado 😥'}</h1>
                                 <p>${user.bio ?? 'Não possui bio cadastrada 😥'}</p>
                                 <div class="followers-content">
                                 <div class="followers">
                                     <h5>👥Seguidores</h5>
                                     <p>${user.followers}</p>
                                 </div>
                                 <div class="following">
                                     <h5>👥Seguindo</h5>
                                     <p>${user.following}</p>
                                 </div>
                                 </div>`
                                 
        let repositoriesItens = ""
        user.repositories.forEach(repo => repositoriesItens += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`)
        if (user.repositories.length > 0) {
            this.userProfile.innerHTML += `<div class="repositories section">
                                            <h2>Repositórios</h2>
                                            <ul>${repositoriesItens}</ul>
                                            </div>
                                            `
        }
    },
    renderNotFound(){
        this.userProfile.innerHTML =" <h3>Usuário não encontrado</h3>"
    }
}
const user = {
    avatarUrl: "",
    name:"",
    bio:"",
    userName:"",
    followers:"",
    following:"",     
    repositories: [],
    setInfo(gitHubUser){
        this.avatarUrl = gitHubUser.avatar_url
        this.name = gitHubUser.name
        this.bio = gitHubUser.bio
        this.userName = gitHubUser.login 
        this.followers = gitHubUser.followers   
        this.following = gitHubUser.following
        console.log(gitHubUser) 
       
    },
    
    setRepositories(repositories){
        this.repositories = repositories
        console.log(repositories)      
        
          
    },
}

async function getRepositories(userName){
    const response = await fetch(`${baseUrl}/${userName}/repos?per_page=${repositoriesQuantity}`)
    return await response.json()    
}

async function getUser(userName){
    const response = await fetch(`${baseUrl}/${userName}`)
    return await response.json()    
}

const baseUrl = "https://api.github.com/users"
const repositoriesQuantity = 10

export { baseUrl, repositoriesQuantity}


document.getElementById("btn-search").addEventListener("click", () => {
    const userName = document.getElementById("input-search").value
    if(userName.length === 0){
        alert("Preencha o campo com o nome do usuário do GitHub")
        return
    }
    getUserData(userName)
})

document.getElementById("input-search").addEventListener("keyup", (e) => {
    const userName = e.target.value
    const key = e.which || e.keycode
    const isEnterKeyPressed = key === 13
    if (isEnterKeyPressed) {
        if(userName.length === 0){
            alert("Preencha o campo com o nome do usuário do GitHub")
            return
        }
        getUserData(userName)
    }
})

async function getUserData(userName) {
    const userResponse = await getUser(userName)

    if(userResponse.message === "Not Found"){
        screen.renderNotFound()
        return
    }
    const repositoriesResponse = await getRepositories(userName)
    user.setInfo(userResponse)
    user.setRepositories(repositoriesResponse)
    screen.renderUser(user)
}
