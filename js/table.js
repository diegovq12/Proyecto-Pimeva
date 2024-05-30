import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// Datos de ejemplo para la tabla
document.addEventListener('DOMContentLoaded', function () {
    const data = [
        ['VESSEL', 'LOA', 'OPERATION TIME', 'ETA', 'POB', 'ETB', 'ETC', 'ETD', 'CARGO'],
        ['Vessel 1', 200, '08:00', '01/06', '', '', '', '', 'Cargo 1'],
        ['Vessel 2', 180, '06:00', '02/06', '', '', '', '', 'Cargo 2'],
        ['Vessel 3', 150, '10:00', '03/06', '', '', '', '', 'Cargo 3'],
        ['Vessel 4', 220, '12:00', '04/06', '', '', '', '', 'Cargo 4']
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
            { data: 3, type: 'date', dateFormat: 'DD/MM', correctFormat: true }, // ETA
            { data: 4, type: 'text', readOnly: true }, // POB
            { data: 5, type: 'text', readOnly: true }, // ETB
            { data: 6, type: 'text', readOnly: true }, // ETC
            { data: 7, type: 'text', readOnly: true }, // ETD
            { data: 8, type: 'text' } // CARGO
        ],
        afterChange: function (changes, source) {
            if (source === 'loadData') {
                return; // don't do anything on initial load
            }

            changes.forEach(([row, prop, oldValue, newValue]) => {
                if (prop === 2 || prop === 3) { // OPERATION TIME or ETA
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

        // POB = ETA + OPERATION TIME
        let eta = hot.getDataAtCell(row, 3);
        if (eta && eta !== 'TBC') {
            const [etaDay, etaMonth] = eta.split('/').map(Number);
            let pobDate = new Date(2024, etaMonth - 1, etaDay);
            pobDate.setHours(pobDate.getHours() + hours);
            pobDate.setMinutes(pobDate.getMinutes() + minutes);
            hot.setDataAtCell(row, 4, formatDate(pobDate)); // POB

            // ETB = POB + 1 hour
            let etbDate = new Date(pobDate);
            etbDate.setHours(etbDate.getHours() + 1);
            hot.setDataAtCell(row, 5, formatDate(etbDate)); // ETB

            // ETC = ETB + OPERATION TIME
            let etcDate = new Date(etbDate);
            etcDate.setHours(etcDate.getHours() + hours);
            etcDate.setMinutes(etcDate.getMinutes() + minutes);
            hot.setDataAtCell(row, 6, formatDate(etcDate)); // ETC

            // ETD = ETC + 1 hour
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
});
