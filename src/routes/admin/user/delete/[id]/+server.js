import { redirect } from '@sveltejs/kit'
import userDB from '$lib/db/user.js'

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    
    if(user.role === 'Admin'){
        await userDB.deleteUser(params.id)
        redirect(307, '/admin/user?success=yes&type=user')
    }else{
        redirect(307, `/admin/user?success=no&type=user`)
    } 
}