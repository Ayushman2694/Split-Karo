'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import React from 'react';

const { Sider, Content } = Layout;

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/dashboard/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard/dashboard">Dashboard</Link>,
    },
    {
      key: '/dashboard/groups',
      icon: <TeamOutlined />,
      label: <Link href="/dashboard/groups">Groups</Link>,
    },
    {
      key: '/activity',
      icon: <ClockCircleOutlined />,
      label: <Link href="/dashboard/expenses">Expenses</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">Settings</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          background: '#001529',
          paddingTop: 24,
        }}
      >
        <div
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 30,
          }}
        >
          <span role="img" aria-label="logo">
            💸
          </span>{' '}
          Splitwise Clone
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ padding: 24, background: '#f5f5f5' }}>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            borderRadius: 12,
            minHeight: '100%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
