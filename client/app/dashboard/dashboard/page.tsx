'use client';

import { Typography } from "antd";

export default function DashboardPage() {
  return (
    <div style={styles.main}>
      <div style={styles.header}>
        <Typography.Title level={2}>Dashboard</Typography.Title>
      </div>

      <div style={styles.summaryContainer}>
        <div style={{ ...styles.card, backgroundColor: "#FFEFE3", color: "#FF7A00" }}>
          <p style={styles.cardTitle}>You Owe</p>
          <p style={styles.cardAmount}>$120.00</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#E2F7E1", color: "#34A853" }}>
          <p style={styles.cardTitle}>You Are Owed</p>
          <p style={styles.cardAmount}>$85.00</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: "#F0F0F0", color: "#333" }}>
          <p style={styles.cardTitle}>Total Balance</p>
          <p style={styles.cardAmount}>- $35.00</p>
        </div>
      </div>

      <div style={styles.activity}>
        <Typography.Title level={4}>Recent Activity</Typography.Title>
        <div style={styles.activityItem}>
          <span>Emma paid you</span>
          <span style={{ color: "#34A853", fontWeight: 600 }}>$25.00</span>
        </div>
        <div style={styles.activityItem}>
          <span>You owe Liam</span>
          <span style={{ color: "#FF7A00", fontWeight: 600 }}>$18.00</span>
        </div>
        <div style={styles.activityItem}>
          <span>Emma paid you</span>
          <span style={{ color: "#34A853", fontWeight: 600 }}>$46.00</span>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    padding: 32,
  },
  header: {
    marginBottom: 32,
  },
  summaryContainer: {
    display: "flex",
    gap: 24,
    marginBottom: 40,
    flexWrap: "wrap",
  },
  card: {
    flex: "1 1 200px",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: "bold",
  },
  activity: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  activityItem: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
    fontSize: 16,
  },
};
