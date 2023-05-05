import Avatar from '@mui/material/Avatar';
import { ReactNode, useEffect } from 'react';
import stringToColor from '../../util/function/StringToColor';
import { UserType } from '../../types/ChatType';
import React from 'react';

export type StringAvatarProps = {
  name: string,
  variant?: "square" | "circular" | "rounded",
  width?: number
  height?: number,
}

export const StringAvatar = (props: StringAvatarProps) => {
  // const [color, setColor] = useState
  const { name } = props;
  let split = name.trim().split(' ')
  let first: string
  let second: string
  switch (split.length) {
  case 0:
    first = second = ''
    break;
  case 1:
    if (split[0].length >= 2) {
      first = split[0][0]
      second = split[0][1]
    } else {
      first = split[0];
      second = ''
    }
    break;
  default:
    first = split[0][0]
    second = split[1][0]
    break;
  }
  
  return (
    <Avatar 
      sx={{
        bgcolor: stringToColor(name),
        width: props.width,
        height: props.height,
      }}
      variant={props.variant}
      children={`${first}${second}`}
    />
  )
}

export type IconAvatarProps = {
  icon: ReactNode,
  variant?: "square" | "circular" | "rounded",
  width?: number
  height?: number,
}

export const IconAvatar = (props: IconAvatarProps) => {
  return (
    <Avatar 
      sx={{
        bgcolor: stringToColor(props.icon!.toString()),
        width: props.width,
        height: props.height,
      }}
      variant={props.variant}
    >
      {props.icon}
    </Avatar>
  )
}

export type ImageAvatarProps = {
  src: string,
  width?: number
  height?: number,
}

export const ImageAvatar = (props: ImageAvatarProps) => {
  return (
    <Avatar
      src={props.src}
      sx={{
        width: props.width,
        height: props.height,
      }}
    />
  )
}

export type UserAvatarProps = {
  user: UserType,
  variant?: "square" | "circular" | "rounded",
  width?: number
  height?: number,
}

export const UserAvatar = (props: UserAvatarProps) => {
  const { user } = props
  const defaultAvtUrl = user.profile.avatar ?? ""
  const [avtUrl, setAvtUrl] = React.useState(defaultAvtUrl)

  useEffect(() => {
    if (user.profile.avatar && user.profile.avatar !== avtUrl)
      setAvtUrl(user.profile.avatar)
  }, [user])
  
  return (
    avtUrl ?
    <ImageAvatar
      src={avtUrl}
      {...{props}}
    /> : <StringAvatar
      name={user.name}
      {...{props}}
    />
  )
}