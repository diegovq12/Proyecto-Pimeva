import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// datos de la tabla
const data = [
    ['', 'Ford', 'Volvo', 'Toyota', 'Honda'],
    ['2019', 10, 11, 12, 13],
    ['2020', 20, 11, 14, 13],
    ['2021', 30, 15, 12, 13],
];

// configuración de la tabla
const container = document.getElementById('app');
const hot = new Handsontable(container, {
    data: data,
    rowHeaders: true,
    colHeaders: true,
    licenseKey: 'non-commercial-and-evaluation',
});