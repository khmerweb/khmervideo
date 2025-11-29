// models/category.js
import { ObjectId } from 'mongodb'
import db from "./database.js"

class Category{
    async count(){
        return await db.collection('Category').countDocuments()
    }

    async createCategory(category){
        await db.collection('Category').insertOne(category)
    }

    async getCategory(id){
        const _id = new ObjectId(id)
        let category = await db.collection('Category').findOne({_id})
        category = {...category, _id: category._id.toString()}
        return category
    }

    async getCategories(amount){
        let categories = await db.collection('Category').find().sort({ date: -1 }).limit(amount).toArray()
        categories = categories.map(category => ({...category, _id: category._id.toString()}))
        return categories
    }

    async updateCategory(id, category){
        const _id = new ObjectId(id)
        await db.collection('Category').updateOne({ _id }, {$set: category})
    }

    async deleteCategory(id){
        const _id = new ObjectId(id)
        await db.collection('Category').deleteOne({ _id })
    }

    async paginateCategories(page, amount){
        let categories = await db.collection('Category').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
        categories = categories.map(category => ({...category, _id: category._id.toString()}))
        return categories
    }

    async getAllItems(){
        let categories = await db.collection('Category').find().sort({ date: -1 }).toArray()
        categories = categories.map(category => ({...category, _id: category._id.toString()}))
        return categories
    }

}

export default new Category()