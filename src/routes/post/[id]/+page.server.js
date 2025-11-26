import postDB from "$lib/db/post.js"
import userDB from "$lib/db/user.js"
import setup from "$lib/settings.js"

export async function load({ locals, params }){
    const id = params.id
    const user = locals?.user
    const settings = await setup()
    const post = await postDB.getPost(params)
    const authorId = post.author
    const author = await userDB.getUser(authorId)
    const authorName = author.title
    const randomPosts = await postDB.getRandomPosts(7, post)
    
    const thumb = post.thumb
    const title = post.title
    
    return {post, user, authorName, randomPosts, settings, thumb, title}
}