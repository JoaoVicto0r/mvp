-- Criar tabela de logs de atividade
CREATE TABLE IF NOT EXISTS activity_logs (
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

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Trigger para logs automáticos em support_tickets
CREATE OR REPLACE FUNCTION log_support_ticket_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
        VALUES (NEW.user_id, 'support_ticket_created', 'support_ticket', NEW.id::text, 
                json_build_object('subject', NEW.subject, 'priority', NEW.priority));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
            VALUES (COALESCE(NEW.admin_id, NEW.user_id), 'support_ticket_status_changed', 'support_ticket', NEW.id::text,
                    json_build_object('old_status', OLD.status, 'new_status', NEW.status));
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER support_ticket_activity_log
    AFTER INSERT OR UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION log_support_ticket_activity();
