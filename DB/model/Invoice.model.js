const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: Number, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
    paymentType: { type: String, required: true },
    products: [{
        _id:{type:mongoose.Schema.Types.ObjectId, ref: 'Product',required:true},
        itemName: { type: String ,required: true },
        itemNumber: { type: Number ,required: true },
        discount: { type: Number ,required: true },
        barcode: { type: String ,required: true },
        currentStock: { type: Number ,required: true },
        selectedContainerName: { type: String ,required: true },     
        productContainers:[
            {
                barcodes:[{
                    code: { type: String,  }
                  }],
               name:{type: String},
               price:{type:Number},
               quantity:{type:Number},
               _id:{type:mongoose.Schema.Types.ObjectId}
            }
        ],
        qnt: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    invoiceDiscount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
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
