import React, { FunctionComponent, useEffect, useState, CSSProperties } from 'react'
import Icon from '@/packages/icon'
import Popup from '@/packages/popup'
import bem from '@/utils/bem'
import { ExistRender } from './existRender'
import { CustomRender } from './customRender'
import './address.scss'

export interface RegionData {
  name?: string
  [key: string]: any
}

export interface NextListObj {
  next: string
  value: string | RegionData
  custom: string
  selectedRegion: {}
}
export interface AddressList {
  id?: string | number
  provinceName: string
  cityName: string
  countyName: string
  townName: string
  addressDetail: string
  selectedAddress: boolean
  name?: string
  phone?: string
}

export interface CloseRes {
  data: {}
  type: string
}
export interface AddressProps {
  className?: string
  style?: CSSProperties
  modelValue: boolean
  type: string
  customAddressTitle: string
  province: RegionData[]
  city: RegionData[]
  country: RegionData[]
  town: RegionData[]
  isShowCustomAddress: Boolean
  existAddress: AddressList[]
  existAddressTitle: string
  customAndExistTitle: string
  height: string | number
  defaultIcon: string
  selectedIcon: string
  closeBtnIcon: string
  backBtnIcon: string
  onSelected?: (prevExistAdd: AddressList, item: AddressList, copyExistAdd: AddressList[]) => void
  onClose?: (cal: CloseRes) => void
  closeMask?: (cal: { closeWay: string }) => void
  switchModule?: (cal: { type: string }) => void
  onChange?: (cal: NextListObj) => void
}

const defaultProps = {
  modelValue: false,
  type: 'custom',
  customAddressTitle: '请选择所在地区',
  province: [],
  city: [],
  country: [],
  town: [],
  isShowCustomAddress: true,
  existAddress: [],
  existAddressTitle: '配送至',
  customAndExistTitle: '选择其他地址',
  height: '200px',
  defaultIcon: 'location2',
  selectedIcon: 'Check',
  closeBtnIcon: 'circle-close',
  backBtnIcon: 'left',
} as AddressProps

export const Address: FunctionComponent<
  Partial<AddressProps> & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>
