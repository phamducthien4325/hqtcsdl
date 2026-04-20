import ExcelJS from "exceljs";

export async function makeWorkbookBuffer(sheetName, rows) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  if (rows.length > 0) {
    sheet.columns = Object.keys(rows[0]).map((key) => ({
      header: key,
      key
    }));
    rows.forEach((row) => sheet.addRow(row));
  }

  return workbook.xlsx.writeBuffer();
}
