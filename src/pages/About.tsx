import React from "react";
import { Layout, Card, Button, Icon, Badge } from "@stellar/design-system";

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Instituto Caldeira Team",
      role: "Blockchain Developers",
      description:
        "Specialized in decentralized solutions and Stellar technology",
      icon: Icon.Users01 as React.ComponentType<{
        size?: string;
        style?: React.CSSProperties;
      }>,
      skills: ["Blockchain", "Stellar", "Smart Contracts", "React"],
    },
  ];

  const technologies = [
    {
      name: "Stellar Network",
      icon: Icon.Globe01 as React.ComponentType<{
        size?: string;
        style?: React.CSSProperties;
      }>,
      description: "Fast and efficient blockchain for payments",
    },
    {
      name: "Soroban",
      icon: Icon.Code02 as React.ComponentType<{
        size?: string;
        style?: React.CSSProperties;
      }>,
      description: "Smart contracts on the Stellar network",
    },
    {
      name: "React + TypeScript",
      icon: Icon.Monitor01 as React.ComponentType<{
        size?: string;
        style?: React.CSSProperties;
      }>,
      description: "Modern and responsive interface",
    },
    {
      name: "Stellar Design System",
      icon: Icon.Palette as React.ComponentType<{
        size?: string;
        style?: React.CSSProperties;
      }>,
      description: "Official Stellar UI components",
    },
  ];

  return (
    <Layout.Content>
      <Layout.Inset>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1
            style={{ fontSize: "3rem", marginBottom: "1rem", color: "#1a1a1a" }}
          >
            🚀 About Meridian Delivery
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              color: "#666",
              maxWidth: "900px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            A revolutionary decentralized platform for deliveries, built with
            Stellar blockchain technology to ensure transparency, security and
            automatic payments.
          </p>
        </div>

        {/* Mission Section */}
        <div style={{ marginBottom: "4rem" }}>
          <Card>
            <div style={{ padding: "2rem" }}>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <Icon.Target01
                  size="xl"
                  style={{ marginBottom: "1rem", color: "#0066cc" }}
                />
                <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  Our Mission
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "2rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <Icon.Shield01
                    size="lg"
                    style={{ marginBottom: "1rem", color: "#28a745" }}
                  />
                  <h3>Decentralized Trust</h3>
                  <p style={{ color: "#666", lineHeight: "1.5" }}>
                    Eliminate the need for intermediaries through smart
                    contracts that ensure automatic and transparent payments.
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <Icon.Zap
                    size="lg"
                    style={{ marginBottom: "1rem", color: "#ff9500" }}
                  />
                  <h3>Maximum Efficiency</h3>
                  <p style={{ color: "#666", lineHeight: "1.5" }}>
                    Reduce costs and speed up processes by eliminating
                    bureaucracy and traditional intermediaries from the delivery
                    chain.
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <Icon.Eye
                    size="lg"
                    style={{ marginBottom: "1rem", color: "#6f42c1" }}
                  />
                  <h3>Total Transparency</h3>
                  <p style={{ color: "#666", lineHeight: "1.5" }}>
                    All transactions are recorded on the blockchain, creating an
                    immutable and auditable history of each delivery.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Section */}
        <div style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              fontSize: "2rem",
            }}
          >
            👥 Our Team
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem",
            }}
          >
            {teamMembers.map((member) => {
              const MemberIcon = member.icon;
              return (
                <Card key={member.name}>
                  <div style={{ padding: "2rem", textAlign: "center" }}>
                    <MemberIcon
                      size="xl"
                      style={{ marginBottom: "1rem", color: "#0066cc" }}
                    />
                    <h3 style={{ marginBottom: "0.5rem", fontSize: "1.3rem" }}>
                      {member.name}
                    </h3>
                    <p
                      style={{
                        color: "#666",
                        marginBottom: "1rem",
                        fontWeight: "bold",
                      }}
                    >
                      {member.role}
                    </p>
                    <p
                      style={{
                        color: "#666",
                        marginBottom: "1.5rem",
                        lineHeight: "1.5",
                      }}
                    >
                      {member.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      {member.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technology Stack */}
        <div style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              fontSize: "2rem",
            }}
          >
            🛠️ Technologies Used
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {technologies.map((tech) => {
              const TechIcon = tech.icon;
              return (
                <Card key={tech.name}>
                  <div style={{ padding: "1.5rem", textAlign: "center" }}>
                    <TechIcon
                      size="lg"
                      style={{ marginBottom: "1rem", color: "#0066cc" }}
                    />
                    <h4 style={{ marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                      {tech.name}
                    </h4>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "0.9rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {tech.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Hackathon Section */}
        <div style={{ marginBottom: "4rem" }}>
          <Card>
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <Icon.Trophy01
                size="xl"
                style={{ marginBottom: "1rem", color: "#ffd700" }}
              />
              <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                Hackathon Project
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  maxWidth: "800px",
                  margin: "0 auto 2rem auto",
                  lineHeight: "1.6",
                }}
              >
                Meridian Delivery was developed as part of a hackathon focused
                on innovative blockchain solutions. Our proposal aims to
                revolutionize the delivery sector through decentralization and
                payment automation.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "2rem",
                  marginTop: "2rem",
                }}
              >
                <div>
                  <h4
                    style={{ color: "#0066cc", fontSize: "2rem", margin: "0" }}
                  >
                    100%
                  </h4>
                  <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                    Decentralized
                  </p>
                </div>
                <div>
                  <h4
                    style={{ color: "#28a745", fontSize: "2rem", margin: "0" }}
                  >
                    0
                  </h4>
                  <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                    Intermediaries
                  </p>
                </div>
                <div>
                  <h4
                    style={{ color: "#ff9500", fontSize: "2rem", margin: "0" }}
                  >
                    24/7
                  </h4>
                  <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                    Availability
                  </p>
                </div>
                <div>
                  <h4
                    style={{ color: "#6f42c1", fontSize: "2rem", margin: "0" }}
                  >
                    ∞
                  </h4>
                  <p style={{ color: "#666", margin: "0.5rem 0 0 0" }}>
                    Transparency
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <Card>
            <div style={{ padding: "3rem" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                🌟 Join the Revolution
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#666",
                  marginBottom: "2rem",
                  lineHeight: "1.5",
                }}
              >
                Join us in building the future of decentralized deliveries.
                Whether you're a requester or carrier, your participation helps
                create a fairer and more efficient ecosystem.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => (window.location.href = "/")}
                >
                  <Icon.Plus size="sm" />
                  Create Delivery
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => (window.location.href = "/carriers")}
                >
                  <Icon.Truck01 size="sm" />
                  Become a Carrier
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default About;
