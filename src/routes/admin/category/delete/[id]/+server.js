import { redirect } from '@sveltejs/kit'
import categoryDB from '$lib/db/category'

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    if(locals.user.role !== 'Admin'){
        redirect(307, '/admin/category?success=no&type=category')
    }
    
    const id = params.id
    await categoryDB.deleteCategory(id)
    redirect(307, '/admin/category?success=yes&type=category')
}