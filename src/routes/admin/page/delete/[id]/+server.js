import { redirect } from '@sveltejs/kit'
import pageDB from "$lib/db/page.js"

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    if(user.role !== "Admin"){
        redirect(307, '/admin/page?success=no&type=page')
    }
    
    const id = params.id
    await pageDB.deletePage(id)
    redirect(307, '/admin/page?success=yes&type=page')
}