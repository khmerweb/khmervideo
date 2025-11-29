//settings.js
import settingDB from "$lib/db/setting.js"

async function setup(){
    let set = await settingDB.getSettings(1)
    let setting = set[0]
    let settings = {}

    if(setting){
        settings = {
            siteTitle: setting.title,
            description: setting.description,
            dashboard: parseInt(setting.dashboard),
            frontend: parseInt(setting.frontend),
            categories: parseInt(setting.categories),
            playlist: parseInt(setting.frontend),
            thumb: '',
            date: ''
        }
    }else{
        settings = {
            siteTitle: 'ដំណឹង​ល្អ',
            description: 'description',
            dashboard: 2,
            frontend: 20,
            categories: 20,
            playlist: 20,
            thumb: '',
            date: ''
        }
    }
    
    return settings
}
 
export default setup