import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// Datos de ejemplo para la tabla
document.addEventListener('DOMContentLoaded', function () {

    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('es-MX', options);

    // Cargar datos desde localStorage o usar datos por defecto
    const savedData = localStorage.getItem('tableData');
    const defaultData = [
        ['VESSEL', 'LOA', 'OPERATION TIME', 'ETA', 'POB', 'ETB', 'ETC', 'ETD', 'CARGO'],
        ['Vessel 1', 200, '25:00', '01/06 12:00', '', '', '', '', 'Cargo 1'],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '']
    ];
    const data = savedData ? JSON.parse(savedData) : defaultData;

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
        cells: function (row, col) {
            const cellProperties = {};
            if (row === 0) {
                cellProperties.readOnly = true; // Hacer la primera fila de solo lectura
            }
            return cellProperties;
        },
        afterChange: function (changes, source) {
            if (source === 'loadData') {
                return; // no hacer nada en la carga inicial
            }

            changes.forEach(([row, prop, oldValue, newValue]) => {
                if (prop === 2 || prop === 3) { // OPERATION TIME o ETA
                    if (!newValue || newValue.trim() === '') {
                        clearDependentCells(row);
                    } else {
                        if (isDateCollision(row)) {
                            alert('Error: Las fechas y horas colisionan con otra entrada.');
                            hot.setDataAtCell(row, prop, oldValue); // Revertir el cambio
                        } else {
                            updateDates(row);
                        }
                    }
                }
            });

            // Guardar datos en localStorage después de cualquier cambio
            localStorage.setItem('tableData', JSON.stringify(hot.getData()));
        }
    });

    function updateDates(row) {
        const operationTime = hot.getDataAtCell(row, 2);
        const eta = hot.getDataAtCell(row, 3);

        if (!operationTime || !eta) {
            clearDependentCells(row);
            return;
        }

        if (isDateCollision(row)) {
            return; // No realizar operaciones si hay colisiones
        }

        const [totalHours, minutes] = operationTime.split(':').map(Number);

        // POB = ETA + OPERATION TIME
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

    function clearDependentCells(row) {
        if (row > 0) {
            ['POB', 'ETB', 'ETC', 'ETD'].forEach((col, index) => {
                hot.setDataAtCell(row, index + 4, '');
            });
        }
    }

    function isDateCollision(currentRow) {
        const rows = hot.countRows();
        const columns = [3, 4, 5, 6, 7]; // ETA, POB, ETB, ETC, ETD
        const dates = columns.map(col => hot.getDataAtCell(currentRow, col)).map(parseDate);

        for (let row = 1; row < rows; row++) {
            if (row !== currentRow) {
                const rowDates = columns.map(col => hot.getDataAtCell(row, col)).map(parseDate);
                for (let i = 0; i < dates.length; i++) {
                    if (dates[i] && rowDates[i] && (dates[i].getTime() === rowDates[i].getTime() || dates[i] < rowDates[i])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function parseDate(dateStr) {
        if (!dateStr) return null;
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month] = datePart.split('/').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        return new Date(2024, month - 1, day, hours, minutes);
    }
});
