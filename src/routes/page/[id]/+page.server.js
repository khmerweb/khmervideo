import setup from "$lib/settings.js"
import pageDB from "$lib/db/page.js"
import postDB from "$lib/db/post.js"

export async function load({ params }){
    const settings = await setup()
    const page = await pageDB.getPage(params)
    const posts = await postDB.getLatestPostByCategory(['movie'], 1)
    const randomPosts = await postDB.getRandomPosts(3, posts[0][0])
    const thumb = page.thumb
    const title = page.title

    let pageURL
    if(page._id === '66b17b1e944f187d47506cda'){
        pageURL = 'contact'
    }else if(page._id === '66b17b48944f187d47506cdc'){
        pageURL = 'about'
    }
    
    return {page, randomPosts, settings, thumb, title, pageURL}
}