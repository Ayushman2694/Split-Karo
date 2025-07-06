"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  message,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [splitOption, setSplitOption] = useState<"equal" | "custom">("equal");
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const res = await fetch("http://localhost:3000/groups/groups", {
        credentials: "include",
      });
      const data = await res.json();
      setGroups(data);
      setLoading(false);
    } catch (err) {
      message.error("Failed to fetch groups");
    }
  };

  const fetchExpenses = async () => {
    // Optional: implement GET expenses by selected group
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = groups.find((g: any) => g.id === groupId);
    if (group) {
      setMembers(group.members.map((m: any) => m.user));
    }
  };

  const handleAddExpense = async (values: any) => {
    if (!selectedGroupId) {
      return message.error("Please select a group");
    }

    let splits = [];

    if (splitOption === "equal") {
      const splitAmount = values.amount / members.length;
      splits = members.map((member: any) => ({
        userId: member.id,
        amount: parseFloat(splitAmount.toFixed(2)),
      }));
    } else {
      try {
        // Parse custom split (e.g., "Emma:40, Liam:60")
        const parts = values.customSplit.split(",");
        splits = parts.map((p: string) => {
          const [name, amt] = p.trim().split(":");
          const user = members.find((m: any) => m.name === name.trim());
          if (!user) throw new Error(`User "${name}" not found in group`);
          return {
            userId: user.id,
            amount: parseFloat(amt.trim()),
          };
        });
      } catch (err: any) {
        return message.error(err.message || "Invalid custom split format");
      }
    }

    const payload = {
      groupId: selectedGroupId,
      description: values.name,
      amount: values.amount,
      splitType: splitOption,
      splits,
    };

    try {
      const res = await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add expense");

      message.success("Expense added successfully!");
      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err.message || "Something went wrong");
    }
  };

  if (loading) return <Spin size="large" style={{ margin: 100 }} />;

  return (
    <div style={styles.container}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Expenses
        </Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={styles.addButton}
        >
          Add Expense
        </Button>
      </Row>

      {/* Expense Cards (static or dynamic) */}
      <Row gutter={[16, 16]}>
        {expenses.map((expense) => (
          <Col key={expense.id} xs={24} sm={12} md={8} lg={6}>
            <Card style={styles.card}>
              <Typography.Text style={styles.label}>{expense.name}</Typography.Text>
              <Typography.Title level={3} style={styles.amount}>
                ${expense.amount.toFixed(2)}
              </Typography.Title>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Expense Modal */}
      <Modal
        open={isModalOpen}
        title={<Typography.Title level={3}>Add New Expense</Typography.Title>}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Add"
        cancelText="Cancel"
        centered
        okButtonProps={{ style: styles.modalButton }}
        cancelButtonProps={{ style: styles.cancelButton }}
        bodyStyle={{ paddingTop: 10 }}
      >
        <Form layout="vertical" form={form} onFinish={handleAddExpense}>
          <Form.Item
            label="Expense Name"
            name="name"
            rules={[{ required: true, message: "Please enter the expense name" }]}
          >
            <Input placeholder="e.g. Lunch, Taxi" style={styles.input} />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter the amount" }]}
          >
            <InputNumber placeholder="0.00" style={{ width: "100%", ...styles.input }} min={0} />
          </Form.Item>

          <Form.Item label="Select Group" name="group" rules={[{ required: true }]}>
            <Select
              placeholder="Choose group"
              onChange={handleGroupChange}
              style={styles.input}
              showSearch
            >
              {groups.map((g) => (
                <Option key={g.id} value={g.id}>
                  {g.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Split Option" name="splitOption" initialValue="equal">
            <Radio.Group onChange={(e) => setSplitOption(e.target.value)} style={styles.radioGroup}>
              <Radio value="equal">Equal Split</Radio>
              <Radio value="custom">Custom Split</Radio>
            </Radio.Group>
          </Form.Item>

          {splitOption === "custom" && (
            <Form.Item name="customSplit" rules={[{ required: true }]}>
              <Input.TextArea
                placeholder="e.g. Emma: 40, Liam: 60"
                style={styles.input}
                rows={3}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 32,
    minHeight: "100vh",
    backgroundColor: "#fafafa",
  },
  addButton: {
    backgroundColor: "#007C89",
    borderColor: "#007C89",
    borderRadius: 20,
    fontWeight: 600,
    height: 42,
  },
  cancelButton: {
    borderRadius: 20,
    height: 42,
  },
  modalButton: {
    backgroundColor: "#007C89",
    borderColor: "#007C89",
    borderRadius: 20,
    height: 42,
  },
  input: {
    borderRadius: 8,
    height: 42,
  },
  card: {
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    textAlign: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: 500,
  },
  amount: {
    margin: 0,
    color: "#007C89",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: 4,
  },
};