> = (props) => {
  const {
    modelValue,
    children,
    type,
    height,
    customAddressTitle,
    existAddress,
    existAddressTitle,
    province,
    city,
    country,
    town,
    isShowCustomAddress,
    customAndExistTitle,
    selectedIcon,
    defaultIcon,
    closeBtnIcon,
    backBtnIcon,
    onChange,
    onSelected,
    onClose,
    closeMask,
    switchModule,
    style,
    className,
    ...rest
  } = { ...defaultProps, ...props }
  const b = bem('address')

  const [privateType, setPrivateType] = useState<string>(type)
  const [tabName, setTabName] = useState<string[]>(['province', 'city', 'country', 'town'])
  const [showPopup, setShowPopup] = useState(modelValue)
  const [selectedRegion, setSelectedRegion] = useState({
    province: { name: '' },
    city: { name: '' },
    country: { name: '' },
    town: { name: '' },
  }) //已选择的 省、市、县、镇

  let [selectedExistAddress, setSelectedExistAddress] = useState({}) // 当前选择的地址

  const [closeWay, setCloseWay] = useState('self')

  // 手动关闭 点击叉号(cross)，或者蒙层(mask)
  const handClose = (type = 'self') => {
    setCloseWay(() => (type === 'cross' ? 'cross' : 'self'))

    setShowPopup(false)
  }
  // 点击遮罩层关闭
  const clickOverlay = () => {
    setCloseWay('mask')

    closeMask && closeMask({ closeWay: 'mask' })
  }
  // 切换下一级列表
  const nextAreaList = (item: NextListObj) => {
    // onchange 接收的参数
    const callbackParams = {
      next: item.next,
      value: item.value,
      custom: item.custom,
      selectedRegion: {},
    }

    setSelectedRegion({
      ...(item.selectedRegion as typeof selectedRegion),
    })

    onChange && onChange(callbackParams)
  }
  // 选择现有地址
  const selectedExist = (
    prevExistAdd: AddressList,
    item: AddressList,
    copyExistAdd: AddressList[]
  ) => {
    console.log(prevExistAdd, item, copyExistAdd)
    setSelectedExistAddress(item)

    onSelected && onSelected(prevExistAdd, item, copyExistAdd)

    handClose()
  }
  // 初始化
  const initAddress = () => {
    for (let i = 0; i < tabName.length; i++) {
      setSelectedRegion({
        ...selectedRegion,
        [tabName[i]]: {},
      })
    }
  }
  // 关闭
  const closeFun = () => {
    const resCopy = Object.assign(
      {
        addressIdStr: '',
        addressStr: '',
      },
      selectedRegion
    )
    const res: CloseRes = {
      data: {},
      type: privateType,
    }
    if (privateType === 'custom' || privateType === 'custom2') {
      const { province, city, country, town } = resCopy
      resCopy.addressIdStr = [
        (province as RegionData).id || 0,
        (city as RegionData).id || 0,
        (country as RegionData).id || 0,
        (town as RegionData).id || 0,
      ].join('_')
      resCopy.addressStr = [
        (province as RegionData).name,
        (city as RegionData).name,
        (country as RegionData).name,
        (town as RegionData).name,
      ].join('')
      res.data = resCopy
    } else {
      res.data = selectedExistAddress
    }

    initAddress()

    onClose && onClose(res)
  }
  // 选择其他地址
  const onSwitchModule = () => {
    if (privateType === 'exist') {
      setPrivateType('custom')
    } else {
      setPrivateType('exist')
    }
    initAddress()
    switchModule && switchModule({ type: privateType })
  }

  const headerRender = () => {
    return (
      <div className={b('header')}>
        <div className="arrow-back" onClick={onSwitchModule}>
          {privateType === 'custom' && backBtnIcon && (
            <Icon name={backBtnIcon} color="#cccccc"></Icon>
          )}
        </div>

        <div className={b('header__title')}>
          {privateType === 'custom' ? customAddressTitle : existAddressTitle}
        </div>

        <div onClick={() => handClose('cross')}>
          {closeBtnIcon && <Icon name={closeBtnIcon} color="#cccccc" size="18px"></Icon>}
        </div>
      </div>
    )
  }

  useEffect(() => {
    setShowPopup(modelValue)
  }, [modelValue])

  useEffect(() => {
    if (!showPopup) {
      closeFun()
    }
  }, [showPopup])

  return (
    <>
      {showPopup && (
        <Popup
          visible={showPopup}
          position="bottom"
          onClickOverlay={clickOverlay}
          onOpen={() => {
            setCloseWay('self')
          }}
          onClose={() => {
            closeFun()
          }}
        >
          <div className={`${b()} ${className ? className : ''}`} style={{ ...style }} {...rest}>
            {headerRender()}
            {(privateType === 'custom' || privateType === 'custom2') && (
              <CustomRender
                type={privateType}
                province={province}
                city={city}
                country={country}
                town={town}
                height={height}
                onNextArea={(cal) => {
                  nextAreaList && nextAreaList(cal)
                }}
                onClose={handClose}
              ></CustomRender>
            )}
            {privateType === 'exist' && (
              <ExistRender
                type={privateType}
                existAddress={existAddress}
                selectedIcon={selectedIcon}
                defaultIcon={defaultIcon}
                isShowCustomAddress={isShowCustomAddress}
                customAndExistTitle={customAndExistTitle}
                onSelected={selectedExist}
                onSwitchModule={onSwitchModule}
              ></ExistRender>
            )}
          </div>
        </Popup>
      )}
    </>
  )
}

Address.defaultProps = defaultProps
Address.displayName = 'NutAddress'
