import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import userDB from '$lib/db/user.js'
import bcrypt from "bcryptjs"

export async function load({ locals, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const settings = await setup()
    const delObj = { success: url.searchParams.get('success'), type: url.searchParams.get('type') }
    const count = await userDB.count()
    const items = await userDB.getUsers(settings.dashboard)
    const pageNumber = Math.ceil(count/settings.dashboard)
    const title = "ទំព័រ​អ្នក​និពន្ធ"
    
    return {user, count, settings, items, info:"អ្នក​និពន្ធ", type:"user", pageNumber, delObj, title}
}

export const actions = {
	create: async ({ request, locals, cookies }) => {
        if(locals.user.role !== 'Admin'){
            return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​ចុះ​ឈ្មោះ​អ្នក​និពន្ធ​​​ទេ!' }
        }

		const data = await request.formData()
        
        const title = data.get('title')
        const content = data.get('content')
        const role = data.get('role')
        const email = data.get('email')
        let password = data.get('password')
        password = bcrypt.hashSync(password, 8)
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
            await userDB.createUser(user)
            return { success: true, message: 'អ្នក​និព្ធ​ម្នាក់​ត្រូវ​បាន​ចុះ​ឈ្មោះ​!' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
	}
}