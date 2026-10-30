const uploadProductImage = (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image"
            });
        }

        const imagePath = `/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: "Product image uploaded successfully",
            image: imagePath
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = { uploadProductImage };
