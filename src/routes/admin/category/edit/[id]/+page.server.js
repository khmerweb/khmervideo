import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import categoryDB from '$lib/db/category'

export async function load({ locals, params, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}
    const id  = params.id
    const navPage = url.searchParams.get('p')
    const settings = await setup()
    const count = await categoryDB.count()
    const category = await categoryDB.getCategory(id)
    const items = await categoryDB.paginateCategories(navPage, settings.dashboard)
    const title = 'កែប្រែ​ជំពូក'
    const pageNumber = Math.ceil(count/settings.dashboard)

    return {user, count, settings, category, items, info:"ជំពូក", type:"category", pageNumber, navPage, title}
}

export const actions = {
    update: async ({ request, locals, cookies }) => {
        if(locals.user.role !== 'Admin'){
            return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​កែប្រែ​​ជំពូក​ទេ!' }
        }

        const data = await request.formData()

        const id = data.get('id')

        const title = data.get('label')
        const thumb = data.get("thumb")
        const date = data.get("date")
        const dateObj = new Date(date)

        const validate = (
            typeof title === 'string' && title !== '' &&
            typeof thumb === 'string' && thumb !== '' &&
            !isNaN(dateObj)
        )
        
	    if(validate){
            const category = {title, thumb, date}
            await categoryDB.updateCategory(id, category)
            return { success: true, message: 'ការ​កែប្រែ​​សំរេច​បាន​ដោយ​ជោគជ័យ' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
    }
}