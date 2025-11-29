import { json } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import userDB from '$lib/db/user.js'

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){
        throw redirect(307, '/login')
    }
    const page = params.page
    const settings = await setup()
    const items = await userDB.paginateUsers(parseInt(page), parseInt(settings.dashboard))
    return json(items)
}