import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ImageAvatar } from './UserAvatar';
import { AlertTitle, Divider, Snackbar } from '@mui/material';
import idolSuccessUrl from '/src/assets/idol_success.jpg'
import idolFailedUrl from '/src/assets/idol_failed.jpg'
import idolStareUrl from '/src/assets/idol_stare.jpg'
import Notify from '../../util/function/Notification';

export type MyAlertProps = {
  title: string,
  body: string,
  src: string,
  // body: '\\ OwO /',
  // icon: '/src/assets/idol_success.jpg',
  tag: string,
  showing: boolean,
  width?: number,
  height?: number,
  severity?: 'info' | 'success' | 'warning' | 'error'
  mode?: 'text' | 'button',
  onClose?: (res?: string) => void
}

/**
 * Idol success alert
 */
const IDOL_SUC_ALERT: MyAlertProps = {
  title: '無敵なアイドル',
  body: '\\ OwO / \\ OwO / \\ OwO / \\ OwO /',
  src: idolSuccessUrl,
  tag: "GO!",
  showing: true,
  severity: 'success',
}

/**
 * Idol info alert
 */
const IDOL_STR_ALERT: MyAlertProps = {
  title: 'ジー　ゴゴゴゴ〜',
  body: '今日も、嘘つくの！',
  src: idolStareUrl,
  tag: "Are you sure?",
  showing: true,
  severity: 'info',
  mode: 'button',
  // mode
}

const IDOL_FAL_ALERT: MyAlertProps = {
  title: '嫌だよ〜',
  body: 'qwq',
  src: idolFailedUrl,
  tag: "No!",
  showing: true,
  severity: 'error',
  mode: 'button',
}

const NO_ALERT: MyAlertProps = {
  title: '',
  body: '',
  src: '',
  tag: "",
  showing: false,
  severity: 'info',
  mode: 'button',
}

export class MyDefaultAlerts {
  public static readonly IDOL_SUC_ALERT = IDOL_SUC_ALERT
  public static readonly IDOL_FAL_ALERT = IDOL_FAL_ALERT
  public static readonly IDOL_STR_ALERT = IDOL_STR_ALERT
  public static readonly NO_ALERT = NO_ALERT
}

export default function MyAlert(props: MyAlertProps) {
  React.useEffect(() => {
    if (props.title)
      Notify(props.title, { body: props.body, icon: props.src })
  }, [props.showing])
  
  
  return (
    <Snackbar
      open={props.showing}
      autoHideDuration={10000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        variant='filled'
        action={
          <Button onClick={() => {if(props.onClose) props.onClose()}} color="inherit" size="small">
            {props.tag}
          </Button>
        }
        icon={false}
        severity={props.severity}
      >
        <Stack
          direction="row"
          spacing={2}
        >
          <ImageAvatar src={props.src} />
          <Divider />
          <Stack 
            direction='column'
            spacing={2}
          >
            <AlertTitle>
              {props.title}
            </AlertTitle>
            {props.body}
          </Stack>
        </Stack>
      </Alert>
    </Snackbar>
  );
}