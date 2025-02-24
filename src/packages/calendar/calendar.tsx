import React, { FunctionComponent } from 'react'
import Popup from '@/packages/popup'
import CalendarItem from '@/packages/calendaritem'
import Utils from '@/utils/date'
import './calendar.scss'

export interface CalendarProps {
  type?: string
  isAutoBackFill?: boolean
  poppable?: boolean
  visible?: boolean
  title?: string
  defaultValue?: string | string[]
  startDate?: string
  endDate?: string
  onClose?: () => void
  onChoose?: (param: string) => void
}
const defaultProps = {
  type: 'one',
  isAutoBackFill: false,
  poppable: true,
  visible: false,
  title: '日历选择',
  defaultValue: '',
  startDate: Utils.getDay(0),
  endDate: Utils.getDay(365),
  onClose: () => {},
  onChoose: (param: string) => {},
} as CalendarProps

export const Calendar: FunctionComponent<
  Partial<CalendarProps> & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const {
    children,
    poppable,
    visible,
    type,
    isAutoBackFill,
    title,
    defaultValue,
    startDate,
    endDate,
    onClose,
    onChoose,
  } = { ...defaultProps, ...props }

  const close = () => {
    onClose && onClose()
  }

  const update = () => {}

  const choose = (param: string) => {
    close()
    onChoose && onChoose(param)
  }

  const closePopup = () => {
    close()
  }

  return (
    <React.Fragment>
      {poppable ? (
        <Popup
          visible={visible}
          position="bottom"
          round
          closeable={true}
          onClickOverlay={closePopup}
          onClickCloseIcon={closePopup}
        >
          <CalendarItem
            type={type}
            isAutoBackFill={isAutoBackFill}
            poppable={poppable}
            title={title}
            defaultValue={defaultValue}
            startDate={startDate}
            endDate={endDate}
            onUpdate={update}
            onClose={close}
            onChoose={choose}
          ></CalendarItem>
        </Popup>
      ) : (
        <CalendarItem
          type={type}
          isAutoBackFill={isAutoBackFill}
          poppable={poppable}
          title={title}
          defaultValue={defaultValue}
          startDate={startDate}
          endDate={endDate}
          onClose={close}
          onChoose={choose}
        ></CalendarItem>
      )}
    </React.Fragment>
  )
}

Calendar.defaultProps = defaultProps
Calendar.displayName = 'NutCalendar'
