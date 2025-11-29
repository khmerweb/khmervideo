import { redirect } from '@sveltejs/kit'
import setup from "$lib/settings.js"
import settingDB from "$lib/db/setting.js"

export async function load({ locals, params, url }){
    const user = locals.user
    if(!user){throw redirect(307, '/login')}

    const id  = params.id
    const navPage = url.searchParams.get('p')
    const settings = await setup()
    const count = await settingDB.count()
    const setting = await settingDB.getSetting(id)
    const items = await settingDB.paginateSettings(parseInt(navPage), settings.dashboard)
    const pageNumber = Math.ceil(count/settings.dashboard)
    const title = "កែប្រែ setting"
    return { user, count, settings, setting, items, info:"setting ", type:"setting", pageNumber, navPage, title }
}

export const actions = {
    update: async ({ request, locals, cookies }) => {
        if(locals.user.role !== 'Admin'){
            return { success: false, message: 'អ្នក​គ្មាន​សិទ្ធ​កែប្រែ​​​ setting ​ទេ!' }
        }

        const data = await request.formData() 

        const id = data.get('id')
        
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
            await settingDB.updateSetting(id, setting)
            return { success: true, message: 'ការ​កែប្រែ​​សំរេច​បាន​ដោយ​ជោគជ័យ' }
        }else{
            return { success: false, message: "ទិន្នន័យ​បញ្ជូន​មក​មិន​ត្រឹមត្រូវ​ទេ!" }
        }
    }
}