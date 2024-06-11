const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: false },
    phone: { type: String, required: false },
    notes: { type: String, default: '' },
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' }]
});

const CustomerModel = mongoose.model('Customer', CustomerSchema);

module.exports = { CustomerModel };
