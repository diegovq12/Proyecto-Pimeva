import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// Datos de ejemplo para la tabla
document.addEventListener('DOMContentLoaded', function () {

    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('es-MX', options);

    const data = [
        ['VESSEL', 'LOA', 'OPERATION TIME', 'ETA', 'POB', 'ETB', 'ETC', 'ETD', 'CARGO'],
        ['Vessel 1', 200, '25:00', '01/06 12:00', '', '', '', '', 'Cargo 1'],
        ['Vessel 2', 180, '30:30', '02/06 14:30', '', '', '', '', 'Cargo 2'],
        ['Vessel 3', 150, '15:45', '03/06 09:00', '', '', '', '', 'Cargo 3'],
        ['Vessel 4', 220, '40:00', '04/06 16:45', '', '', '', '', 'Cargo 4'],
        ['Vessel 5', 210, '20:00', '05/06 10:00', '', '', '', '', 'Cargo 5'],
        ['Vessel 6', 190, '18:30', '06/06 08:30', '', '', '', '', 'Cargo 6'],
        ['Vessel 7', 170, '22:15', '07/06 13:15', '', '', '', '', 'Cargo 7'],
        ['Vessel 8', 160, '26:45', '08/06 11:45', '', '', '', '', 'Cargo 8'],
        ['Vessel 9', 180, '14:30', '09/06 09:30', '', '', '', '', 'Cargo 9'],
        ['Vessel 10', 200, '19:00', '10/06 10:00', '', '', '', '', 'Cargo 10']
    ];

    const container = document.getElementById('hot');
    const hot = new Handsontable(container, {
        data: data,
        rowHeaders: true,
        colHeaders: true,
        licenseKey: 'non-commercial-and-evaluation',
        colWidths: [150, 80, 120, 180, 180, 180, 180, 180, 400],
        rowHeights: 35,
        stretchH: 'all',
        className: 'htCenter htMiddle',
        columns: [
            { data: 0, type: 'text' }, // VESSEL
            { data: 1, type: 'numeric', numericFormat: { pattern: { mantissa: 2 } } }, // LOA
            { data: 2, type: 'text' }, // OPERATION TIME (ahora texto para aceptar más de 24 horas)
            { data: 3, type: 'text' }, // ETA (ahora texto para aceptar fecha y hora)
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

        const [totalHours, minutes] = operationTime.split(':').map(Number);

        // POB = ETA + OPERATION TIME
        let eta = hot.getDataAtCell(row, 3);
        if (eta && eta !== 'TBC') {
            const [etaDate, etaTime] = eta.split(' ');
            const [etaDay, etaMonth] = etaDate.split('/').map(Number);
            const [etaHours, etaMinutes] = etaTime.split(':').map(Number);
            let pobDate = new Date(2024, etaMonth - 1, etaDay, etaHours, etaMinutes);
            pobDate.setHours(pobDate.getHours() + totalHours);
            pobDate.setMinutes(pobDate.getMinutes() + minutes);
            hot.setDataAtCell(row, 4, formatDate(pobDate)); // POB

            // ETB = POB + 1 hour
            let etbDate = new Date(pobDate);
            etbDate.setHours(etbDate.getHours() + 1);
            hot.setDataAtCell(row, 5, formatDate(etbDate)); // ETB

            // ETC = ETB + OPERATION TIME
            let etcDate = new Date(etbDate);
            etcDate.setHours(etcDate.getHours() + totalHours);
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
