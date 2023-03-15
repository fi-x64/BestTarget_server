const mongoose = require('mongoose');

const goiYSchema = new mongoose.Schema(
    {
        _id: String,
        // hangSX: [{
        //     tenHang: {
        //         type: String
        //     },
        //     danhMucId: {
        //         type: String
        //     }
        // }],
        // mauSac: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // dungLuong: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // suDungSim: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // suDungSim: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // boViXuLy: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // ram: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // loaiOCung: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // cardManHinh: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // kichCoManHinh: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // loaiMayAnh: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // loaiAmThanh: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // loaiThietBiDeo: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // loaiPhuKien: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },
        // loaiLinhKien: {
        //     danhSach: {
        //         type: Array
        //     },
        //     danhMucId: {
        //         type: Array
        //     }
        // },

    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const GoiY = mongoose.model('goiY', goiYSchema);

module.exports = GoiY;