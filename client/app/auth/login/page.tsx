'use client'

import { useState } from 'react'
import { Button, Form, Input, Typography, message } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onFinish = async (values: any) => {
  setLoading(true);

  try {
    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 👈 to receive/set cookie
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Login failed');

    message.success('Logged in successfully!');
    router.push('/dashboard/dashboard');
  } catch (err: any) {
    message.error(err.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Typography.Title level={2}>Log in</Typography.Title>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            label="Username or Email"
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input placeholder="you@example.com" style={styles.input} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              style={styles.input}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              style={styles.button}
            >
              Log in
            </Button>
          </Form.Item>

          <Typography.Text>
            Don't have an account?{' '}
            <a href="/auth/register" style={{ color: '#007C89' }}>
              Create an account
            </a>
          </Typography.Text>
        </Form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    padding: 20,
  },
  card: {
    maxWidth: 400,
    width: '100%',
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  },
  input: {
    borderRadius: 4,
    height: 42,
  },
  button: {
    height: 42,
    backgroundColor: '#007C89',
    borderColor: '#007C89',
    borderRadius: 20,
    fontWeight: 600,
  },
}
