const express = require('express');
const router = express.Router();
const fs = require('fs');
const selectRowsFromInput = require('../utils/xlsxOperations');


router.post('/', (req, res) => {
    try {
        const selectedRows = selectRowsFromInput(req.body.individualRows, req.body.groupedRows);

    
        // Here we can process the selectedRows as needed
        // For now, let's just save it to a JSON file
    
        console.log(selectedRows);
        fs.writeFileSync('./excelData.json', JSON.stringify(selectedRows, null, 2));
        
        res.send('Rows selected successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while selecting rows.');
    }
});

module.exports = router;
