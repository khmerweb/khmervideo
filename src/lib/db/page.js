//models/page.js
import { ObjectId } from 'mongodb'
import db from "./database.js"

class Page{
    async count(c){
        const db = c.get('db')
        return await db.collection('Page').countDocuments()
    }

    async createPage(c, page){
        const db = c.get('db')
        await db.collection('Page').insertOne(page)
    }

    async getPage(params){
        const _id = new ObjectId(params.id)
        let page = await db.collection('Page').findOne({ _id })
        page = {...page, _id: page._id.toString()}
        return page
    }

    async getPages(c, amount){
        const db = c.get('db')
        return await db.collection('Page').find().sort({ date: -1 }).limit(amount).toArray()
    }

    async updatePage(c, page){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        await db.collection('Page').updateOne({ _id }, {$set: page})
    }

    async deletePage(c){
        const db = c.get('db')
        const _id = new ObjectId(c.req.param('id'))
        await db.collection('Page').deleteOne({ _id })
    }

    async paginatePages(c, amount){
        const db = c.get('db')
        let page

        if(c.req.param('page')){
            page = parseInt(c.req.param('page'))
        }else if(c.req.query('page')){
            page = parseInt(c.req.query('page'))
        }else{
            page =  parseInt(c.get('navPage'))
        }
        
        return await db.collection('Page').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
    }
}

export default new Page()