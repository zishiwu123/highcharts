import '../../../../code/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import GoogleDataStore from '../../../../code/es-modules/Data/Stores/GoogleDataStore.js';
import GroupDataModifier from '../../../../code/es-modules/Data/Modifiers/GroupDataModifier.js';

import ChainDataModifier from '../../../../code/es-modules/Data/Modifiers/ChainDataModifier.js';
import RangeDataModifier from '../../../../code/es-modules/Data/Modifiers/RangeDataModifier.js';

import DataSeriesConverter from '../../../../code/es-modules/Data/DataSeriesConverter.js';

let dataSeriesConverter;

const chart = Highcharts.chart('container', { });
const store = new GoogleDataStore(undefined, {
    googleSpreadsheetKey: '14632VxDAT-TAL06ICnoLsV_JyvjEBXdVY-J34br5iXY',
    // startColumn: 1,
    // endColumn: 8,
    // startRow: 0,
    // endRow: 52
});

const modifierChain = new ChainDataModifier();
const groupModifier = new GroupDataModifier({ groupColumn: 'Margin  (Trump)' });
const rangeModifier = new RangeDataModifier({ ranges: [{ column: 1, maxValue: 0, minValue: -100 }] })

modifierChain.add(groupModifier);
modifierChain.add(rangeModifier);

store.on('load', e => console.log('load', e));

const modiferToUse = modifierChain;

store.on('afterLoad', e => {
    // Write the unmodified margins
    document.getElementById('datastore-before')
        .innerHTML = e.table.getAllRows().map(row => row.getColumn('Margin  (Trump)')).join('\n');

    // Do the modification
    console.log('modi', modiferToUse.execute(e.table));

    // convert data to series
    dataSeriesConverter = new DataSeriesConverter(e.table, { type: 'line' });

    chart.update({
        series: dataSeriesConverter.getAllSeriesData()
    }, true, true, true);
});

modiferToUse.on('afterExecute', e => {
    // Write the modified margins
    document.getElementById('datastore-after')
        .innerHTML = e.table.getAllRows().map(row => {
            //console.log(row)
            return row.getColumn(1)
        }).join('\n');
});

store.on('loadError', e => console.log(e));

store.load();