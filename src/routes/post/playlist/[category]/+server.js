import { json } from '@sveltejs/kit'
import setup from '$lib/settings.js'
import postDB from '$lib/db/post.js'

export async function POST({ request, params }){
    const category = params.category
    const { thumbs } = await request.json()
	const settings = await setup()

	const playlist = await postDB.getRandomPlaylist(settings.frontend, category, thumbs)

    return json(playlist)
}