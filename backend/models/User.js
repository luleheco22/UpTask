import mongoose from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    })

//encriptar el password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
    } else {
        next()
    }
})

userSchema.methods.checkPassword = async function (passwordForm) {
    return await bcrypt.compare(passwordForm, this.password)
}

const User = mongoose.model('User', userSchema)

export default User