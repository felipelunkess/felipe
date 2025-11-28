-- Tabela de usuários para autenticação (simples)
USE ProjetoUniversidadeWeb;
GO

IF OBJECT_ID('dbo.usuario', 'U') IS NULL
BEGIN
CREATE TABLE usuario (
  id_usuario INT IDENTITY(1,1) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nome VARCHAR(200) NULL,
  papel VARCHAR(50) DEFAULT 'user',
  data_cadastro DATETIME DEFAULT GETDATE()
);
END
GO

-- Insere usuário padrão admin/admin (Mude a senha em produção)
IF NOT EXISTS (SELECT 1 FROM usuario WHERE username = 'admin')
BEGIN
  INSERT INTO usuario (username, password, nome, papel)
  VALUES ('admin', 'admin', 'Administrador', 'admin');
END
GO
