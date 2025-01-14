
var React = require('react');
var Mui = require('material-ui');
var Paper = Mui.Paper;
var d3 = require('d3');
var NutellaMixin = require('./NutellaMixin');

var ActivityCard = React.createClass({

    mixins: [NutellaMixin],

    componentDidMount: function() {
        var self= this;
        this._colorSelected = '#00bcd4';
        this._timerDuration = 1500;

        d3.select(this.getDOMNode())
            .on('touchstart', function() {
                self.cardTouchIn.call(self, this);
            })
            .on('mousedown', function() {
                self.cardTouchIn.call(self, this);
            })
            .on('touchend', function() {
                self.cardTouchOut.call(self);
            })
            .on('mouseup', function() {
                self.cardTouchOut.call(self);
            });

    },

    cardTouchIn: function(el) {
        var self = this;

        var cardWidth = this.props.cardStyle['width'];
        var cardHeight = this.props.cardStyle['height'];
        var circleRadius = Math.sqrt(Math.pow(cardWidth, 2) + Math.pow(cardHeight, 2)) / 2;

        var publishAfterTransition = function() {
            var action = function() {
                // #LOG action
                self.logAction('launchActivity', {
                    activity_name: self.props.configName,
                    timer: self.props.timer
                });
                nutella.net.publish('currentConfig/update', +self.props.configId);
            };
            self._timeoutId = setTimeout(action, self._timerDuration);
        };

        var svg = d3.select(el)
            .select('.card-svg')
            .append('svg')
            .style({
                width: cardWidth,
                height: cardHeight
            });

        var stroke = this.state.isSelected ? 'white' : null;

        svg.append('circle')
            .attr({
                cx: cardWidth / 2,
                cy: cardHeight / 2,
                r: '0px'
            })
            .style({
                fill: this._colorSelected,
                stroke: stroke
            })
            .transition()
            .call(publishAfterTransition)
            .duration(self._timerDuration)
            .attr({
                r: circleRadius
            });

    },

    cardTouchOut: function() {
        d3.selectAll('.activity-card')
            .select('.card-svg')
            .select('svg')
            .remove();

        window.clearTimeout(this._timeoutId);
    },

    componentWillReceiveProps: function(newProps) {
        if(+newProps.currentConfigId === +newProps.configId) {
            this.setState({
                isSelected: true
            });
        } else {
            this.setState({
                isSelected: false
            });
        }

    },

    getInitialState: function () {
        return  {
            isSelected: false
        }
    },

    formatTimer: function(ms) {
        var x = ms / 1000;
        var seconds = Math.floor(x % 60);
        x /= 60;
        var minutes = Math.floor(x % 60);
        x /= 60;
        var hours = Math.floor(x % 24);
        x /= 24;
        var days = Math.floor(x);

        var timer;
        timer = seconds + ' sec';
        timer = minutes != 0 ? minutes + " min " + timer : timer;
        timer = hours != 0 ? hours + " hrs " + timer : timer;
        timer = days != 0 ? days + " days " + timer : timer;
        return timer;
    },

    render: function () {

        var selectedCardStyle = {
            backgroundColor: this._colorSelected,
            color: 'white'
        };

        // Copy
        var cardStyle = {};
        for(var p_ in this.props.cardStyle) {
            if(this.props.cardStyle.hasOwnProperty(p_)) {
                cardStyle[p_] = this.props.cardStyle[p_];
            }
        }
        var spanStyle = {};

        var className='activity-card';
        var timer = null;

        // Add properties if selected
        if(this.state.isSelected) {
            className += ' activity-card-selected';
            for(var p in selectedCardStyle) {
                if(selectedCardStyle.hasOwnProperty(p)) {
                    cardStyle[p] = selectedCardStyle[p];
                }
            }
            timer = <span>{this.formatTimer(this.props.timer)}</span>;
            spanStyle = {
                width: this.props.cardStyle.width,
                textAlign: 'center',
                fontWeight: '400',
                fontSize: '2.6em'
            };
        }

        return (

            <Paper className={className} style={cardStyle}  >

                <div className='card-svg'> </div>

                <div className='card-name'>

                    <div className='card-text'>
                        <span style={spanStyle} >{this.props.configName}</span>
                        {timer}
                    </div>

                </div>

            </Paper>);
    }

});

module.exports = ActivityCard;
