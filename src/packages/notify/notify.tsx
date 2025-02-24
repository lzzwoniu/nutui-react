import * as React from 'react'
import Notification, { NotificationProps } from './Notification'
import classNames from 'classnames'

let messageInstance: any = null
interface INotifyProps {
  id: string
  color?: string
  msg: string
  duration: number
  className?: string
  background?: string
  type: string
  onClick: () => void
  onClosed: () => void
}

const options: INotifyProps = {
  msg: '',
  id: '',
  duration: 3000, //时长
  type: 'danger',
  className: '',
  onClosed: () => {},
  onClick: () => {},
}

function getInstance(props: NotificationProps, callback: (notification: any) => void) {
  if (messageInstance) {
    messageInstance.destroy()
    messageInstance = null
  }

  Notification.newInstance(props, (notification: any) => {
    return callback && callback(notification)
  })
}

function notice(opts: any) {
  function close() {
    if (messageInstance) {
      messageInstance.destroy()
      messageInstance = null
    }
  }
  opts = { ...options, ...opts }
  getInstance(opts, (notification: any) => {
    messageInstance = notification
  })
}
const errorMsg = (msg: any) => {
  if (!msg) {
    console.warn('[NutUI Notify]: msg不能为空')
    return
  }
}

export default {
  text(msg: string | React.ReactNode, option = {}) {
    errorMsg(msg)
    return notice({ msg, type: 'base', ...option })
  },
  success(msg: string | React.ReactNode, option = {}) {
    errorMsg(msg)
    return notice({ msg, type: 'success', ...option })
  },
  primary(msg: string | React.ReactNode, option = {}) {
    errorMsg(msg)
    return notice({ msg, type: 'primary', ...option })
  },
  danger(msg: string | React.ReactNode, option = {}) {
    errorMsg(msg)
    return notice({ msg, type: 'danger', ...option })
  },
  warn(msg: string | React.ReactNode, option = {}) {
    errorMsg(msg)
    return notice({ msg, type: 'warning', ...option })
  },
  hide() {
    if (messageInstance) {
      messageInstance.destroy()
      messageInstance = null
    }
  },
}
