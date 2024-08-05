$(document).ready(function() {
    // $('.dashboard > .row').each(function(index) {
    //     $(this).delay(index * 500).animate({opacity: 1}, 2000);
    // });

    // $('.advertisement .cards .card').on('click', function(event) {
    //     const expHeading = $(event.currentTarget).find('.experience-heading').text();
    //     const $cards = $('.advertisement .cards');
    //     const $spinner = $('#spinner-cube');
    //     let bgColor = undefined;
        
    //     $spinner.css('display', 'block');

    //     $('.user-persona-container').addClass(cssClassExpSelected);
    //     $cards.addClass(cssClassExpSelected);

    //     $cards.children().each(function() {
    //         $(this).removeClass('rise-bubble');
    //         if ($(this).find('.experience-heading').text() === expHeading) {
    //             $(this).addClass('selected').removeClass('unselected');
    //             bgColor = $(this).css('background');
    //             $('.cube-face').css('background', bgColor);
    //             showContent(expHeading);
    //         } else {
    //             $(this).addClass('unselected').removeClass('selected');
    //         }
    //     });

    //     hideSpinner($spinner);
    // });
});

function hideSpinner($spinner) {
    setTimeout(() => {
        $spinner.css('display', 'none');
    }, 2500);
}

function waitForTheSpinner(callBack) {
    setTimeout(() => {
        callBack();
    }, 2500);
}

function showContent(selectedExp) {
    waitForTheSpinner(() => {
        const $contentSection = $('.content-section');
        const $body = $('body');
        const $residentSentimentSteps = $('#res-sent-step-container');
        if(selectedExp == 'Resident Sentiment') {
            $contentSection.css('display', 'block');
            $residentSentimentSteps.css('display', 'block');
            setTimeout(() => {
                $('.res-sent-step-stages #step1').removeClass('animate__animated animate__fadeInUp animate__slow');
                $('.res-sent-step-container').addClass('animate__animated animate__slower animate__rollOut');
                setTimeout(() => {
                    $residentSentimentSteps.hide();
                    $body.css('overflow', 'auto');
                    $('.dashboard').show();
                    $('.dashboard').addClass('animate__animated animate__slow animate__rollIn');
                    resetDashboard();
                    setTimeout(() => {
                        initializeDashboard();
                    }, 1000);
                }, 2000);
            }, 4000);
        }
    });
}

function resetDashboard() {
    // Reset chart
    if ($('#sentimentChart').highcharts()) {
        $('#sentimentChart').highcharts().destroy();
    }

    // Reset gauge
    $('#scoreGauge').empty();

    // Reset venue scores
    $('.venue-scores').empty();

    // Reset metrics
    $('.metrics .metric').each(function() {
        $(this).empty();
    });

    // Reset opacities
    $('.dashboard > .row > [class*="col-"]').css('opacity', 0);
}

const themeColors = {
    themePrimary: '#007bff',
    themeSecondary: '#6c757d',
    themeSuccess: '#28a745',
    themeInfo: '#17a2b8',
    themeWarning: '#ffc107',
    themeDanger: '#dc3545',
    themeLight: '#f8f9fa',
    themeDark: '#343a40',
    themePhx3ColorDarkOrange: '#FF4560',
    themePhx3ColorLight: '#FFD1D9'
};

const jsonResponse = {
"Scores": [
      {"ResponseDate": "2024-01-31", "AxisLabel": "Jan-24", "Score": 75},
      {"ResponseDate": "2024-02-29", "AxisLabel": "Feb-24", "Score": 25, "ActionItem": {"Action": "Interactive cooking classes for residents every week"}},
      {"ResponseDate": "2024-03-31", "AxisLabel": "Mar-24", "Score": 55, "ActionItem": {"Action": "Guest chef (seafood specialist) brought in"}},
      {"ResponseDate": "2024-04-30", "AxisLabel": "Apr-24", "Score": 73, "ActionItem": {"Action": "Re-decorated interiors to medieval theme"}},
      {"ResponseDate": "2024-05-31", "AxisLabel": "May-24", "Score": 47, "ActionItem": {"Action": "Weekly menu revamp. <br/> Changed vendor for beef supply."}},
      {"ResponseDate": "2024-06-30", "AxisLabel": "Jun-24", "Score": 33}
  ]
};

