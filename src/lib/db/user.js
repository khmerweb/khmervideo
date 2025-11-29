//models/user.js
//npm install bcryptjs
import db from "./database.js"
import { ObjectId } from 'mongodb'
import bcrypt from "bcryptjs"

class User{
    async count(){
        return await db.collection('User').countDocuments()
    }

    async createRootUser(c){
        const hashPassword = bcrypt.hashSync("xxxxxxxx", 8)
        const user = {
            email: "sokhavuth@khmerweb.app",
            title: "សុខាវុធ",
            password: hashPassword,
            role: "Admin",
            thumb: "",
            content: "",
            datetime: "",
        }

        const db = c.get('db')
        await db.collection('User').insertOne(user)
    }

    async createUser(user){
        await db.collection('User').insertOne(user)
    }

    async checkUser(email){
        let user = await db.collection('User').findOne({email})
        user = {...user, _id: user._id.toString()}
        return user
    }

    async getUser(id){
        const _id = new ObjectId(id)
        let user = await db.collection('User').findOne({ _id })
        user = {...user, _id: user._id.toString()}
        return user
    }

    async getUsers(amount){
        let users = await db.collection('User').find().sort({ date: -1 }).limit(amount).toArray()
        users = users.map(user => ({...user, _id: user._id.toString()}))
        return users
    }

    async updateUser(id, user){
        const _id = new ObjectId(id)
        await db.collection('User').updateOne({ _id }, {$set: user})
    }

    async deleteUser(id){
        const _id = new ObjectId(id)
        await db.collection('User').deleteOne({ _id })
    }

    async paginateUsers(page, amount){
        let users = await db.collection('User').find().sort({ date: -1 }).skip((page-1)*amount).limit(amount).toArray()
        users = users.map(user => ({...user, _id: user._id.toString()}))
        return users
    }
}

export default new User()