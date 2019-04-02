import fecha from './fecha.min.js'
function BmDatePicker() {
    var _opts = {}
    var _oneDayTs = 86400000
    var _selectedDay = []
    var _weeksArr = []
    var _pattern = 'YYYY-MM-DD'
    var generateContent = function () {
        var html = generateWeek(_opts.weeks) + _weeksArr.map(function(weeks) {
            return generateMonth(weeks, fecha.format(weeks[0], 'YYYY年M月'))
        }).join('')
        document.getElementById(_opts.container).innerHTML = '<div class="bmdp">' + html + '</div>'
    }
    var generateTips = function () {
        var left1 = '<div class="tip-left"><div class="tip-ok"></div><div class="tip-text-item">出勤</div><div class="tip-rest"></div><div class="tip-text-item">休息</div><div class="tip-leave"></div><div class="tip-text-item">请假</div></div>'
        var right1 = '<div class="tip-right"><div class="tip-selected"></div><span class="tip-text">选中</span></div>'
        var left2 = '<div class="tip-left">[已有出勤计划不可选中]</div>'
        var right2 = '<div class="tip-right">[可多选]</div>'
        
        return '<div class="bottom">'
            + '<div class="tips">' + left1 + right1 + '</div>'
            + '<div class="tips">' + left2 + right2 + '</div>'
            + '</div>'
    }

    var generateWeek = function (weeks) {
        var weekStart = '<table class="bmdp__week"><tr class="bmdp__week-row">'
        var weekEnd = '</tr></table>'
        var weekContent = weeks.map(function (week) {
            return '<td class="bmdp__week-cell">' + week + '</td>'
        }).join('')
        return weekStart + weekContent + weekEnd
    }
    var generateMonth = function (items, title) {
        return '<div class="bmdp__month">'
            + (title ? ('<div class="bmdp__month-title">' + title + '</div>') : '')
            + '<table class="bmdp__month-content">'
            + supplyMonthDayItems(items).map(function (item) {
                return '<tr class="bmdp__month-row">' +
                    generateMonthRowWeek(item) +
                    '</tr>'
            }).join('')
            + '</table></div>'
    }
    var generateMonthRowWeek = function (row) {
        return row.map(function (sitem) {
            return '<td class="bmdp__month-cell">' + generateCell(sitem) + '</td>'
        }).join('')
    }
    var generateCell = function(item) {
        if (!item) {
            return ''
        }
        var formatStr = fecha.format(item, _pattern)
        var clz = ['bmdp__month-day']
        var mark = ''
        if (_opts.okList.indexOf(formatStr) > -1) {
            mark += '<div class="bmdp__mark--ok"></div>'
            if (_opts.disableOk) {
                clz.push('bmdp__month-day--disabled')
            }
        }
        if (_opts.leaveList.indexOf(formatStr) > -1) {
            mark += '<div class="bmdp__mark--leave"></div>'
            if (_opts.disableOk) {
                clz.push('bmdp__month-day--disabled')
            }
        }
        if (_opts.restList.indexOf(formatStr) > -1) {
            mark += '<div class="bmdp__mark--rest"></div>'
            if (_opts.disableOk) {
                clz.push('bmdp__month-day--disabled')
            }
        }
        mark = '<div class="bmdp__marks">' + mark + '</div>'
        if (_selectedDay.indexOf(formatStr) > -1) {
            clz.push('bmdp__month-day--selected')
        }
        clz = uniqueArray(clz)
        return '<span class="' + clz.join(' ') + '" data-date="'+ formatStr +'">' + item.getDate() + '</span>' + mark
    }
    var uniqueArray = function (array) {
        var result = []
        array.forEach(function (item) {
            if (result.indexOf(item) === -1) {
                result.push(item)
            }
        })
        return result
    }
    var supplyMonthDayItems = function (items) {
        if (!items || items.length === 0) {
            return []
        }
        var startBlankLength = 0
        var endBlankLength = 0
        var startItemDay = items[0].getDay()
        var endItemDay = items[items.length - 1].getDay()
        if (startItemDay === 0) {
            startBlankLength = 6
        } else {
            startBlankLength = startItemDay - 1
        }
        if (endItemDay > 0) {
            endBlankLength = 7 - endItemDay
        }

        var temp = [].concat(items)
        for (var i = 0; i < startBlankLength; i++) {
            temp.unshift(null)
        }
        for (var i = 0; i < endBlankLength; i++) {
            temp.push(null)
        }
        return temp.reduce(function (prev, curr, index) {
            var last = prev[prev.length - 1]
            if (!last || last.length % 7 === 0) {
                last = []
                prev.push(last)
            }
            last.push(curr)
            return prev
        }, [])
    }
    var initMonthItem = function () {
        var start = fecha.parse(_opts.start, _pattern)
        var end = fecha.parse(_opts.end, _pattern)
        var temp = []
        if (start.getTime() > end.getTime()) {
            return temp
        }
        var fixedStart = fecha.parse(fecha.format(start, _pattern), _pattern)
        var fixedEnd = fecha.parse(fecha.format(end, _pattern), _pattern)
        var days = (fixedEnd - fixedStart) / _oneDayTs
        for(var i = 0; i <= days; i++) {
            var currentDay = new Date((_oneDayTs * i) + fixedStart.getTime())
            var last = temp[temp.length - 1]
            if (!last || last[last.length - 1].getMonth() !== currentDay.getMonth()) {
                last = []
                temp.push(last)
            }
            last.push(currentDay)
        }
        _weeksArr = temp
    }
    var bindCellEvent = function() {
        $('#' + _opts.container).on('click', '.bmdp__month-day', function (event) {
            if ($(event.target).hasClass('bmdp__month-day--disabled')) return
            var targetDate = event.target.dataset.date
            if (targetDate) {
                var targetIndex = _selectedDay.indexOf(targetDate)
                if (_opts.multiSelectMode) {
                    if (targetIndex === -1) {
                        _selectedDay.push(targetDate)
                        $(event.target).addClass('bmdp__month-day--selected')
                    } else {
                        _selectedDay.splice(targetIndex, 1)
                        $(event.target).removeClass('bmdp__month-day--selected')
                    }
                    emitChange()
                } else {
                    if (targetIndex === -1) {
                        _selectedDay = [targetDate]
                        $('#' + _opts.container + ' .bmdp__month-day').removeClass('bmdp__month-day--selected')
                        $(event.target).addClass('bmdp__month-day--selected')
                        emitChange()
                    }
                }
            }
        });
    }
    var emitChange = function () {
        if (_opts.onChange) {
            _opts.onChange(_selectedDay)
        }
    }
    var updateView = function (options) {
        if (!options) return
        _opts.start = options.start || _opts.start
        _opts.end =  options.end || _opts.end
        initMonthItem()
        generateContent()
    }
    var init = function (options) {
        var defaultOptions = {
            weeks: ['一', '二', '三', '四', '五', '六', '日'],
            okList: [],
            restList: [],
            leaveList:[]
        }
        _selectedDay = options.selected || []
        _opts = $.extend({}, defaultOptions, options)
        bindCellEvent()
        initMonthItem()
        generateContent()
    }
    var clear = function () {
        _selectedDay = []
        $('#' + _opts.container + ' .bmdp__month-day').removeClass('bmdp__month-day--selected')
    }
    return {
        init: init,
        updateView: updateView,
        clear: clear
    }
}

export {BmDatePicker}