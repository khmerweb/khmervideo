import { json } from '@sveltejs/kit'
import postDB from "$lib/db/post.js"

export async function GET({ locals, params }){
    const page = params.page
    const q = params.q
    const { posts } = await postDB.searchPosts(q, 14, parseInt(page))

    return json({ posts })
}