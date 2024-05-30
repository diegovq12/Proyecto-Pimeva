import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// Datos de la tabla
document.addEventListener('DOMContentLoaded', function () {
    const data = [
        ['VESSEL', 'LOA', 'OPERATION TIME', 'ETA', 'POB', 'ETB', 'ETC', 'ETD', 'CARGO'],
        ['SEA HAWK', 181.64, '17:00', '15/05 06:00', '15/05 06:36', '15/05 07:48', '16/05 00:48', '16/05 01:48', 'DISCH. 557 STEEL COILS | 2,714.838 MTS'],
        ['OCEAN AMITIE', 180, '48:00', '15/05 19:00', '15/05 02:48', '16/05 03:48', '18/05 03:48', '18/05 04:48', 'DISCH. 5.885 MT ALUMINIUM INGOTS'],
        ['INLACO HARMONY', 176.83, '14:00', '16/05 08:00', 'TBC', 'TBC', '18/05 06:48', '18/05 21:48', 'DISCH. 302 COILS | 2,132 MTS'],
        ['NEW NOBLE', 180, '06:00', '17/05 23:00', 'TBC', 'TBC', 'TBC', 'TBC', 'DISCH. 1714 MT STEEL PRODUCTS'],
        ['ALASKA', 182.87, '15:00', '19/05 07:00', 'TBC', 'TBC', 'TBC', 'TBC', 'DISCH. 631 COILS | 6,514.451 MTS'],
        ['CHIPOLBROK STAR', 199.99, '24:00', '19/05 23:00', 'TBC', 'TBC', 'TBC', 'TBC', 'DISCH. 10 YACHT LOAD. 3 YACHT'],
        ['BBC CAMPANA', 138.5, 'TBC', '24/05 00:00', 'TBC', 'TBC', 'TBC', 'TBC', 'DISCH. 4 YACHT LOAD. 2 YACHT'],
        ['AAL GIBRALTAR', 159.99, 'TBC', '28/05 00:00', 'TBC', 'TBC', 'TBC', 'TBC', 'YACHT OPERATION'],
        ['L DA SHUN', 189.99, 'TBC', '28/05 20:00', 'TBC', 'TBC', 'TBC', 'TBC', 'DISCH. 3,762.228 MT STEEL PRODUCTS'],
        ['MAR DE CALIFORNIA', 134.98, '48:00', '30/05 00:00', 'TBC', 'TBC', 'TBC', 'TBC', 'DISCH. 10,000 MT GYPSUM'],
        ['BBC NORFOLK', 132, 'TBC', '02/04 00:00', 'TBC', 'TBC', 'TBC', 'TBC', 'SUBMARINE CABLE | CONT. SOCK 32,000 TM']
    ];

    const container = document.getElementById('hot');
    const hot = new Handsontable(container, {
        data: data,
        rowHeaders: true,
        colHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: [150, 80, 120, 120, 120, 120, 120, 120, 400],
        rowHeights: 35,
        stretchH: 'all',
        className: 'htCenter htMiddle',
        columns: [
            { data: 0, type: 'text' }, // VESSEL
            { data: 1, type: 'numeric', numericFormat: { pattern: { mantissa: 2 } } }, // LOA
            { data: 2, type: 'time', timeFormat: 'HH:mm', correctFormat: true }, // OPERATION TIME
            { data: 3, type: 'text', readOnly: true }, // ETA
            { data: 4, type: 'text', readOnly: true }, // POB
            { data: 5, type: 'text', readOnly: true }, // ETB
            { data: 6, type: 'text', readOnly: true }, // ETC
            { data: 7, type: 'text', readOnly: true }, // ETD
            { data: 8, type: 'text' } // CARGO
        ],
        cells: function (row, col) {
            const cellProperties = {};
            if (row === 0) {
                cellProperties.readOnly = true; // Hacer la primera fila no editable
            }
            return cellProperties;
        },
        afterChange: function (changes, source) {
            if (source === 'loadData') {
                return; // No hacer nada en la carga inicial
            }
            changes.forEach(([row, prop, oldValue, newValue]) => {
                if (prop === 2) { // OPERATION TIME
                    updateDates(row);
                }
            });
        }
    });

    function updateDates(row) {
        const operationTime = hot.getDataAtCell(row, 2);
        if (!operationTime) {
            return;
        }

        const [hours, minutes] = operationTime.split(':').map(Number);
        const operationDate = new Date(0, 0, 0, hours, minutes);

        let eta = hot.getDataAtCell(row, 3);
        if (eta && eta !== 'TBC') {
            const [etaDate, etaTime] = eta.split(' ');
            const [etaDay, etaMonth] = etaDate.split('/').map(Number);
            const [etaHours, etaMinutes] = etaTime.split(':').map(Number);
            let pobDate = new Date(2024, etaMonth - 1, etaDay, etaHours, etaMinutes);
            pobDate.setHours(pobDate.getHours() + hours);
            pobDate.setMinutes(pobDate.getMinutes() + minutes);
            hot.setDataAtCell(row, 4, formatDate(pobDate)); // POB

            let etbDate = new Date(pobDate);
            etbDate.setHours(etbDate.getHours() + 1);
            hot.setDataAtCell(row, 5, formatDate(etbDate)); // ETB

            let etcDate = new Date(etbDate);
            etcDate.setHours(etcDate.getHours() + hours);
            etcDate.setMinutes(etcDate.getMinutes() + minutes);
            hot.setDataAtCell(row, 6, formatDate(etcDate)); // ETC

            let etdDate = new Date(etcDate);
            etdDate.setHours(etdDate.getHours() + 1);
            hot.setDataAtCell(row, 7, formatDate(etdDate)); // ETD
        }
    }

    function formatDate(date) {
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        return `${day}/${month} ${hours}:${minutes}`;
    }

    // Añadir botón para agregar columnas
    const addColumnButton = document.createElement('button');
    addColumnButton.innerText = 'Add Column';
    addColumnButton.style.margin = '10px';
    document.body.appendChild(addColumnButton);

    addColumnButton.addEventListener('click', () => {
        hot.alter('insert_col', hot.countCols());
    });
});