function getSentimentScoreHighchartsOptions(scores)
{
    const sentimentScoreHighchartsOptions = {
        chart: {
            type: 'areaspline',
            zoomType: 'x',
        },
        title: {
            text: 'Sentiment Score',
        },
        legend: {
          enabled: false
        },
        xAxis: {
          title: {
            text: undefined
          },
          startOnTick: true,
          endOnTick: true
        },
        yAxis: {
            title: {
                text: undefined
            },
            min:0,
            max:100,
            plotLines: [{
              value: 65,
              color: themeColors.themePhx3ColorLight,
              width: 1.5,
              dashStyle: 'Dash',
              label: {
                text: 'Benchmark',
                align: 'right',
                verticalAlign: 'top', // Position the label on top of the plot line
                style: {
                  fontWeight: 'bold',
                  color: themeColors.themePhx3ColorDarkOrange,
                }
              },
              zIndex: 5 // Ensure the plot line appears above the chart
            }]
        },
        tooltip: {
          positioner: function (labelWidth, labelHeight, point) {
            const chart = this.chart;
            let x = point.plotX + chart.plotLeft + 10;
            let y = point.plotY + chart.plotTop - labelHeight / 2;
      
            // Prevent the tooltip from going outside the plot area
            if (x + labelWidth > chart.plotLeft + chart.plotWidth) {
              x = point.plotX + chart.plotLeft - labelWidth - 10;
            }
      
            if (y < chart.plotTop) {
              y = chart.plotTop;
            } else if (y + labelHeight > chart.plotTop + chart.plotHeight) {
              y = chart.plotTop + chart.plotHeight - labelHeight;
            }
      
            return { x, y };
          },
          style: {
            pointerEvents: 'none' // Prevent interactions with the tooltip
          },
          formatter: function () {
            // const dateStr = typeof this.x === 'number' ? Highcharts.dateFormat('%e %b %Y', this.x) : '';
            return `<b>${this.x}</b><br/>Sentiment Score: ${this.y}`;
          }
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [
          {
            name: 'Sentiment Score',
            marker: {
              enabled: true
            },
            color: themeColors.themePrimary,
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, themeColors.themePrimary],
                [1, '#ffffff']
              ]
            },
            pointPlacement: 'on' // Ensure points are placed on the ticks
          }
        ],
        credits: {enabled: false}
    };

    const processedData = scores.map((score, i, array) => {
      let nextItem = array[i + 1];
      const nextScore = nextItem ? nextItem.Score : score.Score;
      let marker = {};
      if (score.ActionItem) {
        marker = {
          symbol: nextScore > score.Score ? 'triangle' : 'triangle-down',
          fillColor: '#fff',
          lineColor: nextScore > score.Score ? '#719b59' : '#FF4560',
          lineWidth: 2, // Marker border width
          radius: 5
        };
      }
      return { 
        x: i, 
        y: score.Score,
        marker: marker,
        dataLabels: {
          enabled: false,
        }
      };
    });
  
    const annotations = scores.map((item, i, array) => {
      if (!item.ActionItem) return null;
      let nextItem = array[i + 1];
      const nextScore = nextItem ? nextItem.Score : item.Score;
      return {
        point: {
          x: i,
          y: item.Score,
          xAxis: 0,
          yAxis: 0
        },
        text: item.ActionItem?.Action,
        backgroundColor: nextScore > item.Score ? '#719b59' : '#FF4560',
        borderColor: 'unset',
        borderRadius: 3,
        borderWidth: 1,
        style: {
          color: '#fff',
          fontSize: '12px',
          padding: '8px',
          fontWeight: 'bold'
        }
      };
    }).filter(annotation => annotation !== null);
  
    const options = {
      ...sentimentScoreHighchartsOptions,
      xAxis: {
        ...sentimentScoreHighchartsOptions.xAxis,
        categories: scores.map(d => d.AxisLabel),
        labels: {
          step: 1,
        },
        tickInterval: 1,
        tickPositioner: function() {
          const positions = [];
          for (let i = 0; i < this.categories.length; i++) {
            positions.push(i);
          }
          return positions;
        },
      },
      annotations: [{
        draggable: '',
        labels: annotations
      }],
      series: [
        {
          ...sentimentScoreHighchartsOptions.series[0],
          data: processedData
        }
      ]
    };
    
    return options;
  }

