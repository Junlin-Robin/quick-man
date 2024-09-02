import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useMount } from "ahooks";
import { useNavigate, useLocation } from 'react-router-dom';

// import frequencyLogo from 'public/frequency.svg';
// import forceConstant from 'public/force-constant.svg';
import styles from "../../style/index.module.less";
import useWatchSystemTheme from '@/hooks/use-watch-system-theme';

import { MenuList } from "@/routers/constants";

interface Iprops {
  style?: React.CSSProperties;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isLargerThanMinWidth?: boolean;
}

export default function Sider(props: Iprops) {
  const { collapsed, isLargerThanMinWidth, style } = props;
  const theme = useWatchSystemTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState('');


  useEffect(() => {
    setSelectedKeys(location.pathname);
    // requestAnimationFrame(() => window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   // behavior: 'smooth',
    // }))
    window.scrollTo(0, 0);
    
  }, [location])

  useMount(() => {
    if (location.pathname === '/' || !location.pathname) {
      navigate('/calculation/qm/isotope-fractionation/frequency')
    }
  });

  return (
    <div style={{ position: 'relative' }}>
      <Layout.Sider
        id="my_slider"
        className={styles['slider']}
        collapsible={!isLargerThanMinWidth}
        collapsed={collapsed}
        // breakpoint="md"
        collapsedWidth={'100vw'}
        width={isLargerThanMinWidth ? 150 : '100vw'}
        style={{
          overflow: "auto",
          height: isLargerThanMinWidth ? "calc(100vh - 64px)" : (collapsed ? '0' : '100px'),
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          transition: 'all .5s ease',
          border: '1px solid rgba(5, 5, 5, 0.06)',
          zIndex: 900,
          ...style,
        }}
        trigger={null}
      >
        <Menu
          defaultSelectedKeys={["castep-calculation"]}
          selectedKeys={[selectedKeys]}
          theme={theme}
          items={MenuList.map((item) => ({
            ...item,
            icon: <img src={(theme === 'dark' ? item.icon.dark : item.icon.light)} style={{ width: '12px', height: '12px' }} />,
            onClick: ({ key }) => navigate(key),
          }))}
          style={{ overflowY: "auto", backgroundColor: "transparent", border: 'none', padding: 0, margin: 0 }}
          mode="inline"
        />
      </Layout.Sider>
    </div>
  );
}
