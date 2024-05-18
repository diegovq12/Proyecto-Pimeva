import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

// datos de la tabla
document.addEventListener('DOMContentLoaded', function () {
    const data = [ // datos estaticos
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

// configuracion de la tabla
    const container = document.getElementById('hot');
    const hot = new Handsontable(container, {
        data: data, 
        rowHeaders: true, 
        colHeaders: true, 
        licenseKey: 'non-commercial-and-evaluation', 
        colWidths: [150, 80, 120, 120, 120, 120, 120, 120, 400], // ancho de las columnas
        rowHeights: 35, // alto de las filas
        stretchH: 'all', // estirar las columnas
        className: 'htCenter htMiddle', // centrar el texto
        cells: function (row, col) { // estilos de las celdas
            var cellProperties = {};
            if (row === 0) { // primera fila
                cellProperties.renderer = "html";
                cellProperties.className = 'htCenter htMiddle';
            }
            if (row === 11) { // ultima fila
                cellProperties.renderer = "html";
                cellProperties.className = 'highlight';
            }
            return cellProperties;
        }
    });
});