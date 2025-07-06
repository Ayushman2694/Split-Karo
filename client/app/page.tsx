"use client";

import Link from "next/link";
import { Button, Typography } from "antd";

export default function Home() {
  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#fff",
          padding: "40px 30px",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <Typography.Title level={2}>Welcome to ----</Typography.Title>
        <Typography.Paragraph style={{ marginBottom: 40, fontSize: 16 }}>
          A simple and secure way to get started.
        </Typography.Paragraph>

        <Link href="/auth/login">
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#007C89",
              borderColor: "#007C89",
              borderRadius: 20,
              padding: "0 32px",
              fontWeight: 600,
              height: 44,
            }}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}
