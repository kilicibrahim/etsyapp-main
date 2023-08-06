const XLSX = require('xlsx');

const workbook = XLSX.readFile('./xlsx/Etsy-Tshirts.xlsx');
const firstSheetName = workbook.SheetNames[0];
const json = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

// this could take jsonData as parameter instead of reading from file
const selectRowsFromInput = async (individualRowsInput, groupedRowsInput) => {
    const individualRows = individualRowsInput ? individualRowsInput.split(',').map(Number).filter(row => !isNaN(row)) : [];
    const groupedRows = groupedRowsInput ? groupedRowsInput.split(',').map(group => group.split('-').map(Number)) : [];

    // Use a Set to ensure unique rows
    let uniqueRowsSet = new Set();

    // Add individual rows to the set
    individualRows.forEach(row => {
        uniqueRowsSet.add(row);
    });

    // Add grouped rows to the set
    groupedRows.forEach(group => {
        if (group.length === 2 && !isNaN(group[0]) && !isNaN(group[1])) {
            for (let i = group[0]; i <= group[1]; i++) {
                uniqueRowsSet.add(i);
            }
        }
    });

    // Convert the set back to an array
    const uniqueRowsArray = [...uniqueRowsSet];

    // Use the uniqueRowsArray to slice the JSON data
    return uniqueRowsArray.map(rowIndex => json[rowIndex - 1]);
}

module.exports = selectRowsFromInput;
