-- Execute este comando no SQL Editor do Supabase para criar a integração de perfis

CREATE TABLE perfis_usuarios (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nome_completo TEXT,
  data_nascimento DATE,
  email TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE perfis_usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver o próprio perfil" 
ON perfis_usuarios FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil" 
ON perfis_usuarios FOR UPDATE 
USING (auth.uid() = id);


-- Trigger para criar o perfil automaticamente quando alguém se cadastrar
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfis_usuarios (id, email, nome_completo)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'nome_completo');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
