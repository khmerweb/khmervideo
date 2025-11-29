import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import settingDB from "$lib/db/setting.js"

export async function load({ locals, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const settings = await setup()
    const count = await settingDB.count()
    const items = await settingDB.getSettings(settings.dashboard)
    const pageNumber = Math.ceil(count/settings.dashboard)
    const delObj = { success: url.searchParams.get('success'), type: url.searchParams.get('type') }
    const title = "ទំព័រ setting"
    return { user, count, settings, items, info:"setting ", type:"setting", pageNumber, delObj, title }
}

export const actions = {
    create: async ({ request, locals, cookies }) => {
        if(locals.user.role !== 'Admin'){
            return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​បង្កើត​​ setting ទេ!' }
        }

        const data = await request.formData() 
        
        const title = data.get('title')
        const description = data.get("description")
        const dashboard = data.get("dashboard")
        const frontend = data.get("frontend")
        const categories = data.get("categories")
        const thumb = data.get("thumb")
        const date = data.get("date")
        const dateObj = new Date(date)

        const validate = (
            typeof title === 'string' && title !== '' &&
            typeof description === 'string' && description !== '' &&
            typeof dashboard === 'string' && dashboard !== '' &&
            typeof frontend === 'string' && frontend !== '' &&
            typeof categories === 'string' && categories !== '' &&
            typeof thumb === 'string' && thumb !== '' &&
            !isNaN(dateObj)
        )

        if(validate){
            const setting = {title, description, dashboard, frontend, categories, thumb, date}
            await settingDB.createSetting(setting)
            return { success: true, message: 'setting ​​មួយ​ត្រូវ​បាន​បង្កើត​ឡើង!' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
    }
}