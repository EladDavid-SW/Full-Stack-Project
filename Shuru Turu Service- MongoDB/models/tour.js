const mongoose = require('mongoose');
const id_validator = require('mongoose-id-validator');


var TourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    path: {
        type: Array,
        required: false,
    },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', require: true },
}, { timestamps: true });
TourSchema.plugin(id_validator);
const Tour = mongoose.model('Tour', TourSchema);
module.exports = Tour;