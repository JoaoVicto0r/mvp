-- Inserir usuário admin padrão (senha: admin123)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Administrador', 'admin@culinarycalc.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5W', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir dados de exemplo para tickets de suporte
DO $$
DECLARE
    user_id_var UUID;
BEGIN
    -- Pegar o ID de um usuário comum
    SELECT id INTO user_id_var FROM users WHERE role = 'user' LIMIT 1;
    
    IF user_id_var IS NOT NULL THEN
        INSERT INTO support_tickets (user_id, subject, message, priority, status) VALUES 
        (user_id_var, 'Dúvida sobre cálculo de custos', 'Olá, estou com dificuldades para entender como o sistema calcula os custos das receitas. Poderiam me ajudar?', 'medium', 'open'),
        (user_id_var, 'Erro ao adicionar ingrediente', 'Quando tento adicionar um novo ingrediente, o sistema apresenta erro. Já tentei várias vezes.', 'high', 'in_progress');
    END IF;
END $$;
