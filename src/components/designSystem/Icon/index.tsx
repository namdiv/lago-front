import { cloneElement } from 'react'
import styled from 'styled-components'
import clsns from 'classnames'

import { theme } from '~/styles'

import { ALL_ICONS } from './mapping'

export type IconName = keyof typeof ALL_ICONS
export type IconColor =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'skeleton'
  | 'disabled'
  | 'input'
  | 'primary'

enum IconAnimationEnum {
  spin = 'spin',
  pulse = 'pulse',
}
interface IconProps {
  name: IconName
  size?: 'small' | 'medium' | 'large'
  color?: IconColor
  className?: string
  animation?: keyof typeof IconAnimationEnum
}

enum SizeEnum {
  small = '12px',
  medium = '16px',
  large = '24px',
}

const mapColor = (color?: IconColor) => {
  switch (color) {
    case 'primary':
      return theme.palette.primary.main
    case 'success':
      return theme.palette.success.main
    case 'error':
      return theme.palette.error.main
    case 'warning':
      return theme.palette.warning.main
    case 'info':
      return theme.palette.info.main
    case 'light':
      return theme.palette.common.white
    case 'dark':
      return theme.palette.grey[600]
    case 'input':
      return theme.palette.grey[500]
    case 'disabled':
      return theme.palette.grey[400]
    case 'skeleton':
      return theme.palette.grey[100]
    default:
      return 'inherit'
  }
}

export const Icon = ({ name, size = 'medium', color, className, animation }: IconProps) => {
  const SVGIcon = ALL_ICONS[name]

  return (
    <StyledIcon
      title={`${name}/${size}`}
      data-qa={`${name}/${size}`}
      $size={size}
      className={clsns('svg-icon', className, { [`icon-animation--${animation}`]: animation })}
      $color={mapColor(color)}
      component={<SVGIcon />}
    />
  )
}

const StyledIcon = styled(({ component, ...props }) => cloneElement(component, props))`
  width: ${(props: { $size: keyof typeof SizeEnum }) => SizeEnum[props.$size]};
  min-width: ${(props: { $size: keyof typeof SizeEnum }) => SizeEnum[props.$size]};
  height: ${(props: { $size: keyof typeof SizeEnum }) => SizeEnum[props.$size]};
  color: ${(props) => props.$color};

  &.icon-animation--${IconAnimationEnum.spin} {
    animation: spin 1s linear infinite;
  }

  &.icon-animation--${IconAnimationEnum.pulse} {
    animation: pulse 1.5s ease-in-out 0.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`
