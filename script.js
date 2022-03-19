document.addEventListener('DOMContentLoaded', () =>{

    const addLead = document.querySelector('.add-lead')	
    const services = document.querySelector('.services')

    // список свободного времение бронирования
    const freeTimeBookingList = document.querySelector('.free-time-booking__list')

    // список рабочего времене и времени возможного бронирования
    const monthTimeInfoList = {
        april: {
            monthId : 04,
            monthWorkDayStart : 08,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },

        may: {
            monthId : 05,
            monthWorkDayStart : 04,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },

        june: {
            monthId : 06,
            monthWorkDayStart : 6.30,
            monthWorkDayEnd : 20.30,
            monthStartTimeNotWork : 11.30,
            monthEndTimeNotWork : 16
        }, 

        july: {
            monthId : 07,
            monthWorkDayStart : 08,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },

        august: {
            monthId : 08,
            monthWorkDayStart : 08,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },

        september: {
            monthId : 09,
            monthWorkDayStart : 08,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },

        october: {
            monthId : 10,
            monthWorkDayStart : 08,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },

        november: {
            monthId : 11,
            monthWorkDayStart : 08,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },

        december: {
            monthId : 12,
            monthWorkDayStart : 08,
            monthWorkDayEnd : 20,
            monthStartTimeNotWork : 12,
            monthEndTimeNotWork : 16
        },
    }

    // информация по броне
    const bookingInfoList = {
        idRecurses : null,
        dataCheckBooking : null,
        monthNumber : null,
    }

    const basket = {
        chipName: null,
        dataBooking: null,
        timeBooking: null,
        prise: null,
    }
    
    class Calendar {

        constructor() {
          this.monthDiv = document.querySelector('.cal-month__current');
          this.headDivs = document.querySelectorAll('.cal-head__day');
          this.bodyDivs = document.querySelectorAll('.cal-body__day');
          this.nextDiv = document.querySelector('.cal-month__next');
          this.prevDiv = document.querySelector('.cal-month__previous');
        }
      
        init() {
          moment.locale(window.navigator.userLanguage || window.navigator.language);
      
          this.month = moment();
          this.today = this.selected = this.month.clone();
          this.weekDays = moment.weekdaysShort(true);
      
          this.headDivs.forEach((day, index) => {
            day.innerText = this.weekDays[index];
          });
      
          this.nextDiv.addEventListener('click', _ => {this.addMonth();});
          this.prevDiv.addEventListener('click', _ => {this.removeMonth();});
      
          this.bodyDivs.forEach(day => {
            day.addEventListener('click', e => {
                const date = +e.target.innerHTML < 10 ? `0${e.target.innerHTML}` : e.target.innerHTML;
                bookingInfoList.dataCheckBooking  = `${this.month.format('YYYY-MM')}-${date}`
                bookingInfoList.monthNumber =  this.month.clone().format('MM')
                console.log(bookingInfoList)
                getFreeTimeSwimming(bookingInfoList, (result) =>{
                    console.log(result)
                    if(freeTimeBookingList.hasChildNodes()) 
                    {
                        document.querySelectorAll('.free-time-booking__item').forEach( (e) => {
                            e.remove()
                        })
                    }
                    freeTimeBookingList.append(...result.map(createNODWithFreeTimeBooking))
                })

              
                 console.log(`${this.month}`)
              if (e.target.classList.contains('cal-day__month--next')) {
                this.selected = moment(`${this.month.add(1, 'month').format('YYYY-MM')}-${date}`);
              } else if (e.target.classList.contains('cal-day__month--previous')) {
                this.selected = moment(`${this.month.subtract(1, 'month').format('YYYY-MM')}-${date}`);
              } else {
                this.selected = moment(`${this.month.format('YYYY-MM')}-${date}`);
              }
      
              this.update();
            });
          });
      
          this.update();
        }
      
        update() {
          this.calendarDays = {
            first: this.month.clone().startOf('month').startOf('week').date(),
            last: this.month.clone().endOf('month').date() };
      
      
          this.monthDays = {
            lastPrevious: this.month.clone().subtract(1, 'months').endOf('month').date(),
            lastCurrent: this.month.clone().endOf('month').date() };
      
      
          this.monthString = this.month.clone().format('MMMM YYYY');
      
          this.draw();
        }
      
        addMonth() {
          this.month.add(1, 'month');
      
          this.update();
        }
      
        removeMonth() {
          this.month.subtract(1, 'month');
      
          this.update();
        }
      
        draw() {
          this.monthDiv.innerText = this.monthString;
      
          let index = 0;
      
          if (this.calendarDays.first > 1) {
            for (let day = this.calendarDays.first; day <= this.monthDays.lastPrevious; index++) {
              this.bodyDivs[index].innerText = day++;
      
              this.cleanCssClasses(false, index);
      
              this.bodyDivs[index].classList.add('cal-day__month--previous');
            }
          }
      
          let isNextMonth = false;
          for (let day = 1; index <= this.bodyDivs.length - 1; index++) {
            if (day > this.monthDays.lastCurrent) {
              day = 1;
              isNextMonth = true;
            }
      
            this.cleanCssClasses(true, index);
      
            if (!isNextMonth) {
              if (day === this.today.date() && this.today.isSame(this.month, 'day')) {
                this.bodyDivs[index].classList.add('cal-day__day--today');
              }
      
              if (day === this.selected.date() && this.selected.isSame(this.month, 'month')) {
                this.bodyDivs[index].classList.add('cal-day__day--selected');
              }
      
              this.bodyDivs[index].classList.add('cal-day__month--current');
            } else {
              this.bodyDivs[index].classList.add('cal-day__month--next');
            }
      
            this.bodyDivs[index].innerText = day++;
          }
        }
      
        cleanCssClasses(selected, index) {
          this.bodyDivs[index].classList.contains('cal-day__month--next') &&
          this.bodyDivs[index].classList.remove('cal-day__month--next');
          this.bodyDivs[index].classList.contains('cal-day__month--previous') &&
          this.bodyDivs[index].classList.remove('cal-day__month--previous');
          this.bodyDivs[index].classList.contains('cal-day__month--current') &&
          this.bodyDivs[index].classList.remove('cal-day__month--current');
          this.bodyDivs[index].classList.contains('cal-day__day--today') &&
          this.bodyDivs[index].classList.remove('cal-day__day--today');
          if (selected) {
            this.bodyDivs[index].classList.contains('cal-day__day--selected') &&
            this.bodyDivs[index].classList.remove('cal-day__day--selected');
          }
        }}
      
    
    const cal = new Calendar();
    cal.init();
        
    const data = new Date()
        data.setHours(8) // начало рабочего дня
        data.setMinutes(0)
        data.setSeconds(0)

    // массив дат (часов) возможных для брони
    function getTimeSwimming ([{monthWorkDayStart, monthWorkDayEnd, monthStartTimeNotWork, monthEndTimeNotWork}]) {
        const data = new Date()
        data.setHours(monthWorkDayStart) // начало рабочего дня
        data.setMinutes(0)
        data.setSeconds(0)
        const rangeTimeBooking  = 30//30 минут минимально допустимое время брони и шаг брони

        const timeSwimming = []
        for(let i = 0; i <= ((monthWorkDayEnd - monthWorkDayStart) * 2); i++) {
            const time = new Date(data.getTime() + rangeTimeBooking * i  * 60000)
            const getHour = time.getHours()
            const getMinutes = time.getMinutes()
            const fullTime = Number(getHour + '.' + getMinutes)

            if(!(fullTime > monthStartTimeNotWork  && fullTime < monthEndTimeNotWork)) {
                timeSwimming.push( {time : time , dayStatus : 'work'})
            } else  timeSwimming.push( {time : time , dayStatus : 'notwork'})
            
        }

        return timeSwimming
    }

    // вытягивает из Битрикс данные о лодках
    function getChipsInfo (callback) {
        BX24.callMethod(
            'calendar.resource.list',
            {},
            function(result) {
                if(result.error()){
                    console.log('ERROR' + result.error())
                }

                if(result.data().length) {
                    callback(result.data()) // передаем  данные о ладках 
                }

                if(result.more()){
                    result.next()
                }
            }
        )
    }
    getChipsInfo((result) => {
        showChipsInfoOnSite(result)
    })

    //создание списка катеров
    const createNODWithChipInfo = ({ID, NAME}) => {
        const service =  document.createElement('li')
        service.classList = "service"
        service.innerText = NAME
        service.addEventListener('click', () => {
            bookingInfoList.idRecurses = ID
            service.classList.toggle('service--active')
        })
        return service // возвращаем созданную Li
    }

    const createNODWithFreeTimeBooking = ({time, dayStatus}) => {
        const freeTimeBookingItem =  document.createElement('li')
        freeTimeBookingItem.classList = "free-time-booking__item"
        if(dayStatus === 'notwork') freeTimeBookingItem.classList.add('free-time-booking__item--not-work')
        if(dayStatus === 'busy') freeTimeBookingItem.classList.add('free-time-booking__item--busy')
        freeTimeBookingItem.innerText = time.getHours() + '.' + time.getMinutes()
        // service.addEventListener('click', () => {
        //     bookingInfoList.idRecurses = ID
        // })
        
        
        return freeTimeBookingItem // возвращаем созданную Li
    }

    // отображение списка катеров на сайте
    const showChipsInfoOnSite = (result) => {
        services.append(...result.map(createNODWithChipInfo))
    }

    function createNODTimeSwimming (timeStartWork, timeEndWork) {
        
    }


    // создание брони (новая сделка)
    addLead.addEventListener('click', () => {
        BX24.callMethod(
            "crm.deal.add", 
            {
                fields:
                { 
                    "TITLE": "Сделка-проверка 2", 
                    "TYPE_ID": "GOODS", 
                    "STAGE_ID": "NEW", 					
                    "COMPANY_ID": 3,
                    "CONTACT_ID": 3,
                    "OPENED": "Y", 
                    "ASSIGNED_BY_ID": 1, 
                    "PROBABILITY": 30,
                    "CURRENCY_ID": "USD", 
                    "OPPORTUNITY": 5000,
                    "CATEGORY_ID": 5,
                    "UF_CRM_1579263511138": [
                        "resource|2|05.03.2022 13:00:00|10800|Вейкборд",
                    ]
                                    
                },
            
            }, 
            function(result) 
            {
                if(result.error())
                    console.error(result.error());
                else
                    console.info("Создана сделка с ID " + result.data());
            }
        );	
    })

    // получение данных о свободном времени брони для лодки  
    function getFreeTimeSwimming ({idRecurses, dataCheckBooking}, callback) {
        console.log(dataCheckBooking)
        BX24.callMethod("calendar.resource.booking.list",
            {
                filter: {
                    resourceTypeIdList: [`${idRecurses}`], // передается список id ресурсов, которые можно выбрать методом calendar.resource.list
                    from:dataCheckBooking,
                    to: dataCheckBooking,
                },
            },
            function(result){
                const workTimeOnFocusMonth = Object.values(monthTimeInfoList).filter( (item) => {return item.monthId === Number(bookingInfoList.monthNumber) })
                const timeSwimming = getTimeSwimming(workTimeOnFocusMonth)

                if(result.error()){
                    console.log('ERROR' + result.error())
                }

                if(result.data().length){
                    // массив занятого времени
                    const busyTimeSwimming = result.data().map( (item) => {
                        return [new Date(item.DATE_FROM), new Date(item.DATE_TO) ]
                    })

                    // список свободных часов
                    const listFreeTimeSwimming = timeSwimming.filter( (item) => {
                        const time = item.time
                        const dayStatus = item.dayStatus
                        const getHoursTimeSwimming = Number(time.getHours() + '.' + time.getMinutes())

                        const checkTimeNotWork =  busyTimeSwimming.some( ([starTimeBooking, endTimeBooking]) => {
                            const getHourStarTimeBooking = Number(starTimeBooking.getHours() + '.' + starTimeBooking.getMinutes())
                            const getHourEndTimeBooking = Number(endTimeBooking.getHours() + '.' + endTimeBooking.getMinutes())
                            return getHoursTimeSwimming >= getHourStarTimeBooking && getHoursTimeSwimming <= getHourEndTimeBooking
                        }) 

                        if(checkTimeNotWork) item.dayStatus = 'busy'
                        return item
                    })
                    callback(listFreeTimeSwimming)
                    // callback(listFreeTimeSwimmingFormatted(listFreeTimeSwimming))

                } else 
                    callback(timeSwimming)
                    // callback (listFreeTimeSwimmingFormatted(timeSwimming)) // если 0 броней

                if(result.more()){
                    result.next()
                }
            }
        );
    }

    // время на которое можнго забронрировать
    function getTimeRangeSwimming () {
        
    }

})

