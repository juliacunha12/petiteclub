CREATE TABLE produtos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome TEXT NOT NULL,
  preco FLOAT NOT NULL,
  tamanho TEXT NOT NULL,
  imageurl TEXT,
  descricao TEXT,
  criadoEm TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  categoria TEXT DEFAULT 'Vestidos'
);

ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso Público" ON produtos FOR SELECT USING (true);

INSERT INTO produtos (nome, preco, tamanho, imageurl, descricao, categoria)
VALUES
('Top Neon Butterfly', 89.90, 'PP', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500', 'Top borboleta com brilho', 'Blusas & Tops'),
('Saia de Veludo Cyber', 120.00, 'P', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500', 'Saia rosa com brilho metálico', 'Shorts & Saias'),
('Mini Bag Glossy', 45.00, 'PP', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500', 'Bolsa pequena e brilhante', 'Acessórios');
