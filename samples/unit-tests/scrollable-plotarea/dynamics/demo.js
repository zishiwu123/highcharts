QUnit.test('Test dynamic behaviour of Scrollable PlotArea', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            scrollablePlotArea: {
                minWidth: 2000,
                scrollPositionX: 1
            },
            inverted: true
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    assert.strictEqual(
        chart.plotWidth,
        chart.plotBox.width,
        '#14448: plotBox.width should equal plotWidth'
    );
    assert.strictEqual(
        chart.plotHeight,
        chart.plotBox.height,
        '#14448: plotBox.height should equal plotHeight'
    );

    chart.setTitle({ text: 'New title' });

    assert.ok(
        chart.fixedRenderer.box.contains(chart.title.element),
        'Title should be outside the scrollable plot area (#11966)'
    );

    chart.update({
        xAxis: {
            lineWidth: 1
        }
    });

    assert.ok(
        chart.fixedRenderer.box.contains(chart.xAxis[0].axisGroup.element),
        'X-axis should be outside the scrollable plot area (#8862)'
    );
});

QUnit.test('Responsive scrollable plot area (#12991)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            scrollablePlotArea: {
                minHeight: 400
            },
            height: 300
        },
        series: [
            {
                data: [0, 1, 2, 3, 4]
            }
        ]
    });

    chart.setSize(null, 500);

    assert.ok(
        document.getElementsByClassName('highcharts-scrolling')[0]
            .clientHeight > 300,
        'The scrollbar should disasppear after increasing the height of the chart (#12991)'
    );

    document.getElementById('container').style.height = "190px";
    chart.reflow();

    document.getElementById('container').style.height = "400px";
    chart.reflow();

    chart.tooltip.refresh(chart.series[0].points[0]);

    assert.notOk(
        chart.tooltip.isHidden,
        `After updating the scrollablePlotArea, the tooltip should be still
        visible, #17352.`
    );
});

QUnit.test(
    'The radial axes like in the gauge series should have the ability to scroll, #14379.',
    function (assert) {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'gauge',
                scrollablePlotArea: {
                    minWidth: 700
                }
            },
            pane: [
                {
                    startAngle: -90,
                    size: '50.0%',
                    center: ['20.0%', '40%'],
                    endAngle: 90
                },
                {
                    startAngle: -90,
                    size: '50.0%',
                    center: ['60.0%', '40%'],
                    endAngle: 90
                }
            ],
            yAxis: [
                {
                    min: 0,
                    max: 200,
                    tickPixelInterval: 50,
                    pane: 0
                },
                {
                    min: 0,
                    max: 200,
                    tickPixelInterval: 50,
                    pane: 1
                }
            ],
            series: [
                {
                    data: [80]
                },
                {
                    data: [90],
                    yAxis: 1
                }
            ]
        });

        assert.notOk(
            chart.yAxis[0].axisGroup.element.parentNode.parentNode.classList
                .contains('highcharts-fixed'),
            'yAxis should not have that class.'
        );
    }
);

QUnit.test('#12517: Reset zoom button', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            scrollablePlotArea: {
                minWidth: 2000
            },
            zoomType: 'x'
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    const controller = new TestController(chart);
    controller.pan([200, 200], [300, 200]);

    const button = chart.resetZoomButton;

    assert.ok(
        button.translateX + button.width < chart.chartWidth,
        'Reset zoom button should be within chart'
    );
});
