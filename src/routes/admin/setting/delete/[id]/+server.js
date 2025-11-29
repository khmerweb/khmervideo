import { redirect } from '@sveltejs/kit'
import settingDB from "$lib/db/setting.js"

export async function GET({ locals, params }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    if(user.role === 'Admin'){
        await settingDB.deleteSetting(params.id)
        redirect(307, '/admin/setting?success=yes&type=setting')
    }else{
        redirect(307, `/admin/setting?success=no&type=setting`)
    } 
}