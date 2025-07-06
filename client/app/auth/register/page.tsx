"use client";

import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: values.name,       // ✅ match backend DTO
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      message.success("Registered successfully!");
      router.push("/auth/login");
    } catch (err: any) {
      message.error(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Typography.Title level={2}>Create Account</Typography.Title>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 24 }}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Your Name" style={styles.input} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="you@example.com" style={styles.input} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
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
              Register
            </Button>
          </Form.Item>

          <Typography.Text>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#007C89" }}>
              Log in
            </Link>
          </Typography.Text>
        </Form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    padding: 20,
  },
  card: {
    maxWidth: 400,
    width: "100%",
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  input: {
    borderRadius: 4,
    height: 42,
  },
  button: {
    height: 42,
    backgroundColor: "#007C89",
    borderColor: "#007C89",
    borderRadius: 20,
    fontWeight: 600,
  },
};
