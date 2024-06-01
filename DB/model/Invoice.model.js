const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

InvoiceSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastInvoice = await this.constructor.findOne().sort({ invoiceNumber: -1 });
        this.invoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
    }
    next();
});

const InvoiceModel = mongoose.model('Invoice', InvoiceSchema);

module.exports = { InvoiceModel };
