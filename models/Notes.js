const mongoose= require('mongoose');

const notesSchema= new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
        // to give the reference
    },
    // acts as foreign key
    title:{
        type:String,
        required : true

    },
    description : {
        type: String,
        required : true
    },
    tags :{
        type : String,
        default : "General"
    },
    date: {
        type : Date,
        default : Date.now
    }
})

module.exports= mongoose.model('notes', notesSchema);

