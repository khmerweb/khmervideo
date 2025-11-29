import setup from "$lib/settings.js"
import postDB from "$lib/db/post.js"

export async function load({ locals }){
    const user = locals.user
    const settings = await setup()
    const title = 'ទំព័រ​ស្វែង​រក'
    const { posts, lastPage, q } = locals.data
    const page = 1
    
    return {user, posts, settings, lastPage, page, q, title}
}

export const actions = {
    search: async ({ locals, request, fetch }) => {
        const settings = await setup()
        const data = await request.formData()
        const q = data.get('q')
        const { posts, length } = await postDB.searchPosts(q, 14, 1)
        const lastPage = Math.ceil(length/14)

        locals.data = { posts, lastPage, q }
    }
}