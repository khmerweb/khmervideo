import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import userDB from '$lib/db/user.js'
import bcrypt from "bcryptjs"

export async function load({ locals, params, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const id = params.id
    const navPage = url.searchParams.get('p')
    const settings = await setup()
    const count = await userDB.count()
    const author = await userDB.getUser(id)
    const items = await userDB.paginateUsers(parseInt(navPage), settings.dashboard)
    const pageNumber = Math.ceil(count/settings.dashboard)
    const title = "កែប្រែ​អ្នក​និពន្ធ"

    return {user, count, settings, author, items, info:"អ្នក​និពន្ធ", type:"user", pageNumber, navPage, title}
}

export const actions = {
    update: async ({ request, locals, cookies }) => {
        const data = await request.formData()
        const id = data.get('id')

        const title = data.get('title')
        const content = data.get('content')
        const role = data.get('role')
        const email = data.get('email')
        let password = data.get('password')

        const author = await userDB.getUser(id)
        if(password !== author.password){
           password = bcrypt.hashSync(password, 8)
        }
        
        const thumb = data.get("thumb")
        const date = data.get("date")
        const dateObj = new Date(date)

        const validate = (
            typeof title === 'string' && title !== '' &&
            typeof content === 'string' &&
            typeof role === 'string' && role !== '' &&
            typeof email === 'string' && email !== '' &&
            typeof password === 'string' && password !== '' &&
            typeof thumb === 'string' && thumb !== '' &&
            !isNaN(dateObj)
        )
        
	    if(validate){
            const user = {title, content, role, email, password, thumb, date}
            if(locals.user.role !== 'Admin'){
                if(locals.user.id !== id){
                    return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​កែប្រែ​អ្នក​និពន្ធ​​​ផ្សេងឡើយ!' }
                }else{
                    await userDB.updateUser(id, user)
                }
            }else if(locals.user.role === 'Admin'){
                await userDB.updateUser(id, user)
            }
            return { success: true, message: 'ការ​កែប្រែ​​សំរេច​បាន​ដោយ​ជោគជ័យ' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
    }
}