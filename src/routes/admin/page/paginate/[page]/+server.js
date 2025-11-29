import { json } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import pageDB from "$lib/db/page.js"

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}
    
    const page = params.page
    const settings = await setup()
    const items = await pageDB.paginatePages(parseInt(page), settings.dashboard)
    
    return json(items)
}