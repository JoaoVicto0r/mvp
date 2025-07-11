-- Tabela de tickets de suporte
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    admin_response TEXT,
    admin_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Tabela de logs de atividades do sistema
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Triggers para updated_at
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Administrador', 'admin@culinarycalc.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Dados de exemplo para tickets de suporte
INSERT INTO support_tickets (user_id, subject, message, priority, status) 
SELECT 
    u.id,
    'Dúvida sobre cálculo de custos',
    'Olá, estou com dificuldades para entender como o sistema calcula os custos das receitas. Poderiam me ajudar?',
    'medium',
    'open'
FROM users u WHERE u.role = 'user' LIMIT 1;

INSERT INTO support_tickets (user_id, subject, message, priority, status) 
SELECT 
    u.id,
    'Erro ao adicionar ingrediente',
    'Quando tento adicionar um novo ingrediente, o sistema apresenta erro. Já tentei várias vezes.',
    'high',
    'in_progress'
FROM users u WHERE u.role = 'user' LIMIT 1;
