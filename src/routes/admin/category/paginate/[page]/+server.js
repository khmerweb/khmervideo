import { json } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import categoryDB from '$lib/db/category'

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}
    
    const page = params.page
    const settings = await setup()
    const items = await categoryDB.paginateCategories(parseInt(page), settings.dashboard)
    
    return json(items)
}