"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Modal,
  Form,
  Input,
  message,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchGroups = async () => {
    try {
      const res = await fetch("http://localhost:4000/groups/user/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch groups");
      const data = await res.json();
      setGroups(data);
    } catch (err: any) {
      message.error(err.message || "Could not load groups");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (values: any) => {
  try {
    const res = await fetch("http://localhost:4000/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ensures cookie is sent
      body: JSON.stringify(values),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Group creation failed");

    message.success(`Group "${values.name}" created`);
    setIsModalOpen(false);
    form.resetFields();
    fetchGroups();
  } catch (err: any) {
    message.error(err.message || "Something went wrong");
  }
};


  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Typography.Title level={2}>Your Groups</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={styles.createButton}
          onClick={() => setIsModalOpen(true)}
        >
          Create Group
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <div style={styles.grid}>
          {groups.map((group: any, index) => (
            <div
              key={index}
              style={styles.card}
              onClick={() => router.push(`/groups/view/${group.id}`)}
            >
              <Typography.Title level={4} style={styles.cardTitle}>
                {group.name}
              </Typography.Title>
              <p style={styles.members}>
                Members:{" "}
                <strong>
                  {group.members?.map((m: any) => m.user?.name).join(", ") ||
                    "N/A"}
                </strong>
              </p>
              <p style={styles.balance("Settled up")}>
                Balance: <strong>Settled up</strong>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ➕ Create Group Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        bodyStyle={{ padding: 0 }}
      >
        <div style={styles.modalCard}>
          <Typography.Title level={3}>C Group</Typography.Title>
          <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
            <Form.Item
              label="Group Name"
              name="name" // ✅ Match backend DTO
              rules={[{ required: true, message: "Please enter a group name" }]}
            >
              <Input placeholder="Enter group name" style={styles.input} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={styles.button}
              >
                Create Group
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
}

const styles: { [key: string]: any } = {
  container: {
    padding: 32,
    minHeight: "100vh",
    backgroundColor: "#fafafa",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: "#007C89",
    borderColor: "#007C89",
    borderRadius: 20,
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    cursor: "pointer",
  },
  cardTitle: {
    marginBottom: 12,
  },
  members: {
    marginBottom: 8,
    color: "#555",
  },
  balance: (value: string) => ({
    color:
      value === "Settled up"
        ? "#4caf50"
        : value.startsWith("-")
        ? "#f44336"
        : "#2196f3",
  }),
  modalCard: {
    padding: "40px 30px",
    borderRadius: 12,
    backgroundColor: "#fff",
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
