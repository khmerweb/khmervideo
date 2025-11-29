//models/setting.js

import { ObjectId } from 'mongodb'
import db from "./database.js"

class Setting{
    async count(){
        return await db.collection('Setting').countDocuments()
    }

    async createSetting(setting){
        await db.collection('Setting').insertOne(setting)
    }

    async getSetting(id){
        const _id = new ObjectId(id)
        let setting = await db.collection('Setting').findOne({ _id })
        setting = {...setting, _id: setting._id.toString()}
        return setting
    }

    async getSettings(amount){
        let settings = await db.collection('Setting').find().sort({ date: -1 }).limit(amount).toArray()
        settings = settings.map(setting => ({...setting, _id: setting._id.toString()}))
        return settings
    }

    async updateSetting(id, setting){
        const _id = new ObjectId(id)
        await db.collection('Setting').updateOne({ _id }, {$set: setting})
    }

    async deleteSetting(id){
        const _id = new ObjectId(id)
        await db.collection('Setting').deleteOne({ _id })
    }

    async paginateSettings(page, amount){
        let settings = await db.collection('Setting').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
        settings = settings.map(setting => ({...setting, _id: setting._id.toString()}))
        return settings
    }
}

export default new Setting()