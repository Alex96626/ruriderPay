document.addEventListener('DOMContentLoaded', () =>{

  const url  ='https://rurider.bitrix24.ru/rest/1/sxdkj7grncs47nuz/'
  const newLead = document.querySelector('.newLeed')

  newLead.addEventListener('click', () => {
    console.log(bookingInfoList)
    const data = bookingInfoList.dataCheckBooking.split('-').reverse().join('.')
    const time = bookingInfoList.timeBooking.split(":")
    const hour = time[0]
    const minutes = time[1]
    const seconds = time[2]
    const params = {
        "fields[TITLE]": "Сделка-проверка 2", 
        "fieldsTYPE_ID]": "GOODS", 
        "fieldsSTAGE_ID]": "NEW", 					
        "fields[COMPANY_ID]": 3,
        "fields[CONTACT_ID]": 3,
        "fields[OPENED]": "Y", 
        "fields[ASSIGNED_BY_ID]": 1, 
        "fields[PROBABILITY]": 30,
        "fields[OPPORTUNITY]": 5000,
        "fields[CATEGORY_ID]": 5,
        "fields[UF_CRM_1579263511138][0]": `resource|${bookingInfoList.idRecurses}|${data} ${hour}:${minutes}:${seconds}|${bookingInfoList.durationBooking}|Вейкборд`,                          
    }
  
    const searchParams = new URLSearchParams(params)
    checkPossibilityBooking(bookingInfoList.idRecurses, bookingInfoList.dataCheckBooking.split('-').reverse().join('.'))
    fetch(`${url}crm.deal.add.json?${searchParams}`)
  })

  function checkPossibilityBooking ( idRecurses, dataCheckBooking,callback) {
    fetch(`https://rurider.bitrix24.ru/rest/1/sxdkj7grncs47nuz/calendar.resource.booking.list.json?filter[from]=${dataCheckBooking}&filter[to]=${dataCheckBooking}&filter[resourceTypeIdList][0]=${idRecurses}&filter[resourceTypeIdList][1]=4`)
    .then(response => {
        return response.json()
    })
    .then(result => {
      console.log(result)
    })
  } // пока не работает)

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
      timeBooking : null,
      durationBooking : null,
      monthNumber : null,
  }

  const basket = {
      chipName: null,
      dataBooking: null,
      timeStartBooking: null,
      timeEndBooking: null,
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
              basket.dataBooking = `${this.month.format('YYYY-MM')}-${date}`
              
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

          if(!(fullTime >= monthStartTimeNotWork  && fullTime < monthEndTimeNotWork)) {
              timeSwimming.push( {time : time , dayStatus : 'work'})
          } else  timeSwimming.push( {time : time , dayStatus : 'notwork'})
          
      }

      return timeSwimming
  }

  // вытягивает из Битрикс данные о лодках
  function getChipsInfo (callback) {
    fetch(`https://rurider.bitrix24.ru/rest/1/sxdkj7grncs47nuz/calendar.resource.list`)
      .then(response => {
          return response.json()
      })
      .then(result => {
          callback(result.result)
      }) 
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
          basket.chipName = NAME
          service.classList.toggle('service--active')
          
      })
      return service // возвращаем созданную Li
  }

  const createNODWithFreeTimeBooking = ({time, dayStatus}) => {
      const freeTimeBookingItem =  document.createElement('li')
      freeTimeBookingItem.status = dayStatus
      freeTimeBookingItem.classList = "free-time-booking__item"
      if(dayStatus === 'notwork') freeTimeBookingItem.classList.add('free-time-booking__item--not-work')
      if(dayStatus === 'busy') freeTimeBookingItem.classList.add('free-time-booking__item--busy')
      freeTimeBookingItem.time = time
      freeTimeBookingItem.innerText = time.getHours() + '.' + time.getMinutes()
      freeTimeBookingItem.addEventListener('click', (event) => {
        getTimeRangeSwimming()
        basket.timeStartBooking = event.target.time

        bookingInfoList.timeBooking =  time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
      })
      
      
      return freeTimeBookingItem // возвращаем созданную Li
  }

  // отображение списка катеров на сайте
  const showChipsInfoOnSite = (result) => {
      services.append(...result.map(createNODWithChipInfo))
  }

  // получение данных о свободном времени брони для лодки  
  function getFreeTimeSwimming ({idRecurses, dataCheckBooking },callback) {
    const params = {
      'filter[from]' : dataCheckBooking,
     'filter[to]' : dataCheckBooking,
      'filter[resourceTypeIdList][0]' : idRecurses,
      'filter[resourceTypeIdList][1]' : 4,
    }

    const searchParams = new URLSearchParams(params)
    fetch(`${url}calendar.resource.booking.list.json?${searchParams}`)
      .then(response => {
          return response.json()
      })
      .then(result => {
        console.log(result)
        const workTimeOnFocusMonth = Object.values(monthTimeInfoList).filter( (item) => {return item.monthId === Number(bookingInfoList.monthNumber) })
        const timeSwimming = getTimeSwimming(workTimeOnFocusMonth)
  
        if(result.result.length) {
          const busyTimeSwimming = result.result.map( (item) => {
            return [new Date(item.DATE_FROM), new Date(item.DATE_TO) ]
          })
  
          const listFreeTimeSwimming = timeSwimming.filter( (item) => {
            const time = item.time
            // const dayStatus = item.dayStatus
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
  
        }
        else callback (timeSwimming)
      
      })
  }
  // время на которое можно забронрировать
  function getTimeRangeSwimming (day) {
    const times = document.querySelectorAll('.free-time-booking__item')
    const timesToArray = Array.from(times)
    const time  = event.target
    const indexTimeToClick =  timesToArray.findIndex( item => item === time)
    const listTimeForBusy =  timesToArray.slice(indexTimeToClick)
    const indexTimeLastFreeForTimeClick =  listTimeForBusy.findIndex( (item) => item.status !== 'work')
    const listTimeFreeToBooking = listTimeForBusy.slice(0,indexTimeLastFreeForTimeClick)
    
    console.log(listTimeFreeToBooking)
    const data = new Date()
    data.setHours(0)
    data.setMinutes(0)
    data.setSeconds(0)

    const listTimeBooking = listTimeFreeToBooking.map( ( item,index) => {
      return item = new Date(data.getTime() + 30 * (index + 1)  * 60000)
    })
    console.log(listTimeBooking)
    
    if(event.target.querySelector('ul') !== null) {
      console.log('dfdsffdf')
      // event.target.querySelector('ul').remove()
    }
    
    const newListTime =  document.createElement('ul')
    newListTime.classList = 'new-list-time'
    for(let i = 0; i < listTimeBooking.length; i++ ) {
      const newItemTime = document.createElement('li')
      newItemTime.innerText = listTimeBooking[i].getHours() + '.' + listTimeBooking[i].getMinutes()
      newItemTime.time = 0.5 * (i + 1)
      newItemTime.addEventListener('click', (event) => {
        
        console.log(event.target.timeBusy = listTimeBooking[i] )
        basket.timeEndBooking = new Date( new Date (basket.timeStartBooking).getTime() + 3600000 * newItemTime.time )
        basket.timeStartBooking +  listTimeBooking[i].getHours()

        // инфа по бронированию
        bookingInfoList.durationBooking =  (basket.timeEndBooking.getTime() - basket.timeStartBooking.getTime()) / 1000 // перевод в секунды
        
        basketShow ()
        //закрасить/перекрасить забронированное клиентом время
        times.forEach( item => item.classList.remove('free-time-booking__item--busy-now'))
        listTimeFreeToBooking.map( (item, index) => {
          
          if(index <= i) item.classList.add('free-time-booking__item--busy-now')
        })
        
        //закрыть себя
        event.target.closest('.new-list-time').remove()
      })
      newListTime.append(newItemTime)
    }
  event.target.append(newListTime)
  }

  function basketShow () {
    const basketNod =  document.querySelector('.basket')
    basketNod.innerHTML = basket.chipName +'-' + basket.dataBooking + '-' + basket.timeStartBooking + '-' + basket.timeEndBooking
  }

})
