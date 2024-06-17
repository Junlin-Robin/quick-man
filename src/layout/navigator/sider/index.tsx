import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from 'react-router-dom';

import frequencyLogo from 'public/frequency.svg';
import forceConstant from 'public/product-6.svg';
import styles from "../../style/index.module.less";
import useWatchSystemTheme from '../../../hooks/use-watch-system-theme';

interface Iprops {
  style?: React.CSSProperties;
}

export default function Sider(props: Iprops) {
  const { collapsed, md, style } = props;
  const theme = useWatchSystemTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState('');

  useEffect(() => {
    console.log({ location })
    setSelectedKeys(location.pathname)
  }, [location])

  return (
    <div style={{ position: 'relative' }}>
      <Layout.Sider
        id="my_slider"
        className={styles['slider']}
        collapsible={!md}
        collapsed={collapsed}
        // breakpoint="md"
        collapsedWidth={0}
        width={150}
        style={{
          overflow: "auto",
          height: "calc(100vh - 64px)",
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          transition: 'all .5s ease',
          border: '1px solid rgba(5, 5, 5, 0.06)',
          // padding: '3px 5px 0 5px',
          ...style,
        }}
        // zeroWidthTriggerStyle={{
        //   backgroundColor: 'red',
        //   zIndex: 10,
        //   position: 'fixed',
        //   top: '50vh',
        //   left: 0,
        //   width: '20px'
        // }}
        trigger={null}
      >
        <Menu
          defaultSelectedKeys={["castep-calculation"]}
          selectedKeys={selectedKeys}
          theme={theme}
          items={[
            {
              label: '频率分馏计算',
              icon: (<img src={frequencyLogo} style={{ width: '14px', height: '14px' }} />),
              // path: '/calculation/qm/isotope-fractionation/frequency',
              key: '/calculation/qm/isotope-fractionation/frequency',
              onClick: ({key}) => {navigate(key)},
            },
            {
              label: '力常数计算',
              icon: (<img src={forceConstant} style={{ width: '12px', height: '12px' }} />),
              // path: '/calculation/qm/isotope-fractionation/frequency',
              key: '/calculation/qm/isotope-fractionation/force-constant',
              onClick: ({key}) => {navigate(key)},
            }
          ]}
          style={{ overflowY: "auto", backgroundColor: "transparent", border: 'none', padding: 0, margin: 0 }}
          mode="inline"
        />
      </Layout.Sider>
    </div>
  );
}
