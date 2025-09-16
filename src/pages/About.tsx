import React from "react";
import { 
  Layout, 
  Card, 
  Button, 
  Icon,
  Badge
} from "@stellar/design-system";

const About: React.FC = () => {
  const teamMembers = [
    {
      name: "Equipe Instituto Caldeira",
      role: "Desenvolvedores Blockchain",
      description: "Especializados em soluções descentralizadas e tecnologia Stellar",
      icon: Icon.Users01,
      skills: ["Blockchain", "Stellar", "Smart Contracts", "React"]
    }
  ];

  const technologies = [
    { name: "Stellar Network", icon: Icon.Globe01, description: "Blockchain rápida e eficiente para pagamentos" },
    { name: "Soroban", icon: Icon.Code02, description: "Smart contracts na rede Stellar" },
    { name: "React + TypeScript", icon: Icon.Monitor01, description: "Interface moderna e responsiva" },
    { name: "Stellar Design System", icon: Icon.Palette, description: "Componentes UI oficiais da Stellar" }
  ];

  return (
    <Layout.Content>
      <Layout.Inset>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1a1a1a' }}>
            🚀 Sobre o Meridian Delivery
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#666', maxWidth: '900px', margin: '0 auto', lineHeight: '1.6' }}>
            Uma plataforma descentralizada revolucionária para entregas, construída com tecnologia blockchain Stellar 
            para garantir transparência, segurança e pagamentos automáticos.
          </p>
        </div>

        {/* Mission Section */}
        <div style={{ marginBottom: '4rem' }}>
          <Card>
            <div style={{ padding: '2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Icon.Target01 size="xl" style={{ marginBottom: '1rem', color: '#0066cc' }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Nossa Missão</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <Icon.Shield01 size="lg" style={{ marginBottom: '1rem', color: '#28a745' }} />
                  <h3>Confiança Descentralizada</h3>
                  <p style={{ color: '#666', lineHeight: '1.5' }}>
                    Eliminar a necessidade de intermediários através de contratos inteligentes que garantem 
                    pagamentos automáticos e transparentes.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <Icon.Zap size="lg" style={{ marginBottom: '1rem', color: '#ff9500' }} />
                  <h3>Eficiência Máxima</h3>
                  <p style={{ color: '#666', lineHeight: '1.5' }}>
                    Reduzir custos e acelerar processos eliminando burocracias e intermediários tradicionais 
                    da cadeia de entregas.
                  </p>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <Icon.Eye size="lg" style={{ marginBottom: '1rem', color: '#6f42c1' }} />
                  <h3>Transparência Total</h3>
                  <p style={{ color: '#666', lineHeight: '1.5' }}>
                    Todas as transações são registradas na blockchain, criando um histórico imutável 
                    e auditável de cada entrega.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Team Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
            👥 Nossa Equipe
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {teamMembers.map((member, index) => {
              const MemberIcon = member.icon;
              return (
                <Card key={index}>
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <MemberIcon size="xl" style={{ marginBottom: '1rem', color: '#0066cc' }} />
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>{member.name}</h3>
                    <p style={{ color: '#666', marginBottom: '1rem', fontWeight: 'bold' }}>{member.role}</p>
                    <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>{member.description}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                      {member.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary">
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
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
            🛠️ Tecnologias Utilizadas
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {technologies.map((tech, index) => {
              const TechIcon = tech.icon;
              return (
                <Card key={index}>
                  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <TechIcon size="lg" style={{ marginBottom: '1rem', color: '#0066cc' }} />
                    <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{tech.name}</h4>
                    <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {tech.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Hackathon Section */}
        <div style={{ marginBottom: '4rem' }}>
          <Card>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <Icon.Trophy01 size="xl" style={{ marginBottom: '1rem', color: '#ffd700' }} />
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Projeto Hackathon</h2>
              <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '800px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
                O Meridian Delivery foi desenvolvido como parte de um hackathon focado em soluções blockchain 
                inovadoras. Nossa proposta visa revolucionar o setor de entregas através da descentralização 
                e automação de pagamentos.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div>
                  <h4 style={{ color: '#0066cc', fontSize: '2rem', margin: '0' }}>100%</h4>
                  <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Descentralizado</p>
                </div>
                <div>
                  <h4 style={{ color: '#28a745', fontSize: '2rem', margin: '0' }}>0</h4>
                  <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Intermediários</p>
                </div>
                <div>
                  <h4 style={{ color: '#ff9500', fontSize: '2rem', margin: '0' }}>24/7</h4>
                  <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Disponibilidade</p>
                </div>
                <div>
                  <h4 style={{ color: '#6f42c1', fontSize: '2rem', margin: '0' }}>∞</h4>
                  <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Transparência</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Card>
            <div style={{ padding: '3rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌟 Faça Parte da Revolução</h2>
              <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', lineHeight: '1.5' }}>
                Junte-se a nós na construção do futuro das entregas descentralizadas. 
                Seja um solicitante ou transportador, sua participação ajuda a criar um ecossistema mais justo e eficiente.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={() => window.location.href = '/'}
                >
                  <Icon.Plus size="sm" />
                  Criar Entrega
                </Button>
                <Button 
                  variant="secondary" 
                  size="md"
                  onClick={() => window.location.href = '/carriers'}
                >
                  <Icon.Truck01 size="sm" />
                  Seja um Transportador
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
