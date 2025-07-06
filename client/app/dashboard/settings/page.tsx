"use client";

import { Button, Form, Input, Typography, Divider, Modal, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [isModalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    setModalVisible(false);
    message.success("Account deleted (mock)");
    // TODO: Connect to actual delete account API here
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include", // Send cookie, so server can clear it
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Logout failed");
      }

      message.success("Logged out");
      router.push("/auth/login");
    } catch (err: any) {
      message.error(err.message || "Logout failed");
    }
  };

  return (
    <div style={styles.container}>
      <Typography.Title level={2}>Settings</Typography.Title>

      <Form
        layout="vertical"
        form={form}
        onFinish={(values) => {
          console.log("Updated Settings:", values);
          message.success("Settings updated");
        }}
        style={{ maxWidth: 500 }}
      >
        <Form.Item label="Full Name" name="name">
          <Input placeholder="Your full name" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input placeholder="you@example.com" />
        </Form.Item>

        <Form.Item label="Password" name="password">
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={styles.saveButton}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Typography.Title level={4} type="danger">
        Danger Zone
      </Typography.Title>
      <Button
        danger
        onClick={() => setModalVisible(true)}
        style={{ marginRight: 12 }}
      >
        Delete Account
      </Button>

      <Modal
        title="Are you sure?"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setModalVisible(false)}
        okText="Yes, delete"
        okButtonProps={{ danger: true }}
      >
        <p>This action is irreversible. All your data will be lost.</p>
      </Modal>

      <Divider />

      <Typography.Title level={4}>Logout</Typography.Title>
      <Button type="default" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 32,
  },
  saveButton: {
    backgroundColor: "#007C89",
    borderColor: "#007C89",
    borderRadius: 8,
  },
};