function initializeDashboard() {
    // Sentiment Chart
    Highcharts.chart('sentimentChart', getSentimentScoreHighchartsOptions(jsonResponse.Scores));

    // Animate dashboard components
    // $('.dashboard > .row > [class*="col-"]').each(function(index) {
    //     setTimeout(() => {
    //         $(this).addClass('show');
    //         if ($(this).find('#scoreGauge').length) {
    //             createGauge(51);
    //         }
    //         if ($(this).find('.venue-scores').length) {
    //             initializeVenueScores();
    //         }
    //         if ($(this).find('.metrics').length) {
    //             initializeMetrics();
    //         }
    //     }, index * 500);
    // });

    console.log($('.dashboard > .row'));

    console.log($('.dashboard > .row [class*="col-"]'));
    console.log($('.dashboard > .row > [class*="col-"]'));

    $('.dashboard .row > [class*="col-"]').each(function(index) {
        $(this).delay(index * 1500).animate({opacity: 1}, 2000, function() {
            if ($(this).find('#scoreGauge').length) {
                createGaugeChart(51);
            }
            if ($(this).find('.venue-scores').length) {
                initializeVenueScores();
            }
            if ($(this).find('.metrics').length) {
              $('html, body').animate({
                scrollTop: $('.metrics').offset().top
            }, 'smooth');
            setTimeout(() => {
              initializeMetrics();
            }, 1000);
            }
        });
    });
}

