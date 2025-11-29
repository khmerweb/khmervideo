import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import pageDB from "$lib/db/page.js"

export async function load({ locals, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const settings = await setup()
    const count = await pageDB.count()
    const items = await pageDB.getPages(settings.dashboard)

    const pageNumber = Math.ceil(count/settings.dashboard)
    const delObj = { success: url.searchParams.get('success'), type: url.searchParams.get('type') }
    const title = 'ទំព័រ​ស្តាទិក'

    return { user, count, settings, items, info:"ទំព័រ​ស្តាទិក", type:"page", pageNumber, delObj, title }
}

export const actions = {
	create: async ({ request, locals, cookies }) => {
        if(locals.user.role !== 'Admin'){
            return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​បង្កើត​ទំព័រ​ស្តាទិក​​ទេ!' }
        }

		const data = await request.formData()
        
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
            const access_token = cookies.get('khmertube_access_token')
            await pageDB.createPage(page)
            return { success: true, message: 'ទំព័រ​ស្តាទិក​​មួយ​ត្រូវ​បាន​បង្កើត​ឡើង!' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
	}
}