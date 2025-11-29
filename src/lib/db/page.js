//models/page.js
import { ObjectId } from 'mongodb'
import db from "./database.js"

class Page{
    async count(){
        return await db.collection('Page').countDocuments()
    }

    async createPage(page){
        await db.collection('Page').insertOne(page)
    }

    async getPage(params){
        const _id = new ObjectId(params.id)
        let page = await db.collection('Page').findOne({ _id })
        page = {...page, _id: page._id.toString()}
        return page
    }

    async getPages(amount){
        let pages = await db.collection('Page').find().sort({ date: -1 }).limit(amount).toArray()
        pages = pages.map(page => ({...page, _id: page._id.toString()}))
        return pages
    }

    async updatePage(id, page){
        const _id = new ObjectId(id)
        await db.collection('Page').updateOne({ _id }, {$set: page})
    }

    async deletePage(id){
        const _id = new ObjectId(id)
        await db.collection('Page').deleteOne({ _id })
    }

    async paginatePages(page, amount){
        let pages = await db.collection('Page').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
        pages = pages.map(page => ({...page, _id: page._id.toString()}))
        return pages
    }
}

export default new Page()