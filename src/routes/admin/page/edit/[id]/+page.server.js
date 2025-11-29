import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import pageDB from "$lib/db/page.js"

export async function load({ locals, params, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const navPage = url.searchParams.get('p')
    const settings = await setup()
    const count = await pageDB.count()
    const page = await pageDB.getPage(params)
    const items = await pageDB.paginatePages(parseInt(navPage), settings.dashboard)
    
    const pageNumber = Math.ceil(count/settings.dashboard)
    const title = "កែប្រែ​ទំព័រ​ស្តាទិក"
    return {user, count, settings, page, items, info:"ទំព័រ​ស្តាទិក", type:"page", pageNumber, navPage, title}
}

export const actions = {
    update: async ({ request, locals }) => {
        if(locals.user.role !== 'Admin'){
            return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​កែប្រែ​ទំព័រ​ស្តាទិក​​ទេ!' }
        }
        const data = await request.formData()

        const id = data.get('id')

        const title = data.get('title')
        const content = data.get('content')
        const thumb = data.get("thumb")
        const date = data.get("date")
        const dateObj = new Date(date)

        const validate = (
            typeof title === 'string' && title !== '' &&
            typeof content === 'string' && content !== '' &&
            typeof thumb === 'string' && thumb !== '' &&
            !isNaN(dateObj)
        )
        
	    if(validate){
            const page = {title, content, thumb, date}
            await pageDB.updatePage(id, page)
            return { success: true, message: 'ការ​កែប្រែ​​សំរេច​បាន​ដោយ​ជោគជ័យ' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
    }
}