function createGaugeChart(score) {
    var options = {
        series: [score],
        chart: {
            height: 250,
            type: 'radialBar',
            offsetY: -10
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                },
                track: {
                    background: '#e7e7e7',
                    strokeWidth: '67%',
                    margin: 0,
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        formatter: function(val) {
                            return parseInt(val) + '%';
                        },
                        color: '#111',
                        fontSize: '36px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                type: 'horizontal',
                shadeIntensity: 0.5,
                gradientToColors: ['#FF69B4'],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        stroke: {
            lineCap: 'round'
        },
        labels: ['Overall Score'],
    };

    var chart = new ApexCharts(document.querySelector("#gauge-chart"), options);
    chart.render();
}

function polarToCartesian(centerX, centerY, radius, angleInRadians) {
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function createGauge(score) {
    var opts = {
        angle: 0.15,
        lineWidth: 0.44,
        radiusScale: 1,
        pointer: {
            length: 0.6,
            strokeWidth: 0.035,
            color: '#000000'
        },
        limitMax: false,
        limitMin: false,
        colorStart: '#FF69B4',  // Pink color
        colorStop: '#FF69B4',   // Pink color
        strokeColor: '#E0E0E0',
        generateGradient: true,
        highDpiSupport: true,
        percentColors: [[0.0, "#FF69B4"], [1.0, "#FF69B4"]],
        staticLabels: {
            font: "10px sans-serif",
            labels: [0, 20, 40, 60, 80, 100],
            color: "#000000",
            fractionDigits: 0
        },
    };
    var target = document.getElementById('gauge-chart');
    var gauge = new Gauge(target).setOptions(opts);
    gauge.maxValue = 100;
    gauge.setMinValue(0);
    gauge.animationSpeed = 32;
    gauge.set(score);

    // Add percentage text in the center
    var percentText = document.createElement('div');
    percentText.style.position = 'absolute';
    percentText.style.top = '50%';
    percentText.style.left = '50%';
    percentText.style.transform = 'translate(-50%, -50%)';
    percentText.style.fontSize = '24px';
    percentText.style.fontWeight = 'bold';
    percentText.textContent = score + '%';
    target.parentNode.appendChild(percentText);
}

function initializeVenueScores() {
    const venues = [
        { name: 'Blissful Bites Bistro', score: 20 },
        { name: 'Serenity Café', score: 75 },
        { name: 'Sunny Meadows Dining Room', score: 58 }
    ];

    venues.forEach(venue => {
        $('.venue-scores').append(`
            <div class="venue-score">
                <span class="venue-name">${venue.name}</span>
                <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: 0%; background-color: ${getColor(venue.score)}" aria-valuenow="${venue.score}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <span class="venue-value">${venue.score}%</span>
            </div>
        `);
    });

    // Animate progress bars
    setTimeout(() => {
        $('.progress-bar').each(function() {
            $(this).css('width', $(this).attr('aria-valuenow') + '%');
        });
    }, 500);
}

function initializeMetrics() {
    const metrics = [
        { id: 'foodMetric', score: 65, name: 'Food', color: '#0d8aee' },
        { id: 'serviceMetric', score: 55, name: 'Service', color: '#fd3995' },
        { id: 'envMetric', score: 42, name: 'Env', color: '#1dc9b7' },
        { id: 'brandMetric', score: 30, name: 'Restaura Brand', color: '#eaa432' }
    ];

    // <div class="sparklines d-inline-flex" sparktype="line" sparkheight="30" sparkwidth="70" sparklinecolor="#886ab5" sparkfillcolor="false" sparklinewidth="1" values="5,6,5,3,8,6,9,7,4,2"></div>

    metrics.forEach((metric, idx) => {
        $(`#${metric.id}`).html(`
            <div class="metric-score-wrapper">
              <div class="js-easy-pie-chart color-primary-300 position-relative d-inline-flex align-items-center justify-content-center" data-percent="75" data-piesize="50" data-linewidth="5" data-linecap="butt" data-scalelength="0" style="color:${metric.color}">
                  <div class="d-flex flex-column align-items-center justify-content-center position-absolute pos-left pos-right pos-top pos-bottom fw-300 fs-lg">
                      <span class="js-percent d-block text-dark"></span>
                  </div>
              </div>
              <div class="metric-name">${metric.name}
                <i class="fa ml-1 fa-caret-up" style="color:${metric.color}"></i>
              </div>
            </div>
            <div class="metric-sparkline-wrapper">
              <div class="js-sparklines" style="color:${metric.color}"></div>
            </div>
        `);
    });

    $('.js-sparklines').each(function() {
      let $this = $(this);
      let obj = {
        type: 'line',
        lineColor: $this.css('color') || themeColors.themePrimary,
        height: 30,
        width: 70,
        fillColor: false,
      };
      $this.sparkline(
        [3, 4, 3, 6, 7, 3, 3, 6, 2, 6, 4],
        obj
      );
    });
    
    $('.js-easy-pie-chart').each(function() {
      let $this = $(this),
        barcolor = $this.css('color') || themeColors.themePrimary,
        trackcolor = $this.data('trackcolor') || 'rgba(0,0,0,0.04)',
        size = parseInt($this.data('piesize')) || 50,
        scalecolor =   $this.data('scalecolor') || $this.css('color'),
        scalelength = parseInt($this.data('scalelength')) || 0,
        linewidth = parseInt($this.data('linewidth')) ||  parseInt(size / 8.5),
        linecap = $this.data('linecap') || 'butt'; //butt, round and square.
        
      $this.easyPieChart({
        size : size,
        barColor : barcolor,
        trackColor : trackcolor,
        scaleColor: scalecolor,
        scaleLength: scalelength, //Length of the scale lines (reduces the radius of the chart).
        lineCap : linecap, //Defines how the ending of the bar line looks like. Possible values are: butt, round and square.
        lineWidth : linewidth,
        animate: {
          duration: 1500,
          enabled: true
        },
        onStep: function(from, to, percent) {
          $(this.el).find('.js-percent').text(Math.round(percent));
        }
      });
  
      $this = null;
    });
}

function getColor(score) {
    if (score < 33) return '#DF5353';
    if (score < 66) return '#DDDF0D';
    return '#55BF3B';
}