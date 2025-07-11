-- Dados iniciais para teste
INSERT INTO categories (name, description, color) VALUES
('Farinhas', 'Diferentes tipos de farinhas', '#f59e0b'),
('Açúcares', 'Açúcares e adoçantes', '#ef4444'),
('Gorduras', 'Óleos, manteigas e gorduras', '#10b981'),
('Laticínios', 'Leites, queijos e derivados', '#3b82f6'),
('Ovos', 'Ovos e derivados', '#f97316'),
('Fermento', 'Fermentos e leveduras', '#8b5cf6'),
('Especiarias', 'Temperos e especiarias', '#06b6d4'),
('Frutas', 'Frutas frescas e secas', '#84cc16');

-- Fornecedores exemplo
INSERT INTO suppliers (name, contact, email, phone, address) VALUES
('Distribuidora Pão & Cia', 'João Silva', 'joao@paoecompanhia.com', '(11) 99999-9999', 'Rua das Padarias, 123'),
('Açúcar & Mel Ltda', 'Maria Santos', 'maria@acucaremel.com', '(11) 88888-8888', 'Av. Doce Vida, 456'),
('Laticínios Frescos', 'Pedro Oliveira', 'pedro@laticiniosfrescos.com', '(11) 77777-7777', 'Rua do Leite, 789');
