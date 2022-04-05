document.addEventListener('DOMContentLoaded', () =>{

  const url  ='https://rurider.bitrix24.ru/rest/1/sxdkj7grncs47nuz/'

  const newLead = document.querySelector('.newLeed')
  const services = document.querySelector('.services')

  newLead.addEventListener('click', () => {
    const data = bookingInfoList.dataCheckBooking.split('-').reverse().join('.')
    const durationBooking = bookingInfoList.durationBooking
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
    }

    bookingInfoList.idResources.forEach( (item,index) => {
      params[`fields[UF_CRM_1579263511138][${index + 1}]`] = `resource|${item}|${data} ${hour}:${minutes}:${seconds}|${durationBooking}`
    })

    const searchParams = new URLSearchParams(params)
    getBusyTimeNow(bookingInfoList.idResources, bookingInfoList.dataCheckBooking.split('-').reverse().join('.'))
      .then((result) => {

        // вытаскиваем время ранее забронированное с шагом 30 мин
        
        const busyTime =  result.reduce( (acc,{DATE_FROM, DATE_TO}) => {
            const date = new Date(DATE_FROM)
            const hourBusy = (new Date(DATE_TO) - new Date(DATE_FROM)) / 1000 / 60 / 60 //1.5

            for(let i = 0; i <= hourBusy; i +=0.5) {
              const timeBusyFormatDate = new Date(date.getTime() + 30 * i  * 120000)
              const hour = timeBusyFormatDate.getHours()
              const minutes = timeBusyFormatDate.getMinutes()
              const getTime = hour + '.' + minutes
              acc.push(getTime)
            }
            return acc
          }, [])  
        
        // время сейчас забронированное
        const timeBusyNow = document.querySelectorAll('.free-time-booking__item--busy-now')
        const busyNowTime = Array.from(timeBusyNow).reduce ((acc,{time}) => {
            const hour = new Date(time).getHours()
            const minutes = new Date(time).getMinutes()
            const getTime = hour + '.' + minutes
            acc.push(getTime)
            return acc
        }, [])

        const checkPossibilityBooking = busyNowTime.some( (item) => {
          return  busyTime.some( elem => {
              return item === elem
            })
          })
      
          if(!checkPossibilityBooking) {
            fetch(`${url}crm.deal.add.json?${searchParams}`)  
          } else alert('А уже все, все все')
      })
  })

  function getResourceInfo (idResources,dataCheckBooking) {
    const idList = Object.values(idResources)
  
    const params = {
      'filter[from]' : dataCheckBooking,
      'filter[to]' : dataCheckBooking,
    }

    idList.forEach( (item,index) => {
      params[`filter[resourceTypeIdList][${index + 1}]`] = item
    })

    return params
  }

  function getBusyTimeNow (idResources, dataCheckBooking) {
    
    params = getResourceInfo(idResources, dataCheckBooking)

    const searchParams = new URLSearchParams(params).toString()

    return fetch(`${url}calendar.resource.booking.list.json?${searchParams}`)
    .then(response => {
      return response.json()
    })
    .then(result => {
      return result.result
    })
     
  } 

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
      idResources : [],
      dataCheckBooking : null,
      timeBooking : null,
      durationBooking : null,
      monthNumber : null,
  }

  const basket = {
      chipName: [],
  }
  
  //отрисовываем календарьgit 
  const cal = new Calendar();
  cal.init(clickToDayOnCalendar);

  function clickToDayOnCalendar (month, date) {
    
    bookingInfoList.dataCheckBooking  = `${month.format('YYYY-MM')}-${date}`
    bookingInfoList.monthNumber =  month.clone().format('MM')
    basket.dataBooking = `${month.format('YYYY-MM')}-${date}`
    
    getFreeTimeSwimming(bookingInfoList, (result) =>{
        if(freeTimeBookingList.hasChildNodes()) 
        {
            document.querySelectorAll('.free-time-booking__item').forEach( (e) => {
                e.remove()
            })
        }
        freeTimeBookingList.append(...result.map(createNODEWithFreeTimeBooking))
    })
  }
      
  const data = new Date()
      data.setHours(8) // начало рабочего дня
      data.setMinutes(0)
      data.setSeconds(0)

  // массив дат (часов) возможных для брони 
  function getTimeSwimming ([workTimeOnFocusMonth]) {

    const monthWorkDayStart = workTimeOnFocusMonth.monthWorkDayStart
    const monthWorkDayEnd = workTimeOnFocusMonth.monthWorkDayEnd
    const monthStartTimeNotWork = workTimeOnFocusMonth.monthStartTimeNotWork
    const monthEndTimeNotWork = workTimeOnFocusMonth.monthEndTimeNotWork
    
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
        } else  {
          timeSwimming.push( {time : time , dayStatus : 'notwork'})
        }
        
    }

    return timeSwimming
  }

  // вытягивает из Битрикс данные о лодках
  function getChipsInfo (callback) {
    fetch(`${url}calendar.resource.list`)
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
  const createNODEWithChipInfo = ({ID, NAME}) => {
    const nameModify = NAME.toLowerCase().split(' ').join('-')
    const service =  document.createElement('label')
    service.htmlFor = nameModify
    service.classList = "service";
    service.addEventListener('click', () => {
      
    })

    const serviceName = document.createElement('span')
    serviceName.innerHTML = NAME

    const serviceCheck = document.createElement('input')
    serviceCheck.type = "checkbox"
    serviceCheck.name = nameModify
    serviceCheck.id = nameModify
    serviceCheck.addEventListener('change', () => {
      if(serviceCheck.checked) {
        service.classList.add("service--active") 
          bookingInfoList.idResources.push(ID)
          basket.chipName.push(NAME)
          basketShow (basket)
      }
      else {
        const indexidResourcesRemoving = bookingInfoList.idResources.findIndex( item => item === ID)
        const indexChipNameRemoving =  basket.chipName.findIndex( item => item === NAME)
        bookingInfoList.idResources.splice(indexidResourcesRemoving, 1)
        basket.chipName.splice(indexChipNameRemoving, 1)
        service.classList.remove("service--active") 
        basketShow(basket)
      }
    })
    
    service.append(serviceName)
    service.append(serviceCheck)
    
    return service // возвращаем созданную label
  }

  const createNODEWithFreeTimeBooking = ({time, dayStatus}) => {
      const freeTimeBookingItem =  document.createElement('li')
      freeTimeBookingItem.status = dayStatus
      freeTimeBookingItem.classList = "free-time-booking__item"
      if(dayStatus === 'notwork') {
        freeTimeBookingItem.classList.add('free-time-booking__item--not-work')
      }

      if(dayStatus === 'busy'){
        freeTimeBookingItem.classList.add('free-time-booking__item--busy')
      }

      freeTimeBookingItem.time = time
      freeTimeBookingItem.innerText = time.getHours() + '.' + time.getMinutes()
      freeTimeBookingItem.addEventListener('click', (event) => {
        getTimeRangeSwimming(event)
        basket.timeStartBooking = event.target.time

        bookingInfoList.timeBooking =  time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds()
      })
      
      
      return freeTimeBookingItem // возвращаем созданную Li
  }

  // отображение списка катеров на сайте
  const showChipsInfoOnSite = (result) => {
      services.append(...result.map(createNODEWithChipInfo)) 
  }

  // получение данных о свободном времени брони для лодки  
  function getFreeTimeSwimming ({idResources, dataCheckBooking, monthNumber},callback) {
    
    params = getResourceInfo(idResources, dataCheckBooking)

    const searchParams = new URLSearchParams(params).toString()

    fetch(`${url}calendar.resource.booking.list.json?${searchParams}`)
      .then(response => {
          return response.json()
      })
      .then(result => {
        const sizeMonthTimeInfoList = Object.values(monthTimeInfoList)
        const workTimeOnFocusMonth = sizeMonthTimeInfoList.filter(item => item.monthId === Number(monthNumber))
        const timeSwimming = getTimeSwimming(workTimeOnFocusMonth)
  
        if(result.result.length) {
          const busyTimeSwimming = result.result.map( (item) => {
            return [new Date(item.DATE_FROM), new Date(item.DATE_TO) ]
          })
  
          const listFreeTimeSwimming = timeSwimming.filter( (item) => {
            const time = item.time
            const getHoursTimeSwimming = Number(time.getHours() + '.' + time.getMinutes())
  
            const checkTimeNotWork =  busyTimeSwimming.some( ([starTimeBooking, endTimeBooking]) => {
                const getHourStarTimeBooking = Number(starTimeBooking.getHours() + '.' + starTimeBooking.getMinutes())
                const getHourEndTimeBooking = Number(endTimeBooking.getHours() + '.' + endTimeBooking.getMinutes())
                return getHoursTimeSwimming >= getHourStarTimeBooking && getHoursTimeSwimming <= getHourEndTimeBooking
            }) 
  
            if(checkTimeNotWork) {
              item.dayStatus = 'busy'
            }

            return item

          })
  
          callback(listFreeTimeSwimming)
  
        }
        else callback (timeSwimming)
      
      })
  }

  // время на которое можно забронрировать
  function getTimeRangeSwimming (event) {
    const times = document.querySelectorAll('.free-time-booking__item')
    const timesToArray = Array.from(times)
    const time  = event.target
    const indexTimeToClick =  timesToArray.findIndex( item => item === time)
    const listTimeForBusy =  timesToArray.slice(indexTimeToClick)
    const indexTimeLastFreeForTimeClick =  listTimeForBusy.findIndex( (item) => item.status !== 'work')
    const listTimeFreeToBooking = listTimeForBusy.slice(0,indexTimeLastFreeForTimeClick)
    
    const data = new Date()
    data.setHours(0)
    data.setMinutes(0)
    data.setSeconds(0)

    const listTimeBooking = listTimeFreeToBooking.map( ( item,index) => {
      return new Date(data.getTime() + 30 * (index + 1)  * 60000)
    })
    
    const newListTime =  document.createElement('ul')
    newListTime.classList = 'new-list-time'
    for(let i = 0; i < listTimeBooking.length; i++ ) {
      const newItemTime = document.createElement('li')
      newItemTime.innerText = listTimeBooking[i].getHours() + '.' + listTimeBooking[i].getMinutes()
      newItemTime.time = 0.5 * (i + 1)
      newItemTime.addEventListener('click', (event) => {
        basket.timeEndBooking = new Date( new Date (basket.timeStartBooking).getTime() + 3600000 * newItemTime.time )
        basket.timeStartBooking +  listTimeBooking[i].getHours()

        // инфа по бронированию
        bookingInfoList.durationBooking =  (basket.timeEndBooking.getTime() - basket.timeStartBooking.getTime()) / 1000 // перевод в секунды
        
        basketShow (basket)
        //закрасить/перекрасить забронированное клиентом время
        times.forEach( item => item.classList.remove('free-time-booking__item--busy-now'))
        listTimeFreeToBooking.forEach( (item, index) => {
          if(index <= i) {
            item.classList.add('free-time-booking__item--busy-now')
          }
        })
        
        //закрыть себя
        event.target.closest('.new-list-time').remove()
      })

      newListTime.append(newItemTime)

    }

  event.target.append(newListTime)
  
  }

  function basketShow (basket) {
    const basketNODE =  document.querySelector('.basket')
    const chipName = basket?.chipName ?? ''
    const dataBooking = basket?.dataBooking ?? ''
    const timeStartBooking = basket?.timeStartBooking ?? ''
    const timeEndBooking = basket?.timeEndBooking ?? ''
    basketNODE.innerHTML = chipName +'-' + dataBooking + '-' + timeStartBooking + '-' + timeEndBooking
  }

})
