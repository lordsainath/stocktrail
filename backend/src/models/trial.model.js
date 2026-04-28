const mongoose = require('mongoose');

const trialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

const Trial = mongoose.model('Trial', trialSchema);