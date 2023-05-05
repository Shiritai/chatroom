import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import { RoutePages } from '../../util/router/RoutePages';
import { SignProps } from '../../types/PagePropTypes';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Typography>
  );
}

function indexProps(index: any) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}

export default function SignPage() {
  const theme = useTheme();
  const [ind, setInd] = useState(0);
  // enable RWD in height dimension
  const [height, setHeight] = useState(window.innerHeight * 0.8)

  const handleRWD = () => {
    setHeight(window.innerHeight)
  }

  const swap = () => {
    setInd(old => (old + 1) % 2)
  }

  let signProp: SignProps = { swap: swap }

  useEffect(() => {
    window.addEventListener('resize', handleRWD)
    return () => window.removeEventListener('resize', handleRWD)
  })

  const handleChange = (_: unknown, newValue: number) => {
    setInd(newValue);
  }

  return (
    <Box sx={{
        height: {height},
        margin: 'auto',
      }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          <AppBar position="static" color="default">
            <Tabs
              value={ind}
              onChange={handleChange}
              indicatorColor='secondary'
              textColor='secondary'
              variant="fullWidth"
              aria-label="action tabs example"
            >
              <Tab label={RoutePages.SIGN_IN.name} {...indexProps(0)} />
              <Tab label={RoutePages.SIGN_UP.name} {...indexProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={ind}
          >
            <TabPanel value={ind} index={0} dir={theme.direction}>
              <SignIn {...signProp}/>
            </TabPanel>
            <TabPanel value={ind} index={1} dir={theme.direction}>
              <SignUp {...signProp}/>
            </TabPanel>
          </SwipeableViews>
        </Grid>
      </Grid>
    </Box>
  );
}