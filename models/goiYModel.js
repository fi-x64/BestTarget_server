const mongoose = require('mongoose');

const goiYSchema = new mongoose.Schema(
    {
        _id: String,
        hangSX: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        mauSac: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        dungLuong: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        suDungSim: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        boViXuLy: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        ram: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        oCung: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        loaiOCung: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        cardManHinh: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        kichCoManHinh: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        thietBi: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        phuKien: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
        linhKien: [{
            label: {
                type: String
            },
            value: {
                type: Number
            }
        }],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const GoiY = mongoose.model('goiY', goiYSchema);

module.exports = GoiY;