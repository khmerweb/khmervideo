import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import categoryDB from '$lib/db/category'

export async function load({ locals, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const settings = await setup()
    const count = await categoryDB.count()
    const items = await categoryDB.getCategories(settings.dashboard)

    const pageNumber = Math.ceil(count/settings.dashboard)
    const delObj = { success: url.searchParams.get('success'), type: url.searchParams.get('type') }
    const title = "ទំព័រ​ជំពូក"
    return { user, count, settings, items, info:"ជំពូក", type:"category", pageNumber, delObj, title }
}

export const actions = {
    create: async ({ request, locals, cookies }) => {
        if(locals.user.role !== 'Admin'){
            return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​បង្កើត​ជំពូក​ទេ!'}
        }

        const data = await request.formData()
        
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
            await categoryDB.createCategory(category)
            return { success: true, message: 'ជំពូក​​មួយ​ត្រូវ​បាន​បង្កើត​ឡើង!' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
    }
}