const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const Admin = require('../models/admin');
const Staff = require('../models/staff');

// Route thêm tài khoản admin mặc định
router.post('/admin/create', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Hash mật khẩu trước khi lưu vào database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo mới admin với email và mật khẩu đã được mã hóa
        const admin = new Admin({
            email,
            password: hashedPassword
        });

        await admin.save();
        res.status(201).json({ message: 'Created Admin successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Route đăng nhập admin
router.post('/admin/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Email or password incorrect' });
        }

        // Kiểm tra mật khẩu hợp lệ
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email or password incorrect' });
        }

        // Kiểm tra email và mật khẩu là 'admin123@gmail.com' và 'admin123'
        if (email === 'admin123@gmail.com' && password === 'admin123') {
            next();
        } else {
            return res.status(401).json({ message: 'No access permission' });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Middleware để kiểm tra quyền admin
const isAdmin = async (req, res, next) => {
    next();
};

// CRUD staff
router.get('/staff', isAdmin, async (req, res) => {
    try {
        const staffs = await Staff.find();
        res.json(staffs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/staff', isAdmin, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        const staff = new Staff({
            _id: mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            address: req.body.address,
            email: req.body.email,
            password: hashedPassword 
        });

        await staff.save();
        res.status(201).json({ message: 'Staff created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/staff/:id', isAdmin, async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Updated staff successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/staff/:id', isAdmin, async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.json({ message: 'Staff deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
